---
title: Setting up DbUp in Azure Pipelines
slug: setting-up-dbup-in-azure-pipelines
date_published: 2018-12-03T00:00:00.000Z
date_updated: 2018-12-03T00:00:00.000Z
tags: DevOps, Programming
excerpt: DbUp in a .Net core console application and Azure Pipelines.
---

[Azure Pipelines](https://azure.microsoft.com/en-au/services/devops/pipelines/) is part of the [Azure Devops](https://azure.microsoft.com/en-au/services/devops/) offerings which enables you to continuously build test and deploy to any platform and cloud environments. It's been a while since this has been out and it's only recently that I have got a chance to play around with it at one of my clients. We use [DBUp](https://dbup.readthedocs.io/en/latest/), a .Net library to deploy schema changes to our SQL Server database. *It tracks which SQL scripts have been run already, and runs the change scripts that are needed to get your database up to date.*

Setting up DbUp is very easy, and you can use the script straight from the [docs](https://dbup.readthedocs.io/en/latest/) to get started. If you are using .Net core console application VS template to setup DbUp make sure to modify the return type of the main function to use int and to return the appropriate application exit codes (as from the script in the doc.) I made the mistake of removing the return statements, only to later realize that build scripts were successfully passing even though the DbUp scripts were failing.

If you are using the .Net Core console application VS template (like I did) make sure you modify the return type of the main function in Program.cs to int.

In Azure Pipelines I have the build step publish the build output as a zip artifact. Using this in the release pipeline is a 2 step process

### 1 - Extract Zip Package

Using the [Extract Files Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/extract-files?view=vsts) extract the zip package from the build artifacts. You can specify a destination folder for the files to be extracted to (as shown below).
![Extract package](__GHOST_URL__/content/images/dbup_azure_pipelines_extract.jpg)
### 2 - Execute DbUp Package

With the package extracted out into a folder, we can now execute the console application (using the [dotnet command line](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-run?tabs=netcore21#description)) by passing in the connection string as a command line argument.
![Execute package](__GHOST_URL__/content/images/dbup_azure_pipelines_execute.jpg)
You now have your database deployments automated through the Azure Pipelines.
