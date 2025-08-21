---
title: "AWS RDS and .NET: Step-by-Step Guide for SQL Server Setup"
slug: aws-rds-sql-server-dotnet
date_published: 2024-08-08T05:24:21.000Z
date_updated: 2024-11-28T03:33:54.000Z
tags: AWS
excerpt: Amazon Relational Database Service (RDS) is a managed database service on AWS Cloud. RDS provides different database engines; in this post, we will focus on SQL Server. We will set up a Microsoft SQL Server database on RDS and connect to it from a .NET application.
---

Amazon Relational Database Service ([RDS](https://aws.amazon.com/rds/)) is a managed database service on AWS Cloud.

RDS provides different database engines; this post will focus on SQL Server.

We will set up a Microsoft SQL Server database on RDS and connect to it from a .NET application.

RDS for SQL Server makes setting up, operating, and scaling SQL Server deployments in AWS easy.

AWS sponsors this post, which is part of my [AWS Series.](__GHOST_URL__/blog/tag/aws/)

## Setting Up AWS RDS SQL Server Instance

Let's create our first RDS instance running SQL Server.

In the Amazon Console, navigate to the RDS section and select the 'Create database' button.
![](__GHOST_URL__/content/images/2024/08/image.png)Create a database from AWS Console under the RDS
The Create database takes you to a new page where you can configure the details of the RDS instance. 

Let's choose the Microsoft SQL Server as our Database Engine.
![](__GHOST_URL__/content/images/2024/08/image-2.png)
The Standard option gives you full control over setting up the options, the SQL Server version, instance size, and other details.

The Easy option requires lesser manual configuration and uses recommended best-practice configurations.

It automatically suggests two database instance sizes depending on the workloads you are running—Production or Dev/Test.
![](__GHOST_URL__/content/images/2024/08/image-3.png)
Under Settings provide the DB instance identifier and the master credentials required to connect to the SQL instance.
![](__GHOST_URL__/content/images/2024/08/image-4.png)AWS RDS SQL Server Settings and master credentials.
You can manage the credentials in AWS Secrets Manager or self-manage. 

The console also provides an option to auto-generate a password, which will appear on the summary page upon creation. 

💡

*You can change the master password anytime by Modifying the instance once it's created from the AWS Console.*

The Standard Create option lets you choose the Instance machine and storage configurations.
![](__GHOST_URL__/content/images/2024/08/image-5.png)
You can choose the instance size and the amount of storage required based on your application needs.

You can [increase the DB instance storage](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.ModifyingExisting) if you need additional storage.

The Connectivity section lets you choose the VPC configuration and firewall rules and controls access to the instance.
![](__GHOST_URL__/content/images/2024/08/image-6.png)

⚠️

*You cannot change the VPC after the database is created.*

For production workloads, you should restrict access to your database instance to only the applications that require access.

For this post, I will set the public access to 'Yes' since I need to connect to it from a .NET application running outside the VPC.
![](__GHOST_URL__/content/images/2024/08/image-7.png)Public access to RDS SQL Server instance assigns a public IP address to the database.
This covers the main settings you must know when creating an RDS SQL Server instance.

Create the database!
![](__GHOST_URL__/content/images/2024/08/image-8.png)RDS SQL Server database
## Connecting To AWS RDS SQL Server using Azure Data Studio

To interact with RDS SQL Server instance you can use various IDEs, such as [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16), [Azure Data Studio](https://azure.microsoft.com/en-au/products/data-studio), [Jetbrains DataGrip](https://www.jetbrains.com/datagrip/), etc.

You can use the server connection details from the RDS instance in the AWS Console.
![](__GHOST_URL__/content/images/2024/08/image-10-1.png)RDS SQL Server Instance details in AWS Console.
Below, I am using Azure Data Studio to connect to it, and here's how adding a new connection looks.
![](__GHOST_URL__/content/images/2024/08/image-9.png)Azure Data Studio connect to RDS SQL Server
## Connecting to AWS RDS SQL Server from .NET Application

To connect to the RDS instance from a .NET application, we can use the [SqlConnection class](https://learn.microsoft.com/en-us/dotnet/api/system.data.sqlclient.sqlconnection?view=netframework-4.8.1).

I also use [Dapper](https://www.learndapper.com/), a lightweight ORM framework that provides extension methods on the SqlConnection class to translate the SQL query result into first-class C# objects.

The code below shows the updated ASP NET API Controller, which talks to the RDS database to retrieve weather data information.

    string connectionString = builder.Configuration.GetConnectionString("RDSConnectionString");
    
    app.MapGet("/weatherforecast", async () =>
        {
            using var connection = new SqlConnection(connectionString);
            var forecasts = await connection
                .QueryAsync<WeatherForecast>(
                     "SELECT Date, TemperatureC, Summary FROM WeatherForecasts");
            
            return Results.Ok(forecasts);
        })
        .WithName("GetWeatherForecast")
        .WithOpenApi();

*I created a database and a table with some dummy weather forecast data for this to work!*
