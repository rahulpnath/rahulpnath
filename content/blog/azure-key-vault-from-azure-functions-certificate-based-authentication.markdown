---
author: [Rahul Nath]
title: 'Azure Key Vault From Azure Functions - Certificate Based Authentication'
  
tags:
  - Azure Key Vault
  - Azure
date: 2017-05-25
completedDate: 2017-04-30 04:46:43 +1000
keywords:
description: Authenticate with Azure Key Vault from Azure Function using Certificates
thumbnail: ../images/azureFunction_newFunctionApp.png
---

In the previous post we saw how to connect to [Azure Key Vault from Azure Functions](/blog/azure-key-vault-from-azure-functions/). We used the [Application Id and Secret to authenticate with the Azure AD Application](/blog/authenticating-a-client-application-with-azure-key-vault/). Since the general recommendation is to use certificate-based authentication, in this post, we will see how we can use certificates to authenticate from within an Azure Function.

First, we need to create an Azure AD application and set it up to use certificate-based authentication. Create a new service principal for the AD application and associate that with the Azure Key Vault. Authorize the AD application with the permissions required. In this case, I am providing all access to keys and secrets.

```powershell
$certificateFilePath = "C:\certificates\ADTestVaultApplication.cer"
$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$certificate.Import($certificateFilePath)
$rawCertificateData = $certificate.GetRawCertData()
$credential = [System.Convert]::ToBase64String($rawCertificateData)
$startDate= [System.DateTime]::Now
$endDate = $startDate.AddYears(1)
$adApplication = New-AzureRmADApplication -DisplayName "CertAdApplication" -HomePage  "http://www.test.com" -IdentifierUris "http://www.test.com" -CertValue $credential  -StartDate $startDate -EndDate $endDate

$servicePrincipal = New-AzureRmADServicePrincipal -ApplicationId $adApplication.ApplicationId

Set-AzureRmKeyVaultAccessPolicy -VaultName 'RahulKeyVault' -ServicePrincipalName $servicePrincipal.ServicePrincipalNames[0] -PermissionsToSecrets all -PermissionToKeys all
```

Create an Azure Function App under your subscription as shown below. You can also use the same application created in the previous post (if you did create one).

<img src="../images/azureFunction_newFunctionApp.png" alt="Azure Function New App" class="center" />

In the Function Apps page, select the app just created. Add a new function like in the last post. Selecting the Function App shows the available set of actions. Under the _Platform Features_ tab we can upload the SSL certificates first and then update the Application Certificates to make the certificate available for the function.

<img src="../images/azureFunction_PlatformFeatures.png" alt="Azure Function Platform Features" class="center" />

Upload the certificate by selecting it from your folder system.

<img src="../images/azureFunction_addCertificate.png" alt="Azure Function Upload Certificate" class="center" />

For the certificate to be available for use in the Azure Functions an entry should be present in Application Settings. Under _Application Settings_ in the _Platform Features_ tab add App settings key and value - _WEBSITE_LOAD_CERTIFICATES_ and the certificate thumbprint This makes the certificate available for consumption within the function. Multiple thumbprints can be specified comma separated if required.

<img src="../images/azureFunction_AppSetting.png" alt="Azure Function Certificates App Settings" class="center" />

Using a certificate to authenticate with the Key Vault is the same as we have [seen before](/blog/authenticating-a-client-application-with-azure-key-vault/).

```csharp
using System;
using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

private const string applicationId = "AD Application ID";
private const string certificateThumbprint = "Certificate Thumbprint";

public async static Task Run(TimerInfo myTimer, TraceWriter log)
{
    var keyClient = new KeyVaultClient(async (authority, resource, scope) =>
{
    var authenticationContext = new AuthenticationContext(authority, null);
    X509Certificate2 certificate;
    X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
    try
    {
        store.Open(OpenFlags.ReadOnly);
        X509Certificate2Collection certificateCollection = store.Certificates.Find(X509FindType.FindByThumbprint, certificateThumbprint, false);
        if (certificateCollection == null || certificateCollection.Count == 0)
        {
            throw new Exception("Certificate not installed in the store");
        }

        certificate = certificateCollection[0];
    }
    finally
    {
        store.Close();
    }

    var clientAssertionCertificate = new ClientAssertionCertificate(applicationId, certificate);
    var result = await authenticationContext.AcquireTokenAsync(resource, clientAssertionCertificate);
    return result.AccessToken;
});

    var secretIdentifier = "https://rahulkeyvault.vault.azure.net/secrets/mySecretName";
    var secret = await keyClient.GetSecretAsync(secretIdentifier);

    log.Info($"Secret Value: {secret}");
}
```

Make sure you add in the _project.json_ as seen in the [previous post](/blog/azure-key-vault-from-azure-functions/) to enable the required NuGet packages. The Azure function now uses the certificate to authenticate with Key Vault and retrieve the secret.

Hope this helps!
