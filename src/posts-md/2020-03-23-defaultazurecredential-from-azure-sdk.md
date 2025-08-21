---
title: "DefaultAzureCredential: Unifying How We Get Azure AD Token"
slug: defaultazurecredential-from-azure-sdk
date_published: 2020-03-23T00:00:00.000Z
date_updated: 2024-01-12T00:24:22.000Z
tags: Azure
excerpt: The DefaultAzureCredential is appropriate for most scenarios where the application is intended to ultimately be run in Azure. DefaultAzureCredential combines credentials that are commonly used to authenticate when deployed, with credentials that are used to authenticate in a development environment.
---

In the past, Azure had different ways to authenticate with the various resources. The [Azure SDK's](https://azure.github.io/azure-sdk/index.html) is bringing this all under one roof and providing a more unified approach to developers when connecting to resources on Azure.

In this post, we will look into the [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-net/blob/727ab08412e60394b6fea8b13cac47d83aca1f3b/sdk/identity/Azure.Identity/README.md#defaultazurecredential) class that is part of the [Azure Identity](https://github.com/Azure/azure-sdk-for-net/blob/727ab08412e60394b6fea8b13cac47d83aca1f3b/sdk/identity/Azure.Identity/README.md) library. It is the new and unified way to connect and retrieve tokens from Azure Active Directory and can be used along with resources that need them. We will look at how to authenticate and interact with Azure Key Vault and Microsoft Graph API in this post.

> The Azure Identity library provides Azure Active Directory token authentication support across the Azure SDK. It provides a set of TokenCredential implementations which can be used to construct Azure SDK clients which support AAD token authentication.

## What is DefaultAzureCredential

The DefaultAzureCredential is very [similar to the AzureServiceTokenProvider class](__GHOST_URL__/blog/authenticating-with-azure-key-vault-using-managed-service-identity/) as part of the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication/). The DefaultAzureCredential gets the token based on the environment the application is running. The following credential types if enabled will be tried, in order - *EnvironmentCredential, ManagedIdentityCredential, SharedTokenCacheCredential, InteractiveBrowserCredential*. Some of these options are not enabled by default and needs to be explictly enabled.

## Azure Key Vault

When connecting with Key Vault, make sure to provide the identity (Service Principal or Managed Identity) with relevant Access Policies in the Key Vault. It can be added via the Azure portal (or cli, PowerShell, etc.).
![](__GHOST_URL__/content/images/key_vault_access_policies.jpg)
Using the [Azure Key Vault client library for .NET v4](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-net) you can access and retrieve Key Vault Secret as below. The DefaultAzureCredential inherits from TokenCredential, which the SecretClient expects.

    var secretClient = new SecretClient(
        new Uri("https://identitytest.vault.azure.net"),
        new DefaultAzureCredential());
    var secret = await secretClient.GetSecretAsync("<SecretName>");
    

If you are using the [version 3 of the KeyVaultClient](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-net-v3) to connect to Key Vault, you can use the below snippet to connect and retrieve a secret from the Key Vault.

    var credential = new DefaultAzureCredential();
    var keyVaultClient = new KeyVaultClient(async (authority, resource, scope) =>
    {
        var token = credential.GetToken(
            new Azure.Core.TokenRequestContext(
                new[] { "https://vault.azure.net/.default" }));
        return token.Token;
    });
    
    var secret = await keyVaultClient
        .GetSecretAsync("<Secret Identifier>");
    

## Microsoft Graph API

When connecting with the [Graph Api](__GHOST_URL__/blog/how-to-authenticate-with-microsoft-graph-api-using-managed-service-identity/), we can get a token to authenticate using the same DefaultAzureCredential. I am not sure if there is a GraphServiceClient variant that takes in the TokenCredential (similar to SecretsClient). Do drop in the comments if you are aware of one.

    var credential = new DefaultAzureCredential();
    var token = credential.GetToken(
        new Azure.Core.TokenRequestContext(
            new[] { "https://graph.microsoft.com/.default" }));
    
    var accessToken = token.Token;
    var graphServiceClient = new GraphServiceClient(
        new DelegateAuthenticationProvider((requestMessage) =>
        {
            requestMessage
            .Headers
            .Authorization = new AuthenticationHeaderValue("bearer", accessToken);
    
            return Task.CompletedTask;
        }));
    

### Local Development

In your local environment, DefaultAzureCredential uses the shared token credential from the IDE. In the case of Visual Studio, you can configure the account to use under Options -> Azure Service Authentication. By default, the accounts that you use to log in to Visual Studio does appear here. If you have multiple accounts configured, set the [SharedTokenCacheUsername](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredentialoptions.sharedtokencacheusername?view=azure-dotnet) property to specify the account to use.
[

Azure Managed Service Identity And Local Development

One of the common challenges when building cloud applications is managing credentials for authenticating to cloud services. The Managed Service Identity feature of Azure AD provides an automatically managed identity in Azure AD. This identity helps authenticate with cloud service that supports Azure…

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/defaultazurecredential_environment_credential.jpg)
](__GHOST_URL__/blog/azure-managed-service-identity-and-local-development)
In my case, I have my hotmail address (associated with my Azure subscription) and my work address added to Visual Studio. However, when using my hotmail account to access KeyVault or Graph API, I ran into this [issue](https://github.com/Azure/azure-sdk-for-net/issues/8658). Explicitly adding in a new user to my Azure AD and using that from Visual Studio resolved the issue.

> I ran into issues when using my Microsoft account, that I use to login to Azure account. Adding in a new user to Azure AD and using that from Visual Studio got it working.

![](__GHOST_URL__/content/images/vs_azure_service_authentication.jpg)
The SharedTokenCacheUsername can be passed into the DefaultAzureCredential using the CredentialOptions, as shown below. I am using the [#if DEBUG directive](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives/preprocessor-if) to enable this only on debug build.

    var azureCredentialOptions = new DefaultAzureCredentialOptions();
    #if DEBUG
        azureCredentialOptions.SharedTokenCacheUsername = "<AD User Name>";
    #endif
    
    var credential = new DefaultAzureCredential(azureCredentialOptions);
    

To make the above source-control friendly, you can move the '<AD User Name>' to your configuration file, so that each team member can set it as required. The same can also be achieved by setting '*AZURE__USERNAME*' environment variable. Once set make sure to restart Visual Studio to reflect. With the *AZURE__USERNAME* set you no longer need to explicitly set the SharedTokenCacheUsername.

> Set *AZURE__USERNAME* to avoid having to write the extra code to set the SharedTokenCacheUsername

Alternatively, you can also set Environment variables and specify the 'AZURE_CLIENT_ID', 'AZURE_TENANT_ID', and 'AZURE_CLIENT_SECRET' which will be automatically picked up and used to authenticate. Check out this [post on how to get the ClientId/Secret to authenticate](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/).

Hope this helps you get started with the new set of Azure SDK's!

*Thanks to *[*Jon Gallant*](https://blog.jongallant.com/2019/11/azure-sdks/)* for reaching out and encouraging me to check out this new set of SDK's*
