---
author: [Rahul Nath]
title: 'Managing Azure Key Vault over the REST API'
  
tags:
  - Azure Key Vault
date: 2016-05-25 06:23:39
keywords:
description:
thumbnail: ../images\service_management_adAccess.png
---

Creating and managing Azure Key Vault was mostly supported through PowerShell cmdlets [initially](/blog/getting-started-with-azure-key-vault/), but there are multiple ways of achieving this now - REST API, [PowerShell](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/), CLI or [ARM templates](/blog/managing-azure-key-vaults-using-azure-resource-manager-arm-templates/). In this post, we will look into how we can use the REST API to create and manage a Key Vault.

## Azure Resource Manager API

The [Azure Resource Manager API](https://msdn.microsoft.com/en-AU/library/azure/dn790568.aspx) provides programmatic access to manage Azure services that support [Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/). Since Key Vault supports Resource Manager, we will be using it. Any requests to the API must be authenticated and can be done using an Azure AD application. Most of the steps to create an AD application are same as we saw when creating an AD application to [Authenticate a Client Application with Azure Key Vault](/blog/authenticating-a-client-application-with-azure-key-vault/). From the '_permissions to other applications_' tab in portal (as shown below), we can give the application access to Management API's.

To get the token to access the Management API resource (_https://management.azure.com _), I use the [ADAL library](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) with the required data. All the information that needs to be passed to the ADAL library is available under the AD application in the azure portal (as shown below).

```csharp
string token = await GetAccessToken(
                "https://login.microsoftonline.com/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                "https://management.azure.com/",
                string.Empty);
 ...

private async Task<string> GetAccessToken(string authority, string resource, string scope)
{
    var adCredential = new ClientCredential(APPLICATION_ID, APPLICATION_SECRET);
    var authenticationContext = new AuthenticationContext(authority);
    return (await authenticationContext.AcquireTokenAsync(resource, adCredential)).AccessToken;
}
```

> _Earlier authentication requests were served from https://login.windows.net (authority URL) which is [now updated](https://blogs.technet.microsoft.com/ad/2015/03/06/simplifying-our-azure-ad-authentication-flows/) to https://login.microsoftonline.com ._

<img src="../images\service_management_adAccess.png" class="center" alt="AD Application access to Azure Service Management API" />

## Key Vault Management Client

The [Microsoft.Azure.Management.KeyVault](https://www.nuget.org/packages/Microsoft.Azure.Management.KeyVault/) NuGet package, provides capabilities to connect to the Management API's and manage the Vaults. With the NuGet reference added I can use the _[KeyVaultManagementClient](https://github.com/Azure/azure-sdk-for-net/blob/master/src/ResourceManagement/KeyVaultManagement/KeyVaultManagement/Generated/KeyVaultManagementClient.cs)_.

> _Much of the SDK code is generated using [Autorest](https://github.com/azure/autorest), from the REST API's metadata spec's in Swagger format._

With the Azure Subscription Id and the token from the previous step a TokenCloudCredentials is created that is used to connect the Key Vault Management Client.

```csharp
string token = await GetAccessToken(
    "https://login.microsoftonline.com/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "https://management.azure.com/",
    string.Empty);
var tokenCredentials = new TokenCloudCredentials(SUBSCRIPTION_ID, token);
var keyVaultManagementClient = new KeyVaultManagementClient(tokenCredentials);
```

Key Vaults exists under a Resource Group and for it to be accessible using the AD application authenticated token, we need to grant permission to the application. Just like we managed [User Permissions for Key Vault](/blog/managing-user-permissions-for-key-vault/) we can give the AD application access to the Resource Group. We can do this from the new portal (as shown in the other post) or using the _New-AzureRmRoleAssignment_ PowerShell cmdlet. _Get-AzureRmADServicePrincipal_ is used o get the ObjectId of an existing application passing the application name as SearchString. I have yet not found a better way to find the application ObjectId. Please drop a comment if you know of any.

```powershell
Get-AzureRmADServicePrincipal  -SearchString 'AD Application Name'
New-AzureRmRoleAssignment -ObjectId <AD Application Object Id>
     -RoleDefinitionName Reader -ResourceGroupName SharedGroup
```

### Creating New Key Vault

We have all the required permissions setup, to create a key vault using the KeyVaultManagament client library. Using this is straightforward as shown below.
The _[Sku](https://github.com/Azure/azure-content/blob/master/articles/resource-manager-template-keyvault.md#sku)_ is used to specify [Key vault service tier](https://azure.microsoft.com/en-us/pricing/details/key-vault/) - 'Standard' or 'Premium'. For HSM backed keys it is Premium. Family on Sku object takes in a hardcoded value of 'A'. _[AccessPolicies](https://github.com/Azure/azure-content/blob/master/articles/resource-manager-template-keyvault.md#propertiesaccesspolicies-object)_ specify the AD object identifier of user or application that can access the vault. In this case, I am adding the current AD application with full ([_all_](https://github.com/Azure/azure-content/blob/master/articles/resource-manager-template-keyvault.md#propertiesaccesspoliciespermissions-object)) access to Keys and Secrets. Adding an access policy in same as using the [_Set-AzureRmKeyVaultAccessPolicy_](https://msdn.microsoft.com/en-us/library/mt603625.aspx).

```csharp
var parameters = new VaultCreateOrUpdateParameters()
{
    Location = "southeast asia",
    Properties = new VaultProperties()
    {
        Sku = new Sku { Family = "A", Name = "Standard" },
        TenantId = Guid.Parse(TENANT_ID),
        AccessPolicies = new List<AccessPolicyEntry>() {
            new AccessPolicyEntry
                    {
                        TenantId = Guid.Parse(TENANT_ID),
                        ObjectId = Guid.Parse(AD_OBJECT_ID),
                        PermissionsToKeys = new string[] { "all" },
                        PermissionsToSecrets = new string[] { "all" }
                    }
        }
    }
};

var vaultFromCode = await keyVaultManagementClient.Vaults
        .CreateOrUpdateAsync("SharedGroup", "VaultFromCode", parameters);
```

## Managing Existing Key Vaults

**Update a Key Vault**

When updating an existing Key Vault, the full state (_VaultCreateOrUpdateParameters_) must be passed back and not just the update. To add a new _AccessPolicyEntry_, the existing policy entry values must also be passed back. In the code below, I get the existing state of the Key Vault using the _Get_ and use the current vault properties to add in the new AccessPolicyEntry.

```csharp
var keyVault = (await keyVaultManagementClient.Vaults
   .GetAsync("SharedGroup", "VaultFromCode")).Vault;
            parameters = new VaultCreateOrUpdateParameters();
            parameters.Location = keyVault.Location;
            parameters.Properties = keyVault.Properties;
            parameters.Properties.AccessPolicies.Add(

   new AccessPolicyEntry
   {
       TenantId = Guid.Parse(TENANT_ID),
       ObjectId = Guid.Parse("AD Object IDentifier"),
       PermissionsToKeys = new string[] { "get" },
       PermissionsToSecrets = new string[] { "get" }
   }
            );
await keyVaultManagementClient.Vaults.CreateOrUpdateAsync("SharedGroup", "VaultFromCode", parameters);
```

**Delete a Key Vault**

```csharp
await keyVaultManagementClient.Vaults.DeleteAsync("SharedGroup", "VaultFromCode");
```

Hope this helps you manage Azure Key Vault using the REST API.
