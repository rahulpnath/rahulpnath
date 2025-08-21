---
title: Amazon SQS and AWS Lambda Triggers in .NET
slug: amazon-sqs-lambda-trigger-dotnet
date_published: 2022-09-21T00:00:00.000Z
date_updated: 2024-11-28T02:29:26.000Z
tags: AWS, Lambda
excerpt: Learn how to process SQS messages from AWS Lambda Function. We will learn how to set up and trigger a .NET Lambda Function using SQS and the various configurations associated.
---

*This article is sponsored by AWS and is part of my [AWS Series](__GHOST_URL__/tag/aws/).*

Amazon Simple Queue Service (SQS) is a fully managed message queuing service.

SQS enables you to decouple applications and build distributed software systems. With Amazon SQS, you can offload tasks from one application component by sending them to a queue and processing them asynchronously.

AWS Lambda functions can process messages in SQS.

In this post, you’ll learn

- Build and set up a Lambda Function to handle SQS messages
- Different Lambda SQS trigger configurations.
- Exception handling when processing SQS messages

[

Amazon SQS For the .NET Developer: How to Easily Get Started

Learn how to get started with Amazon SQS and use it from a .NET Application. We will learn how to send and receive messages, important properties,and concepts that you need to know when using SQS.

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/queue.jpg)
](__GHOST_URL__/blog/amazon-sqs)
## Build and Deploy .NET Lambda Function

[AWS Lambda](__GHOST_URL__/blog/aws-lambda-net-core/) is Amazon’s answer to serverless computing services. It allows running code with zero administration of the infrastructure that the code is running on.

Make sure to install the AWS Toolkit ([Visual Studio](https://aws.amazon.com/visualstudio/), [Rider](https://aws.amazon.com/rider/), [VS Code](https://aws.amazon.com/visualstudiocode/)) and [set up Credentials for the local development environment](__GHOST_URL__/blog/amazon-credentials-dotnet/).  This helps you quickly develop a .NET application on the AWS infrastructure and deploy them quickly to your AWS Accounts.

With the AWS Toolkit installed, select the AWS Lambda Lambda Project template and choose SQS blueprint. As shown below, it creates an AWS Lambda function template project with a `Function.cs` class with everything required to handle SQS events.

    public async Task FunctionHandler(SQSEvent evnt, ILambdaContext context)
    {
        foreach(var message in evnt.Records)
        {
            await ProcessMessageAsync(message, context);
        }
    }
    
    private async Task ProcessMessageAsync(SQSEvent.SQSMessage message, ILambdaContext context)
    {
        context.Logger.LogInformation($"Processed message {message.Body}");
    
        // TODO: Do interesting work based on the new message
        await Task.CompletedTask;
    }
    

The `SQSEvent` class represents the SQS message notification. It contains a list of `SQSMessage` objects in the Records property.

The blueprint code loops through the `Records` property and logs the message body. The `ProcessMessageAsync` method will contain the business or application-specific logic in a real-world application.

### Deploy Lambda Function

To publish the Lambda function to the AWS account, you can use the Publish to AWS Lambda option that the AWS Toolkit provides. You can directly publish the new lambda function with your [development environment connected to your AWS account](__GHOST_URL__/blog/amazon-credentials-dotnet/).

I prefer to set up an automated build/deploy pipeline to publish to your AWS Account for real-world applications. Check out the below for an example of how to set up a Lambda Function deployment pipeline from GitHub Actions.

## Setting Up SQS Lambda Trigger

Lambda Triggers can be set up under the Lambda Function or on the SQS.

To add a Lambda trigger from the Lambda function, navigate the Lambda Function. Under Configuration → Triggers, select the ‘*Add Trigger’* button.
![To add a Lambda trigger, select the Add trigger option under Configuration → Triggers.](__GHOST_URL__/content/images/aws-lambda-sqs-trigger.jpg)
It prompts a new window with an option to select the source for the trigger.

Choose SQS as the source trigger and specify the SQS queue ARN for which the Lambda function must trigger.

For now, let’s leave the other configuration to default. We will explore it in detail later in this post.
![Select SQS as the source and the SQS Queue ARN details. When a new message comes to the SQS queue, our .NET Lambda Function will be triggered.](__GHOST_URL__/content/images/aws-lambda-sqs-trigger-add.jpg)
Before clicking the ‘Add’ button, we need to ensure the Lambda Function IAM Role has the required IAM Policies to interact with the SQS.

### IAM Policies

Navigate to the IAM Role associated with the Lambda Function. You can do this under the Lambda function Configuration → Permissions → Execution role.
![Select the Execution Role under Configuration → Permissions to update the IAM Policies for the .NET Lambda Function.](__GHOST_URL__/content/images/aws-lambda-sqs-trigger-execution-role.jpg)
The IAM role specifies the permissions for the Lambda function. Setting up SQS Trigger requires the below [permissions](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html).

- **sqs:ReceiveMessage** → Receive the message from the Queue.
- **sqs:DeleteMessage** → Delete the message from Queue once successfully processed.
- **sqs:GetQueueAttributes** → Get Queue attributes to determine the default timeout and other related attributes for processing the message.

Add an inline policy to the Lambda function IAM Role and give access to SQS, as shown below.
![Set up inline IAM Policy for the .NET Lambda Function to connect with the SQS. It requires permissions to ReceiveMessage, DeleteMessage and to GetQueueAttributes.](__GHOST_URL__/content/images/aws-lambda-sqs-trigger-iam-policies.jpg)
Specify the minimum permissions required for the Lambda Function to access the SQS queue. Also, specify the Resource ARN for the SQS queue. The Lambda function can only access the specific SQS queue, following the [Principle of Least Privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).

With the IAM policies applied, go back to the Lambda Trigger setup page and complete setting up the Lambda Trigger. It will successfully add the new trigger for the SQS queue.

### Testing SQS Lambda Trigger Integration

To test the Lambda trigger integration, navigate to the SQS and send a new message.
![Send a test message from the SQS in the AWS Console](__GHOST_URL__/content/images/aws-lambda-sqs-trigger-send-message.jpg)
As soon as the message arrives in the Queue, it will trigger our .NET Lambda function with the SQSEvent containing one record.

The Lambda function reads the message and logs it to the console. You can see this under Cloudwatch Logs.

## SQS Lambda Trigger Configuration

The SQS Lambda Trigger Configuration provides a few configurable options.

These options affect how the Lambda function is called and is essential to understand.

You can update the configuration by navigating the Lambda function and editing the trigger configuration.
![The SQS Lambda trigger provides a few configurable options, mainly Batch Size and Batch Window. This affects how the messages are sent to the Lambda function.](__GHOST_URL__/content/images/aws-lambda-sqs-trigger-configurations.jpg)
- **Batch Size** → This is the largest number of records that will be read from the Queue at once and delivered to the Lambda Function. If you want the Lambda function to process only one message at a time, set this to 1. Setting a higher value does not guarantee the Lambda Functions will be delivered that many records. It only indicates the maximum limit of records.
- **Batch Window** → This specifies the time in seconds to wait to gather records to set the Batch Size setting before invoking the Lambda function. E.g., if the Batch size is ten and Batch Window is 30 seconds, it will wait 30 seconds to accumulate ten records. If there are ten records before that, the Function gets invoked immediately. After 30 seconds there still is less than 10, it will invoke the Lambda function with the available records. These settings become more critical when many messages come into your Queue.
- **Filter Criteria** → You can [filter messages coming into SQS](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html#filtering-sqs) even before it is delivered to your Lambda function. So if you are only interested in specific kinds of messages (based on message properties or attributes), you can specify the Filters. It is a JSON object structure, and you can add multiple filters to a trigger configuration. If the messages do not pass the filter criteria, these are automatically dropped from the SQS.

## Exception Handling When Processing SQS Messages

So all good until now. We have messages coming into the queue, the Lambda function gets triggered, processes the message, and successfully removes the message from the Queue.

Great!

But what happens when there is an exception when processing the message in the Lambda Function?

Maybe it’s an unhandled code path, a null reference exception, or an external third-party integration service that is down.

Whenever the Lambda function errors and throws an exception, Lambda does not acknowledge SQS of successful processing. After the default Visibility timeout on the Queue or at the message level, the message will reappear in the Queue. And it is made available for processing again.

The Lambda Trigger and SQS provide different configurations to control the exception handling flow and attached processes. I will cover this in a future blog post, where we will see how to simulate an exception, how messages get retried, how to control the retries, and more.

I hope this helped you to get started with Amazon SQS and AWS Lambda Triggers from a .NET application.
