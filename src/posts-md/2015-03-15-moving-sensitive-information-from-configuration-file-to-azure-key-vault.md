---
title: Moving Sensitive Information from Configuration File to Azure Key Vault
slug: moving-sensitive-information-from-configuration-file-to-azure-key-vault
date_published: 2015-03-14T17:34:23.000Z
date_updated: 2024-11-28T02:21:52.000Z
tags: Azure
excerpt: This post describes on how sensitive information can be moved out of application's configuration's file to azure key vault.
---

> Please check [here](__GHOST_URL__/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/) for scripts using the latest PowerShell cmdlets.

Most of the applications today needs to use some kind of sensitive information like a database connection-string, api secret or passwords for it to connect to external service providers. Today we see that all these information are stored in the application's configuration file, which poses a huge security risk. Anyone having access to this configuration file could use this information to access sensitive data posing a security risk. Having understood this risk, we would not want to keep these secrets anymore in the application but move it to a safer and secure place. With [Azure Key Vault](__GHOST_URL__/blog/getting-started-with-azure-key-vault/), we can have this information encrypted and saved safely out of the application and use as required from the application.Azure Key Vault provides a feature of saving such small data, **Secrets**, into the vault and access them over a secure endpoint.

> Secrets in Azure Key Vault are octet sequences with a maximum size of 10k bytes each and can have any data stored.

If you are new to Azure Key Vault and yet to setup a vault, you could refer to [Getting Started with Azure Key Vault](__GHOST_URL__/blog/getting-started-with-azure-key-vault/), to setup the vault and the Active Directory(AD) application that is used to authenticate our application to access the keyvault. Since in this case we are going to use Secrets from the key vault, while setting the key vault access policy for the the AD application, we need to explicitly set access for the application to use the secrets. Access Policy to secrets and keys are distinct and can be set accordingly and you can choose to have different application's to access keys and secrets separately. In the below script I have set the same application to have access to keys and secrets, by setting *PermissionsToKeys* and *PermissionsToSecrets*

    Set-AzureKeyVaultAccessPolicy -VaultName 'TestVaultRahul' -ServicePrincipalName 'd4f09821-ab30-44f3-8d57-69925489b932' -PermissionsToKeys all -PermissionsToSecrets all
    

To create a secret in the Vault, you can use the powershell script command as shown below. On successful creation of the secret the identifier to the secret is returned, which can be used by the application to obtain the Secret value.Since we have given the AD application '*all*' access, we could also create the secret using the api client.

    PS C:\> $apiKey = ConvertTo-SecureString -String "ApiKey" -AsPlainText -Force
    Set-AzureKeyVaultSecret -VaultName TestVaultRahul -Name "ApiKey" -SecretValue $apiKey
    
    SecretValue     : System.Security.SecureString
    SecretValueText : ApiKey
    VaultName       : testvaultrahul
    Name            : ApiKey
    Version         : cfedea84815e4ca8bc19cf8eb943ee13
    Id              : https://testvaultrahul.vault.azure.net/secrets/ApiKey/cfedea84815e4ca8bc19cf8eb943ee13
    

For the application to access this secret all it needs is the SecretIdentifier and the AD credentials to authenticate with the key vault. You would want to use [certificate based authentication](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/) to authenticate against the AD application so that only the thumbprint information needs to be there in the application's configuration and not the secret itself as that is again a sensitive information.

    var keyClient = new KeyVaultClient((authority, resource, scope) =>
    {
        var authenticationContext = new AuthenticationContext(authority, null);
        var clientAssertionCertificate = new ClientAssertionCertificate(applicationId, certificate);
        var result = authenticationContext.AcquireToken(resource, clientAssertionCertificate);
    });
    
    var secret =
        await keyClient.GetSecretAsync("https://testvaultrahul.vault.azure.net/secrets/ApiKey/cfedea84815e4ca8bc19cf8eb943ee13");
    

No longer do we need to keep these sensitive information in the applications configuration file, we can just have the Secret Identifiers configured in the application and have the application fetch is as required from the vault. By doing this we have kept the sensitive information out of reach from the application and also from the people who have access to a production environment.
