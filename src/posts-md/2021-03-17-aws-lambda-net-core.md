---
title: "AWS Lambda For The .NET Developer: How To Easily Get Started"
slug: aws-lambda-net-core
date_published: 2021-03-17T00:00:00.000Z
date_updated: 2024-11-28T02:33:40.000Z
tags: AWS, Lambda
excerpt: Learn how to get started with AWS Lambda with .NET Core by building out a simple function and deploying to AWS. We will also see how to set up local development environment using the AWS Toolkit.
---

Early this year, I joined [OFX.com](http://ofx.com/) and have been working with the [Global Currency Account](https://www.ofx.com/en-us/business/global-currency-account/) team.

The company is entirely on AWS Cloud Service. Much of my experience with Cloud platforms has been with Microsoft Azure (where I am also an [MVP](https://mvp.microsoft.com/en-us/PublicProfile/5003875?fullName=Rahul%20Nath)).

This calls for some [new learning](__GHOST_URL__/blog/ultralearning-book-summary/), and I am excited about it. In this post, I explore AWS Lambda for anyone just getting started with it.
[

AWS Lambda For The .NET Developer

Learn to build Serverless Applications on AWS

![](https://www.udemy.com/staticx/udemy/images/v7/apple-touch-icon.png)Udemy

![](https://img-c.udemycdn.com/course/480x270/4689888_b522_4.jpg)
](https://www.udemy.com/course/aws-lambda-dotnet/?referralCode&#x3D;981481B991C2890BD448)
[AWS Lambda](https://aws.amazon.com/lambda/) is Amazon's answer to serverless compute services. It allows running code with zero administration of the infrastructure that the code is running on.

AWS Lambda allows us to upload the code as a ZIP file or container image, and AWS takes care of allocating the compute execution power required to run the code.

> *AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers, creating workload-aware cluster scaling logic, maintaining event integrations, or managing runtimes.*

These applications can have different triggers to invoke them, including HTTP API calls.

Embracing services like this which requires no infrastructure maintenance from an application developers side, is often termed as **Serverless**

> *[Serverless computing](https://en.wikipedia.org/wiki/Serverless_computing) is a cloud computing execution model in which the cloud provider allocates machine resources on-demand, taking care of the servers on behalf of their customers*

## AWS Lambda and .NET Core

At the time of writing, .NET Core 3.1 is the latest .NET framework with native support with AWS Lambda. You can read more about the announcement [here](https://aws.amazon.com/blogs/compute/announcing-aws-lambda-supports-for-net-core-3-1/).

Even though .NET 5 is out, support for Lambda is only with [Container Images](https://aws.amazon.com/blogs/developer/net-5-aws-lambda-support-with-container-images/). It is because .NET 5 falls under ['Current' Support level](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) and is not a Long Term Supported (LTS) version. .NET 6 will be the next LTS supported version. *AWS Lambda's policy has been to support LTS versions of language runtimes for managed runtimes*.

### Tooling Support

Any time starting with a new kind of project, the first question that comes to my mind is how we build applications for this?

The AWS Toolkit makes it easier to develop, debug and deploy (you should be looking to automate this) applications to AWS. There is an AWS Toolkit version for most of the IDE's out there. The common ones I

The IDE's I commonly use for .NET development are [Visual Studio](https://aws.amazon.com/visualstudio/), [Visual Studio Code](https://aws.amazon.com/visualstudiocode/) and [JetBrains Rider](https://aws.amazon.com/blogs/developer/aws-toolkit-in-jetbrains-rider/), and toolkit is available for all of those.

Once installed and setup (follow the docs for instructions), you can start creating different project types from the available templates available. Below is a screenshot from the Visual Studio project creation dialog filtered to AWS Platform type.
![AWS Toolkit Visual Studio Project Templates](__GHOST_URL__/content/images/aws_toolkit_visual_studio.jpg)
## Setting Up First Project

Let's create a new project using the '*AWS Lambda Project (.NET Core - C#)*' template option.

Selecting the option from the template list prompts you to choose the AWS Blueprint.

Blueprints contain some code (to get started) based on the type of trigger used to invoke the AWS Lambda function.
![AWS Lambda Select Blueprint dialog Visual Studio](__GHOST_URL__/content/images/aws_select_blueprint.jpg)
In this case, let's select an Empty Function and set it up all ourselves to understand what is happening.

The project created has one class file, `Function.cs`, which contains the code to run when the AWS Lambda function gets invoked.
![AWS Lambda Empty template project files in Solution Explorer](__GHOST_URL__/content/images/aws_project_files.jpg)
It contains two Nuget packages `[Amazon.Lambda.Core`](https://www.nuget.org/packages/Amazon.Lambda.Core/) and `[Amazon.Lambda.Serialization.SystemTextJson](https://www.nuget.org/packages/Amazon.Lambda.Serialization.SystemTextJson/)`.

The JSON config file specifies the AWS lambda details, including the `function-handler` that needs to run when the Lambda function gets invoked.

The function handler string is of the format ***ASSEMBLY::TYPE::METHOD*** where Assembly is the name of the handler function assembly; Type is the full name of the handler type including the Namespace, and Method is the name of the function handler.

In this demo project, the assembly's name is '*AWSLambda1*', the type '*AWSLambda1.Function'* (which is the Function class), which has one method named '*FunctionHandler*.' Hence the whole function-handler string is as below.

    {
      "function-handler": "AWSLambda1::AWSLambda1.Function::FunctionHandler",
    }
    

The default `Function` class looks like below, with a method `FunctionHandler` that takes in a string input and an `ILambdaContext` instance.

    using Amazon.Lambda.Core;
    
    // Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
    [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]
    
    namespace AWSLambda1
    {
        public class Function
        {
    
            /// <summary>
            /// A simple function that takes a string and does a ToUpper
            /// </summary>
            /// <param name="input"></param>
            /// <param name="context"></param>
    
            /// <returns></returns>
            public string FunctionHandler(string input, ILambdaContext context)
            {
                return input.ToUpper();
            }
        }
    }
    

### Mock Lambda Test Tool

The project supports the [Mock Lambda Test Tool](https://github.com/aws/aws-lambda-dotnet/tree/master/Tools/LambdaTestTool), with the `aws-lambda-tools-defaults.json` set up by default. If you want to use the Mock Lambda tool on an existing project, read the [documentation](https://github.com/aws/aws-lambda-dotnet/tree/master/Tools/LambdaTestTool) and add a corresponding file to your project.

The Mock Lambda Tool helps test the Lambda function locally without deploying it to an AWS environment.

The `launchsettings.json` file has the necessary config required to launch the Mock Lambda Test tool when running (F5) the application using Visual Studio.

The Mock Lambda Test Tool shows up a UI to select the configuration file and the Function to execute. The example requests drop-down allows selecting various request formats based on the lambda function trigger.

Since our Function accepts a string, let's choose the 'Hello World' template and pass a string. To trigger the Function, click the Execute Function, and it will simulate an AWS Lambda Function trigger.
![Mock Lambda Tool showing the Function](__GHOST_URL__/content/images/aws_mock_lambda_tool.jpg)
### Lambda Triggers

Earlier, we triggered the Lambda function manually using the Mock tool. Similarly, we can also use the Lambda Console, API, CLI, etc., to invoke the Lambda.

However, most of the time, we want our Function to run in response to an external [Trigger](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html).

> *A trigger is a Lambda resource or a resource in another service that you configure to invoke your Function in response to lifecycle events, external requests, or on a schedule*

A trigger could be anything, from HTTP Requests, a message coming into a queue (SQS), a file dropped to storage (S3), etc.

Each service that integrates with Lambda sends data to the Function as a JSON object. The structure of the JSON payload is dependent on the type of the event.

Depending on the trigger, we need to change the signature of the `FunctionHandler` method so that it can process different payloads (instead of string). We can then extract data specific to the event and use that for processing inside our Lambda function.

There are [separate Nuget packages available](https://github.com/aws/aws-lambda-dotnet/tree/master/Libraries/src) for each of these services that can trigger a lambda. Below is an example of handling [SQS Events](https://github.com/aws/aws-lambda-dotnet/tree/master/Libraries/src/Amazon.Lambda.SQSEvents) in an AWS Lambda.

    public class Function
    {
        public string Handler(SQSEvent sqsEvent)
        {
            foreach (var record in sqsEvent.Records)
            {
                Console.WriteLine($"[{record.EventSource}] Body = {record.Body}");
            }
        }
    }
    

## Deploying to AWS

The easiest way to publish the AWS Lambda function to AWS infrastructure is to right-click on the project and select the 'Publish To AWS Lambda...' option. It prompts up a dialog to select the appropriate configuration to deploy the Lambda function.

*In real-life projects, you would set up a build-deploy pipeline to automate this, which we will see later.*
![Upload Lambda Function dialog in Visual Studio.](__GHOST_URL__/content/images/aws_publish_to_aws_lambda.jpg)
Clicking the Next button prompts to select an IAM role to grant the Lambda function the necessary permissions to run and connect to other services.

I have given it the [AWSLambdaBasicExecutionRole](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html#permissions-executionrole-features), which grants permissions to write to CloudWatch logs.
![Upload Lambda Function Advanced Function Details in Visual Studio.](__GHOST_URL__/content/images/aws_publish_to_aws_lambda_1.jpg)
Click the Upload button to upload and publish the Lambda Function to the selected AWS environment.

The wizard first runs dotnet publish, which generates the compiled DLL, all of its assembly dependency, along with the runtimeconfig.json file (*AWSLambda1.runtimeconfig.json*).
![AWS Lambda Uploading Log in Visual Studio](__GHOST_URL__/content/images/aws_publish_log.jpg)
The runtime config contains the information about the dotnet version and helps the AWS Lambda configure the runtime environment. Below is the generated config (which is generated by specifying */p:GenerateRuntimeConfigurationFiles=true* by the [Toolkit](https://docs.aws.amazon.com/lambda/latest/dg/csharp-package.html))

    {
      "runtimeOptions": {
        "tfm": "netcoreapp3.1",
        "framework": {
          "name": "Microsoft.NETCore.App",
          "version": "3.1.0"
        }
      }
    }
    

If the *Open Lambda Function view after upload complete* is checked in the wizard, it automatically opens the Function after deployment.

If not, you can manually do this from the *AWS Explorer* (that is part of the AWS Toolkit), which is available from View → AWS Explorer. Navigate to AWS Lambda and select the Lambda function that you just deployed.
![AWS Explorer in Visual Studio to view deployed Lambda function](__GHOST_URL__/content/images/aws_lambda_visual_studio_explorer.jpg)
You can invoke the Lambda that we just deployed to AWS from within Visual Studio (manually). The response is all uppercase of the Request payload as expected from the Function.

### AWS Console

Alternatively, you can also navigate to [AWS Console](https://aws.amazon.com/console/), navigate to Lambda in the appropriate region to view the deployed Lambda.
![AWS Lambda in AWS Console](__GHOST_URL__/content/images/aws_lambda_console.jpg)
We can trigger the Lambda Function from here and also update various configurations. If you want to assign different triggers, that's possible from here as well. Manually uploading a new zip package file is also possible from the console.

### Lambda Internals

So by just specifying a string `function-handler`, how is AWS Lambda triggering our Function?

Lambda supports multiple languages through the use of [runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).

> The runtime provides a language-specific environment that runs in an execution environment. It relays invocation events, context information and responses between Lambda and the Function. You can use Lambda provided runtimes or custom runtimes.

Given the `handler-function`, the runtime uses reflection to load the assembly and calls the class's appropriate Function.

Lambda supports out-of-the-box runtime for popular languages. You can also use custom runtime to use any other languages. For a .zip file package, configure to use a built-in runtime using the configuration file. When code is a container image, include runtime when you build the image.

The [Amazon.Lambda.RuntimeSupport](https://github.com/aws/aws-lambda-dotnet/tree/master/Libraries/src/Amazon.Lambda.RuntimeSupport) library helps to build custom runtimes for .NET .

I hope this helps you set up your first AWS Lambda, test it locally on your development machine and publish it to AWS. In future posts, we will see how to set up a build deploy pipeline, handle multiple Lambda Functions in a single project, logging in Lambda, etc.

Feel free to drop in the comments or [send a tweet](https://twitter.com/rahulpnath) if you have any comments or questions.

Happy Serverless programming!

## References

- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Building Lambda Function with C#](https://docs.aws.amazon.com/lambda/latest/dg/lambda-csharp.html)
- [Lambda Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
