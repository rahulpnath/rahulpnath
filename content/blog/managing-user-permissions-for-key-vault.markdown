---
author: [Rahul Nath]
title: 'Managing User Permissions for Key Vault'
date: 2015-10-11 01:08:17
  
tags:
  - Azure Key Vault
keywords:
description: This post describes on how user permissions can be managed for a key vault. It details on adding user access to modify keys or secrets in a vault.
thumbnail: ../images/rbac_assignment_scopes.png
---

> Please check [here](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/) for scripts using the latest PowerShell cmdlets.

Granting access to different users to manage the key vault would be a typical scenario in an organization. This could either be to create new vaults or manage keys and secrets within an existing key vault. One way to do that would be to create an [AD application and use that to manage the vault](/blog/authenticating-a-client-application-with-azure-key-vault/). Alternatively you would also want to add users to your azure subscription and grant them access for this (which was exactly what one of my readers wanted to achieve and reached out to me for).

In this post we will see how we can add a new user and grant him the required permissions. The permissions to be provided would differ based on your requirement, so you would want to modify them as required.

## Creating the user

[Creating a new user to the azure subscription](https://azure.microsoft.com/en-us/documentation/articles/active-directory-create-users/) can easily be done from the [management portal](https://manage.windowsazure.com). We need to create the user in the azure subscription, as any resource in the subscription can be accessed only after authenticating against the Active Directory (AD) associated with it.

> Every Azure subscription is associated with an Azure Active Directory (AD) and needs to be authenticated with, before any of its resources can be used.

Azure Key Vault gets created in the default AD associated with the subscription, so we need to add the new user to that. (If you are not sure on how to find the default AD [this post](/blog/authenticating-a-client-application-with-azure-key-vault/) describes it in the beginning). In the portal under the _Azure Directory_ option, select the default directory and on the _Users_ tab, we can add a new user.

<img src="../images/ad_add_user.png" class="center"></img>

When creating the user, you can [assign the role required](https://azure.microsoft.com/en-us/documentation/articles/active-directory-assign-admin-roles/) based on the requirement. In this case I have added the user to a '_User_' role, as I do not want this user to have any administrative access to the my azure subscriptions or resources.

## Creating the key vault

To create a key vault that we want to give permissions for the user, the below powershell scripts can be used. If you are new to key vault, then check out the [Getting Started with Azure Key Vault](/blog/getting-started-with-azure-key-vault/) or [other related articles](/blog/category/azure-key-vault/).

```powershell
Switch-AzureMode AzureResourceManager
New-AzureResourceGroup –Name 'SharedGroup' –Location 'East Asia'
New-AzureKeyVault -VaultName 'TestKeyVault' -ResourceGroupName
	'SharedGroup' -Location 'East Asia'
```

The above scripts creates the key vault under the '_SharedGroup_'. [Resource Groups](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/#resource-groups) are logical containers, used to group resources together as required. [Access to azure resources](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/) can be assigned at any of the three levels (subscription, resource group or resource) and it inherits down the hierarchy as shown below. Roles can be assigned specifically to a resource, or to resource group (which would mean all to all resources in that group) or at the subscription level (which would apply to all resources/resource groups in that subscription.).

[![RBAC Assignment Scopes](../images/rbac_assignment_scopes.png)](https://acomdpsstorage.blob.core.windows.net/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/20151006095042/rbacassignmentscopes.png)

### Setting Permission on the resource group

As an administrator I want the newly created user to have permission to interact with the key vault, but not create new or delete existing vaults. I would also want to give the user ability to modify keys and secrets within the vault. Currently since the new user does not have any rights, we should first give him rights to see the vaults in the _SharedGroup_. For this a _Reader_ role from the set of [built in roles](https://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-configure/#built-in-roles) can be assinged, through the new azure portal or powershell.

```powershell
New-AzureRoleAssignment -Mail keyvaultuser@domain.onmicrosoft.com
	-RoleDefinitionName Reader -ResourceGroupName SharedGroup
```

<img src="../images/resource_group_permission.png" class="center"></img>

To modify objects (keys/secrets) in the key vault we need to run [Set-AzureKeyVaultAccessPolicy](https://msdn.microsoft.com/en-us/library/dn903607.aspx) cmdlet with the required permissions, to grant access for the user. In the below script the user is given all Permissions to both keys and secrets, and this again depends on your requirement.

```powershell
Set-AzureKeyVaultAccessPolicy -VaultName "TestKeyVault" -UserPrincipalName "keyvaultuser@domain.onmicrosoft.com"
	-PermissionsToKeys all -PermissionsToSecrets all
```

### Creating the key (new user)

The new user can login with the email id and password, shared to him by the administrator (received when creating the user in the AD), in the powershell prompt and create keys/secrets in the key vault.

```powershell
$userName = 'keyvaultuser@domain.onmicrosoft.com'
$subscriptionPassword = 'mypassword'
$securePassword = ConvertTo-SecureString -String $subscriptionPassword -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($userName, $securePassword)
Add-AzureAccount -Credential $cred
Add-AzureKeyVaultKey -VaultName 'TestKeyVault' -Name 'MyKey' -Destination 'Software'
```

The newly created user now has full access on the key vault and only that. He can only add/remove objects within the key vault and see resources within the SharedGroup. This way the administrator can be rest assured that no other sensitive information or accesses is being shared accidentally. Periodically revisiting these permissions and revoking unnecessary accesses is recommended!
