---
title: Azure Key Vault in a Real World Application
slug: azure-key-vault-in-a-real-world-application
date_published: 2015-04-25T11:46:09.000Z
date_updated: 2024-11-28T02:21:59.000Z
tags: Azure
excerpt: This post looks in how to handle key vault for a real world application and how to organize the keys/secrets usage.
---

> Please check [here](__GHOST_URL__/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/) for scripts using the latest PowerShell cmdlets.

Over the last couple of posts we have seen how to [Get Started with Azure Key Vault](__GHOST_URL__/blog/getting-started-with-azure-key-vault/), [Authenticate a Client Application with the Vault](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/) and also on how the vault can be used as an [alternate to the configuration file to keep sensitive information secure](__GHOST_URL__/blog/moving-sensitive-information-from-configuration-file-to-azure-key-vault/). In this post we will explore into how a key vault can be fit into the life-cycle of an application, configuring application to use the keyvault for different deployments and also on how to manage the keys/secrets for these different deployments. Any application that uses the Key Vault to manage keys and other sensitive information, should be able to switch easily to use the vault configured for it.

## Configuring Client-Applications to use the Key vault

Objects are uniquely identified within Azure Key Vault using a URL such that no two objects in the system, regardless of geo-location, have the same URL. The complete URL to an object is called the Object Identifier and consists of a prefix portion that identifies the Key Vault, the object type, a user provided Object Name, and an Object Version. The *object-name* is case-insensitive and immutable. When an object is first created it is given a unique version identifier and is marked as the current version of the object. Creation of a new instance with the same object name gives the new object a unique version identifier and causes it to become the current version. When querying for an object *object-version* is optional and if not provided will point to the current version of the given object-name.

> https://keyvault-name.vault.azure.net/{object-type}/{object-name}/{object-version}

From a client application all we need to have is to the configuration for the key vault url, and configurations to identify key/secret name which can include the version if required. This could be saved in the application's configuration file as shown below.

    <appSettings>
      <add key="KeyVaultUrl" value="https://testvaultrahul.vault.azure.net"/>
      <add key="SqlConnectionString" value="SqlConnectionString"/>
      <add key ="SecretWithVersion" value="SecretWithVersion/cfedea84815e4ca8bc19cf8eb943ee13"/>
      <add key="CryptoKey" value="CryptoKey"/>
    </appSettings>
    

In the above configuration I assume that when these configurations are used from the code, we know that if a value is a key or secret. We could have an extended configuration or string prefix's (key* or secret*) to indicate this and then have the code automatically detect it too if required to decouple that, but I don't see it really necessary. So the application at any time would only depend on these configured values, and we can easily switch it use any vault configured with the required key/secret values.

    var keyVaultIdentifierHelper = new KeyVaultIdentifierHelper(ConfigurationManager.AppSettings["KeyVaultUrl"]);
    var connectionStringIdentifier =
        keyVaultIdentifierHelper.GetSecretIdentifier(ConfigurationManager.AppSettings["SqlConnectionString"]);
    var connectionStringSecret = await keyClient.GetSecretAsync(connectionStringIdentifier);
    

    public class KeyVaultIdentifierHelper
    {
        private const string KeyFormat = "{0}/keys/{1}";
        private const string SecretFormat = "{0}/secrets/{1}";
        private readonly string keyVaultUrl;
    
        public KeyVaultIdentifierHelper(string keyVaultUrl)
        {
            this.keyVaultUrl = keyVaultUrl;
        }
    
        public string GetKeyIdentifier(string keyName)
        {
            return string.Format(KeyFormat, this.keyVaultUrl, keyName);
        }
    
        public string GetSecretIdentifier(string secretName)
        {
            return string.Format(SecretFormat, this.keyVaultUrl, secretName);
        }
    }
    
    

## Managing the Key Vault for Multiple Deployments

Now that we have decoupled the application from the Key Vault, we need to see how to configure key vaults to cater for multiple deployments. In any application development life-cycle, there would be multiple deployments at a given time for the application to cater for different roles - developers, testers and maybe a production one too. It is very likely that the connection strings and other sensitive information would be deployment specific and we would want to keep them separate. Best way to achieve this would be to create Key vault per deployment so that this separation is clearly maintained. You could check on the [Key Vault Pricing](http://azure.microsoft.com/en-in/pricing/details/key-vault/) on how this would affect your overall cost. For each of these deployments you would need to make sure that all the required keys/secrets are added with valid values. Since this can soon end up as a repeated activity, it is best to automate this (using powershell scripts or your own application)

## Restricting Permissions to Key Vault

We had seen how to [authenticate a client application with a Key Vault](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/) using an Active Directory (AD) application, and how to set various access policies for these application's. Applications should be given only the minimum set of permissions that it requires to operate on, most probably this would be only the read permissions. For [administrative application's](https://github.com/rahulpnath/AzureKeyVaultExplorer) we would want to give all permissions so that it can modify the vault keys/secrets as required. For such a scenario it is best to have, two (or more) separate AD application's created and have separate permissions provided.
![Multiple AD applications to access key vault with different permissions](__GHOST_URL__/content/images/multiple_ad_application.png)
## What all should be there in my configuration file?

All your [sensitive information should be moved out of your application configuration file](__GHOST_URL__/blog/moving-sensitive-information-from-configuration-file-to-azure-key-vault/), and Key Vault is the one place to have them all. The application's configuration file should only have the azure key vault url and the AD application id and certificate identifier (thumb print) that can be used to authenticate with the AD. Yes it is advisable to use the [certificate authentication mechanism](__GHOST_URL__/blog/authenticating-a-client-application-with-azure-key-vault/) as opposed to the secret mechanism, if not you would have to put the secret in your configuration file, which would be like 'giving a thief the key to your safe'.Additionally you could also have the key identifier mappings in the configuration file that the application can use to map to key/secret in the vault as we had seen above.

By doing this we have fully decoupled the application and its dependency with the vault store and have also protected all our sensitive information. This also helps in having the application to be tested with configurations appropriate to the type of deployment. Hope this helps you in developing your application against the key vault.
