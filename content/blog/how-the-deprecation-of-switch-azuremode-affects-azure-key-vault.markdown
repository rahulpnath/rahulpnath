---
author: [Rahul Nath]
title: 'How the Deprecation of Switch AzureMode Affects Azure Key Vault'
  
tags:
  - Azure Key Vault
date: 2016-02-25 14:51:03
keywords:
description:
---

It's been a while that the 'Switch AzureMode' is [deprecated in the Azure PowerShell](https://github.com/Azure/azure-powershell/wiki/Deprecation-of-Switch-AzureMode-in-Azure-PowerShell) and has left breaking changes in all the scripts that were using it. [I had come across this mode switch first](/blog/azure-key-vault-and-powershell-module-version/), when starting off with Azure Key Vault, as the then existing cmdlets depended on it. Now that it is deprecated we have updated versions of the PowerShell cmdlets to manage [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/). This post revisits all the scripts used in the [previous Key Vault posts](/blog/category/azure-key-vault/) and provides the updated scripts.

Most of the scripts have the only change of having an extra 'Rm' indicating that those were off the Resource Manager.

```powershell
# Creating a New Azure Key Vault
New-AzureRmResourceGroup -Name KeyVaultGroup -Location "East Asia"
New-AzureRmKeyVault -VaultName RahulKeyVault -ResourceGroupName KeyVaultGroup -Location "East Asia"
```

Creating a new key/secret remains the same

```powershell
# Creating a Key/Secret in Vault
Add-AzureKeyVaultKey -VaultName RahulKeyVault -Name NewKey -Destination Software

# Secret
$apiKey = ConvertTo-SecureString -String "ApiKey" -AsPlainText -Force
Set-AzureKeyVaultSecret -VaultName RahulKeyVault -Name "ApiKey" -SecretValue $apiKey
```

```powershell
# Getting existing Vault details
Get-AzureRmKeyVault -VaultName RahulKeyVault
```

```powershell
# Creating AD application with certificate authentication
$certificateFilePath = "C:\certificates\ADTestVaultApplication.cer"
$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$certificate.Import($certificateFilePath)
$rawCertificateData = $certificate.GetRawCertData()
$credential = [System.Convert]::ToBase64String($rawCertificateData)
$startDate= [System.DateTime]::Now
$endDate = $startDate.AddYears(1)
$adApplication = New-AzureRmADApplication -DisplayName "RahulTestADApplication"
-HomePage  "http://www.rahulpnath.com" -IdentifierUris "http://www.rahulpnath.com"
-KeyValue  $credential -KeyType "AsymmetricX509Cert" -KeyUsage "Verify" -StartDate $startDate -EndDate $endDate
```

```powershell
# Associating the AD application with the key vault
$servicePrincipal = New-AzureRmADServicePrincipal -ApplicationId $adApplication.ApplicationId
Set-AzureRmKeyVaultAccessPolicy -VaultName 'RahulKeyVault' -ObjectId  $servicePrincipal.Id -PermissionsToKeys all -PermissionsToSecrets all
$ServicePrincipal.ApplicationId #Outputs the ServicePrincipalName/AppPrincipalId
```

```powershell
# User Role assignment
New-AzureRmRoleAssignment -Mail keyvaultuser@domain.onmicrosoft.com
  -RoleDefinitionName Reader -ResourceGroupName SharedGroup
```

Please drop a comment if I have missed any!
