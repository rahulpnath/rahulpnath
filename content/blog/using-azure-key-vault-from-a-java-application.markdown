---
author: [Rahul Nath]
title: 'Using Azure Key Vault from a Java Application'
  
tags:
  - Azure Key Vault
date: 2016-02-27 14:56:03
keywords:
description:
---

Azure Key Vault service is a cloud hosted, HSM(Hardware Security Modules)-backed service for managing cryptographic keys and other secrets. With Azure Key Vault, the process of managing and controlling the keys required for an application or multiple applications for an enterprise can be handled at a centralized place. If you are new to Key Vault, read the [Getting Started with Azure Key Vault](/blog/getting-started-with-azure-key-vault/). Access to Key Vault is primarily using [PowerShell](https://msdn.microsoft.com/en-us/library/dn868052.aspx) or the [REST API](https://msdn.microsoft.com/en-us/library/azure/dn903609.aspx). There are client API libraries available for [various platforms](https://github.com/Azure) that wraps around the REST API, including one for [Java](https://github.com/Azure/azure-sdk-for-java/tree/master/azure-keyvault). There have been some asks from my blog readers on how to use the Java SDK as there are no samples available, and this post is a result of that!

The Java Key Vault SDK provides a [KeyVaultClientService](https://github.com/Azure/azure-sdk-for-java/blob/8bd59520544cf7471f8b3c2e3f9e577e68ff2852/services/keyvault/azure-keyvault/src/main/java/com/microsoft/azure/keyvault/KeyVaultClientService.java) to create a [KeyVaultClient](https://github.com/Azure/azure-sdk-for-java/blob/8bd59520544cf7471f8b3c2e3f9e577e68ff2852/services/keyvault/azure-keyvault/src/main/java/com/microsoft/azure/keyvault/KeyVaultInternalClientImpl.java), to interact with the Key Vault. The SDK is available as a Maven package and is available for download [here](http://search.maven.org/#search%7Cga%7C1%7Ckeyvault). Setting up a project to try this will be a quickie for someone who is already working on Java, but I struggled a bit with the IDE and getting the packages into the project. (Likely the sample solution attached at the end is not the best way to get things working, but it works!. Do drop by a comment if there are better/easier ways.)

[Authenticating a client application with Azure Key Vault](/blog/authenticating-a-client-application-with-azure-key-vault/) is using an Azure AD application. You can create an AD application either from the portal or use [PowerShell cmdlets](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/). In this example I am using the client/Secret authentication mechanism, but it is recommended to use certificate-based authentication, so you do not have to put the secret in your source files. The KeyVaultClientService needs a [KeyVaultConfiguration](https://github.com/Azure/azure-sdk-for-java/blob/8bd59520544cf7471f8b3c2e3f9e577e68ff2852/services/keyvault/azure-keyvault/src/main/java/com/microsoft/azure/keyvault/KeyVaultConfiguration.java) object, which in turn needs the Credentials to connect to the KeyVault. There is an abstract implementation available for [KeyVaultCredentials](https://github.com/Azure/azure-sdk-for-java/blob/8bd59520544cf7471f8b3c2e3f9e577e68ff2852/services/keyvault/azure-keyvault/src/main/java/com/microsoft/azure/keyvault/authentication/KeyVaultCredentials.java) available which implements CloudCredentials and supports automatic bearer token refresh. Inheriting this we can create support for the clientid/secret authentication as shown below. I use the [Microsoft Azure Active Directory Authentication Library (ADAL) for Java](https://github.com/AzureAD/azure-activedirectory-library-for-java) to authenticate against the AD application, which is again available as a [Maven package](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.microsoft.aad%22).

```java
 public class ClientSecretKeyVaultCredential extends KeyVaultCredentials
{
	private String applicationId ;
	private String applicationSecret;

	public ClientSecretKeyVaultCredential(String applicationId, String applicationSecret)
	{
		this.setApplicationId(applicationId);
		this.setApplicationSecret(applicationSecret);
	}

	@Override
	public Header doAuthenticate(ServiceRequestContext request, Map<String, String> challenge) {
		AuthenticationResult res = null;
		String authorization = challenge.get("authorization");
		String resource = challenge.get("resource");

		try {
			res = GetAccessToken(authorization, resource);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return new BasicHeader("Authorization", res.getAccessTokenType() + " " + res.getAccessToken());
	}

	private AuthenticationResult GetAccessToken(String authorization, String resource)
			throws InterruptedException, ExecutionException {
		AuthenticationContext ctx = null;
		ExecutorService service = Executors.newFixedThreadPool(1);
		try {
			ctx = new AuthenticationContext(authorization, false, service);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Future<AuthenticationResult> resp = ctx.acquireToken(resource, new ClientCredential(
				this.getApplicationId(), this.getApplicationSecret()), null);
		AuthenticationResult res = resp.get();
		return res;
	}
}

```

Using the above we can create a KeyVaultClient instance to connect to Key Vault. The KeyVaultClient supports all operations with the vault. The below sample uses a Key Vault key to encrypt a data and then to decrypt it back.

```java
public static void main(String[] args) throws InterruptedException, ExecutionException, URISyntaxException, UnsupportedEncodingException {
     KeyVaultCredentials kvCred = new ClientSecretKeyVaultCredential("AD Application ID", "AD Application Secret");
     Configuration config = KeyVaultConfiguration.configure(null, kvCred);
     KeyVaultClient vc = KeyVaultClientService.create(config);

     System.out.println(vc.getBaseUri());
     String keyIdentifier = "https://rahulkeyvault.vault.azure.net:443/keys/NewKey";
     String textToEncrypt = "This is a test";

     byte[] byteText = textToEncrypt.getBytes("UTF-16");
     Future<KeyOperationResult> result = vc.encryptAsync(keyIdentifier, JsonWebKeyEncryptionAlgorithm.RSAOAEP, byteText);

     KeyOperationResult keyoperationResult = result.get();
     System.out.println(keyoperationResult);
     result = vc.decryptAsync(keyIdentifier, "RSA-OAEP", keyoperationResult.getResult());

     String decryptedResult = new String(result.get().getResult(), "UTF-16");
     System.out.println(decryptedResult);
}
```

> _If you are facing issues with threads not closing out properly after making call to Key Vault check this [comment by Robert](/blog/using-azure-key-vault-from-a-java-application/#comment-2693376641) for details on how to work around it. (As mentioned there it looks ugly, so if you know of a better way would love to hear that)._

Hope this helps you to get started with Azure Key Vault on Java. The sample solution is available [here](https://github.com/rahulpnath/Blog/tree/master/AzureKeyVaultUsingJavaClient)!
