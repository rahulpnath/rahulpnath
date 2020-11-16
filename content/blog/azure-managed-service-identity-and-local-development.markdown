---
author: [Rahul Nath]
title: 'Azure Managed Service Identity And Local Development'
  
date: 2020-04-14
tags:
  - Azure
thumbnail: ../images/defaultazurecredential_environment_credential.jpg
---

One of the common challenges when building cloud applications is managing credentials for authenticating to cloud services. The Managed Service Identity feature of Azure AD provides an automatically managed identity in Azure AD. This identity helps authenticate with cloud service that supports Azure AD authentication. In a previous post, we saw how the [DefaultAzureCredential](https://www.rahulpnath.com/blog/defaultazurecredential_from_azure_sdk/) that is part of the Azure SDK's, helps unify how we get token from Azure AD. The DefaultAzureCredential, combined with Managed Service Identity, allows us to authenticate with Azure services without the need for any additional credentials.


`youtube:https://www.youtube.com/embed/GAcFnnPxGow`

In this post, let us look at how to set up DefaultAzureCredential for the local development environment so that it can work seamlessly as with Managed Identity while on Azure infrastructure. On the local development machine, we can use two credential type to authenticate.

## Using EnvironmentCredential

The EnvironmentCredential looks for the following environment variables to connect to the Azure AD application.

- AZURE_TENANT_ID
- AZURE_CLIENT_ID
- AZURE_CLIENT_SECRET

_How do we get these values?_

In Azure Portal, under the Azure Active Directory -> App Registration, create a new application. Once created, from the Overview tab, get the Application (Client) Id and the Directory (Tenant) Id. Unde, the Certificates and Secrets, add a new Client secret, and use that for the Secret.

![](../images/defaultazurecredential_environment_credential.jpg)

Now that we have all the required values, lets set up the Environment Variables. You can do this either as part of your application itself or under the Windows Environment Variables.

**PRO TIP**: _Have a script file as part of the source code to set up such variables. Make sure the sensitive values are shared securely (and [not via the source control](https://www.rahulpnath.com/blog/keeping-sensitive-configuration-data-out-of-source-control/))_

If you want to set it from the source code, you can do something like below

```csharp
#if DEBUG
  var msiEnvironment = new MSIEnvironment();
  Configuration.Bind("MSIEnvironment", msiEnvironment);
  Environment.SetEnvironmentVariable("AZURE_TENANT_ID", msiEnvironment.TenantId);
  Environment.SetEnvironmentVariable("AZURE_CLIENT_ID", msiEnvironment.ClientId);
  Environment.SetEnvironmentVariable("AZURE_CLIENT_SECRET", msiEnvironment.ClientSecret);
#endif
```

Add the sensitive configs to the [User Secrets](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1&tabs=windows#json-structure-flattening-in-visual-studio) from Visual Studio so that you don't have to check them into source control.

When using DefaultAzureCredential to authenticate against resources like Key Vault, SQL Server, etc., you can create just one Azure AD application for the whole team and share the credentials around securely (use a [password manager](/blog/password-manager-get-one-if-you-havent-already/)).

## Using SharedTokenCacheCredential

DefaultAzureCredential can use the shared token credential from the IDE. In the case of Visual Studio, you can configure the account to use under Options -> Azure Service Authentication. By default, the accounts that you use to log in to Visual Studio does appear here. If you have multiple accounts configured, set the [SharedTokenCacheUsername](https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredentialoptions.sharedtokencacheusername?view=azure-dotnet) property to specify the account to use.

In my case, I have my Hotmail address (associated with my Azure subscription) and my work address added to Visual Studio. However, when using my Hotmail account to access KeyVault or Graph API, I ran into this [issue](https://github.com/Azure/azure-sdk-for-net/issues/8658). Explicitly adding in a new user to my Azure AD and using that from Visual Studio resolved the issue.

> I ran into issues when using my Microsoft account, that I use to login to Azure account. Adding in a new user to Azure AD and using that from Visual Studio got it working.

![](../images/vs_azure_service_authentication.jpg)

When using this approach, you need to grant access for all members of your team explicitly to the resource that needs access and might cause some overhead.

I hope this helps you to get your local development environment working with DefaultAzureCredential and seamlessly access Azure resources even when running from your local development machine!
