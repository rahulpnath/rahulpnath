---
title: How To Secure and Authenticate AWS Lambda Function URLs
slug: how-to-secure-and-authenticate-lambda-function-urls
date_published: 2022-10-31T07:23:29.000Z
date_updated: 2024-11-28T03:47:02.000Z
tags: AWS, Lambda
---

*This article is sponsored by AWS and is part of my [AWS Series](__GHOST_URL__/blog/category/aws/).*

In a previous blog post, [Function URLs - Quick and Easy way to Invoke AWS Lambda Functions over HTTP](__GHOST_URL__/blog/function-urls-in-aws-lambda-dotnet/), we learned how to expose and invoke Lambda functions over an HTTP endpoint. 

We enabled the Function URL without any authentication on the URL endpoint, which makes it possible for anyone with Lambda's URL to invoke the Lambda Function.

When using this in real-world applications, we want to secure the Function URL endpoints and make it possible only for authenticated users or applications to invoke the Lambda Function.

## Enable AWS_IAM Authentication Type

When enabling Function URLS, it gives the option to select the Auth type. To restrict the URL to only authenticated users, choose the AWS_IAM Auth type option.

The AWS_IAM option ensures that only authenticated IAM users and roles can make requests to the function URL.
![](__GHOST_URL__/content/images/2022/10/image-3.png)
Once enabled, if you try to invoke the Function URL without passing any security headers, it throws a `403 Forbidden request`. 

Each HTTP request to an `AWS_IAM` enabled Function URL must be signed using [AWS Signature Version 4 (SigV4)](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html). 

### Creating an IAM User

The principal requesting the Function URL must either have `lambda:InvokeFunctionUrl` permission in their [identity-based policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html) or have permissions granted in the functions resource-based policy. 

For identity-based-policy, you can add the `InvokeFunction` and `InvokeFunctionUrl` permission as shown below. 
![](__GHOST_URL__/content/images/2022/10/image-5.png)
Create an access key for the User with the appropriate permissions to invoke the Function URL. The Access key ID and the Secret are required to sign requests to the Function URL.

### Using IAM Credentials From POSTMAN

[Postman](https://www.postman.com/) is an API platform and building APIs. Postman supports authorizing requests using [AWS Signature](https://learning.postman.com/docs/sending-requests/authorization/#aws-signature) and can be configured to use the AccessKey and Secret for the User from the previous step.

Create a new request in Postman, and under the Authorization tab, choose the Type as `AWS Signature`. 

It prompts you to enter the `AccessKey` and the `SecretKey`. It also requires sending the `AWS Region` and `Service Name`. 

In this case, my lambda function is deployed to Sydney (ap-southeast-2) region, so specify `AWS Region` as '*ap-southeast-2*'  and `Service Name` as '*lambda*'.
![](__GHOST_URL__/content/images/2022/10/image-4.png)
With the AWS Signature setup, you can make a successful request to the AWS Lambda Function URL. Depending on the `HTTP Method` specified on the Postman request, it will perform the appropriate action on the Lambda Function. 

## Calling Function URLs FROM .NET APPs

When building new features, you will have to invoke our Function URL API from other .NET applications. 

In .NET, calling other API endpoints is usually done using the `HttpClient` class. 
[

Are You Using HttpClient in The Right Way?

If not used correctly it’s easy to run into socket exhaustion and DNS related issues with HttpClient in .NET Core. Learn how to identify these issues and how to use HttpClient class in the right way.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/http_client_web.jpg)
](__GHOST_URL__/blog/are-you-using-httpclient-in-the-right-way/)
The [AwsSignatureVersion4](https://github.com/FantasticFiasco/aws-signature-version-4) NuGet package extends the `HttpClient` class to add support for AWS Signature 4.

Using AccessKey and Secret, create a new `ImmutableCredentials` instance to pass to the different extension methods on the `HttpClient` class. You also need to provide the `RegionName` and `ServiceName` as we did in the Postman example.

Below is the .NET sample code to make an authenticated call to a Lambda Function URL endpoint.

    async Task Main()
    {
    	var httpClient = new HttpClient();
    	var credentials = new ImmutableCredentials(
            "ACCESS KEY ID", "SECRET", null);
    	var result = await httpClient.GetAsync($"https://lrd7ews3klz23s3brksliz7nii0iwsng.lambda-url.ap-southeast-2.on.aws?userId={Guid.NewGuid()}", "ap-southeast-2", "lambda", credentials);
    	
    	var resultString = await result.Content.ReadAsStringAsync();
    	result.StatusCode.Dump();
    	resultString.Dump();
    }

### Using Environment Credentials

When the .NET applications are already running in an environment where the AWS Credentials are configured, you can use those credentials to invoke the Function URL.
[

Learn How To Manage Credentials When Building .NET Application on AWS

Learn different ways to set up and manage credentials and sensitive information when building .NET applications on AWS. We will also touch upon some of the tools and utilities that I have set up on my local development machine to make working with AWS easier.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/secure-key.jpg)
](__GHOST_URL__/blog/amazon-credentials-dotnet/)
 The request will succeed if the configured credentials in the environment have access to invoke the Lambda function URL.

    ...
    var credentials = FallbackCredentialsFactory.GetCredentials();
    ...

Instead of explicitly creating an `ImmutableCredentials` instance from the secret key and access key id, use the `FallbackCredentialsFactory` to get the credentials configured at the machine level. 
[

Function URLs - Quick and Easy way to Invoke AWS Lambda Functions over HTTP

A Function URL is a dedicated endpoint for your Lambda function. Learn how to enable Function URLs and build an API using .NET Lambda Function.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2022/10/AWS-Lambda-Function-URLs.png)
](__GHOST_URL__/blog/function-urls-in-aws-lambda-dotnet/)
I hope this helps you authenticate your Lambda Function URLs and ensure only authenticated requests are processed on the URL.
