---
title: How to Authenticate and Authorize Azure Function with Azure Web App Using Managed Service Identity (MSI)
slug: how-to-authenticate-azure-function-with-azure-web-app-using-managed-service-identity
date_published: 2019-05-20T00:00:00.000Z
date_updated: 2022-10-07T09:34:45.000Z
tags: Azure
---

Azure Functions are getting popular, and I start seeing them more at clients. One typical scenario I come across is to authenticate an Azure Function with an Azure Web API. Every time something like this comes up, it means more Azure AD applications, which in turn means more secrets/certificates that need to be managed. But with [Managed Service Identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) (MSI) feature on Azure, a lot of these secrets and authentication bits can be taken off from our shoulders and left to the platform to manage for us.

In this post let us explore how we can successfully authenticate/authorize an Azure Function with a Web API using AD application and Managed Service Identity and still not have any Secrets/certificates involved in the whole process.

## Setting Up the Web API

The Azure hosted Web API is set to use [Azure AD authentication based on JWT token](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/limitingidentitybyscheme?view=aspnetcore-2.2&amp;tabs=aspnetcore2x). To enable this, I have the below code in the Startup class. I created an AD application and ClientId set up as shown below. Any request to the Web API needs a valid token from the Azure AD application in the request header.

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc(options =>
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
            options.Filters.Add(new AuthorizeFilter(policy));
        }).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
    
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Audience = Configuration["AzureAd:ClientId"];
                options.Authority =
                    $"{Configuration["AzureAd:Instance"]}{Configuration["AzureAd:TenantId"]}";
            });
    }
    
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        ...
        app.UseAuthentication();
        app.UseMvc();
    }
    

### Enabling MSI on Azure Function

Managed Serviced Identity (MSI) can be turned on through the Azure Portal. Under 'Platform features' for an Azure Function select '*Identity*' as shown below and turn it on for *System Assigned*.

> **[A system-assigned managed identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview#how-does-the-managed-identities-for-azure-resources-work)** is enabled directly on an Azure service instance. When the identity is enabled, Azure creates an identity for the instance in the Azure AD tenant that's trusted by the subscription of the instance. After the identity is created, the credentials are provisioned onto the instance. The lifecycle of a system-assigned identity is directly tied to the Azure service instance that it's enabled on. If the instance is deleted, Azure automatically cleans up the credentials and the identity in Azure AD.

![](__GHOST_URL__/content/images/azure_function_msi.jpg)![](__GHOST_URL__/content/images/azure_function_msi_on.jpg)
Once enabled, you can find the added identity for the Azure function under *Enterprise Applications* list in the AD directory. Azure internally manages this identity.

### Authenticating Function with API

To authenticate with the Web API, we need to present a token from the AD application. Any service principal on the AD can authenticate and retrieve token this and so can out Azure Function with the Identity turned on. Usually authenticating with the Azure AD requires a [Client ID/Secret or ClientId?Certificate combination](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/). However, with MSI turned on, Azure manages these credentials for us in the background, and we don't have to manage it ourselves. By using the [AzureServiceTokenProvider](https://docs.microsoft.com/en-us/azure/key-vault/service-to-service-authentication) class from the [Microsoft.Azure.Services.AppAuthentication,](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) NuGet package helps authenticate an MSI enabled resource with the AD.

> With [AzureServiceTokenProvider](https://github.com/Azure/azure-sdk-for-net/blob/ddda7cb74b979f03bb03e240c06c924914ee8bdd/src/SdkCommon/AppAuthentication/Azure.Services.AppAuthentication/AzureServiceTokenProvider.cs) class, If no connection string is specified, Managed Service Identity, Visual Studio, Azure CLI, and Integrated Windows Authentication are tried to get a token. Even if no connection string is specified in code, one can be specified in the AzureServicesAuthConnectionString environment variable.

[

DefaultAzureCredential: Unifying How We Get Azure AD Token

Azure Identity library provides Azure Active Directory token authentication support across the Azure SDK

![](__GHOST_URL__/favicon.ico)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/pfx_security.jpg)
](__GHOST_URL__/blog/defaultazurecredential-from-azure-sdk)
To access the API, we need to pass the token from AD application as a Bearer token, as shown below.

    var target = "<AD App Id of Web API>";
    var azureServiceTokenProvider = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(target);
    
    var wc = new System.Net.Http.HttpClient();
    wc.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    var result = await wc.GetAsync("<Secured API URL>");
    

## Role-Based Authorization For Azure Function MSI

Now that we have the authentication set up between the Azure Function and Web API, we might want to restrict the endpoints on the API the function can call. It is the typical User Authorization scenario, and we can use similar approaches that apply.

### Using AD Role

To add an App Role for the MSI function, we first need to add an 'Application' role to the AD Application (one that Web API uses to authenticate against). The [allowedMemberTypes](https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest) does allow comma separated values if you are looking to add the same role for User and Application.

    "appRoles": [
            {
                "allowedMemberTypes": [
                    "Application"
                ],
                "description": "All",
                "displayName": "All",
                "id": "d1c2ade8-98f8-45fd-aa4a-6d06b947c66f",
                "isEnabled": true,
                "lang": null,
                "origin": "Application",
                "value": "All"
            }
        ]
    

With the role defined, we can add the MSI Service Principal to the application role using [New-AzureADServiceAppRoleAssignment](https://docs.microsoft.com/en-us/powershell/module/azuread/new-azureadserviceapproleassignment?view=azureadps-2.0) cmdlet.

    # TenantId required only if multiple tenant exists for login
    Connect-AzureAd -TenantId 'TENANT ID'
    # Azure Function Name (Service Principal created will have same name)
    # Check under Enterprise Applications
    $msiServicePrincipal = Get-AzureADServicePrincipal -SearchString "<Azure Function Name>"
    # AD App Name
    $adApp = Get-AzureADServicePrincipal -SearchString "<AD App Web API>"
    
    New-AzureADServiceAppRoleAssignment -Id $adApp.AppRoles[0].Id `
         -PrincipalId $msiServicePrincipal.ObjectId `
         -ObjectId $msiServicePrincipal.ObjectId `
         -ResourceId $adApp.ObjectId
    

### Using AD Group

In a [previous post](__GHOST_URL__/blog/custom-authorization-policy-providers/), we saw how to use Azure AD Groups to provide role-based access. You can add a Service Principal to the AD group either through the portal or code.
![](__GHOST_URL__/content/images/azure_function_msi_add_to_ad_group.jpg)
    az ad group member add
        --subscription b3c70d42-a0b9-4730-84a4-b0004a31f7b4
        -g aa762499-6287-4e28-8753-27e90cfd2738 // ADGroup Id
        --member-id bb8920f3-7a76-4d92-9fff-fc10afa7887a // Service Principal Object Id
    

To verify that the token retrieved using the AzureServiceTokenProvider has the associated claims, decode the token using [jwt.io](https://jwt.io/). In this case, I have added both roles and groups for the MSI service principal, and you can see that below (highlighted).
![](__GHOST_URL__/content/images/azure_function_role_based_access.jpg)
The Web API can now use these claims from the token to determine what functionality needs to be available for the associated roles. Here is a [detailed post on how to do that using claims based on Groups](__GHOST_URL__/blog/dot-net-core-api-and-azure-ad-groups-based-access/).

We need one less set of authentication keys shipped as part of our application by enabling MSI. The infrastructure layer, Azure, handles this for us, which makes building applications a lot easier. [Azure supports MSI](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities) for a lot more resources where similar techniques can be applied. Hope this helps to authenticate and authorize the Azure Functions accessing your Web API and also help you in discovering more use cases for using Managed Services Identity (MSI).

**References:**

[Using Azure Managed Service Identities with your apps](https://jpd.ms/using-azure-managed-service-identities-with-your-apps-b979564ddf4)
