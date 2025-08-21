---
title: How To Manage Multiple Stages in Amazon API Gateway REST API?
slug: amazon-api-gateway-rest-api-multiple-stages
date_published: 2022-08-01T00:00:00.000Z
date_updated: 2024-11-28T02:30:13.000Z
tags: AWS
excerpt: Learn how to configure different Stages to use different backend integrations - Lambda Function, DynamoDB etc - based on the Stage they are running. We will use Stage variables to set up connections with different Lambda Functions and DynamoDB database.
---

*This article is sponsored by AWS and is part of my [AWS Series](__GHOST_URL__/tag/aws/).*

When building applications, we want the ability to test them before we deploy them to the production environment. It applies to building API applications.

With Amazon API Gateway, we can use Stages to represent different environments (production, test, development, etc.).

In this blog post, learn how to configure different Stages to use backend integrations - Lambda Function, DynamoDB, etc. - based on the Stage they are running.

In a previous post, we learned [how to build an API Gateway REST API Using AWS Lambda Proxy Integration](__GHOST_URL__/blog/amazon-api-gateway-rest-api-lambda-proxy-integration/). We learned how to handle the API Gateway requests in a Lambda function built in .NET, connect to a DynamoDB table and perform CRUD operations.
[

How To Build an API Gateway REST API Using AWS Lambda Proxy Integration?

In this post, you will learn how to build a REST API using Amazon API Gateway with AWS Lambda Proxy integration built in .NET Core. Learn how to build and set up the Lambda integration, connect to a DynamoDB database and perform CRUD operations.

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/aws_lambda.jpg)
](__GHOST_URL__/blog/amazon-api-gateway-rest-api-lambda-proxy-integration)
However, when deploying to multiple Stages, we had one issue -  APIs deployed to different Stages were using the same backend integrations - Lambda Function and DynamoDB table. We want each API Stage to talk to its own backed integration services. This makes each Stage isolated and runs without affecting other Stages.

> *Following a convention when naming resources and services is a good practice.*

For this example, I will prefix each resource/service with the name of the Stage it’s running, except for Production. For e.g., A DynamoDB table for the Test environment/Stage will be named *test-User.* The Lambda Function, in this case, will be *test-user-service.*

The hyphen in the names to indicate the stage makes the name more readable in the resources list. Choose a convention based on your team preferences.

We can make each Stage interact with their respective integrations services using Stage or Environment variables.

Based on the AWS Services involved and how they are set up in the end-to-end integration, we will need to define these variables at multiple places.

## API Gateway Stages

A Stage is a logical reference to a lifecycle state of your API (for example, `dev`, `prod`, `beta`, `v2`). You can deploy an API to multiple Stages based on your application requirement.

Each Stage allows configuring environment-specific variables, called Stage Variables in API Gateway.

> *[Stage variables](https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html) are name-value pairs that you can define as configuration attributes associated with a deployment stage of a REST API. They act like environment variables and can be used in your API setup and mapping templates.*

### Adding Stage Variables

To create a stage variable, navigate to Stages and the stage you want to add the variable. Under the Stage Variables section, add a new variable.

Below I have added ‘*env*’, an environment variable to indicate the environment the Stage is running.
![Add stage variable to the API Stage.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-proxy-stage-variables.jpg)
The *env* variable for the Test stage is ‘test-‘.

We can use the env stage variable to prefix the integration services it connects.

E.g., In the test environment, the Lambda Function will be ‘*test-user-service*’, and the DynamoDB table will be *test-User.*

### Configure API Integration Using Stage Variables

We can now configure the Method Integration Request on the API Gateway to connect to the stage-specific Lambda Function. For the Test stage, we need it to connect to `test-user-service`, and for the Prod stage, we will connect to the original `user-service`.

Under the Integration Request, when setting the Lambda Function, we can use the Stage Variables to append to the name of the Lambda Function, as shown below.
![Use stage variables to prefix the Lambda Function name when specifying the Integration endpoint in API Gateway REST API Integration Method.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-proxy-lambda-method-integration-request-stage-variables.jpg)
So now we have the Lambda Function as `${stageVariables.env}user-service`, which uses the *stageVariables* object to retrieve the *env* variable.

On saving the Lambda Function integration with the *stageVariables* in, it prompts to ensure we add `lambda:InvokeFunction` permissions to the Lambda function manually.

The last time we explicitly selected the Lambda Function for the integration, it automatically set up these permissions.

Since API Gateway cannot determine what values the stage variables will contain, it delegates this responsibility to us to manually set up.
![Add permission to Lambda Function manually for API Gateway to be able to invoke it. When you use stage variables in the lambda name, this dialog prompts up since you need to add in the permissions manually.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-proxy-lambda-permissions.jpg)
Later in the post, we will use the above information to set up the Resource-based policy in our Lambda Functions manually.

## Multiple Lambda Functions

Since each Stage connects to its own Lambda Function, we need to deploy the same function code to different Lambda.
[

AWS Lambda For The .NET Developer

Learn to build Serverless Applications on AWS

![](https://www.udemy.com/staticx/udemy/images/v7/apple-touch-icon.png)Udemy

![](https://img-c.udemycdn.com/course/480x270/4689888_b522_4.jpg)
](https://www.udemy.com/course/aws-lambda-dotnet/?referralCode&#x3D;981481B991C2890BD448)
Based on the Stage the Lambda Function is running on, it needs to also connect to different DynamoDB tables. This also applies to other services if you are using any in your applications.

### Configure DynamoDB Based on Stage

First, create a new DynamoDB table and append the name with our Stage prefix. In this case, it will be *test-User* Table.

For the Lambda function to be able to talk to the correct DynamoDB table, we need to make sure to append the stage variable to the default table name it uses from the *`User`* class name.

When setting up the `DynamoDBContext` instance, we can pass a configuration to apply a prefix for table names.

    public Function()
    {
        var environment = Environment.GetEnvironmentVariable("Environment");
        _dynamoDbContext = new DynamoDBContext(new AmazonDynamoDBClient(),
            new DynamoDBContextConfig()
            {
                TableNamePrefix = environment
            });
    }
    

Since we are using the environment variable to determine the value to prefix to DynamoDB table names, we can configure this based on the environment the Lambda Function is running for.

You can configure this in AWS Console, under Configuration → Environment Variables.

Below I have set the variable *Environment* to be ‘*test-’* for the *test-user-service* Lambda Function.
![Add environment variable for the Lambda Function from the AWS Console.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-proxy-lambda-environment-variable.jpg)
### Configuring Lambda Policies Based on Environment

Now that the Lambda Function connects to the appropriate DynamoDB table based on the Environment variable settle, it also needs to be given the relevant IAM policies to talk to.

Navigate to the Lambda Function in AWS Console, under Configuration → Permissions, and select the Execution Role assigned to the Lambda Function.

This opens the IAM Role, where you can Add additional Permissions to the role.
![Update the Lambda IAM Role to provider permissions to talk to the Stage-specific DynamoDB table. Explicitly select the required permissions and the Resources the Lambda function needs access to.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-proxy-lambda-iam-role-stage.jpg)
I’ve added the same set of permissions that we provided when setting up the first Lambda Function [in the previous post](__GHOST_URL__/blog/amazon-api-gateway-rest-api-lambda-proxy-integration/), but to the stage-specific DynamoDB table.

### Setting Up API Gateway and Lambda Permissions

Under Permissions → Resource-based Policy section, add a new permissions.

*A resource-based policy lets you grant permissions to other AWS accounts or services per resource.*

You can get the values to fill below from the popup that showed up when we updated the Integration Request to use Stage Variables.

Below, the Source ARN specifies the endpoint ARN details that require access. In this case, all HTTP Methods under the user resource is given access to invoke the Lambda function.

TDK star notation details
![Add a resource-based policy to provide the API Gateway permission to invoke the Lambda Function. The Source ARN specifies the endpoint ARN details that require access. In this case, all HTTP Methods under the user resource is given access to invoke the Lambda function.](__GHOST_URL__/content/images/api-gateway-rest-api-lambda-stage-permission.jpg)
## Managing API Deployments

We have successfully configured the different services and resources to connect based on the Stage it’s running on.

Launch the API Gateway URL for the Test stage and make a `GET` and `POST` request to test it. You will see the data retrieved/saved from the *test-User* table. You can also verify the CloudWatch logs of the *test-user-service* Lambda Function to make sure they are called.

When making changes to the REST API definitions, you can now first deploy it to the Test stage. Test the changes first, and push it to the Prod stage when ready.

### Rollback Deployments

Under the Deployment History tab for a Stage, you can see all the deployments made to that stage.

It shows the current stage with a checkmark against it. Selecting a different deployment allows changing the deployment to that version.
![Curernt and previous deployment history under API Gateway Stages. Select a different version and deploy that version.](__GHOST_URL__/content/images/api-gateway-rest-api-deployment-history.jpg)
This allows easy rollback to a previous deployment when needed. But note that this only rollbacks the API Gateway part of the code. If your deployment includes related backend resource changes, you will need to roll them back separately.

When using a build deploy pipeline, you can manage this all together from a single place/release pipeline. I will cover this in a separate blog post.

*Full Source code and demo [available here](https://rahulpnath.visualstudio.com/YouTube%20Samples/_git/api-gateway-rest-lambda-proxy-integration).*

I hope this helps you manage and set up multiple Stages and API Gateway deployments.
