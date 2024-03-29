---
author: [Rahul Nath]
title: 'Managing Azure Key Vault using Azure Resource Manager (ARM) Templates'
  
tags:
  - Azure Key Vault
date: 2016-06-05 06:15:31
keywords:
description:
---

Creating and managing Azure Key Vault was mostly supported through PowerShell cmdlets [initially](/blog/getting-started-with-azure-key-vault/), but there are multiple ways of achieving this now - [REST API](/blog/managing-azure-key-vault-over-the-rest-api/), [PowerShell](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/), CLI or ARM templates. In this post, we will look into how we can use [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/) (ARM) templates to create and manage a Key Vault.

## Azure Resource Manager and Templates

Simply put, the [Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/)(ARM) allows to group different resources in your solution that form a logical unit and manage them together. It allows to spin up all the resources required for your system and deploy them as and when required. You can achieve this using custom PowerShell scripts or creating a template (in JSON format) - Azure Resource Manager Template.

> _Within the ARM template, you define the infrastructure for your app, how to configure that infrastructure, and how to publish your app code to that infrastructure._

You can [export a template from existing resources](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-export-template/) for a starting point and then work off that. But in this post, I will start with an empty template as it helps to understand all the template parts. A template is nothing but a JSON file with a specific [schema](http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#). All templates have the below format where a few of the elements are not mandatory. If you are not familiar with the template format and the different elements that make it, I'll wait while you read more about the [Template format](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/#template-format)

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "",
  "parameters": {},
  "variables": {},
  "resources": [],
  "outputs": {}
}
```

## Key Vault ARM Template

The [Key Vault schema](https://github.com/Azure/azure-resource-manager-schemas/blob/c301d6ed1d8876cad60af1f81d420e9249a80594/schemas/2015-06-01/Microsoft.KeyVault.json) is authored here and is part of the root schema URL that we had [seen above](http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#). Though it might not be able to fully understand the schema details, it helps to understand at a high level what are the different parameters that are allowed when defining a Key Vault. At present, the schema allows only creating [Secrets](/blog/moving-sensitive-information-from-configuration-file-to-azure-key-vault/) within a Key Vault and [Keys have to be created separately](/blog/how-the-deprecation-of-switch-azuremode-affects-azure-key-vault/).

Like we did using the [REST API](/blog/managing-azure-key-vault-over-the-rest-api/), with this ARM template I want to create or update a Key Vault with a specified set of properties (like Vault Name, tenant etc), the access policies to specify the AD objects (applications/users) that have access to the Vault and create a few secrets.

Create a new JSON file with any name you like (_azuredeploy.json_) and copy the above template structure into it. For the content version, you can use any value that you like for e.g. 1.0.0. Next, we need to define the parameters that we need, that are specific to each Key Vault deployment. Without parameters, we will be always deploying the resources with the same name and properties, so it is a good practice to externalize it and use it as required. [Parameters](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/#parameters) have a defined structure and allows to have basic validation for the input values. All parameters that does not have a _defaultValue_ needs to be passed in while using the template.

### Parameters

Let's see a few of the different parameter types that we use in this template. The _keyVaultName_ parameter is a simple string value and is required to be passed in as it does not have a default value specified, where as the _enableVaultForVolumeEncryption_ is an optional parameter and defaults to false. The parameters _accessPolicies_ and _secrets_ are of type _array_ and takes in any valid JSON array. But in this specific case, I want it to be in a specific format but I am yet not sure if I can specify a format structure for the JSON input. Sound off in the comments if you know of a way.

```
"parameters": {
    "keyVaultName": {
        "type": "string",
        "metadata": {
            "description": "Name of the Key Vault"
        }
    },
    "accessPolicies": {
        "type": "array",
        "defaultValue": "{}",
        "metadata": {
            "description": "Access policies object {"tenantId":"","objectId":"",
                    "permissions":{"keys":[""],"secrets":[""]}}"
        }
    },
    "enableVaultForVolumeEncryption": {
        "type": "bool",
        "defaultValue": false,
        "metadata": {
            "description": "Specifies if the vault is enabled for volume encryption"
        }
    },
    "secrets": {
        "type": "array",
        "defaultValue": "{}",
        "metadata": {
            "description": "all secrets {"secretName":"","secretValue":""}"
        }
    }
    ...
}
```

### Resources

The Resources section of the template defines the resources to be deployed or updated and takes in an array of values. Resource manager supports two modes of deployment - [Incremental and Complete deployment](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/#incremental-and-complete-deployments) - and the way you define the resources here will affect what and how things get deployed. The template supports the use of certain [Expressions and Functions](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/#expressions-and-functions), to enable dynamic creation of values. Expressions are enclosed in square brackets ([]) and can appear anywhere is a JSON string value and evaluated when the template is deployed. To use a literal string that starts with a bracket [, use two brackets [[.

The [parameter function](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-functions/#parameters) is used to get the value of a parameter that is passed in. I use this to access the Vault name, accessPolicies and other parameters that we had defined earlier. Since accessPolicies in the template expects an array I pass in the parameter object as is to it.

Secrets are defined as nested resources within the Key Vault and can be defined as a nested property within the Key Vault resource as shown in the [example here](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-template-keyvault/#examples). Since here we are interested in dynamically generating the Secrets based on the array value passed in as _secrets_ parameter, I use the _[copy, copyIndex and length function](https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-multiple/#copy-copyindex-and-length)_ to iterate through the array and generate the required template. The _copy_ function iterates and produces the same template structure with different values as specified by the parameter values.

Since the Secret is defined as a separate resource, _name_ property needs to indicate that it is a nested resource, hence we are concatenating the Vault Name with it. Without that I was getting the error :

<span style='color: red;'>_A nested resource type must have an identical number of segments as its resource name. A root resource type must have segment length one greater than its resource name._</span>.

The _[dependsOn](https://azure.microsoft.com/en-us/documentation/articles/resource-group-define-dependencies/#dependson)_ element specifies that the Secret resource is dependent on the Key Vault resource.

```json
 "resources": [
    {
        "type": "Microsoft.KeyVault/vaults",
        "name": "[parameters('keyVaultName')]",
        "accessPolicies": "[parameters('accessPolicies')]",
        ...
    },
    {
        "type": "Microsoft.KeyVault/vaults/secrets",
        "name": "[concat(parameters('keyVaultName'), '/', parameters('secrets')[copyIndex()].secretName)]",
        "properties": {
            "value": "[parameters('secrets')[copyIndex()].secretValue]"
        },
        "dependsOn": [
            "[concat('Microsoft.KeyVault/vaults/', parameters('keyVaultName'))]"
        ],
        "copy": {
            "name": "secretsCopy",
            "count": "[length(parameters('secrets'))]"
        }
    }
]
```

## Deploying with ARM Templates

To deploy the ARM template we need to pass in the required parameters and run the template.

### Parameter File

Parameters can be passed in individually or as a [Parameter File](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/#parameter-file). Parameter file (_azuredeploy.parameters.json_) is a JSON file with a specific format. Below is a sample parameter file for our Key Vault ARM template. We can have different such templates for each of our deployment environments with values specific for the environment.

```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "keyVaultName": {
                "value": "NewARMVaultP"
            },
            "tenantId": {
                "value": ""
            },
            "accessPolicies": {
                "value": [
                    {
                        "tenantId": "<TENANT ID>",
                        "objectId": "<AD OBJECT ID>",
                        "permissions": {
                            "keys": ["all"],
                            "secrets": ["all"]
                        }
                    },
                    { ... }
                ]
            },
            "secrets": {
                "value": [
                    {
                        "secretName": "ConnectionString",
                        "secretValue": "SecureString1"
                    },
                    { ... }
                ]
            }
        }
    }
```

### Deployment

The ARM template along with the parameter file can be deployed in different ways - [PowerShell, Azure CLI, REST API, Visual Studio or from Azure Portal](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/). Using PowerShell we can deploy as below. The _[Test-AzureRmResourceGroupDeployment](https://msdn.microsoft.com/en-us/library/mt679014.aspx)_ cmdlet tests if the template file and parameter file are in correct format. This is mostly useful when authoring the template. _[New-AzureRmResourceGroupDeployment](https://msdn.microsoft.com/en-us/library/mt603823.aspx)_ deploys using the given template file and parameters.

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName SharedGroup -TemplateFile .\azuredeploy.json
        -TemplateParameterFile .\azuredeploy.parameters.json -Verbose
New-AzureRmResourceGroupDeployment -ResourceGroupName SharedGroup -TemplateFile .\azuredeploy.json
         -TemplateParameterFile .\azuredeploy.parameters.json -Verbose
```

[ARM Template Visualizer](http://armviz.io/#) (ArmViz) is a visual way of editing and managing ARM templates and can be useful when dealing with a large number of resource deployments in a template. Also check out some [Good practices for designing templates](https://azure.microsoft.com/en-us/documentation/articles/best-practices-resource-manager-design-templates/). Most of the template code above is [based off this example here](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-template-keyvault/). <strike>I will try to push this template into the [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) but meanwhile it is [available here](https://github.com/rahulpnath/Blog/tree/master/KeyVault%20ARM%20Template).</strike> The ARM template is available with the [Azure Quickstart Templates](https://azure.microsoft.com/en-us/documentation/templates/201-key-vault-secret-create/)
