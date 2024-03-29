---
author: [Rahul Nath]
title: 'Signing a PDF File Using Azure Key Vault'
  
tags:
  - Azure Key Vault
date: 2017-07-18
completedDate: 2017-07-02 05:48:32 +1000
keywords:
description: Digital sign a PDF using a certificate in Azure Key Vault using iText.
thumbnail: ../images/pdf_signed.png
---

_How to sign a PDF using Azure Key Vault?_ - This is one of the questions that I often get regarding Azure Key Vault. In this post, we will explore how to sign a PDF using a certificate in Azure Key Vault. Signing a PDF has various aspects to it which are covered in depth in the white paper - [Digital Signatures for PDF Documents](http://developers.itextpdf.com/books#digsig). We will be using the [iText library](http://itextpdf.com/) to sign the PDF. iText is available as a [Nuget package library](https://www.nuget.org/packages/itext7/). The below image shows the elements that composes a digital signature on the left and actual contents on the right.

<img src="../images/adobe_signature.png" alt="Digitally Signed PDF Contents" />

## Signing with a Local Certificate

When the certificate (along with the private key) is available locally, signing the PDF is straightforward. You can load the certificate as an X509Certificate from the local certificate store using the [thumbprint](https://stackoverflow.com/questions/11115511/how-to-find-certificate-by-its-thumbprint-in-c-sharp). Make sure that the certificate is installed with the Exportable option as shown below.

<img src="../images/certificate_exportable.png" alt="Exportable certificate" />

The [PrivateKeySignature](http://itextsupport.com/apidocs/itext5/latest/com/itextpdf/text/pdf/security/PrivateKeySignature.html) is an implementation of IExteralSignature that can be used to sign the PDF when the private key is available. The below code signs the _Hello World.pdf_ using the certificate from the local store and saves that as _Local Key.pdf_.

```csharp
private static void SignPdfWithLocalCertificate()
{
    var certificate = GetCertificateLocal();
    var privateKey = DotNetUtilities.GetKeyPair(certificate.PrivateKey).Private;
    var externalSignature = new PrivateKeySignature(privateKey, "SHA-256");
    SignPdf(certificate, externalSignature, "Local Key.pdf");
}

private static void SignPdf(X509Certificate2 certificate, IExternalSignature externalSignature, string signedPdfName)
{
    var bCert = DotNetUtilities.FromX509Certificate(certificate);
    var chain = new Org.BouncyCastle.X509.X509Certificate[] { bCert };

    using (var reader = new PdfReader("Hello World.pdf"))
    {
        using (var stream = new FileStream(signedPdfName, FileMode.OpenOrCreate))
        {
            var signer = new PdfSigner(reader, stream, false);
            signer.SignDetached(externalSignature, chain, null, null, null, 0, PdfSigner.CryptoStandard.CMS);
        }
    }
}
```

## Certificates in Azure Key Vault

You can [manage certificates in Azure Key Vault](/blog/manage-certificates-in-azure-key-vault/) as a first class citizen. Azure Key Vault supports creating new or uploading existing certificates into the vault. Key Vault provides an option to specify whether the private portion of the certificate is exportable or not. Let us see how we can use the certificate from the vault in both these scenarios.

### Exportable Certificate

To create a self-signed certificate in the vault use the below PowerShell script. In this case, the private key is exportable. Executing the below script adds a self-signed certificate into the vault.

```powershell
$certificatepolicy = New-AzureKeyVaultCertificatePolicy   -SubjectName "CN=www.rahulpnath.com"   -IssuerName Self   -ValidityInMonths 12
Add-AzureKeyVaultCertificate -VaultName "VaultFromCode" -Name "TestCertificate" -CertificatePolicy $certificatepolicy
```

<img src="../images/keyvault_getazurekeyvaultcertificate.png" class="center" alt="Key Vault Certificate" />

Creating a certificate, in turn, creates three objects in the vault - Certificate, Key, and Secret. The certificate represents the certificate just created, the Key represents the private part of the certificate, and the Secret has the certificate in PFX format (just as if you had uploaded a [PFX as a Secret](/blog/pfx-certificate-in-azure-key-vault/)). Since the certificate created above is exportable, the Secret contains the Private portion of the key as well. To recreate the certificate locally in memory, we use the below code

```csharp
public static async Task<X509Certificate2> GetCertificateKeyVault(string secretIdentifier)
{
    var client = GetKeyVaultClient();
    var secret = await client.GetSecretAsync(secretIdentifier);

    var certSecret = new X509Certificate2(
        Convert.FromBase64String(secret.Value),
        string.Empty,
        X509KeyStorageFlags.Exportable);

    return certSecret;
}
```

The certificate is encoded as Base64String in the Secret. We create an in-memory representation of the certificate and mark it as _Exportable_. This certificate can be used the same way as the local certificate. Since the private key is part of it, the PrivateKeySignature can still be used to sign.

### Non Exportable Certificate

To create a non-exportable certificate when creating the certificate use [_KeyNotExportable_ flag](https://docs.microsoft.com/en-us/powershell/module/azurerm.keyvault/new-azurekeyvaultcertificatepolicy?view=azurermps-4.1.0) flag as below.

```powershell
$certificatepolicy = New-AzureKeyVaultCertificatePolicy   -SubjectName "CN=www.rahulpnath.com"   -IssuerName Self   -ValidityInMonths 12 -KeyNotExportable
Add-AzureKeyVaultCertificate -VaultName "VaultFromCode" -Name "TestCertificateNE" -CertificatePolicy $certificatepolicy
```

Executing this creates three objects in the vault as above. But since we marked the secret as non-exportable, the Secret will not have the private part of the key. We can create an in-memory representation of the certificate, but we cannot use the PrivateKeySignature as the certificate does not have the private key. We need to use the Key created along with the certificate to _Sign_ the PDF bytes. For this we need a custom implementation of _IExternalSignature_ - KeyVaultSignature.

```csharp
public class KeyVaultSignature : IExternalSignature
{
    private KeyVaultClient keyClient;
    private string keyIdentifier;

    public KeyVaultSignature(KeyVaultClient client, string keyIdentifier)
    {
        keyClient = client;
        this.keyIdentifier = keyIdentifier;
    }
    public string GetEncryptionAlgorithm()
    {
        return "RSA";
    }

    public string GetHashAlgorithm()
    {
        return "SHA-256";
    }

    public byte[] Sign(byte[] message)
    {
        var hasher = new SHA256CryptoServiceProvider();
        var digest = hasher.ComputeHash(message);

        return keyClient
            .SignAsync(
                keyIdentifier,
                Microsoft.Azure.KeyVault.WebKey.JsonWebKeySignatureAlgorithm.RS256,
                digest)
            .Result.Result;
    }
}
```

KeyVaultSignature uses the key vault library to connect to the vault and use the specified key to sign the passed in PDF bytes. Since the key is the private part of the certificate, it will be validated by the public key. Below code shows how to use the KeyVaultSignature in the signing process.

```csharp
private static async Task SignPdfWithNonExportableCertificateInKeyVault()
{
    var client = GetKeyVaultClient();
    var exportableSecretIdentifier = "https://vaultfromcode.vault.azure.net:443/secrets/TestCertificateNE";
    var certificate = await GetCertificateKeyVault(exportableSecretIdentifier);

    var keyIdentifier = "https://vaultfromcode.vault.azure.net:443/keys/TestCertificateNE/65d27605fdf74eb2a3f807827cd756e1";
    var externalSignature = new KeyVaultSignature(client, keyIdentifier);

    SignPdf(certificate, externalSignature, "Non Exportable Key Vault.pdf");
}
```

Once you install and trust the public portion of the certificates, you can see the green tick, indicating that the PDF is verified and signed.

<img src="../images/pdf_signed.png" alt="Signed PDF" />

The sample code for all three scenarios is available [here](https://github.com/rahulpnath/Blog/tree/master/PDFSign). I have used ClientId/Secret to authenticate with Key Vault for the sample code. If you are using this in a production environment, I will recommend using [certificate to authenticate with Key Vault](/blog/authenticating-a-client-application-with-azure-key-vault/). iText supports creating PDF stamps and more features in the signing process, which is well documented. Hope this helps you to secure your PDF files.
