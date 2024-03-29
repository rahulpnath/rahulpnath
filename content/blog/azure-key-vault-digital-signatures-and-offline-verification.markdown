---
author: [Rahul Nath]
title: 'Azure Key Vault: Digital Signatures and Offline Verification'
  
tags:
  - Azure Key Vault
date: 2016-11-15
completedDate: 2016-10-31 21:08:03 +1100
keywords:
description: Explore using Digital Signatures with Azure Key Vault and how to verify signatures offline.
thumbnail: ../images/verify_signature.png
---

Digital Signature is a mechanism to ensure the validity of a digital document or message. Digital signatures use [asymmetric cryptography](/blog/getting-started-with-azure-key-vault/) - uses a public and private key pair.

> _A valid [digital signature](https://en.wikipedia.org/wiki/Digital_signature) gives a recipient reason to believe that the message was created by a known sender (authentication), that the sender cannot deny having sent the message (non-repudiation), and that the message was not altered in transit (integrity)_

The below diagram shows the overview of the different steps involved in the Digital Signature process. We generate a hash of the data that we need to protect and encrypt the hash value using a private key pair. This signed hash is sent along with the original data. The receiver generates a hash of the data received and also decrypts the attached signature using the public key. If both the hashes are same, the signature is valid, and the document has not been tampered with.

[![Azure Key Vault - Verify Signature Offline](../images/signing_verification.png)](https://commons.wikimedia.org/wiki/File:Digital_Signature_diagram.svg)

Azure Key Vault supports sign and verify operations and can be used to implement Digital Signatures. In this post, we will explore how to sign and verify a message using Key Vault. Verifying the hash locally is the recommended approach as per the [documentation](https://msdn.microsoft.com/en-us/library/azure/dn903623.aspx#BKMK_KeyOperations) and we will explore how this can be achieved.

> _Verification of signed hashes is supported as a convenience operation for applications that may not have access to [public] key material; it is recommended that, for best application performance, verify operations are performed locally._

## Signing Data

Sign and Verify operations on Key Vault are allowed only on hashed data. So the application calling these API methods should locally hash the data before invoking the method. The algorithm property value passed to the Key Vault Client API depends on the hashing algorithm used to hash the data. Below are the [supported algorithms](https://msdn.microsoft.com/library/en-us/Mt149357.aspx).

- _RS256: RSASSA-PKCS-v1_5 using SHA-256. The application supplied digest value must be computed using SHA-256 and must be 32 bytes in length._
- _RS384: RSASSA-PKCS-v1_5 using SHA-384. The application supplied digest value must be computed using SHA-384 and must be 48 bytes in length._
- _RS512: RSASSA-PKCS-v1_5 using SHA-512. The application supplied digest value must be computed using SHA-512 and must be 64 bytes in length._
- _RSNULL: See [RFC2437], a specialized use-case to enable certain TLS scenarios._

The below code sample uses SHA-256 hashing algorithm to hash and sign the data.

```csharp
var textToEncrypt = "This is a test message";
var byteData = Encoding.Unicode.GetBytes(textToEncrypt);
var hasher = new SHA256CryptoServiceProvider();
var digest = hasher.ComputeHash(byteData);
var signedResult = await keyVaultClient
    .SignAsync(keyIdentifier, JsonWebKeySignatureAlgorithm.RS256, digest);
```

## Verify Online

To verify a signature online, the keyVaultClient supports a [Verify method](https://msdn.microsoft.com/en-us/library/microsoft.azure.keyvault.keyvaultclient.verifyasync.aspx). It takes the key identifier, algorithm, digest and signature to verify if the signature is valid for the given digest.

```csharp
var isVerified = await keyVaultClient
    .VerifyAsync(keyIdentifier, JsonWebKeySignatureAlgorithm.RS256, digest, signedResult.Result);
```

## Verify Offline

To Verify offline, we need access to the public portion of the key used to sign the data. The client application that needs to verify signatures can connect to the vault and get the key details or use a public key shared out of band. The [AD application used to authenticate](/blog/authenticating-a-client-application-with-azure-key-vault/) with the key vault should have Get access for retrieving the public key from the vault. Get access can be set using the PermissionToKeys switch when registering the AD application with the key vault. Assuming we have access to the public key as a JSON string, we can use the [RSACryptoServiceProvider](https://msdn.microsoft.com/en-us/library/system.security.cryptography.rsacryptoserviceprovider(v=vs.110\).aspx) to verify the signature offline.

```csharp
var key = JsonConvert.DeserializeObject<JsonWebKey>(jsonWebKey);
var rsa = new RSACryptoServiceProvider();
var p = new RSAParameters() { Modulus = key.N, Exponent = key.E };
rsa.ImportParameters(p);
isVerified = rsa.VerifyHash(digest, "Sha256", signedResult.Result);
```

The signature verification succeeds if the message and the signature were not tampered. If either of message or signature were modified then the signature validation fails.

You can get the sample code [here](https://github.com/rahulpnath/Blog/tree/master/VerifySignatureOffline). Hope this helps you to implement Digital Signatures using Key Vault.
