---
author: [Rahul Nath]
title: 'Manage Certificates in Azure Key Vault'

tags:
  - Azure Key Vault
date: 2017-03-01
completedDate: 2017-01-23 09:02:20 +1100
keywords:
description:
thumbnail: ../images/pfx_security.jpg
---

[![Security](../images/pfx_security.jpg)](https://www.flickr.com/photos/111692634@N04/15855489588)

In one of my earlier posts, [PFX Certificate in Azure Key Vault](/blog/pfx-certificate-in-azure-key-vault/), we saw how to save PFX Certificate files in Key Vault as Secrets. Azure Key Vault now [supports certificates as a first class citizen](https://blogs.technet.microsoft.com/kv/2016/09/26/get-started-with-azure-key-vault-certificates/). This means one can manage certificates as a separate entity in KeyVault. At the time of writing, Key Vault supports managing certificates using Powershell. The [portal UI](/blog/managing-key-vault-through-azure-portal/) is still to catch up on this feature. Using the Key Vault's certificate feature, we can create a new certificate: self-signed or signed by a supported certificate authority, import an existing certificate, retrieve the certificate with or without a private key part.

## Setting up the Vault

With the introduction of the certificates feature, a new command line switch is added to [Set-AzureRmKeyVaultAccessPolicy](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.2.0/set-azurermkeyvaultaccesspolicy) cmdlet _[-PermissionToCertificates](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.2.0/set-azurermkeyvaultaccesspolicy#PermissionsToCertificates)_. It supports the following values - _all, get, create, delete, import, list, update, deleteissuers, getissuers, listissuers, setissuers, managecontacts_. For a key vault created after the introduction of this feature, the property is set to _all_ for the creator's access policy. For any vault created before the introduction of the feature, this property needs to be explicitly set to start using it.

### Create Certificate

To create a new certificate in the vault use the [Add-AzureKeyVaultCertificate](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.2.0/add-azurekeyvaultcertificate) cmdlet. The cmdlet requires a Certificate Policy that specifies the subject name, issuer name, validity, etc.

```powershell
$certificatepolicy = New-AzureKeyVaultCertificatePolicy   -SubjectName "CN=www.rahulpnath.com"   -IssuerName Self   -ValidityInMonths 12
Add-AzureKeyVaultCertificate -VaultName "VaultFromCode" -Name "TestCertificate" -CertificatePolicy $certificatepolicy
```

Executing the above creates a certificate in the vault with the given name. To retrieve the certificates in the key vault use the. The certificate object identifier is similar to that of Keys and Secrets as shown below. This identifier is used to identify a certificate uniquely.

```text
https://vaultfromcode.vault.azure.net:443/certificates/TestCertificate
```

To retrieve all the certificates in a vault use the [Get-AzureKeyVaultCertificate](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.2.0/get-azurekeyvaultcertificate) cmdlet passing in the VaultName. To get details of a certificate pass in the Certificate Name as well.

<img class="center" alt="Azure Key Vault, GetAzureKeyVaultCertificate" src="../images\keyvault_getazurekeyvaultcertificate.png" />

When creating a new certificate make sure that a Key or Secret does not exist with the same name in the vault. Azure adds in a key and secret with the same name as that of the certificate when creating a new certificate as shown in the above image. The key is required when for certificates created with non-exportable key (-[KeyNotExportable](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.1.0/new-azurekeyvaultcertificatepolicy#KeyNotExportable)). Non-exportable certificates do not have the private portion contained in secret. Any certificate operation requiring the private part should use the key. For consistency, the key exists for exportable certificates as well.

To import an existing certificate into the key vault, we can use [Import-AzureKeyVaultCertificate](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.keyvault/v2.1.0/import-azurekeyvaultcertificate) cmdlet. The certificate file should be either PFX or PEM format.

### Recreate Certificate Locally from Key Vault

Often we will have to recreate the certificate on the machine where the application using it is running. To create the private portion of the certificate retrieve it from the Secret, load it into a certificate collection, export and save the file locally.

```powershell
$kvSecret = Get-AzureKeyVaultSecret -VaultName 'VaultFromCode' -Name 'TestCertificate'
$kvSecretBytes = [System.Convert]::FromBase64String($kvSecret.SecretValueText)
$certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$certCollection.Import($kvSecretBytes,$null,[System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)
$protectedCertificateBytes = $certCollection.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12, 'test')
$pfxPath = 'C:\cert\test.pfx'
[System.IO.File]::WriteAllBytes($pfxPath, $protectedCertificateBytes)
```

Similarly to export the public portion of the certificate

```powershell
$cert = Get-AzureKeyVaultCertificate -VaultName 'VaultFromCode' -Name 'TestCertificate'
$filePath ='C:\cert\TestCertificate.cer'
$certBytes = $cert.Certificate.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
[System.IO.File]::WriteAllBytes($filePath, $certBytes)
```

### Delete Certificate

To delete a certificate use the Remove-AzureKeyVaultCertificate cmdlet and pass in the vault name and certificate name.

```powershell
Remove-AzureKeyVaultCertificate -VaultName 'VaultFromCode' -Name 'TestCertificate'
```

Hope this helps you to get started with managing certificates in Azure Key Vault.
