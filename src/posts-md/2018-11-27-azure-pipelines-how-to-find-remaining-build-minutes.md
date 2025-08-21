---
title: "Tip of the Week: Azure Pipelines - How to Find Remaining Free Build Minutes?"
slug: azure-pipelines-how-to-find-remaining-build-minutes
date_published: 2018-11-27T00:00:00.000Z
date_updated: 2024-11-28T03:39:54.000Z
tags: DevOps, Azure
---

With [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) you can continuosly build, test and deploy to any cloud platform. Azure Pipelines has multiple options to start based on your project. Even if you are developing a private application, Pipelines offers you 1 Free parallel job with upto 1800 minutes per month and also 1 Free self hosted with unlimited months (as it's anyway running on your infrastructure).

On the Microsoft-hosted CI/CD with 1800 minutes you might need to find the used/remaining time any time during the month. You can find the remaining minutes from the [Azure Devops portal](https://dev.azure.com/) and select the relevant organization.

**Organization settings -> Retention and parallel jobs -> Parallel Jobs**
![Azure Devops Pipelines - Remaining Build Minutes](__GHOST_URL__/content/images/azure_devops_remaining_build_minutes.png)
Hope that helps you find the remaining free build minutes for your organization!
