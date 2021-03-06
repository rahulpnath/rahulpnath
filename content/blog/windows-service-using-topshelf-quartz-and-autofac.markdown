---
author: [Rahul Nath]
title: 'Windows Service Using Topshelf, Quartz and Autofac'
  
tags:
  - Programming
date: 2019-01-21
keywords:
description: Walkthrough of setting up a recurrent job scheduler.
thumbnail: ../images/scheduling_jobs.jpg
---

Whenever there is a need for some automated jobs that have to run On-Prem for a client, my default choice has been to use Windows Service along with Quartz. Last year I had blogged about [one such instance](https://www.rahulpnath.com/blog/scheduling-recurring-jobs-with-a-cool-off-period/). However, I did not get into the detail of setting up the project and associated dependencies to run the service.

In this post, I will walk through how I got about setting up these recurrent job scheduler to make it easy for me or anyone else who runs into a similar situation.

#### Topshelf

[Topshelf](https://topshelf.readthedocs.io/en/latest/) makes the creation of windows services easy by giving the ability to run it as a console application while developing it and easily deploy it as a service. Setting up Topshelf is straight forward - All you need is a console application ([targetting the .Net Framework](https://topshelf.readthedocs.io/en/latest/installation/prerequisites.html)) and [add reference](https://topshelf.readthedocs.io/en/latest/installation/install.html) to [Topshelf Nuget](https://www.nuget.org/packages/topshelf) package. To set up the service, you need to modify the [Program.cs with some setup code](https://topshelf.readthedocs.io/en/latest/configuration/quickstart.html) for creating the windows services and setting some service metadata.

#### Autofac

With Topshelf setup, we have a running windows service application. To add in dependency injection so that you do not have to wire up all your dependencies manually, you can use Autofac. The [Topshelf.Autofac](https://github.com/alexandrnikitin/Topshelf.Autofac) library helps integrate Topshelf and Autofac DI container. Autofac can be easily integrated with Topshelf using the library and passing in the container instance to the _UseAutofacContainer_ extension method on HostConfigurator.

```csharp
var container = Bootstrapper.BuildContainer();

var rc = HostFactory.Run(x =>
{
    x.UseAutofacContainer(container);

    x.Service<SchedulerService>(s =>
    {
        s.ConstructUsingAutofacContainer();
        s.WhenStarted(tc => tc.Start(config));
        s.WhenStopped(tc => tc.Stop());
    });

});
```

#### Quartz.Net

The SchedulerService will now be instantiated using the Autofac container and makes it easy to inject dependencies into it. We need to be able to schedule jobs within the SchedulerService hence inject an _IScheduler_ from [Quartz.Net](https://www.quartz-scheduler.net/). You can add a reference to [Quartz Nuget](https://www.nuget.org/packages/Quartz/) package, and you are all set to run jobs on schedule. To integrate Quartz with Autofac so that job dependencies can also be injected in via the container we need to use [Autofac.Extras.Quartz](https://github.com/alphacloud/Autofac.Extras.Quartz) Nuget.

#### Wiring it Up

Below is a sample setup of the Autofac container that registers jobs (MySyncJob) in assembly and adds scheduler instance to the container (using the _QuartzAutofacFactoryModule_). The _IDbConnection_ is registered to match the lifetime scope of quartz job so that each job instance gets a different instance.

```csharp
public static class Bootstrapper
{
    public static IContainer BuildContainer()
    {
        var builder = new ContainerBuilder();
        builder.RegisterType<SchedulerService>();

        var schedulerConfig = new NameValueCollection
        {
            { "quartz.scheduler.instanceName", "MyScheduler" },
            { "quartz.jobStore.type", "Quartz.Simpl.RAMJobStore, Quartz" },
            { "quartz.threadPool.threadCount", "3" }
        };

        builder.RegisterModule(new QuartzAutofacFactoryModule
        {
            ConfigurationProvider = c => schedulerConfig
        });

        builder.RegisterModule(new QuartzAutofacJobsModule(typeof(MySyncJob).Assembly));

        var connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        builder
           .RegisterType<SqlConnection>()
           .WithParameter("connectionString", connectionString)
           .As<IDbConnection>()
           .InstancePerMatchingLifetimeScope(QuartzAutofacFactoryModule.LifetimeScopeName);

        // Other registrations

        var container = builder.Build();
        return container;
    }
}
```

The SchedulerService class is used to start the scheduler jobs when the service starts up and shut down the jobs when service is shut down. As you can see the IScheduler instance is constructor injected using Autofac. On start, add the jobs to the scheduler(i am using a cron schedule in the example below).

```csharp
public class SchedulerService
{
    private readonly IScheduler _scheduler;

    public SchedulerService(IScheduler scheduler)
    {
        _scheduler = scheduler;
    }

    public void Start(ScheduleConfig config)
    {
        ScheduleJobs(config);
        _scheduler.Start().ConfigureAwait(false).GetAwaiter().GetResult();
    }

    private void ScheduleJobs(ScheduleConfig config)
    {
        ScheduleJobWithCronSchedule<MySyncJob>(config.MySyncJobSchedule);
        ScheduleJobWithCronSchedule<MyOtherSyncJob>(config.MyOtherSyncJobSchedule);
    }

    private void ScheduleJobWithCronSchedule<T>(string cronShedule) where T : IJob
    {
        var jobName = typeof(T).Name;
        var job = JobBuilder
            .Create<T>()
            .WithIdentity(jobName, $"{jobName}-Group")
            .Build();

        var cronTrigger = TriggerBuilder
            .Create()
            .WithIdentity($"{jobName}-Trigger")
            .StartNow()
            .WithCronSchedule(cronShedule)
            .ForJob(job)
            .Build();

        _scheduler.ScheduleJob(cronTrigger);
    }

    public void Stop()
    {
        _scheduler.Shutdown().ConfigureAwait(false).GetAwaiter().GetResult();
    }
}
```

The Sync jobs have its dependencies which are again injected using Autofac container. Adding in new jobs is easy, and all we need to make sure is that it gets set up with the appropriate schedule and register its dependencies in the container.

Hope this helps you with setting up recurring scheduler jobs for on-prem scenarios.
