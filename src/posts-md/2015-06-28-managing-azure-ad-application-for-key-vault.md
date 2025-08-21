---
title: Managing Azure AD Application for Key Vault
slug: managing-azure-ad-application-for-key-vault
date_published: 2015-06-27T19:13:48.000Z
date_updated: 2024-11-28T02:22:06.000Z
tags: Azure
excerpt: This post looks into the life cycle of managing an Azure AD application that is used to secure access to Key Vault.
---

> Please check [here](__GHOST_URL__/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/) for scripts using the latest PowerShell cmdlets.

Access to the Key Vault is secured using AD application token, as we had seen in the '[Authenticating a Client Application with Azure Key Vault](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/)'. Quite often administrators require to manage the AD application created, performing activities like creating new AD applications, changing the certificate used to authenticate with the AD application, remove a certificate or even delete an application. All of these are possible using PowerShell scripts and administrators can even run this as part of their automation scripts. With the latest Azure PowerShell version(0.9.2 or higher), the Key Vault cmdlet's are included automatically and does not require any additional installations. For managing the Azure AD application we need to [install the Azure AD module for PowerShell](https://msdn.microsoft.com/en-us/library/azure/jj151815.aspx#bkmk_installmodule) and import them into the PowerShell command prompt.

## Creating AD application

The *[New-AzureADApplication](https://msdn.microsoft.com/en-us/library/dn986794.aspx)* cmdlet is used to create a new Azure AD application. It also provides an option to specify the certificate details used to authenticate with the AD application at the time of creation itself. This can be done as a separate step if required, which is shown later in the post.

First we need a certificate that is to be used for authenticating against the AD application, for which I use the below commands to generate a test certificate

    makecert -sv mykey.pvk -n "cn=AD Test Vault Application" ADTestVaultApplication.cer -b 03/03/2014 -e 06/05/2017 -r -len 2048
    pvk2pfx -pvk mykey.pvk -spc ADTestVaultApplication.cer -pfx ADTestVaultApplication.pfx -po test
    

This certificate is then used to create the AD application using the below script.

    $certificateFilePath = "C:\certificates\ADTestVaultApplication.cer"
    $certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $certificate.Import($certificateFilePath)
    $rawCertificateData = $certificate.GetRawCertData()
    $credential = [System.Convert]::ToBase64String($rawCertificateData)
    $startDate= [System.DateTime]::Now
    $endDate = $startDate.AddYears(1)
    $adApplication = New-AzureADApplication -DisplayName "KeyVaultADApplication"
      -HomePage  "http://www.rahulpnath.com" -IdentifierUris "http://www.rahulpnath.com"
      -KeyValue  $credential -KeyType "AsymmetricX509Cert" -KeyUsage "Verify"
      -StartDate $startDate -EndDate $endDate
    

To associate the application created with the Key Vault, we need to create a service principal using [New-AzureADServicePrincipal](https://msdn.microsoft.com/en-us/library/dn986799.aspx) and then associate that with the Vault using the [Set-AzureKeyVaultAccessPolicy](https://msdn.microsoft.com/en-us/library/azure/dn903607.aspx)

    $servicePrincipal = New-AzureADServicePrincipal -ApplicationId $adApplication.ApplicationId
    Set-AzureKeyVaultAccessPolicy -VaultName 'KeyVaultRahul' -ObjectId  $servicePrincipal.Id -PermissionsToKeys all -PermissionsToSecrets all
    $ServicePrincipal.ApplicationId #Outputs the ServicePrincipalName/AppPrincipalId
    

### Adding a Certificate

The *[New-MsolServicePrincipalCredential](https://msdn.microsoft.com/en-us/library/azure/dn194106.aspx)* cmdlet is used to add a new credential to a service principal or to an application. The service principal is identified by supplying one of the following: object ID, appPrincipalID, service principal name (SPN).

    $msolCredentials = get-credential
    connect-msolservice -credential $msolCredentials
    $certificateFilePath = "C:\certificates\ADTestVaultApplicationNew.cer"
    $x509Certificate2 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $x509Certificate2.Import($certificateFilePath)
    $rawCertData = $x509Certificate2.GetRawCertData()
    $credentialValue = [System.Convert]::ToBase64String($rawCertData)
    $startDate= [System.DateTime]::Now
    $endDate = $startDate.AddYears(1)
    New-MsolServicePrincipalCredential -ServicePrincipalName $ServicePrincipal.ApplicationId -Type Asymmetric -Value $credentialValue -StartDate $startDate -EndDate   $endDate
    

### Removing a Certificate

Whenever a credential gets compromised or as part of regular credential refresh, administrators would want to remove an old certificate and replace with a new one. The [Remove-MsolServicePrincipalCredential](https://msdn.microsoft.com/en-us/library/azure/dn194125.aspx) cmdlet is used to remove a credential key from a service principal by specifying the key ID for the credential and the objectID/applicationID/ServicePrincipalName to identify the service principal. To get the key ID of an existing credential, [Get-MsolServicePrincipalCredential](https://msdn.microsoft.com/en-us/library/azure/dn194091.aspx) cmdlet can be used, which returns the list of credentials associated with a service principal. The below script just removes the first credential, you could loop through and remove all.

    $servicePrincipalCredential = Get-MsolServicePrincipalCredential -ServicePrincipalName $ServicePrincipal.ApplicationId -ReturnKeyValues 0
    Remove-MsolServicePrincipalCredential -ServicePrincipalName $ServicePrincipal.ApplicationId -KeyIds $servicePrincipalCredential[0].KeyId
    

### Delete an application

The [Remove-MsolServicePrincipal](https://msdn.microsoft.com/en-us/library/azure/dn194113.aspx) cmdlet removes a service principal from Microsoft Azure Active Directory, by specifying objectID/applicationID/ServicePrincipalName to identify the service principal.

    Remove-MsolServicePrincipal -ObjectId <Guid>
    Or
    Remove-MsolServicePrincipal -AppPrincipalId <Guid>
    Or
    Remove-MsolServicePrincipal -ServicePrincipalName <string>
    

Managing the AD application is a very important and necessary process in the life cycle of a Key Vault, as the access to the Vault is controlled using that. Certificates securing the AD applciation should be rolled/updated frequently and application permissions should be reviewed often to make sure that all applications have only the required permissions.
