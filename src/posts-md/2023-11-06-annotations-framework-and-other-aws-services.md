---
title: Learn How to Easily Integrate Lambda Annotations and Other AWS Services
slug: annotations-framework-and-other-aws-services
date_published: 2023-11-06T07:04:46.000Z
date_updated: 2023-11-23T06:13:41.000Z
tags: AWS, Lambda
excerpt: Learn how to use the Lambda Annotations Framework to integrate with other AWS Services like S3, SQS, SNS, DynamoDB etc. In this blog post we will see an example using S3.
---

The [Lambda Annotations Framework](https://github.com/aws/aws-lambda-dotnet/blob/master/Libraries/src/Amazon.Lambda.Annotations/README.md?ref=rahulpnath.com) is a programming model that makes it easier to build AWS Lambda Functions using .NET.

In previous blog posts, we learned how to get started using the Lambda Annotations Framework, build a CRUD API Endpoint, and set up Dependency Injection when creating Lambda Functions using the Annotations Framework.

- [Learn How AWS Lambda Annotations Framework Makes API Gateway Integration Easy](__GHOST_URL__/blog/aws-lambda-annotation-framework/)
- [Serverless API Development Made Easy: Using AWS Lambda Annotations for CRUD](__GHOST_URL__/blog/lambda-annotation-framework-crud-api/)
- [How To Set Up Dependency Injection in Lambda Functions Using Annotations Framework](__GHOST_URL__/blog/lambda-annotations-dependency-injection/)

In all the above scenarios we used the Annotations Framework along with building Lambda Functions for the API Gateway. 

However, you can also use the Annotations Framework when building Lambda Functions that integrate with other AWS Services. 

In this blog post, let's see a quick example of using the Lambda Annotations Framework when building a Lambda Function with Amazon S3 service. 

For E.g., we need to run a Lambda Function every time a new file is uploaded to an Amazon S3 bucket and have the function code read the file and process it. This could be an image post-processing Lambda Function, a report ingestion service, a bulk data upload service, etc.

*This article is sponsored by AWS and is part of my *[*AWS Series*](__GHOST_URL__/tag/aws/)*.*

## AWS Lambda and Amazon S3 Integration

Amazon Simple Storage Service (S3) is an object storage service that allows you to store any data.

Any time an object is created or modified in S3, it raises event notifications. We can use these notifications in specific scenarios to perform additional business logic or application processing.

To learn more about this in detail check my Amazon S3 and AWS Lambda Triggers in .NET, blog post.
[

Amazon S3 and AWS Lambda Triggers in .NET

Amazon S3 raises event notifications when Objects are created and modified. Learn how to use this to trigger Lambda Functions in .NET and the different configuration associated with processing the notification messages.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/amazon-s3-lambda-triggers-dotnet.jpg)
](__GHOST_URL__/blog/amazon-s3-lambda-triggers-dotnet/)
Lambda Functions that integrate with Amazon S3 services, take in a `S3Event` class type, to bind to the Amazon S3 event. 

    public async Task FunctionHandler(S3Event evnt, ILambdaContext context)
    {
      ...
      var file = await this.S3Client
          .GetObjectAsync(s3Event.Bucket.Name, s3Event.Object.Key);
      ...
    }

This happens by default using the basic Lambda JSON Serializer and there is nothing specific that the Annotations Framework can provide us here. 

However, the features that are useful from the Annotations Framework when integrating with other AWS Services are Dependency Injection and Serverless Template for easy deployment.

## Dependency Injection For Lambda Functions

Lambda Annotations Framework provides an easy out-of-the-box mechanism to set up and work with .NET Dependency Injection framework.

Instead of hard-coding the instance creation in the Function constructor, you can inject in the dependencies that the Function needs using the Function constructor or the Handler Function.

To enable the Annotations Framework we need to apply the `LambdaFunction` attribute to the Function Handler as shown below.

The below code shows examples of injecting the `IAmazonS3` instance both using the constructor and also using the Function Handler. 

    public Function(IAmazonS3 s3Client)
    {
        S3Client = s3Client;
    }
    
    [LambdaFunction(ResourceName = "MyLambdaFunction")]
    public async Task FunctionHandler(
      [FromServices] IImageServices imageServices, S3Event evnt, ILambdaContext context)
    {
      ...
    }
    

To inject via the FunctionHandler method, we need to add `FromServices` attribute, to tell Annotations Framework to resolve the type from the DI container.

    [Amazon.Lambda.Annotations.LambdaStartup]
    public class Startup
    {
      public void ConfigureServices(IServiceCollection services)
      {
          services.AddAWSService<Amazon.S3.IAmazonS3>();
      }
    }
    

## Serverless Template File For Deployment

Enable the Annotations Framework also generates the CloudFormation template file, which can be used to automate resource deployment. 

In this scenario, since we are integrating with Amazon S3, we can further define the S3 bucket and also the required triggers to wire up the S3 event notification to trigger the Lambda Function.

    "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Ref": "BucketName"
            },
            "NotificationConfiguration": {
              "LambdaConfigurations": [
                {
                  "Event": "s3:ObjectCreated:*",
                  "Filter": {
                    "S3Key": {
                      "Rules": [
                        {
                          "Name": "prefix",
                          "Value": "test/"
                        },
                        {
                          "Name": "suffix",
                          "Value": ".txt"
                        }
                      ]
                    }
                  },
                  "Function": {
                    "Fn::GetAtt": [
                      "MyLambdaFunction",
                      "Arn"
                    ]
                  }
                }
              ]
            }
          }
        },
        "S3InvokeLambdaPermission": {
          "Type": "AWS::Lambda::Permission",
          "Properties": {
            "Action": "lambda:InvokeFunction",
            "FunctionName": {
              "Ref": "MyLambdaFunction"
            },
            "Principal": "s3.amazonaws.com",
            "SourceArn": {
              "Fn::Sub": "arn:aws:s3:::${BucketName}"
            }
          }
        },
        "LambdaRole": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": {
                    "Service": "lambda.amazonaws.com"
                  },
                  "Action": [
                    "sts:AssumeRole"
                  ]
                }
              ]
            },
            "Path": "/",
            "ManagedPolicyArns": [
              "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
            ],
            "Policies": [
              {
                "PolicyName": "s3",
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Effect": "Allow",
                      "Action": [
                        "s3:Get*"
                      ],
                      "Resource": [
                        {
                          "Fn::Sub": "arn:aws:s3:::${BucketName}"
                        },
                        {
                          "Fn::Sub": "arn:aws:s3:::${BucketName}/*"
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        }

The above template is in addition to the automatically generated template for the Lambda Function. 

It sets up the S3 bucket (`Bucket`), the Lambda IAM Role (`LambdaRole`) giving it permission to read from the S3 bucket and also permission for the S3 bucket to invoke the Lambda Function (`S3InvokeLambdaPermission`).

This makes it easy to deploy the required resources and permissions together along with changes to the Lambda Function.

Similar to Amazon S3, you can also use the same approach to integrate with other AWS Services like SQS, SNS, DynamoDB, etc. 
