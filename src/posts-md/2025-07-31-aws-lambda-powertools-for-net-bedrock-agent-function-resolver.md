---
title: AWS Lambda Powertools for .NET - Bedrock Agent Function Resolver
slug: aws-lambda-powertools-for-net-bedrock-agent-function-resolver
date_published: 2025-07-31T06:31:33.000Z
date_updated: 2025-07-31T06:31:33.000Z
tags: AWS, Lambda
excerpt: Let's learn how to easily add your custom Lambda Function to Amazon Bedrock Agents using the Lambda Powertools library.
---

Amazon Bedrock Agents can invoke functions to perform tasks based on user input.

When using AWS Lambda to build these functions, you're often faced with the challenge of manually parsing complex JSON request/response payloads.

The AWS Lambda Powertools for .NET library solves this problem with its Bedrock Agent Function Resolver. It completely removes the need for boilerplate code, letting you work with strongly typed objects and build more Agent integrations more quickly.

Let's dive in and see how it works.

## What is Powertools for AWS Lambda?

[AWS Lambda Powertools for .NET](https://docs.powertools.aws.dev/lambda/dotnet/), is an open-source utility suite designed to help .NET developers build Lambda functions following AWS best practices.

It supports .NET 6 and .NET 8 runtime environments. 

Lambda Powertools includes a core set of utilities—tracing, structured logging, and custom metrics—along with language-specific features such as idempotency, parameter retrieval, batch processing, and event handling.
[

AWS Lambda Powertools

Powertools for AWS Lambda (.NET) is a suite of utilities for AWS Lambda functions to ease the adoption of best practices such as tracing, structured logging,…

![](__GHOST_URL__/content/images/icon/favicon_144x144.png)YouTube

![](__GHOST_URL__/content/images/thumbnail/studio_square_thumbnail.jpg)
](https://www.youtube.com/playlist?list=PL59L9XrzUa-lVIngBF1OTG1Wxy56_esQB)
## Bedrock Agent Function Resolver

To create an agent running in a Lambda Function, first create an empty Lambda Function using the AWS Toolkit. 
[

AWS Lambda For The .NET Developer

This blog post is a collection of other posts that covers various aspects of AWS Lambda and other services you can integrate with when building serverless applications on Lambda.

![](__GHOST_URL__/content/images/icon/logo-512x512-24.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/thumbnail/AWS-Lambda-1.png)
](__GHOST_URL__/blog/aws-lambda-dotnet-developer/)
Add the [BedrockAgentFunction ](https://www.nuget.org/packages/AWS.Lambda.Powertools.EventHandler.Resolvers.BedrockAgentFunction)nuget package to the Lambda Function

    dotnet add package AWS.Lambda.Powertools.EventHandler.Resolvers.BedrockAgentFunction

The NuGet package provides the `BedrockAgentFunctionResolver` to register your [tools](https://docs.aws.amazon.com/bedrock/latest/userguide/tool-use.html) to handle requests from Bedrock agent. 

The resolve automatically parses the incoming request, routes it to the appropriate tool function and transforms the function response for the Bedrock agent.

Below is a sample Lambda Function code that sets up two tools for Bedrock Agent.

    public class Function
    {
        private readonly BedrockAgentFunctionResolver _resolver;
    
        public Function()
        {
            _resolver = new BedrockAgentFunctionResolver();
    
            _resolver.Tool("getWeatherForCity", (string cityName) => $"The weather in {cityName} is sunny");
            _resolver.Tool("getTemperatureForCity", GetCurrentTemperatureForCity);
        }
    
        private string GetCurrentTemperatureForCity(string cityName)
        {
            return $"The current temperature in {cityName} is {Random.Shared.Next(-20, 50)} °C";
        }
    
        public BedrockFunctionResponse FunctionHandler(BedrockFunctionRequest input, ILambdaContext context)
        {
            return _resolver.Resolve(input, context);
        }
    }

### Lambda Function Entrypoint

In the above code, the `FunctionHandler` function is the entry point for the Lambda Function

The function takes in an input of type `BedrockFunctionRequest` and returns a `BedrockFunctionResponse`. 

All we need to do is pass on the request to the `Resolve` method on the `BedrockAgentFunctionResolver`. This handles all the required mapping from the incoming request to match the appropriate tool and transform the response back into the appropriate format.

### Setting up BedrockAgentFunctionResolver

The `BedrockAgentFunctionResolver` is instantiated in the constructor of the Lambda Function, which means the instance will live as long as the Lambda instance lives.
[

Why Should You Care About Lambda Lifecycle As A .NET Developer?

The Lambda Lifecycle affects the way we write out Function code. Learn some of the dos and don’ts when building Lambda Functions in .NET because of how Lambda initializes the Function classes.

![](__GHOST_URL__/content/images/icon/logo-512x512-25.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/thumbnail/Lambda-Lifecycle-2-1.png)
](__GHOST_URL__/blog/lambda-lifecycle-and-net/)
The tools supported can be registered in the `BedrockAgentFunctionResolver` instance using the `Tool` function, passing in the tool name and the function delegate.

Once you have setup the tools and the function, publish the Lambda Function to your [AWS Account](__GHOST_URL__/blog/amazon-credentials-dotnet/).

## Creating Amazon Bedrock Agent

Let's first create an Amazon agent in AWS Console.

Navigate to Amazon Bedrock in the Console and under Build → Agents click 'Create agent'.

Provide a name and description for your agent.
![](__GHOST_URL__/content/images/2025/07/image-1.png)
Navigate into the Agent and edit the details to select the [foundation model](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html) for your agent. 

For this example I am using the Amazon Nova Pro as my model. One of the advantages of using Amazon Bedrock Agent is that you can easily switch between different foundation models in a centralised and seamless mechanism.
![](__GHOST_URL__/content/images/2025/07/image-3.png)
Once you have the foundation model selected for your Agent, make sure to provide a detailed instruction set for your agent. 

Since in this case the functions that we are adding to the agent are to get the weather and temperatures for a given city name I am specifying a simple straightforward instruction.

"*You are a weather agent. You will be given a city name, and you will return the weather details for that city.*"
![](__GHOST_URL__/content/images/2025/07/image-4.png)
With the basic things set on the agent it's time for us to register and hook up our Lambda function. This is done by creating an [Action Group](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-action-create.html)

Action group defines the functions that the Agent can help the users do. 
![](__GHOST_URL__/content/images/2025/07/image-5.png)
Let's create  `weather_actions_group` and configure our existing Lambda function that we have created.

⚠️

*One thing I have noticed is that the Action group name should be separated by '_'. It didn't work for me when I had '-' (for e.g).*

Within the Action group, we need to add the supported individual [Actions ](https://docs.aws.amazon.com/bedrock/latest/userguide/action-define.html).

In our case, we have the `getWeatherForCity` that is a function we defined in our Lambda function, which takes in a city name and returns the weather for that city.

We can configure that as below and also specify the description and parameters.

For this example I have configured `cityName` as the parameter (that matches exactly with the name in our Lambda function) and also marked it as required.
![](__GHOST_URL__/content/images/2025/07/image-7.png)
With all that setup, the final thing we need to make sure is the Lambda function has the appropriate permissions on it to be invoked by the Bedrock Agent.

Navigate to our Lambda Function. Under Configuration → Permissions → Resource-based policy statements let's add a new permission. 
![](__GHOST_URL__/content/images/2025/07/image-8.png)
This allows `bedrock.amazonaws.com` to have the `invokeFunction` permission on this Lambda function.
![](__GHOST_URL__/content/images/2025/07/image-9.png)
Once all of this is set up, we are all set to Save → Prepare and Test our Agent.
![](__GHOST_URL__/content/images/2025/07/image-11.png)
Ask the agent the weather for any city, and it will return the weather from our Lambda function. 

You can also configure multiple functions in the Action group and then the Agent will also be able to return those results as well. 

So, as an exercise, you can try setting up the `getTemperatureForCity1` and as the agent

*What is the weather in *[*Chennai, *](https://en.wikipedia.org/wiki/Chennai)*and the temperature in *[*Trivandrum*](https://en.wikipedia.org/wiki/Thiruvananthapuram) 😀

You can get the full source code for the Bedrock Agent Function [here](https://github.com/rahulpnath/youtube-samples/tree/main/MyBedrockFunction).
