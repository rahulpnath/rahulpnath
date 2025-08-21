---
title: 5 Recommended Patterns When  Using Cancellation Token in .NET
slug: cancellation-token-patterns
date_published: 2024-04-02T04:53:01.000Z
date_updated: 2024-04-03T04:03:09.000Z
tags: Dotnet, AWS
excerpt: Are you blindly passing around the CancellationToken to all your functions? If so, you are likely using CancellationTokens in the wrong way.  Let’s learn five good practices when using Cancellation Tokens in your application code.
---

Are you passing around the CancellationToken to all your functions blindly? 

Stop using Cancellation Tokens the **wrong** way in .NET!

CancellationTokens in .NET allows the caller to express lost interest in the result of an operation. This can be at a Function level, class level, API endpoint, etc.

 Does that mean all requests are the same and can be canceled similarly?

Short answer - No!

In this post, let’s learn five good practices when using Cancellation Tokens in your application code.

> *Cancellation tokens are a great way to implement cooperative cancellation of asynchronous or long-running synchronous operations.*

 Cancellation tokens allow us to cancel out long-running processes and HTTP requests to other applications, thereby reducing the time our server spends on requests that no one cares about anymore.
[

A .NET Programmer’s Guide to CancellationToken

Imagine having a long-running request triggered by a user on your server. But the user is no longer interested in the result and has navigated away from the page. However, the server is still processing that request and utilizing resources until you come along and implement Cancellation Tokens in the

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2024/03/Cancellation-Token.png)
](__GHOST_URL__/blog/cancellation-token-dotnet/)
*This article is sponsored by AWS*.

## The Problem With Cancelling All Functions

Any time you chain multiple cancellable operations together by calling them together (either parallelly or sequentially), it's possible to leave the application in an invalid state.

Let's look at the same example as in the [previous post](__GHOST_URL__/blog/cancellation-token-dotnet/), where we are uploading a file to Amazon S3.

This problem is not limited to Amazon S3 but applies to any cancellable operations chained together. 
[

Amazon S3 For the .NET Developer: How to Easily Get Started

Learn how to get started with Amazon S3 from a .NET Core application. We will learn how to store and retrieve data from the storage, important concepts to be aware of while using S3.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/size/w1200/storage-box.jpg)
](__GHOST_URL__/blog/amazon-s3-dotnet/)
So, continue reading even if you don't understand how Amazon S3 works or how to use it from a .NET application. But if you want to learn more about Amazon S3, check out the post below.

    app.MapPost("/upload-large-file", async ([FromForm] FileUploadRequest request, CancellationToken cancellationToken) =>
        {
            try
            {
                var s3Client = new AmazonS3Client();
                await s3Client.PutObjectAsync(new PutObjectRequest()
                {
                    BucketName = "user-service-large-messages",
                    Key = $"{Guid.NewGuid()} - {request.File.FileName}",
                    InputStream = request.File.OpenReadStream()
                }, cancellationToken);
    
                await PerformAdditionalTasks(CancellationToken.None);
                return Results.NoContent();
            }
            catch (OperationCanceledException e)
            {
                return Results.StatusCode(499);
            }
        })
        .WithName("UploadLargeFile")
        .DisableAntiforgery()
        .WithOpenApi();
    
    async Task PerformAdditionalTasks(CancellationToken cancellationToken)
    {
        await Task.Delay(1000, cancellationToken);
        
        var snsClient = new AmazonSimpleNotificationServiceClient();
        await snsClient.PublishAsync(new PublishRequest()
        {
            TopicArn = "<SNS TOPIC ARN>",
            Message = "UserUploadedFileEvent"
        }, cancellationToken);
    

The API endpoint takes in the `CancellationToken` and passes that on to the Amazon S3 client `PutObjectAsync` method.

If the user cancels out of the upload process midway through uploading a large file, the file upload is also canceled and discarded from S3.

Let's say in our business functionality, we have to do some additional work right after uploading a file to S3, represented by the `PerformASdditionalTasks` function below.

The `PerformAdditionalTasks` for now, it simulates work with a `Task.Delay` and publishes a message into the Amazon SNS notifying anyone else interested in the `UserUploadedFileEvent`.

The `PerformAdditionalTasks` also takes in the same `CancellationToken` passed into the API endpoint. 

When invoking the API endpoint, if the user cancels out before the file upload is complete or waits until the end, everything works as expected.

However, the operation will be canceled if the user cancels the API request right after the file is uploaded to the S3 bucket while the server processes the additional tasks. 

***This leaves the application in an invalid state. ***

If the file is uploaded but hasn't completed the additional tasks or raised the event on the file upload, it will be left dangling in that S3 bucket.

This brings us to our first recommended practice when using CancellationToken in your .NET applications.

## 1. Avoid canceling operations after side-effects

Once the application code has started making side effects don't cancel out of the operation. 

In the above scenario, the application incurred a side effect after successfully uploading the file to the S3 bucket. 

From this point on, canceling out the operation must be an intentional choice. 

If it's decided to cancel the operation after that, necessary compensating action(s) must be taken. In our scenario, it will be to delete the uploaded file.

The application will continue processing and raise the events if not allowed to cancel. The function must return a success status code in this case and not throw an `OperationCancelledException`.

In this case, the function caller, which is any consumer of the API endpoint, must be ready to handle any cleanup activities in case the cancellation request is ignored and the processing is completed successfully.

## 2. Optional Cancellation Token on Public API and required elsewhere

The function composing the different functions to perform a bigger task should be able to decide whether an individual component should be canceled. 

To enable this, it's recommended to make the `CancellationToken` mandatory on the internal/private functions. 

At the same time, the callee of the public function should have the flexibility of passing in a CancellationToken or ignoring it if it does not intend to cancel.

So make CancellationToken optional on your Public functions and mandatory on the internal/private functions (that can be cancelled).

In ASP.NET Core, since the framework automatically injects the CancellationToken, which is available as part of the RequestContext, making it optional or mandatory does not make much difference. 

But you can see this pattern of keeping it optional in almost all the SDKs/Nuget packages.

For example, look at the two different methods from the Amazon S3 client and the SNS client below

    // S3 Client
    public virtual Task<PutObjectResponse> PutObjectAsync(
      PutObjectRequest request, 
      System.Threading.CancellationToken cancellationToken = default(CancellationToken))
    
      // SNS Client
      public virtual Task<PublishResponse> PublishAsync(
        PublishRequest request, 
        System.Threading.CancellationToken cancellationToken = default(CancellationToken))

In both cases, the `CancellationToken` is optional and defaults `CancellationToken.None`.

## 3. Use CancellationToken.None after the point of 'no cancellation'

`CancellationToken.None` cannot be canceled; that is, its [CanBeCanceled](https://learn.microsoft.com/en-us/dotnet/api/system.threading.cancellationtoken.canbecanceled?view=net-8.0) property is `false`.

Once the application has passed the point of 'no cancellation,' or in other words, has incurred side effects, you can pass on the `CancellationToken.None` after that point. 

This ensures that even if the callee of the original public function cancels the token, the operation will run to completion/or a stable state.

Applying this to our original function means we do not pass on the cancellation token received from the ASP NET framework but pass on a `CancellationToken.None` after the file is uploaded to S3.

    app.MapPost("/upload-large-file", async ([FromForm] FileUploadRequest request, CancellationToken cancellationToken) =>
        {
            try
            {
                var s3Client = new AmazonS3Client();
                await s3Client.PutObjectAsync(new PutObjectRequest()
                {
                    BucketName = "user-service-large-messages",
                    Key = $"{Guid.NewGuid()} - {request.File.FileName}",
                    InputStream = request.File.OpenReadStream()
                }, cancellationToken);
    
                await PerformAdditionalTasks(CancellationToken.None);
                return Results.NoContent();
            }
            catch (OperationCanceledException e)
            {
                return Results.StatusCode(499);
            }
        })

In the updated code for our `POST` endpoint, once the file is uploaded to S3, it passes on the `CancellationToken.None` to the `PerformAdditionalTasks` function (and any other cancellable function after that point).

It's now the consumer of the API's responsibility to do necessary compensating work, if it requested cancellation but receives a successful response.

## 4. Check CancellationToken.CanBeCanceled

Suppose your functions can be made more efficient when they can't be canceled. In that case, checking if the CancellationToken can be canceled and having a different implementation for the function code is recommended.

The best example of this is the `Task.Delay` method. 

     private static Task Delay(uint millisecondsDelay, TimeProvider timeProvider, CancellationToken cancellationToken) =>
                cancellationToken.IsCancellationRequested ? FromCanceled(cancellationToken) :
                millisecondsDelay == 0 ? CompletedTask :
                cancellationToken.CanBeCanceled ? new DelayPromiseWithCancellation(millisecondsDelay, timeProvider, cancellationToken) :
                new DelayPromise(millisecondsDelay, timeProvider);

Based on the `CancellationToken.CanBeCancelled` property, it switches between two different implementations using the `DelayPromiseWithCancellation` or `DelayPromise`.

It enables the function to be more efficient in scenarios where the token cannot be canceled, and it has to run till completion of the time passed to it.

## 5. Ignore CancellationToken if work is quick.

You can ignore the cancellation token if the work done inside your functions (public endpoints) is very short and quick. 

Ignoring the token applies to your Public endpoint, not your internal functions.

So next time you pass around that Cancellation Token, think again,

*Is this work cancellable?*

Don't blindly pass around the token; it has consequences and can leave your application invalid.

#### References

- [**Recommended patterns for CancellationToken**](https://devblogs.microsoft.com/premier-developer/recommended-patterns-for-cancellationtoken/)
