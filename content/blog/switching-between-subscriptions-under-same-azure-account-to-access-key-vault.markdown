---
author: [Rahul Nath]
title: 'Tip of the Week: Switching Subscriptions Under Same Azure Account to Access Key Vaults'
  
tags:
  - TipOW
  - Azure Key Vault
date: 2017-03-02
completedDate: 2017-03-02 13:49:50 +1100
keywords:
description: Switching Azure RM subscriptions to access vaults under different subscriptions.
thumbnail: ../images/powershell_azurermcontext.png
---

<img class="center" alt="Azure Powershell Get-AzureRmContext" src="../images/powershell_azurermcontext.png" />

When accessing Key Vault using Powershell it can be a bit tricky when you have multiple subscriptions under the same account. The Key Vault cmdlets being under the [Resource Manager (RM) mode](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/) depends on the current RM Subscription. The Key Vault cmdlets enable you to manage only the key vaults under the selected subscription. To access the key vaults in other subscriptions, you need to switch the selected RM subscription.

> _Use **Select-AzureRmSubscription** to switch the selected RM subscription_

The [Get-AzureRmContext](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.profile/v2.2.0/get-azurermcontext) returns the metadata used for RM requests. The SubscriptionId/SubscriptionName property indicates the selected subscription. Any Key Vault cmdlets (or RM cmdlets) will work based off that selected subscription. To change the selected Azure RM subscription use the Select-AzureRmSubscription cmdlet. Pass in the SubscriptionId or the Subscription Name that you wish to switch to and the RM Subscription will be set to that. To get the SubscriptionId/SubscriptionName of the subscriptions under your account use [Get-AzureSubscription](https://msdn.microsoft.com/en-us/library/dn495302.aspx) cmdlet.

```powershell
Get-AzureRmContext
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName  "Your Subscription Name"
Select-AzureRmSubscription -SubscriptionId  a5287dad-d5a2-4060-81bc-4a06c7087e72
```

I struggled with this for some time, so hope it helps you!
