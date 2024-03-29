---
author: [Rahul Nath]
title: 'PFX Certificate in Azure Key Vault'

tags:
  - Azure Key Vault
date: 2016-03-18 12:21:03
keywords:
description:
thumbnail: ../images\pfx_security.jpg
---

<div class="alert alert-info">
<strong>Note:</strong> Azure Key Vault now support Certificates as a first class citizen. Check out the post, <a href ="http://www.rahulpnath.com/blog/manage-certificates-in-azure-key-vault/">Manage Certificates in Azure Key Vault</a> for more details.
</div>

[![Security](../images/pfx_security.jpg)](https://www.flickr.com/photos/111692634@N04/15855489588)

You can use PFX certificate's along with Azure Key Vault in multiple ways, depending on your use case. You can import the PFX as a Key into Key Vault and use it just like you would use any other key or save it as a Secret and retrieve it as required. In this post I will explain how this is done.

Before I get into more details let's take a moment to understand better the different file types used and [what they represent](http://stackoverflow.com/questions/2292495/what-is-the-difference-between-a-cer-pvk-and-pfx-file).

- **CER**: Contains the public part of the certificate and usually distributed outside.

- **PVK**: Contains the Private key and securely stored

- **PFX**: Usually has public, private keys, other certificate chains and password protected.

To create a test certificate for this sample I will use _makecert_ and _pvktopfx_ utilities. Alternatively, you could also use any existing certificate.

```text
makecert -sv mykey.pvk -n "cn=Certificate Key" CertificateKey.cer -b 03/03/2016 -e 06/05/2017 -r -sky exchange
pvk2pfx -pvk mykey.pvk -spc CertificateKey.cer -pfx CertificateKey.pfx -po test
```

> The _-sky exchange_ sets the Subject Key Type to Exchange and allows encrypting/decrypting values using the certificate.

The _makecert_ creates the CER and PVK, the public/private key files which gets combined into a single PFX file using _pvktopfx_.

## Using the PFX Certificate to Encrypt and Decrypt

PFX files along with CER files allows to encrypt/decrypt data without the need for Key Vault. You can share the public key, CER, to your clients, who can then use it to encrypt data before sending it to the server. Using the private key, available in PFX, the server can decrypt this data

```csharp
// Client
byte[] encryptedData;
// You can also use the PFX here as it contains the private key
var publicCertificate = new X509Certificate2(@"C:\CertificateKey.cer");
using (var cryptoProvider = publicCertificate.PublicKey.Key as RSACryptoServiceProvider)
{
    var byteData = Encoding.Unicode.GetBytes(textToEncrypt);
    encryptedData = cryptoProvider.Encrypt(byteData, true);
}

//Server
var privateCertificate = new X509Certificate2(@"C:\CertificateKey.pfx", "test");
using (var cryptoProvider = privateCertificate.PrivateKey as RSACryptoServiceProvider)
{
    var decryptedData = cryptoProvider.Decrypt(encryptedData, true);
    var decryptedText = Encoding.Unicode.GetString(decryptedData);
}

```

## Creating a Key in Key Vault from PFX file

Now that I am able to use the PFX file (which essentially is a software-protected key) to encrypt/decrypt data, I will upload this to the Azure Key Vault so that it stays secure there. If you are new to Azure Key Vault and want to get started check my [other posts](/blog/category/azure-key-vault/).

To upload the PFX to Key Vault, you can use the _[Add-AzureKeyVaultKey](https://msdn.microsoft.com/en-us/library/dn868048.aspx)_ PowerShell cmdlet and specify the PFX file path and password.

```powershell
$securepfxpwd = ConvertTo-SecureString –String 'test' –AsPlainText –Force
Add-AzureKeyVaultKey -VaultName 'rahulkeyvault' -Name 'KeyFromCert' -KeyFilePath 'c:\CertificateKey.pfx' -KeyFilePassword $securepfxpwd
```

Using the unique key identifier, I can now access this key from PowerShell or using the Web API. You can still distribute the public key, CER, to your clients for encrypting the data and use the Azure Key Vault API to decrypt the data. Or use the Azure Key Vault to encrypt and decrypt the data.

```csharp
var keyIdentifier = "https://rahulkeyvault.vault.azure.net:443/keys/KeyFromCert/";

// Client Remains the same or use the Key Vault Client
var encryptedResult = await keyClient.EncryptAsync(keyIdentifier, "RSA-OAEP", byteData);

// Server
var decryptedData = await keyClient.DecryptAsync(keyIdentifier, "RSA-OAEP", certED);
var decryptedText = Encoding.Unicode.GetString(decryptedData.Result);
```

The PFX file uploaded to the Key Vault is just like any other key vault key, the only difference being you give the public and private key. Once the key is created in Key Vault, the private part of the key stays secure within the Key Vault and is not accessible outside (except from the original PFX/PVK file).

### Storing PFX file as a Secret

PFX files can also be stored as Secrets in Key Vault which allows you to retrieve and re-create the certificate as required. To add the certificate as a secret you can use the below PowerShell script (taken from [here](http://stackoverflow.com/questions/33728213/how-to-store-pfx-certificate-in-azure-key-vault)).

```powershell
$pfxFilePath = 'C:\CertificateKey.pfx'
$pwd = 'test'
$flag = [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable
$collection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
$collection.Import($pfxFilePath, $pwd, $flag)
$pkcs12ContentType = [System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12
$clearBytes = $collection.Export($pkcs12ContentType)
$fileContentEncoded = [System.Convert]::ToBase64String($clearBytes)
$secret = ConvertTo-SecureString -String $fileContentEncoded -AsPlainText –Force
$secretContentType = 'application/x-pkcs12'
Set-AzureKeyVaultSecret -VaultName 'rahulkeyvault' -Name 'PfxFile' -SecretValue $Secret -ContentType $secretContentType
```

The script exports the certificate to a byte array and converts it to Base64 string representation and saves it to Key Vault as Secret using the [Set-AzureKeyVaultSecret](https://msdn.microsoft.com/en-us/library/dn868050.aspx) PowerShell cmdlet. You can export the certificate along with the password if required, so that when you recreate the certificate file, it will be password protected.

To retrieve and re-create the certificate you can either use PowerShell or API as shown below

```powershell
$secretRetrieved = Get-AzureKeyVaultSecret -VaultName 'rahulkeyvault' -Name 'PfxFile'
$pfxBytes = [System.Convert]::FromBase64String($secretRetrieved.SecretValueText)
[io.file]::WriteAllBytes("c:\CertFromSecret.pfx", $pfxBytes)
```

```csharp
var secretRetrieved = await keyClient.GetSecretAsync(secretIdentifier);
var pfxBytes = Convert.FromBase64String(secretRetrieved.Value);
File.WriteAllBytes(@"C:\cert\ADTestVaultApplicationNew.pfx", pfxBytes);

// or recreate the certificate directly
var certificate = new X509Certificate2(pfxBytes);
```

You can use the PFX certificate as earlier as a file or a certificate object. These are the various ways that you can use PFX certificated along with Key Vault.

Hope this helps!
