---
title: Guide To Building AWS Lambda Functions with Ease in JetBrains Rider
slug: set-up-aws-toolkit-for-jetbrains-rider
date_published: 2023-11-01T06:45:15.000Z
date_updated: 2023-11-03T01:41:39.000Z
tags: AWS, Lambda
excerpt: The AWS Toolkit plugin for JetBrains Rider makes it easier to develop, debug, and deploy serverless applications with AWS right from your IDE. Learn how to setup AWS Toolkit and create AWS Lambda Functions from JetBrains Rider IDE.
---

The [AWS Toolkit plugin for JetBrains Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/getting-started.html) makes it easier to develop, debug, and deploy serverless applications with AWS right from your IDE.

In this blog post, let's learn how to set up the AWS Toolkit and create AWS Lambda Functions from JetBrains Rider IDE.

## Install AWS Toolkit For JetBrains Rider

The AWS Toolkit is available in [the JetBrains marketplace](https://plugins.jetbrains.com/plugin/11349-aws-toolkit). You can install this from within the Rider IDE, by navigating to Settings → Plugins section and searching for 'AWS Toolkit'.
![](__GHOST_URL__/content/images/2023/10/image-17.png)Installing the AWS Toolkit Plugin from the Settings menu in JetBrains Rider IDE.
Once installed you can see an additional icon, with the AWS logo (as shown in the screenshot below) on the left sidebar.
![](__GHOST_URL__/content/images/2023/10/image-20.png)AWS Toolkit in JetBrains Rider
The Toolkit automatically picks up the AWS connection strings from the configuration file.

We learned how to set up the AWS credentials in an earlier article on Learn How To Manage Credentials When Building .NET Application on AWS.
[

Learn How To Manage Credentials When Building .NET Application on AWS

Learn different ways to set up and manage credentials and sensitive information when building .NET applications on AWS. We will also touch upon some of the tools and utilities that I have set up on my local development machine to make working with AWS easier.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/secure-key.jpg)
](__GHOST_URL__/blog/amazon-credentials-dotnet/)
## Create Lambda Functions in JetBrains Rider

With the AWS Toolkit installed, we now have additional template options to create .NET projects. 

We can create different starter templates for building AWS Lambda Functions. 

### Create an Empty Lambda Function in JetBrains Rider

To create an empty Lambda Function, search for 'Lambda Empty Function' template under the 'Add New Project' dialog in Rider.
![](__GHOST_URL__/content/images/2023/10/image-18.png)
Once you fill in the required Solution Name, Project Name, and the solution directory it generates a default Lambda Function .NET project, with the below `FunctionHanlder` Lambda function.

    public string FunctionHandler(string input, ILambdaContext context)
    {
        return input.ToUpper();
    }

### AWS Services and Lambda Function in JetBrains Rider

The AWS Toolkit for Rider also provides additional Lambda templates that you can use as starter templates when building applications. 

Based on your application and the different AWS Service you are integrating with, you can choose appropriate starter templates.

Below is an example of creating a Lambda Simple SQS Function template.
![](__GHOST_URL__/content/images/2023/10/image-21.png)JetBrains Rider Lambda Simple SQS Function template to integrate Amazon SQS with AWS Lambda
The template generates the required code to handle `SQSEvents` in the AWS Function Handler.

    public async Task FunctionHandler(SQSEvent evnt, ILambdaContext context)
    {
        foreach (var message in evnt.Records)
        {
            await ProcessMessageAsync(message, context);
        }
    }
    
    private async Task ProcessMessageAsync(
               SQSEvent.SQSMessage message, ILambdaContext context)
    {
        context.Logger.LogInformation($"Processed message {message.Body}");
        // TODO: Do interesting work based on the new message
        await Task.CompletedTask;
    }

If you want to learn more about integrating with different AWS Services when building Lambda Functions check out my below blog post.
[

AWS Lambda For The .NET Developer

This blog post is a collection of other posts that covers various aspects of AWS Lambda and other services you can integrate with when building serverless applications on Lambda.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2023/05/AWS-Lambda.png)
](__GHOST_URL__/blog/aws-lambda-dotnet-developer/)
## Debugging Lambda Function from JetBrains Rider

The Mock Lambda Tool helps test the Lambda function locally without deploying it to an AWS environment.

📢

**Note:*** This tool is not a local Lambda environment. This tool is optimized for quick local debugging with minimal dependencies.*

You can set up the Mock Lambda Test Tool to work with Rider in two ways

- Using Rider .run file
- Using launchsettings.json file

You can learn more in my blog post on How To Set Up AWS .NET Mock Lambda Test Tool on JetBrains Rider.
[

How To Set Up AWS .NET Mock Lambda Test Tool on JetBrains Rider

Learn how to setup .NET Mock Lambda Test Tool to work with JetBrains Rider IDE.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2023/06/Rider---Mock-Lambda-Tool.png)
](__GHOST_URL__/blog/how-to-set-up-aws-net-mock-lambda-test-tool-on-jetbrains-rider/)
