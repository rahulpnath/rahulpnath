---
title: How To Setup AWS Secret Manager for A Real World .NET Application
slug: aws-secrets-manager-from-dotnet-application
date_published: 2022-06-16T00:00:00.000Z
date_updated: 2024-11-28T02:31:08.000Z
tags: AWS
excerpt: Learn how to organize and manage Secrets in AWS Secrets manager when building .NET applications. Configure applications such that only secrets are relevant to the applications and retrieved from the AWS Secrets Manager, mainly when it contains secrets for multiple applications.
---

*This article is sponsored by AWS and is part of my [AWS Series](__GHOST_URL__/tag/aws/).*

In a previous post, we learned how to get started and integrate AWS Secrets Manager from a .NET application.

We learned how to integrate Secrets Manager into the default .NET Configuration and seamlessly use secrets from application code.

We also set up an automatic refresh for the Secret Manager configuration provider, which means any update made in AWS Secret Manager will automatically reflect in our application.

However, one limitation with the setup is that the .NET application gets all the Secrets in the Secret Manager on application start.

Now in cases where you have only one application in your AWS Infrastructure, this might work fine. However, that is not usually the case.

We have multiple applications running in our AWS account, and at times we have applications configured for different environments/stages in the same account - like Dev, Test, etc. In these scenarios, ***we want our application to pull down and sync only the Secrets that are relevant to that application***.

In this post, let’s explore how we can update our .NET application and how we organize Secrets so that the application gets only relevant Secrets from AWS Secret Manager.

## Organizing Secrets in AWS Secrets Manager

Secrets can be unique to an application or shared across multiple or a group of applications. To ensure applications retrieve only the relevant Secrets, we need to group them based on applications.

👉 Instead of having the Secret Names as `WeatherForecast__Count` and `WeatherForecast__Api`, we can prefix them with the Environment/Stage the applications are running and the application name.

E.g., if the application runs in the Test environment, we can name the Count property as `Test/WeatherApp/WeatherForecast_Count` → *Test* stands for the environment and *WeatherApp* for the application name.

👉 For Secrets shared across applications, instead of duplicating them per application, we can create a shared group name and have all the shared Secrets in there.

E.g., if the *ApiKey* is shared across multiple applications, we can have the Secret Name as `Test/Shared/WeatherForecast_ApiKey` → *Test* stands for the environment and *Shared* for the shared group name.
![Secrets Manager shows the Count and ApiKey secrets organized based on the environment and application. It shows two sets of values for the Test and Prod environment group by application-specific and shared groups.](__GHOST_URL__/content/images/aws-secrets-manager-organize-secrets.jpg)
## Filtering Secrets in .NET Application

Our application code, on startup, still pulls down all the Secrets in the Secrets Manager.

✅Let’s update the .NET app startup code to filter out the Secrets that are not relevant.
[

How Best To Secure Secrets When Building .NET Applications on AWS

Learn how to get started with using AWS Secrets Manager using a .NET Application. We will learn to connect to Secrets Manager from .NET using the client SDK and retrieve secrets. We will also see how to integrate Secrets Manager into built-in .NET Configuration and seamlessly use secrets from our ap

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/secure-padlock.jpg)
](__GHOST_URL__/blog/aws-secrets-manager)
Based on the above convention of names, our WeatherAPI application needs all Secrets under the `WeatherApp` and the `Shared` group in the Secrets Manager. Let’s define this list as the `allowedPrefix` string array.

Based on the environment (`EnvironmentName`), the allowedPrefix is set as shown below.

    var allowedPrefix = new [] 
    {
      $ "{builder.Environment.EnvironmentName}/WeatherApp/",
      $ "{builder.Environment.EnvironmentName}/Shared/"
    };
    

The `AddSecretsManager` extension method we use in the [previous post](__GHOST_URL__/blog/aws-secrets-manager/), to integrate AWS Secrets Manager with the .NET built-in configuration provider, allows to set a `SecretFilter`. The filter property takes in a function that determines whether or not to retrieve a secret.

We only want to retrieve the secret if the name starts with any of the values in the `allowedPrefix` list. When the application runs and initializes the .NET Configuration provider, it will first get all the Secret Names (names only) from the AWS Secrets Manager and enumerates that list to filter out using the `SecretFilter` function set below.

It passes each `SecretListEntry` to the function and checks if it needs to retrieve it or not.

    options.SecretFilter = secret => allowedPrefix.Any(allowed => secret.Name.StartsWith(allowed));
    

### Mapping Secret Manager Keys To .NET Configuration

Since the names in the Secret Manager have the environment and the application name prefixed, we must remove it first to map it to the .NET configuration object. We can update our `KeyGenerator` function to do this.

    options.KeyGenerator = (_, name) =>
    {
        var prefix = allowedPrefix.First(name.StartsWith);
        return name
            .Substring(prefix.Length)
            .Replace("__", ":");
    };
    

The function takes in the secret name and finds the matching prefix from the `allowedPrefix` list. Once identified, it trims out the prefix and replaces any double underscores (__) as a colon (:). It is the convention used by .NET Configuration to map hierarchical configuration objects.

Below is the complete code for the AWS Secret Manager integration with .NET Configuration.

    var allowedPrefix = new[]
    {
        $"{builder.Environment.EnvironmentName}/WeatherApp/",
        $"{builder.Environment.EnvironmentName}/Shared/"
    };
    builder.Configuration.AddSecretsManager(configurator: options =>
    {
        options.PollingInterval = TimeSpan.FromMinutes(30);
        options.KeyGenerator = (_, name) =>
        {
            var prefix = allowedPrefix.First(name.StartsWith);
            return name
                .Substring(prefix.Length)
                .Replace("__", ":");
        };
        options.SecretFilter = 
            secret => allowedPrefix
                .Any(allowed => secret.Name.StartsWith(allowed));
    });
    

With the above configuration setup, the application retrieves only the required secrets. It also automatically refreshes them regularly to keep the values in sync.
