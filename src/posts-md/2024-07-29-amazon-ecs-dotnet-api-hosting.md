---
title: "Deploying a .NET Web API on Amazon ECS: A Step-by-Step Guide"
slug: amazon-ecs-dotnet-api-hosting
date_published: 2024-07-29T06:41:31.000Z
date_updated: 2024-07-29T06:42:51.000Z
tags: 
  - AWS
excerpt: >
  Let's learn some of the core concepts of ECS while deploying an ASP.NET Web API application on Amazon ECS using Fargate. 
  We will explore some key components of ECS, including task definitions, tasks, services, clusters, etc.
---

Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that helps you to more efficiently deploy, manage, and scale containerized applications.

In this post, we will explore some key components of ECS, including task definitions, tasks, services, clusters, etc. 

We will deploy a simple ASP NET Web API application to ECS using Visual Studio and the AWS Toolkit.

Thank you AWS for sponsoring this post in the [ECS Series](__GHOST_URL__/blog/tag/ecs/).

## ECS Core Concepts

**Docker Image: **A lightweight, standalone package containing everything needed to run the software, including code, runtime, libraries, and system tools.Images are usually hosted in ECR when using ECS.

**ECR: **Amazon Elastic Container Registry (Amazon ECR) is a secure, scalable, and reliable AWS-managed container image registry service.

**Task Definition: **A blueprint specifying how to run containers, including which Docker images to use, CPU and memory requirements, networking, and other configuration details.

**Task: **An instantiation of a Task Definition, representing a running container or set of containers.
![](__GHOST_URL__/content/images/2024/07/image-26.png)Core Concepts of ECS and how they are related
**Service: **A configuration that maintains a specified number of tasks running simultaneously, providing features like auto-scaling and load balancing.

**Load Balancer: **A component that distributes incoming traffic across multiple tasks to ensure high availability and improved performance.

**ECS Cluster: **A logical grouping of EC2 instances or Fargate resources where tasks are run.

## Deploying ASP NET API to ECS

Deploying an application to ECS is the best way to see how all of its core components are set up and work together. 

Let's deploy a simple ASP NET Web API application to ECS. 

We will set up multiple instances (3 in this case) of the API, with a load balancer in the front to route traffic to one of the instances.

We will use AWS Fargate instances to host and run our APIs. This makes it easy to run the applications without managing any EC2 instances yourself.

### Deploying To ECS From Visual Studio using AWS Toolkit

The AWS Toolkit is the easiest way to deploy a .NET application to ECS. The toolkit is available for all popular IDEs.

⚠️

*Use build/deploy pipelines to deploy code to your ECS instances in real-world apps.*

For this article, I will use the AWS Toolkit from Visual Studio. 

Once you have the toolkit installed, right-click on your project. In this case, I have a default ASP NET Web API application.

Choose 'Publish to AWS...' option to deploy to ECS.
![](__GHOST_URL__/content/images/2024/07/image-15.png)Publish to AWS option to deploy ASP NET API to ECS Fargate from within Visual Studio
Ensure your local environment has the appropriate credentials to talk to your AWS account. 

Check out [AWS Free Tier](https://aws.amazon.com/free), if you don't have an AWS account. I highly recommend following along with the post to learn ECS better.
[

Learn How To Manage Credentials When Building .NET Application on AWS

Learn different ways to set up and manage credentials and sensitive information when building .NET applications on AWS. We will also touch upon some of the tools and utilities that I have set up on my local development machine to make working with AWS easier.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/size/w1200/secure-key.jpg)
](__GHOST_URL__/blog/amazon-credentials-dotnet/)
Choose ASP NET Core App to Amazon ECS using the AWS Fargate option from the list presented to deploy the API to ECS.
![](__GHOST_URL__/content/images/2024/07/image-17.png)Visual Studio AWS Toolkit deploy ASP NET to ECS Fargate
The Toolkit also provides an option to Edit the default settings using the Edit Settings button.

We need to provide a valid health check endpoint URL in the settings. We first need to enable health checks in our ASP NET  application.

    builder.Services.AddHealthChecks();
    
    var app = builder.Build();
    
    app.MapHealthChecks("/healthz");

Add the above code to your `Program.cs` to enable health check endpoints. This add an endpoint at the `/healthz` URL.

Let's update the ECS publish settings and provide the Health Check endpoint we just added, as shown below.
![](__GHOST_URL__/content/images/2024/07/image-18.png)Visual Studio AWS Toolkit specify health check endpoint for ECS Fargate cluster
This is the URL that ECS will use to poll a deployed instance of our application to ensure that it is up and running successfully. If a valid response is not received, ECS will automatically kill the instance and recreate a new one.

Click Publish. 

This publishes our API application to ECS. You can see the different steps involved in the publishing.
![](__GHOST_URL__/content/images/2024/07/image-20.png)Visual Studio AWS Toolkit status of deploying .NET API to ECS with Fargate
You can also see the Cloudformation template deploy progress in your AWS account, while the application is being published as shown below.
![](__GHOST_URL__/content/images/2024/07/image-19.png)Status of the CloudFormation template being run as part of the CDK deploy step from AWS Toolkit
Once the deployment is complete, you can navigate to the load balancer URL, also shown in the Visual Studio publish UI output section (highlighted above in the image).

### Exploring the Deployed ECS solution in AWS Console

Navigate to Elastic Container Service in your AWS Console.

Here, we can find our deployed ECS Cluster and the associated resources.

AWS provides a view from the Clusters, which lists the Services running in the Cluster.

Below, you can see our cluster with one service that is running.
![](__GHOST_URL__/content/images/2024/07/image-21.png)ECS Cluster details with 1 service running.
The service has three tasks running inside that, which is the default count that the Visual Studio AWS Toolkit sets for the `DesiredCount` of tasks. 

This means three instances of that task definition are running inside our cluster. 

Navigating into the Services reveals more details, such as the load balancer attached to the service and the tasks running as part of it.
![](__GHOST_URL__/content/images/2024/07/image-22.png)Details of the Service running in our ECS cluster, which has the load balancer attached to it.
You can also see that the Tasks are running on Fargate instances.
![](__GHOST_URL__/content/images/2024/07/image-23.png)Tasks running as part of the ECS service, which all points to the same Task Definition file.
All three tasks have the exact Task definition, which defines which docker image it runs, its memory and CPU size, etc, as shown below.
![](__GHOST_URL__/content/images/2024/07/image-24.png)Task Definition showing the memory, CPU, the docker image used etc.
If any task instance faults or becomes unresponsive, ECS will automatically terminate it and bring up a new instance from our task definition. 

*PS: Make sure to delete all resources that the Toolkit created so that you don't use up all your free account limits or unnecessarily spend money.*
![](__GHOST_URL__/content/images/2024/07/image-25.png)Clean up all resources created by deleting the entire CloudFormation stack.
