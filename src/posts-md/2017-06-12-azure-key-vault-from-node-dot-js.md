---
title: Azure Key Vault From Node.js
slug: azure-key-vault-from-node-dot-js
date_published: 2017-06-12T00:00:00.000Z
date_updated: 2024-11-28T02:19:01.000Z
tags: Azure
excerpt: Connecting to Azure Key Vault from Node.js
---

![Azure Key Vault from Node js](__GHOST_URL__/content/images/nodejs_keyvault.png)
If you develop on Node.js, you can use the [Azure SDK for Node](https://github.com/Azure/azure-sdk-for-node) that makes it easy to consume and manage Microsoft Azure Services. In this post let's explore how to use the node SDK to connect to Azure Key Vault and interact with the vault objects. If you are new to key vault check out my [other posts here to get started](__GHOST_URL__/tag/azure-key-vault/).

The [azure-keyvault](https://www.npmjs.com/package/azure-keyvault) npm (node package manager) package allows accessing keys, secrets, and certificates on Azure Key Vault. It required Node.js version 6.x.x or higher. You can get the [latest Node.js version here](https://nodejs.org/en/).

> **Package Features**

- *Manage keys: create, import, update, delete, backup, restore, list and get.*

- *Key operations: sign, verify, encrypt, decrypt, wrap, unwrap.*

- *Secret operations: set, get, update and list.*

- *Certificate operations: create, get, update, import, list, and manage contacts and issuers.*

It is easy to setup a new project and execute code using Node. The ease of setup is one of the things that I liked about node. To try out the Key Vault package, you can start fresh in a new folder and create a javascript file - *main.js* (you can name it anything you want).

The following packages are *required* to connect to the vault and authenticate. The *[azure-keyvault](https://www.npmjs.com/package/azure-keyvault)* package as we saw above provides capabilities to interact with the vault. The [*adal-node*](https://www.npmjs.com/package/adal-node) is the Windows Active Directory Authentication Library for Node. The package makes it easy to authenticate to AAD to access AAD protected web resources. Applications using key vault need to [authenticate using a token from an Azure AD Application](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/).

    const KeyVault = require('azure-keyvault');
    const { AuthenticationContext } = require('adal-node');
    

## **Authenticate Using ClientId and Secret**

Create the Azure AD application and the Secret key as shown in [this post](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/). Grab the ClientId and Secret for authentication from the node application.

    const clientId = 'CLIENT ID';
    const secret = 'SECRET';
    
    var secretAuthenticator = function (challenge, callback) {
      var context = new AuthenticationContext(challenge.authorization);
      return context.acquireTokenWithClientCredentials(challenge.resource, clientId, secret, function (
        err,
        tokenResponse,
      ) {
        if (err) throw err;
    
        var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
        return callback(null, authorizationValue);
      });
    };
    

To access the vault, we need to create an instance of the KeyVaultClient object which taken in a Credentials as shown below. The KeyVaultClient has different methods exposes to interact with keys, secrets, and certificates in the vault. For e.g. To retrieve a secret from the vault the *getSecret* method is used passing in the secret identifier.

    const secretUrl =
      'https://rahulkeyvault.vault.azure.net/secrets/ApiKey/b56396d7a46f4f848481de2e149ef069';
    var credentials = new KeyVault.KeyVaultCredentials(secretAuthenticator);
    var client = new KeyVault.KeyVaultClient(credentials);
    
    client.getSecret(secretUrl, function (err, result) {
      if (err) throw err;
    
      console.log(result);
    });
    

## **Authenticate Using ClientId and Certificate**

To authenticate using ClientId and Certificate the AuthenticationContext exposes a function *acquireTokenWithClientCertificate* which takes in the certificate (pem format) and the certificate thumbprint. If you already have a certificate go ahead and use that. If not create a new test certificate as shown below

    makecert -sv mykey.pvk -n "cn=AD Test Vault Application" ADTestVaultApplication.cer -b 03/03/2017 -e 06/05/2018 -r
    pvk2pfx -pvk mykey.pvk -spc ADTestVaultApplication.cer -pfx ADTestVaultApplication.pfx -po test
    

Create a new AD application and set it to use certificate authentication. Assign the application permissions to access the key vault.

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
    

To convert the pvk file into the pem format that is required by adal-node to authenticate with the AD application use the below command.

    openssl rsa -inform pvk -in mykey.pvk -outform pem -out mykey.pem
    

Using the pem encoded certificate private key, we can authenticate with the vault as shown below.

    function getPrivateKey(filename) {
      var privatePem = fs.readFileSync(filename, { encoding: 'utf8' });
      return privatePem;
    }
    
    var certificateAuthenticator = function (challenge, callback) {
      var context = new AuthenticationContext(challenge.authorization);
    
      return context.acquireTokenWithClientCertificate(
        challenge.resource,
        clientId,
        getPrivateKey('mykey.pem'),
        'CERTIFICATE THUMBPRINT',
        function (err, tokenResponse) {
          if (err) throw err;
    
          var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
          return callback(null, authorizationValue);
        },
      );
    };
    

Using the *certificateAuthenticator* is the same as using the *secretAuthenticator*, by passing it to *KeyVaultCredentials*

    var credentials = new KeyVault.KeyVaultCredentials(certificateAuthenticator);
    var client = new KeyVault.KeyVaultClient(credentials);
    
    client.getSecret(secretUrl, function (err, result) {
      if (err) throw err;
    
      console.log(result);
    });
    

To run the application first run *npm install* to install all the required packages and then execute the js file using *node main.js*. It fetches the secret value from the key vault using the certificate or secret authenticator. Hope this helps you to get started with Azure Key Vault from Node.js.
