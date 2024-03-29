---
author: [Rahul Nath]
title: 'Keeping Sensitive Configuration Data Out of Source Control'
  
tags:
  - Programming
  - Azure Key Vault
date: 2016-09-19
completedDate: 2016-08-27 07:12:16 +1000
keywords:
description: Different options to manage sensitive configuration data and to keep it out of source control.
thumbnail: ../images/sensitivedata_source_control.png
---

Most applications today deals with some form of sensitive information. The most commonly seen are database connection strings, API keys, token etc. The web.config seems the best place to have these values, but it definitely is not. In most cases it gets pushed into the source control systems as well. If it is a private repository then you at least have one level of security on top of it. It still exposes sensitive information to anyone who has access to the repository. It’s worse when the [repository is public](http://www.internetnews.com/blog/skerner/github-search-exposes-passwords.html).

<img alt="Keep sensitive data out of source control" src="../images/sensitivedata_source_control.png" />

There are different ways you can avoid pushing sensitive data into source control. In this post, I will explore options that I am familiar with.

> _Use configuration files as template definitions for the configuration data your application requires. Have the actual values stored elsewhere_

## Azure App Settings

If you are deploying your application as a Web App on Azure, you can store [application settings and connection strings in Azure](https://azure.microsoft.com/en-us/blog/windows-azure-web-sites-how-application-strings-and-connection-strings-work/). At runtime, Windows Azure Web Sites automatically retrieves these values for you and makes them available to code running in your website. This removes the need for having sensitive data in the configuration file.

<img alt="Azure App Settings and Connection Strings" src="../images/sensitiveData_azure_app_settings.png" />

## Release Management Tools

Release management tools like Octopus Deploy, Microsoft Release Management, that performs configuration transformation. It supports creating different environments (development, production) and corresponding configurations. On creating a package for an environment, it applies the corresponding environment configurations

<img alt="Release Management Tools - Octopus Deploy" src="../images/sensitiveData_releaseManagement_tool_octopus.png" />

Packaging embeds the configuration value into the configuration file. This makes it available to anyone who has access to the host systems.

## Azure Key Vault

Azure Key Vault acts as a centralized repository for all sensitive information. Key vault stores cryptographic keys and Secrets and makes them available over a HTTP Api. The objects (keys and secrets) in key vault has unique identifier to retrieve them. Check [Azure Key Vault in real world application](/blog/azure-key-vault-in-a-real-world-application/) for more details on how to achieve this. A client application can [authenticate with Azure Key Vault using a ClientID/secret or ClientID/certificate](/blog/authenticating-a-client-application-with-azure-key-vault/). Using certificate to authenticate is the preferred approach. To get Keys/Secret from key vault all you need is the AD Application Id, the client secret or certificate identifier and the key/secret names. The certificate itself can be deployed separately into the application host.

```XML
<appSettings>
  <add key="KeyVaultUrl" value="https://testvaultrahul.vault.azure.net"/>
  <add key="ADApplicationId" value="" />
  <add key="ADCertificateThumbprint" value="" />
  <add key="DbConnectionString" value="SqlConnectionString"/>
  <add key ="ApiToken" value="ApiToken/cfedea84815e4ca8bc19cf8eb943ee13"/>
</appSettings>
```

> **_[Key Vault supports Managed Service Identity](/blog/authenticating-with-azure-key-vault-using-managed-service-identity/) which makes authenticating with it even more easier if your application is deployed in Azure. You no longer have to add any configuration related to key vault to the applications config file._**

If you are using the 'client secret' to authenticate then the configuration file will have the Secret. In either cases, you should follow either of the previous approaches to keep the Application Id and authentication information out of configuration. The advantage of using [Key Vault](/blog/category/azure-key-vault/) is that it is a centralized repository for all your sensitive data, across different applications. You can also restrict access permissions per application.

These are some approaches to keep sensitive information out of source control. What approach do you use? Irrespective of the approach you use, make sure that you don’t check them in!
