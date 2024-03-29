---
author: [Rahul Nath]
title: 'Scheduling Recurring Jobs With a Cool-Off Period'

tags:
  - Programming
date: 2017-12-24
completedDate: 2017-12-24 08:56:05 +1000
keywords:
description: Scheduling jobs at different time intervals and pausing them in between.
thumbnail: ../images/scheduling_jobs.jpg
---

[![Scheduling](../images/scheduling_jobs.jpg)](https://flic.kr/p/8ys6Hs)

At one of my clients, they had a requirement of scheduling various rules to sent our alert messages via SMS, Email, etc. A Rule consists of below and a few other properties

- **Stored Procedure**: The Stored Procedure (yes you read it correctly) to check if an alert needs to be raised
- **Polling Interval**: The time interval in which a Rule needs to be checked.
- **Cool-Off Period**: Time to wait before running Rule again after an alert was raised.

All Rules are stored in a database. New rules can be added and existing ones updated via an external application. Since the client is not yet in the Cloud, using any of Azure Functions, Lambda, Web Jobs, etc. are out of the question. It needs to be a service running on-premise, so I decided to keep it as a Windows service.

```csharp
 public class Rule
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string StoredProc { get; set; }
    public TimeSpan PollingInterval { get; set; }
    public TimeSpan CoolOffPeriod { get; set; }
    ...
}
```

Because of my past good experiences with [HangFire](https://www.hangfire.io/) I initially set off using that only to discover soon that it can schedule jobs only to the minute level. Even though this is a [feature that has been discussed for a long time](https://github.com/HangfireIO/Hangfire/issues/167), it's yet to be implemented. Since some of the rules are critical to the business, they want to be notified as soon as possible. This means having a polling interval in seconds for those rules.

After reaching out to my [friends at Readify](/blog/finding-a-job-abroad/), I decided to use [Quartz.net](https://www.quartz-scheduler.net/). Many had good experiences using it in the past and recommended it highly. One another option that came up was [FluentScheduler](https://github.com/fluentscheduler/FluentScheduler). There was no particular reason to go with Quartz.net.

> _Quartz.NET is a full-featured, open source job scheduling system that can be used from smallest apps to large-scale enterprise systems._

Setting up and getting started with Quartz scheduler is fast and easy. The library has a [well-written documentation](https://www.quartz-scheduler.net/documentation/index.html). You can update the applications configuration file to tweak various attributes of the scheduler.

```xml
<configuration>
  <configSections>
    <section name="quartz" type="System.Configuration.NameValueSectionHandler, System, Version=1.0.5000.0,Culture=neutral, PublicKeyToken=b77a5c561934e089" />
  </configSections>
  <quartz>
    <add key="quartz.scheduler.instanceName" value="TestScheduler" />
    <add key="quartz.jobStore.type" value="Quartz.Simpl.RAMJobStore, Quartz" />
  </quartz>
</configuration>
```

The [RAMJobStore](http://www.quartz-scheduler.org/api/2.2.1/org/quartz/simpl/RAMJobStore.html) indicates the store to use for storing job. There are other job stores available if you want persistence of jobs anytime the application restarts.

## Setting Up Jobs

Basically, there are three jobs - Alert Job, CoolOff Job, and Refresh Job - set up for the whole application. The Alert and Refresh Jobs are scheduled on application start. The CoolOff Job is triggered by the Alert Job as required. Any data that is required by the job is passed in using [JobDataMap](https://www.quartz-scheduler.net/documentation/quartz-2.x/tutorial/more-about-jobs.html#jobdatamap).

```csharp
...
var job = JobBuilder.Create<AlertJob>()
    .WithIdentity(rule.GetJobKey())
    .WithDescription(rule.Name)
    .SetJobData(rule)
    .Build();

var trigger = TriggerBuilder
    .Create()
    .WithIdentity(rule.GetTriggerKey())
    .StartNow()
    .WithSimpleSchedule(a => a
        .WithIntervalInSeconds((int)rule.PollingInterval.TotalSeconds)
        .RepeatForever())
    .Build();

scheduler.ScheduleJob(job, trigger);
```

### Alert Jobs

The Alert Job is responsible for checking the stored procedure and sending the alerts if required. If an alert is sent, it starts the CoolOff Job and pauses the current job instance. THe DisallowConcurrentExecution prevents multiple instances of the Job having the same key does not execute concurrently. We explicitly set the Job Key based on the Rule Id. This prevents any duplicate messages getting sent out if any of the job instances takes more time to execute than its set polling interval.

```csharp
[DisallowConcurrentExecution]
public class AlertJob : Job
{
    public void Execute(IJobExecutionContext context)
    {
        var alert = context.GetRuleFromJobData();
        var message = GetAlertMessage(alert);
        if(message != null)
        {
            SendMessage(message);
            CoolOff(alert);
        }
    }

    public void CoolOff(Rule rule)
    {
        var job = JobBuilder.Create<CoolOffJob>()
            .WithIdentity(jobKey)
            .WithDescription(rule.MessageTitle)
            .SetJobData(rule)
            .Build();

        var trigger = TriggerBuilder
            .Create()
            .WithIdentity(rule.GetCoolOffTriggerKey())
            .StartAt(rule.GetCoolOffDateTimeOffset())
            .Build();

        scheduler.PauseJob(rule.GetJobKey());
        scheduler.ScheduleJob(job, trigger);
    }
    ...
}
```

### Cool-Off Job

Cool-Off Jobs is a one time job scheduled by the Alert Job after an alert is sent successfully. The CoolOff job is scheduled to start after the Cool-Off time as configured for the alert. This triggers the job only after the set amount of time. It Resumes the original Rule Job to continue execution.

```csharp
public class CoolOffJob : IJob
{
    public void Execute(IJobExecutionContext context)
    {
        var alert = context.GetRuleFromJobData();
        ScheduleHelper.ResumeJob(alert);
    }
}
```

### Refresh Job

The Refresh Job is a recurring job, that polls the database for any changes to the Rules themselves If any change is detected,it removes the existing schedules for the alert and adds the updated alert job.

```csharp
[DisallowConcurrentExecution]
public class RefreshJob : IJob
{
    public void Execute(IJobExecutionContext context)
    {
        var allRules = GetAllRules();
        ScheduleHelper.RefreshRules(allRules);
    }
}
```

With these three jobs, all the rules get scheduled at the start of the application and run continuously. Anytime a change is made to the rule itself, the Refresh Job refreshes it within the time interval that it is scheduled for.

<div class="alert alert-info">
<b>Tip:</b>If there are a lot of rules with the same polling interval it will be good to stagger their starting time using a delayed start per job instance. Doing that will make sure that all jobs do not get polled for at the same time.
</div>

So far I have found the Quartz library stable and reliable and have not faced any issues with it. The library is also quite flexible and adapts well to the different needs.

Hope this helps. Merry Xmas!
