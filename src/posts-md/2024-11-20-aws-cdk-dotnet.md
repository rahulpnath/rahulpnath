---
title: "AWS CDK For The .NET Developer: How To Easily Get Started"
slug: aws-cdk-dotnet
date_published: 2024-11-20T06:59:50.000Z
date_updated: 2025-01-17T04:19:57.000Z
tags:
  - AWS
excerpt: >
  AWS CDK simplifies Cloud Infrastructure management. CDK lets you define AWS resources using first-class programming concepts.
  It translates your code into AWS CloudFormation templates, which can be used to provision AWS resources for your application. Let's get started using .NET and C#.
---

The **AWS Cloud Development Kit (CDK)** simplifies cloud infrastructure management.

CDK lets you define AWS resources using first-class programming concepts. 

It translates your code into AWS CloudFormation templates, which can be used to provision AWS resources for your application.

In this article, we will learn.

- Core CDK Concepts
- Setup and Install CDK
- Create your First CDK Project
- Define App, Stack, and Resources
- Deploy Application to AWS using CDK

## Core Concepts - AWS CDK

Before you dive into code, let's understand the three main concepts when using CDK. 

- **Construct**: The basic building block in CDK, representing a piece of infrastructure (e.g., an S3 bucket or a Lambda function).
- **Stack**: A collection of constructs grouped, defining a deployable infrastructure unit. It maps directly to an AWS CloudFormation stack.
- **App**: The entry point of your CDK application. It contains one or more stacks and manages their lifecycle during deployment.

These concepts work together to organize and deploy your application infrastructure efficiently.

Thanks to AWS for sponsoring this post in my [.NET on AWS Series](__GHOST_URL__/blog/tag/aws/),

## Install and Setup AWS CDK

To work with AWS CDK, we must first install and configure the AWS CDK Command Line Interface (CLI).

If you have Node and npm setup, you can use it to install the CLI using the command below. 

    npm install -g aws-cdk

Once installed, run the `cdk --version` command to ensure it's up and running. 

Also, ensure your local machine has the appropriate credentials to talk to your AWS account.  Check out the article below if you haven't already 👇
[

Learn How To Manage Credentials When Building .NET Application on AWS

Learn different ways to set up and manage credentials and sensitive information when building .NET applications on AWS. We will also touch upon some of the tools and utilities that I have set up on my local development machine to make working with AWS easier.

![](__GHOST_URL__/content/images/icon/logo-512x512-5.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/thumbnail/secure-key.jpg)
](__GHOST_URL__/blog/amazon-credentials-dotnet/)
## Create CDK .NET Project

With the AWS CDK CLI setup, let's start creating our first CDK project.

Create a new empty folder (`hello-cdk`) based on your app name choice. 

🗒️

*The CDK CLI uses this directory name to name things within your CDK code.*

Run the cdk init command using the language of your choice to create your CDK project. 

In this case, since I'm using .NET, I use csharp

    cdk init app --language csharp

### Folder Structure

The `cdk init` command sets up a predefined structure of files and folders in the project directory. 

This is your CDK project and helps organize the source code for your CDK application.
![](__GHOST_URL__/content/images/2024/11/image-2.png)CDK project structure for .NET showing the cdk.json file in Visual Studio Code.
If you want to learn more about the project structure and each of the files inside, check out this [article](https://docs.aws.amazon.com/cdk/v2/guide/projects.html).

## Our Sample Application

We will deploy a simple AWS Lambda Function that talks to a DynamoDB table to save data using CDK.
[

AWS Lambda For The .NET Developer

This blog post is a collection of other posts that covers various aspects of AWS Lambda and other services you can integrate with when building serverless applications on Lambda.

![](__GHOST_URL__/content/images/icon/logo-512x512-6.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/thumbnail/AWS-Lambda.png)
](__GHOST_URL__/blog/aws-lambda-dotnet-developer/)
Below is the function code that our Lambda Function runs.

    public class Function
    {
        public async Task FunctionHandler(string input, ILambdaContext context)
        {
            var dynamoDbContext = new DynamoDBContext(new AmazonDynamoDBClient());
            await dynamoDbContext.SaveAsync(
                new User()
                {
                    Id = Guid.NewGuid().ToString(),
                    Username = input
                });
        }
    }

## Building CDK Stack in .NET

Our sample application requires two resources to be deployed:

- AWS Lambda Function
- DynamoDB Table

The `Amazon.CDK.Lib` The NuGet package provides first-class constructs to represent these AWS resources. 

The package provides the `App` and `Stack` classes to represent the Application and the Stacks within.

The below code is the main function in our CDK project that sets up an `App` instance and also defines the `HelloCdkStack` for our application.

    sealed class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();
            new HelloCdkStack(app, "HelloCdkStack");
            app.Synth();
        }
    }
    
    public class HelloCdkStack : Stack
    {
        internal HelloCdkStack(
            Construct scope, string id, IStackProps props = null) 
            : base(scope, id, props)
        {
          // Define your AWS Resources
        }
    }

All the resources we need to create are defined within the Stack class.

### Lambda Function with CDK in .NET

To set up a Lambda Function, we can use the `Function` class and provide the required properties to be set on our Lambda Function. 

    var lambda = new Function(this, "hello-cdk-labmda", new FunctionProps()
    {
        FunctionName = "hello-cdk-labmda",
        Runtime = Runtime.DOTNET_8,
        Handler = "hello-cdk-lambda::hello_cdk_lambda.Function::FunctionHandler",
        Code = Code.FromAsset(@".\src\artifacts\hello-cdk-lambda.zip"),
        Timeout = Duration.Seconds(30)
    });

The CDK code above expects the lambda function to be packaged as a zip file and available under the artifacts folder. 

This can be quickly done using the `dotnet lambda package` function and specifying the output path.

The CDK defines the Lambda Function, its Handler, the code artifact to use, and the timeout duration.

### DynamoDB with CDK in .NET

Similarly, we can use the `Table` construct to create a DynamoDB Table.

    var userTable = new Table(this, "user-table", new TableProps()
    {
        TableName = "User",
        PartitionKey = new Attribute()
        {
            Name = "Id",
            Type = AttributeType.STRING
        },
        RemovalPolicy = RemovalPolicy.DESTROY
    });

The above code creates a table, specifies it's name and the PartitionKey attribute.

It also sets the `RemovalPolicy` to `Destroy` which means the table will be deleted/destroyed if the Stack is destroyed.

#### Granting Permissions to Resources with CDK in .NET

Since our Lambda Function must write to the DynamoDB table, we must ensure it has the appropriate permissions.

This is quickly done using CDK with one line of code.

    dynamoTable.GrantReadWriteData(lambda);

We use the `GrantReadWriteData` function on the Table construct to grant permissions to the Lambda function. 

## Deploy CDK to AWS 

To deploy our application to AWS, we first need to bootstrap CDK.

The CDK Bootstrap command prepares your AWS environment for deploying CDK applications.

It creates an S3 bucket and other resources in your account to store files and assets (like Lambda code) needed during deployment.

Run the following to bootstrap your environment:

    cdk bootstrap aws://ACCOUNT_ID/REGION
    

This step is required before deploying CDK apps in a new AWS account or region.

Once bootstrapped, run `cdk deploy` from your command line magic happens 🪄
![](__GHOST_URL__/content/images/2024/11/image-3.png)Running cdk deploy from commandline to deploy AWS CDK to my AWS Account using Windows terminal.
It will deploy a new Stack to AWS, create the AWS Lambda Function and the DynamoDB table, upload your packaged zip lambda function, deploy it, and ensure that your function has appropriate permissions to write to the DynamoDB table.

If you log into your AWS console under CloudFormations, you can see the newly created stack and its resources.
![](__GHOST_URL__/content/images/2024/11/image-4.png)AWS CloudFormation Stack crated using CDK deploy from .NET.
We have successfully set up and deployed our first CDK Stack using .NET.

## Destroy/Delete Stack using CDK

Since this is a throwaway code, we don't want it sitting in our AWS account and costing us money. 

Before you go, destroy that Stack we just deployed.

    cdk destroy

Yes, It's that easy! 

*.... Make sure it's not a production app (I should have said that earlier)*
