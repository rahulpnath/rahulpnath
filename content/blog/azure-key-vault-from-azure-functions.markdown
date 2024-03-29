---
author: [Rahul Nath]
title: 'Azure Key Vault From Azure Functions'
  
tags:
  - Azure Key Vault
  - Azure
date: 2017-05-01
completedDate: 2017-04-23 06:41:04 +1000
keywords:
description: How to access Key Vault objects from Azure Function.
thumbnail: ../images/azureFunction_createFunction.png
---

_[Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. Functions can make development even more productive, and you can use your development language of choice, such as C#, F#, Node.js, Python or PHP. Pay only for the time your code runs and trust Azure to scale as needed. Azure Functions lets you develop serverless applications on Microsoft Azure._

Even when developing with Azure Functions you want to keep your sensitive data protected. Like for example if the function needs to connect to a database you might want to get the connection string from [Azure Key Vault](/blog/getting-started-with-azure-key-vault/). If you are new to Azure Key Vault check out [these posts to get started](/blog/category/azure-key-vault/). In this post, we will explore how we can consume objects in Azure Key Vault from an Azure Function.

**Create Azure Function App**: Let's first create an Azure Function App from the Azure portal. Under _New - Compute - Function App_ you can create a new Azure Function.

<img src="../images/azureFunction_new.png" alt="" class="center" />

Enter the details of the new function app and press Create. Each function app has an associated storage account. You can choose an existing one or create a new one.

<img src="../images/azureFunction_create.png" alt="" class="center" />

You can view all Azure Functions Apps in the subscription under _More services - Function Apps_

<img src="../images/azureFunction_all.png" alt="" class="center" />

**Create Function**: To create a function you can create from an existing template or create a custom function. In this example, I will use a timer based function in C#.

<img src="../images/azureFunction_createFunction.png" alt="" class="center" />

In the _run.csx_ file add in the code for the function. The below code fetches the secret value from the Key Vault and logs it. You need to provide the [Azure AD Application Id and secret](/blog/authenticating-a-client-application-with-azure-key-vault/) to authenticate with it. Alternatively you can also use [certificate based authentication to authenticate with the Key Vault](/blog/azure-key-vault-from-azure-functions-certificate-based-authentication/). Make sure you add in the relevant _using_ statements for the KeyVault client Azure Active Directory Authentication libraries (ADAL).

```csharp
using System;
using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

private const string applicationId = "AD Application Id";
private const string applicationSecret = "AD Application Secret";

public async static Task Run(TimerInfo myTimer, TraceWriter log)
{
    var keyClient = new KeyVaultClient(async (authority, resource, scope) =>
    {
        var adCredential = new ClientCredential(applicationId, applicationSecret);
        var authenticationContext = new AuthenticationContext(authority, null);
        return (await authenticationContext.AcquireTokenAsync(resource, adCredential)).AccessToken;
    });

    var secretIdentifier = "https://rahulkeyvault.vault.azure.net/secrets/mySecretName";
    var secret = await keyClient.GetSecretAsync(secretIdentifier);

    log.Info($"C# Timer trigger function executed at: {secret}");
}
```

<img src="../images/azureFunction_code.png" alt="" class="center" />

Since the KeyVaultClient and the ADAL libraries are NuGet packages, we need to specify these as dependencies for the Azure Function. To use NuGet packages, create a _project.json_ file in the functions folder. Add in both the NuGet packages name and required version.

```json
{
  "frameworks": {
    "net46": {
      "dependencies": {
        "Microsoft.Azure.KeyVault": "1.0.0",
        "Microsoft.IdentityModel.Clients.ActiveDirectory": "2.14.201151115"
      }
    }
  }
}
```

<img src="../images/azureFunction_nuget.png" alt="" class="center" />

Executing the function, retrieves the secret details from the Key Vault and logs it as shown below.

<img src="../images/azureFunction_run.png" alt="" class="center" />

Hope this helps you to get started with Key Vault in Azure Functions and keep your sensitive data secure.
