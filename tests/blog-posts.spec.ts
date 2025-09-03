import { test, expect } from '@playwright/test';

/**
 * Generic blog post test that can be used for any blog post
 * This file is auto-generated from all posts in the /src/posts directory
 */
const testData = [
  {
    slug: '2016-recap',
    title: '2016: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: '2017-recap',
    title: '2017: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: '2018-recap',
    title: '2018: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: '2019-recap',
    title: '2019: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: '2020-recap',
    title: '2020: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: '2021-quarter1-recap',
    title: '2021: Quarter 1 Review and Goals Looking Forward to Quarter 2'
  },
  {
    slug: '2021-quarter2-recap',
    title: '2021: Quarter 2 Review and Goals Looking Forward to Quarter 3'
  },
  {
    slug: '2021-recap',
    title: '2021: What Went Well, What Didn\'t and Goals'
  },
  {
    slug: 'a-newbie-to-wf',
    title: 'A newbie to WF'
  },
  {
    slug: 'abortcontroller-cancellationtoken-dotnet',
    title: 'Escaping the Cancel Button Trap: AbortController and CancellationToken in ASP.NET API'
  },
  {
    slug: 'about',
    title: 'About Me'
  },
  {
    slug: 'accessing-azure-key-vault-from-azure-runbook',
    title: 'Accessing Azure Key Vault From Azure Runbook'
  },
  {
    slug: 'add-to-apple-wallet-dotnet',
    title: 'Add to Apple Wallet from Your .NET Application: A Step-by-Step Guide'
  },
  {
    slug: 'amazon-api-gateway-http-apis',
    title: 'Amazon API Gateway for the .NET Developer - How To Build HTTP APIs'
  },
  {
    slug: 'amazon-api-gateway-rest-api-introduction',
    title: 'Amazon API Gateway - Introduction To Building REST APIs'
  },
  {
    slug: 'amazon-api-gateway-rest-api-lambda-proxy-integration',
    title: 'How To Build an API Gateway REST API Using AWS Lambda Proxy Integration?'
  },
  {
    slug: 'amazon-api-gateway-rest-api-multiple-stages',
    title: 'How To Manage Multiple Stages in Amazon API Gateway REST API?'
  },
  {
    slug: 'amazon-cloudwatch-logs-dotnet',
    title: 'How To Log Correctly To AWS CloudWatch From a .NET Application'
  },
  {
    slug: 'amazon-credentials-dotnet',
    title: 'Learn How To Manage Credentials When Building .NET Application on AWS'
  },
  {
    slug: 'amazon-dynamodb-dotnet-developer',
    title: 'Amazon DynamoDB For The .NET Developer'
  },
  {
    slug: 'amazon-dynamodb-transactions-dotnet',
    title: 'Beyond CRUD: Leveraging DynamoDB Transactions for Complex Operations in .NET'
  },
  {
    slug: 'amazon-ec2-dotnet-api-hosting',
    title: 'Deploying a .NET Web API on Amazon EC2: A Step-by-Step Guide'
  },
  {
    slug: 'amazon-ecs-dotnet-api-hosting',
    title: 'Deploying a .NET Web API on Amazon ECS: A Step-by-Step Guide'
  },
  {
    slug: 'amazon-mq-rabbitmq-dotnet',
    title: 'Amazon MQ RabbitMQ: A Reliable Messaging Solution for Your .NET Projects'
  },
  {
    slug: 'amazon-s3-conditional-requests-dotnet',
    title: 'Exploring Amazon S3 Conditional Operations From .NET Application'
  },
  {
    slug: 'amazon-s3-dotnet',
    title: 'Amazon S3 For the .NET Developer: How to Easily Get Started'
  },
  {
    slug: 'amazon-s3-etag-conditional-writes',
    title: 'How to Prevent Amazon S3 Object Overwrites with Conditional Writes in .NET'
  },
  {
    slug: 'amazon-s3-lambda-triggers-dotnet',
    title: 'Amazon S3 and AWS Lambda Triggers in .NET'
  },
  {
    slug: 'amazon-s3-presigned-urls',
    title: 'Amazon S3 Presigned URLs'
  },
  {
    slug: 'amazon-s3-versioning-dotnet',
    title: 'Enable Versioning on Your Amazon S3 Buckets'
  },
  {
    slug: 'amazon-sns-lambda-trigger-dotnet',
    title: 'Amazon SNS and AWS Lambda Triggers in .NET'
  },
  {
    slug: 'amazon-sns-to-lambda-or-sns-sqs-lambda-dotnet',
    title: 'SNS→Lambda Or SNS→SQS→Lambda'
  },
  {
    slug: 'amazon-sns',
    title: 'Amazon SNS For the .NET Developer: Getting Started Quick and Easy'
  },
  {
    slug: 'amazon-sqs-lambda-trigger-dotnet',
    title: 'Amazon SQS and AWS Lambda Triggers in .NET'
  },
  {
    slug: 'amazon-sqs-lambda-trigger-exception-handling-dotnet',
    title: 'How to Handle Exceptions When Processing SQS Messages in .NET Lambda Function'
  },
  {
    slug: 'amazon-sqs',
    title: 'Amazon SQS For the .NET Developer: How to Easily Get Started'
  },
  {
    slug: 'an-enterprise-it-project-experience',
    title: 'An enterprise IT project experience'
  },
  {
    slug: 'analyze-your-site-performance',
    title: 'Tip of the Week: Analyze Your Site Performance'
  },
  {
    slug: 'annotations-framework-and-other-aws-services',
    title: 'Learn How to Easily Integrate Lambda Annotations and Other AWS Services'
  },
  {
    slug: 'apple-wallet-push-notifications',
    title: 'Enhancing User Experience: Push Notifications in .NET for Apple Wallet Pass Updates'
  },
  {
    slug: 'archives',
    title: 'Archives'
  },
  {
    slug: 'are-you-using-httpclient-in-the-right-way',
    title: 'Are You Using HttpClient in The Right Way?'
  },
  {
    slug: 'asp-dot-net-web-api-and-external-login-authenticating-with-social-networks',
    title: 'ASP.NET Web API and External Login - Authenticating with Social Networks'
  },
  {
    slug: 'asp-net-core-cors-demystified',
    title: 'Understand CORS and Learn How to Enable it for Your ASP NET API'
  },
  {
    slug: 'asp-net-core-on-aws-lambda',
    title: 'How To Build and Host ASP NET Core Applications on AWS Lambda Functions'
  },
  {
    slug: 'asp-net-health-checks',
    title: 'Monitor Your Applications: Health Checks in ASP NET Core'
  },
  {
    slug: 'async-enumerable-dotnet',
    title: 'Getting Started with Async Enumerables: A .NET Developer\'s Guide'
  },
  {
    slug: 'attachments-in-email-a-new-way',
    title: 'Attachments in email - a new way'
  },
  {
    slug: 'authenticating-a-client-application-with-azure-key-vault',
    title: 'Authenticating a Client Application with Azure Key Vault'
  },
  {
    slug: 'authenticating-with-azure-key-vault-using-managed-service-identity',
    title: 'Authenticating with Azure Key Vault Using Managed Service Identity'
  },
  {
    slug: 'authy-sync-two-factor-authentication-across-devices',
    title: 'Tip of the Week: Authy - Sync Two Factor Authentication Across Devices'
  },
  {
    slug: 'autofixture-make-your-unit-tests-robust',
    title: 'Tip of the Week: AutoFixture - Make Your Unit Tests Robust'
  },
  {
    slug: 'automated-api-testing-using-postman-collection-runner',
    title: 'Automated API Testing Using Postman Collection Runner'
  },
  {
    slug: 'automated-clickonce-deployment-of-a-wpf-application-using-appveyor',
    title: 'Automated ClickOnce Deployment of a WPF Application using Appveyor'
  },
  {
    slug: 'automated-deployment-of-asmspy-to-chocolatey-using-appveyor',
    title: 'Automated Deployment of AsmSpy to Chocolatey Using AppVeyor'
  },
  {
    slug: 'automatic-deployment-of-future-posts-with-octopress',
    title: 'Automatic Deployment of Future Posts With Octopress'
  },
  {
    slug: 'avoid-commands-calling-commands',
    title: 'Why You Should Avoid Command Handlers Calling Other Commands?'
  },
  {
    slug: 'avoid-state-mutation',
    title: 'Avoid State Mutation'
  },
  {
    slug: 'aws-cdk-dotnet-github-actions',
    title: 'Building and Deploying .NET Applications with AWS CDK on GitHub Actions'
  },
  {
    slug: 'aws-cdk-dotnet',
    title: 'AWS CDK For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'aws-dotnet-lambda-authorizer-api-gateway',
    title: 'Using .NET AWS Lambda Authorizer To Secure API Gateway REST API'
  },
  {
    slug: 'aws-dynamodb-local',
    title: 'How to Run and Access DynamoDB Local For Easy Development and Testing'
  },
  {
    slug: 'aws-dynamodb-net-core',
    title: 'AWS DynamoDB For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'aws-dynamodb-streams-lambda-triggers-dotnet',
    title: 'DynamoDB Streams and AWS Lambda Trigger in .NET'
  },
  {
    slug: 'aws-dynamodb-streams-lambda-triggers-exception-handling-dotnet',
    title: 'How to Handle Exceptions When Processing DynamoDB Stream Events in .NET Lambda Function'
  },
  {
    slug: 'aws-elastic-beanstalk-dotnet-api-toolkit',
    title: 'Step By Step Guide: Deploying ASP NET API To AWS Elastic Beanstalk Using Visual Studio Toolkit'
  },
  {
    slug: 'aws-lambda-annotation-framework',
    title: 'Learn How AWS Lambda Annotations Framework Makes API Gateway Integration Easy.'
  },
  {
    slug: 'aws-lambda-dotnet-developer',
    title: 'AWS Lambda For The .NET Developer'
  },
  {
    slug: 'aws-lambda-dotnet8-aot',
    title: 'AWS Lambda and .NET 8: Enhancing Serverless Performance with Native AOT'
  },
  {
    slug: 'aws-lambda-net-core',
    title: 'AWS Lambda For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'aws-lambda-pgp-using-docker',
    title: 'How To PGP Encrypt An S3 File Using AWS Lambda Running Docker Images'
  },
  {
    slug: 'aws-lambda-powertools-batch',
    title: 'Efficiently Handle SQS Messages with AWS Lambda Powertools Batch Utility'
  },
  {
    slug: 'aws-lambda-powertools-for-net-bedrock-agent-function-resolver',
    title: 'AWS Lambda Powertools for .NET - Bedrock Agent Function Resolver'
  },
  {
    slug: 'aws-lambda-snapstart',
    title: 'Getting Started with AWS Lambda SnapStart: A Beginner’s Guide'
  },
  {
    slug: 'aws-localstack-dotnet',
    title: 'How to Use LocalStack for Seamless AWS Development in .NET'
  },
  {
    slug: 'aws-message-processing-framework',
    title: 'A Step-by-Step Guide to AWS Message Processing with Amazon SQS in .NET'
  },
  {
    slug: 'aws-parameter-store',
    title: 'AWS Parameter Store For The .NET Developer: How to Easily Get Started'
  },
  {
    slug: 'aws-rds-sql-server-dotnet',
    title: 'AWS RDS and .NET: Step-by-Step Guide for SQL Server Setup'
  },
  {
    slug: 'aws-secrets-manager-from-dotnet-application',
    title: 'How To Setup AWS Secret Manager for A Real World .NET Application'
  },
  {
    slug: 'aws-secrets-manager',
    title: 'How Best To Secure Secrets When Building .NET Applications on AWS'
  },
  {
    slug: 'aws-serverless-application',
    title: 'Going Serverless on AWS For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'aws-serverless-refactoring-series-clean-architecture',
    title: 'AWS Serverless Refactoring Series: How to Move to Clean Architecture?'
  },
  {
    slug: 'aws-serverless-refactoring-series',
    title: 'AWS Serverless Refactoring Series: How to Improve the Maintainability of Project'
  },
  {
    slug: 'azure-ad-custom-attributes-and-optional-claims-from-an-asp-dot-net-application',
    title: 'Azure AD Custom Attributes and Optional Claims from an ASP.Net Application'
  },
  {
    slug: 'azure-ad-restrict-application-to-users-in-group',
    title: 'Azure AD: Restrict Application Access To Users Belonging To A Group'
  },
  {
    slug: 'azure-devops-variable-groups-history',
    title: 'Enable History for Azure DevOps Variable Groups Using Azure Key Vault'
  },
  {
    slug: 'azure-key-vault-and-powershell-module-version',
    title: 'Azure Key Vault and Powershell Module Version'
  },
  {
    slug: 'azure-key-vault-as-a-connected-service-in-visual-studio-2017',
    title: 'Azure Key Vault As A Connected Service in Visual Studio 2017'
  },
  {
    slug: 'azure-key-vault-digital-signatures-and-offline-verification',
    title: 'Azure Key Vault: Digital Signatures and Offline Verification'
  },
  {
    slug: 'azure-key-vault-from-azure-functions-certificate-based-authentication',
    title: 'Azure Key Vault From Azure Functions - Certificate Based Authentication'
  },
  {
    slug: 'azure-key-vault-from-azure-functions',
    title: 'Azure Key Vault From Azure Functions'
  },
  {
    slug: 'azure-key-vault-from-node-dot-js',
    title: 'Azure Key Vault From Node.js'
  },
  {
    slug: 'azure-key-vault-in-a-real-world-application',
    title: 'Azure Key Vault in a Real World Application'
  },
  {
    slug: 'azure-key-vault-talk-at-sydney-alt-dot-net',
    title: 'Azure Key Vault Talk at Sydney Alt.Net'
  },
  {
    slug: 'azure-managed-service-identity-and-local-development',
    title: 'Azure Managed Service Identity And Local Development'
  },
  {
    slug: 'azure-pipelines-how-to-find-remaining-build-minutes',
    title: 'Tip of the Week: Azure Pipelines - How to Find Remaining Free Build Minutes?'
  },
  {
    slug: 'azure-sql-server-managed-identity',
    title: 'Let Azure Manage The Username and Password Of Your SQL Connection String'
  },
  {
    slug: 'azure-web-restarting-automatically-due-to-overwhelming-change-notification',
    title: 'Azure Web App Restarting Automatically Due to Overwhelming Change Notification'
  },
  {
    slug: 'azure-web-sites-moving-wordpress-to-cloud',
    title: 'Azure Web Sites: Moving Wordpress to Cloud'
  },
  {
    slug: 'azure-webapp-with-webjobs-dotnet-core-build-depoy',
    title: 'How To Deploy Web App and Web Job In A Single Pipeline'
  },
  {
    slug: 'azure-webjobs-dotnet-core-build-depoy',
    title: 'How To Continuously Deploy Your .NET Core Azure WebJobs'
  },
  {
    slug: 'b2gc2019',
    title: 'Brisbane To Gold Coast Cycle Challenge, B2GC 2019'
  },
  {
    slug: 'being-explicit-about-time-when-handling-multiple-timezone',
    title: 'Being Explicit About Time when Handling Multiple Timezone'
  },
  {
    slug: 'beyond-compare-compare-files-quick-and-easy',
    title: 'Tip of the Week: Beyond Compare - Compare Files Quick and Easy'
  },
  {
    slug: 'blog-tags',
    title: 'Tags'
  },
  {
    slug: 'bodie-1-year-old',
    title: 'Bodie 1 Year Old'
  },
  {
    slug: 'books',
    title: 'Self-help Books'
  },
  {
    slug: 'bored-at-work',
    title: 'Bored at Work? Here\'s What I Did To Make It Fun Again'
  },
  {
    slug: 'buffer-smarter-social-sharing',
    title: 'Tip of the Week: Buffer - Smarter Social Sharing'
  },
  {
    slug: 'build-and-deploy-a-net-core-console-application',
    title: 'Setting up Build and Deploy Pipeline for a .NET Core Console Application'
  },
  {
    slug: 'building-windows-service-installer-on-azure-devops',
    title: 'Building Windows Service Installer on Azure Devops'
  },
  {
    slug: 'bulk-import-csv-into-sql-server',
    title: 'Bulk Import CSV Files Into SQL Server Using SQLBulkCopy and CSVHelper'
  },
  {
    slug: 'bullet-journaling',
    title: 'Bullet Journaling: How To Be More Productive With a Pen and Paper System'
  },
  {
    slug: 'c-google-image-search',
    title: 'C# google image search'
  },
  {
    slug: 'callbacks-in-wcf',
    title: 'Callbacks in WCF'
  },
  {
    slug: 'cancellation-token-dotnet',
    title: 'A .NET Programmer\'s Guide to CancellationToken'
  },
  {
    slug: 'cancellation-token-patterns',
    title: '5 Recommended Patterns When  Using Cancellation Token in .NET'
  },
  {
    slug: 'capture-the-first-step-to-creation',
    title: 'Capture - The First Step To Creation'
  },
  {
    slug: 'cdk-localstack-aws-dotnet',
    title: 'Setting Up AWS CDK with .NET for Seamless LocalStack and AWS Deployments'
  },
  {
    slug: 'check-if-you-have-been-hacked',
    title: 'Tip of the Week: Check If You Have Been Hacked!'
  },
  {
    slug: 'checking-in-package-dependencies-into-source-control',
    title: 'Checking in Package Dependencies into Source Control'
  },
  {
    slug: 'chocolatey-install-softwares-with-ease',
    title: 'Tip of the Week: Chocolatey - Install Softwares With Ease'
  },
  {
    slug: 'clal-command-line-application-launcher',
    title: 'CLAL - Command Line Application Launcher'
  },
  {
    slug: 'cmder-portable-console-emulator-for-windows',
    title: 'Tip of the Week: Cmder - Portable Console Emulator for Windows'
  },
  {
    slug: 'code-review',
    title: 'Making Code Reviews Effective'
  },
  {
    slug: 'code-signing-in-azure-devops-pipeline',
    title: 'Code Signing MSI Installer and DLLs in Azure DevOps'
  },
  {
    slug: 'commuter-cycling-bag',
    title: 'Cycling To Work: What\'s in My Bag'
  },
  {
    slug: 'configuring-unity-container-comparing-code-and-xml-configuration-side-by-side',
    title: 'Configuring Unity Container: Comparing Code and Xml Configuration Side by Side'
  },
  {
    slug: 'connect-net-core-to-azure-key-vault-in-ten-minutes',
    title: 'Connect .Net Core To Azure Key Vault In Ten Minutes'
  },
  {
    slug: 'constructor-and-constraints',
    title: 'Back To Basics: Constructors and Enforcing Invariants'
  },
  {
    slug: 'continuos-delivery-of-octopress-blog-using-travisci-and-docker',
    title: 'Continuos Delivery of Octopress Blog Using TravisCI and Docker'
  },
  {
    slug: 'converting-a-pdf-for-your-kindle',
    title: 'Converting a PDF for your Kindle'
  },
  {
    slug: 'cosmos-arm-template',
    title: 'How To Create An ARM Template For Cosmos DB'
  },
  {
    slug: 'cosmos-emulator-arm-templates',
    title: 'How To Automatically Deploy ARM Templates To Azure Cosmos Emulator'
  },
  {
    slug: 'could-not-load-assembly-msshrtmi-dll',
    title: 'Could Not Load Assembly msshrtmi.dll?'
  },
  {
    slug: 'could-not-load-file-or-assembly-or-one-of-its-dependencies',
    title: 'Web Application Occasionally Throwing \'Could not Load File or Assembly or one of its Dependencies\' Exception'
  },
  {
    slug: 'create-react-app-devops',
    title: 'Azure DevOps Build Release Pipeline For Create React App'
  },
  {
    slug: 'custom-authorization-policy-providers',
    title: 'Custom Authorization Policy Providers in .Net Core For Checking Multiple Azure AD Security Groups'
  },
  {
    slug: 'cypress-react-app-json-server-typescript',
    title: 'Setting Up Cypress + React App + JSON Server + TypeScript'
  },
  {
    slug: 'data-hotfix',
    title: 'Data Hotfix : Things to Remember'
  },
  {
    slug: 'datatemplate-vs-code-behind',
    title: 'DataTemplate Vs Code Behind'
  },
  {
    slug: 'defaultazurecredential-from-azure-sdk',
    title: 'DefaultAzureCredential: Unifying How We Get Azure AD Token'
  },
  {
    slug: 'defensive-coding',
    title: 'Defensive Coding'
  },
  {
    slug: 'deleting-multiple-selected-items-in-wpf',
    title: 'Deleting Multiple Selected Items in WPF'
  },
  {
    slug: 'dependency-injection-in-azure-functions',
    title: 'How To Setup Dependency Injection With Azure Functions ⚡'
  },
  {
    slug: 'deploy-lambda-function-from-jetbrains-rider',
    title: 'Learn To Deploy AWS Lambda Functions with Ease in JetBrains Rider'
  },
  {
    slug: 'deploying-to-aws-elastic-beanstalk-using-aws-console',
    title: 'Deploying To AWS Elastic Beanstalk Using AWS Console'
  },
  {
    slug: 'developer-learnings-from-the-ikea-experience',
    title: 'Developer Learnings from the IKEA Experience'
  },
  {
    slug: 'digital-minimalism',
    title: 'Digital Minimalism: An Experiment To Simplify Online Life'
  },
  {
    slug: 'direct-exchange-rabbitmq-dotnet',
    title: 'RabbitMQ Direct Exchange Explained'
  },
  {
    slug: 'disable-nuget-package-restore-for-a-net-poject',
    title: 'Disable NuGet Package Restore for a .Net Poject'
  },
  {
    slug: 'distracting-chat-apps',
    title: 'Is Instant Messaging At Work Distracting You?'
  },
  {
    slug: 'do-stars-count',
    title: 'Do Stars Count????'
  },
  {
    slug: 'dont-let-ef-fool-your-constructors',
    title: 'Don\'t Let Entity Framework Fool Your Constructors!'
  },
  {
    slug: 'dont-wait-for-new-year',
    title: 'Looking To Start A Habit? But It Isn\'t New Year Yet!'
  },
  {
    slug: 'dot-net-core-api-and-azure-ad-groups-based-access',
    title: '.Net Core Web App and Azure AD Security Groups Role Based Access'
  },
  {
    slug: 'dotnet-opensearch-getting-started',
    title: 'Querying OpenSearch from .NET: Full-Text Search on DynamoDB Data.'
  },
  {
    slug: 'dynamically-create-powershell-alias',
    title: 'Dynamically Create Powershell Alias'
  },
  {
    slug: 'dynamodb-batchdelete',
    title: 'Batch Delete Item Operations In DynamoDB Using .NET'
  },
  {
    slug: 'dynamodb-batchgetitem-dotnet',
    title: 'BatchGetItem Operations In DynamoDB Using .NET'
  },
  {
    slug: 'dynamodb-batchwrite',
    title: 'BatchWriteItem Operations In DynamoDB Using .NET'
  },
  {
    slug: 'dynamodb-condition-expressions-dotnet',
    title: 'How to Ensure Data Consistency with DynamoDB Condition Expressions From .NET Applications'
  },
  {
    slug: 'dynamodb-custom-converters-dotnet',
    title: 'Learn How to Map Complex .NET Types to DynamoDB using Custom Converters'
  },
  {
    slug: 'dynamodb-etl-opensearch-amazon',
    title: 'DynamoDB Zero-ETL Integration With Amazon OpenSearch Service'
  },
  {
    slug: 'dynamodb-global-secondary-index-gsi',
    title: 'Exploring Global Secondary Index: Advanced Querying in DynamoDB From .NET'
  },
  {
    slug: 'dynamodb-net-table',
    title: '.NET DynamoDB SDK: Understanding Table Name Conventions and DynamoDBTable Attribute'
  },
  {
    slug: 'dynamodb-optimistic-locking',
    title: 'How to Implement Optimistic Locking in .NET for Amazon DynamoDB'
  },
  {
    slug: 'dynamodb-pagination',
    title: '3 Different Ways To Do Data Pagination from Amazon DynamoDB Using .NET'
  },
  {
    slug: 'dynamodb-projection-expressions',
    title: 'How to Optimize Your DynamoDB Queries With Projection Expressions in .NET'
  },
  {
    slug: 'dynamodb-putitem-vs-updateitem-whats-the-difference',
    title: 'DynamoDB UpdateItem vs. PutItem in .NET - Which One Should You Use?'
  },
  {
    slug: 'dynamodb-querying-dotnet',
    title: '5 Ways To Query Data From Amazon DynamoDB using .NET'
  },
  {
    slug: 'dynamodb-sparse-index-dotnet',
    title: 'Improving Query Performance in DynamoDB with Sparse Indexes and .NET'
  },
  {
    slug: 'dynamodb-time-to-live-dotnet',
    title: 'How to Effectively Manage Data Lifetime with DynamoDB Time to Live'
  },
  {
    slug: 'dynamodbcontext-and-querying-secondary-indexes',
    title: 'How to Query Secondary Indexes Using DynamoDBContext From the .NET SDK?'
  },
  {
    slug: 'ebook-or-hard-copy',
    title: 'Ebook Or Hard Copy'
  },
  {
    slug: 'ec2-github-actions-asp-net',
    title: 'Step-by-Step: Setting Up GitHub Actions to Build and Deploy .NET to EC2'
  },
  {
    slug: 'electron-and-react',
    title: 'Setting up an Electron Application using create-react-app Template'
  },
  {
    slug: 'electronically-sign-pdf-no-more-printing-and-scanning',
    title: 'Tip of the Week: Electronically Sign PDF - No More Printing and Scanning'
  },
  {
    slug: 'enable-cross-origin-requests-cors-in-asp-dot-net-web-api-using-corsoptions',
    title: 'Enable Cross-Origin Requests (CORS) in ASP.Net Web API Using CorsOptions'
  },
  {
    slug: 'exclude-certain-scripts-from-transaction-when-using-dbup',
    title: 'Exclude Certain Scripts From Transaction When Using DbUp'
  },
  {
    slug: 'exercism',
    title: 'Exercism: A Great Addition To Your Learning Plan'
  },
  {
    slug: 'experimenting-with-pomodoro-technique',
    title: 'How I Included Scrum and Pomodoro Technique in My Morning Routine'
  },
  {
    slug: 'expiry-notification-for-azure-key-vault-keys-and-secrets',
    title: 'Expiry Notification for Azure Key Vault Keys and Secrets'
  },
  {
    slug: 'exploring-azurekeyvaultconfigbuilder',
    title: 'Exploring AzureKeyVaultConfigBuilder'
  },
  {
    slug: 'exploring-oauth-c-and-500px',
    title: 'Windows 8 Series - Exploring OAuth: c# and 500px'
  },
  {
    slug: 'fanout-exchange-rabbitmq-dotnet',
    title: 'RabbitMQ Fanout Exchange Explained'
  },
  {
    slug: 'feedly-one-stop-reading-place',
    title: 'Tip of the Week: Feedly - One Stop Reading Place'
  },
  {
    slug: 'fiddler-free-web-debugging-proxy',
    title: 'Tip of the Week: Fiddler - Free Web Debugging Proxy'
  },
  {
    slug: 'finally',
    title: 'Finally!!!!!!'
  },
  {
    slug: 'finding-a-job-abroad',
    title: 'Finding a Job Abroad'
  },
  {
    slug: 'finding-keyboard-shortcuts-on-websites',
    title: 'Tip of the Week: Finding Keyboard Shortcuts on Websites'
  },
  {
    slug: 'five-tips-to-make-it-impossible-to-get-distracted',
    title: '5 Tips to Make it Impossible to Get Distracted'
  },
  {
    slug: 'flux-make-it-easy-for-your-eyes',
    title: 'Tip of the Week: f.lux - Make it Easy For Your Eyes'
  },
  {
    slug: 'four-finger-swipe-gesture-to-switch-between-virtual-machines',
    title: 'Tip of the Week: Four Finger Swipe Gesture to Switch Between Virtual Machines'
  },
  {
    slug: 'four-years-since-losing-weight',
    title: '4 Years Since Losing 23 kilos in 6 Months'
  },
  {
    slug: 'function-urls-in-aws-lambda-dotnet',
    title: 'Function URLs - Quick and Easy way to Invoke AWS Lambda Functions over HTTP'
  },
  {
    slug: 'fxcop-custom-naming-rules',
    title: 'FxCop Custom Naming Rules'
  },
  {
    slug: 'generating-a-large-pdf-from-website-contents-part-ii',
    title: 'Generating a Large PDF from Website Contents - HTML to PDF, Bookmarks and Handling Empty Pages'
  },
  {
    slug: 'generating-a-large-pdf-from-website-contents-part-iii',
    title: 'Generating a Large PDF from Website Contents - Merging PDF Files'
  },
  {
    slug: 'generating-a-large-pdf-from-website-contents',
    title: 'Generating a Large PDF from Website Contents'
  },
  {
    slug: 'get-started-with-your-blog',
    title: 'Get started with your blog'
  },
  {
    slug: 'getting-results-the-agile-way-book-summary',
    title: 'Book Summary: Getting Results the Agile Way by J.D. Meier'
  },
  {
    slug: 'getting-started-with-amazon-cognito-setting-up-user-pools-and-app-clients',
    title: 'Getting Started with Amazon Cognito: Setting Up User Pools and App Clients'
  },
  {
    slug: 'getting-started-with-asp-net-web-api',
    title: 'Getting Started with ASP.NET Web Api'
  },
  {
    slug: 'getting-started-with-azure-functions',
    title: 'Azure Functions ⚡ For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'getting-started-with-azure-key-vault',
    title: 'Getting Started with Azure Key Vault'
  },
  {
    slug: 'getting-started-with-azure-queue-storage',
    title: 'Azure Queue Storage For The .NET Developer: How To Easily Get Started'
  },
  {
    slug: 'getting-started-with-cypress',
    title: 'Getting Started With Cypress: An End-to-End Testing Framework'
  },
  {
    slug: 'getting-started-with-freelancing-jobs-online',
    title: 'Getting Started With Freelancing Jobs Online'
  },
  {
    slug: 'getting-started-with-nservicebus-on-aws',
    title: 'NServiceBus on AWS SQS: Learn How to Quickly Get Started'
  },
  {
    slug: 'getting-started-with-phonegap-developing-for-windows-phone-and-android',
    title: 'Getting Started with PhoneGap: Developing for Windows Phone and Android'
  },
  {
    slug: 'git-checkout-tfs',
    title: 'git checkout TFS'
  },
  {
    slug: 'giveaway-get-a-license-of-your-choice-from-syncfusion',
    title: 'Giveaway : Get a license of your choice from Syncfusion'
  },
  {
    slug: 'grammarly-improve-your-writing',
    title: 'Tip of the Week: Grammarly - Improve Your Writing'
  },
  {
    slug: 'handle-change',
    title: 'I Don\'t Like Change. But Here\'s What I\'m Doing About It'
  },
  {
    slug: 'handling-application-configuration',
    title: '5 Ways to Handle Application Configuration & Secrets With Azure 🔐'
  },
  {
    slug: 'handling-too-many-requests-error-auth0',
    title: 'Handling Too Many Request Error with Auth0 Using Polly'
  },
  {
    slug: 'headers-exchange-rabbitmq-dotnet',
    title: 'RabbitMQ Headers Exchange Explained'
  },
  {
    slug: 'hello-atomic-essays-world',
    title: 'Hello \'Atomic Essays\' World'
  },
  {
    slug: 'hemingway-editor',
    title: 'Tip of the Week: Hemingway Editor - Improve Your Writing'
  },
  {
    slug: 'hero-or-a-cheat',
    title: 'Hero or a Cheat????'
  },
  {
    slug: 'home',
    title: 'Hey, I\'m Rahul Nath 👋'
  },
  {
    slug: 'how-i-lost-13-kilos-in-one-and-half-months',
    title: 'How I Lost 13 Kilos in One and Half Months'
  },
  {
    slug: 'how-the-deprecation-of-switch-azuremode-affects-azure-key-vault',
    title: 'How the Deprecation of Switch AzureMode Affects Azure Key Vault'
  },
  {
    slug: 'how-to-authenticate-azure-function-with-azure-web-app-using-managed-service-identity',
    title: 'How to Authenticate and Authorize Azure Function with Azure Web App Using Managed Service Identity (MSI)'
  },
  {
    slug: 'how-to-authenticate-with-microsoft-graph-api-using-managed-service-identity',
    title: 'How to Authenticate With Microsoft Graph API Using Managed Service Identity'
  },
  {
    slug: 'how-to-be-amazingly-good-at-asking-questions-online',
    title: 'How To Be Amazingly Good At Asking Questions Online'
  },
  {
    slug: 'how-to-fuel-ourselves',
    title: 'We Need To Fuel Ourselves To Keep Going, But How?'
  },
  {
    slug: 'how-to-get-more-done',
    title: 'How To Get More Done? Here Is a Simple Trick That Works'
  },
  {
    slug: 'how-to-secure-and-authenticate-lambda-function-urls',
    title: 'How To Secure and Authenticate AWS Lambda Function URLs'
  },
  {
    slug: 'how-to-set-up-aws-net-mock-lambda-test-tool-on-jetbrains-rider',
    title: 'How To Set Up AWS .NET Mock Lambda Test Tool on JetBrains Rider'
  },
  {
    slug: 'how-to-setup-google-indic-keyboard-on-your-android-phone',
    title: 'Type in Your Native Indian Language - Setting up Indic Keyboard on Your Android Phone'
  },
  {
    slug: 'how-to-zip-multiple-files-in-dotnet',
    title: 'HOW TO: ZIP Multiple CSV Files In ASP.NET'
  },
  {
    slug: 'how-twitter-changed-my-life',
    title: 'How Twitter Changed My Life!'
  },
  {
    slug: 'how-writing-online-has-helped-me-as-a-programmer',
    title: 'How Writing Online has Helped Me as A Programmer?'
  },
  {
    slug: 'hp-dv4',
    title: 'HP DV4'
  },
  {
    slug: 'http-a-short-dive',
    title: 'HTTP – A Short Dive'
  },
  {
    slug: 'http-content-security-policy-csp',
    title: 'HTTP Content Security Policy (CSP)'
  },
  {
    slug: 'http-files-asp-net-core-dotnet',
    title: '.http Files Explained: Boost Your ASP NET Core API Development Workflow'
  },
  {
    slug: 'http-strict-transport-security-sts-or-hsts',
    title: 'HTTP Strict Transport Security (STS or HSTS)'
  },
  {
    slug: 'https-for-free-and-why-you-should-care',
    title: 'HTTPS For Free and Why You Should Care'
  },
  {
    slug: 'idempotent-lambda-functions-dotnet',
    title: 'How To Easily Make Your .NET AWS Lambda Function Idempotent'
  },
  {
    slug: 'if-this-then-that-ifttt-connect-your-services',
    title: 'Tip of the Week: IF This Then That (IFTTT) - Connect Your Services'
  },
  {
    slug: 'improved-code-navigation-in-visual-studio-2017',
    title: 'Tip of the Week: Improved Code Navigation in Visual Studio 2017'
  },
  {
    slug: 'introduce-tests-when-fixing-bugs',
    title: 'Introduce Tests when Fixing Bugs'
  },
  {
    slug: 'introducing-code-formatting-into-a-large-codebase',
    title: 'Introducing Code Formatting into a Large Code Base'
  },
  {
    slug: 'introduction-to-messaging',
    title: 'Introduction To Messaging'
  },
  {
    slug: 'ioc-registration-by-convention',
    title: 'IoC Registration by Convention'
  },
  {
    slug: 'ios-app-screenshots-using-chrome-browser',
    title: 'How To Take iOS App Store Screenshots Using Google Chrome For Cordova Applications'
  },
  {
    slug: 'is-code-coverage-a-lie',
    title: 'Is Code Coverage a Lie?'
  },
  {
    slug: 'isregistered-on-unity-container-for-generic-type',
    title: 'IsRegistered on Unity Container for Generic Type'
  },
  {
    slug: 'jaybird-run-right-earbud-not-charging',
    title: 'Fixed: Jaybird Run - Right Earbud Not Charging'
  },
  {
    slug: 'jwt-authentication-asp-net-web-api',
    title: 'How To Protect Your ASP NET Web API Using JWT Authentication'
  },
  {
    slug: 'keeping-sensitive-configuration-data-out-of-source-control',
    title: 'Keeping Sensitive Configuration Data Out of Source Control'
  },
  {
    slug: 'kick-start-wpf',
    title: 'Kick Start WPF'
  },
  {
    slug: 'knockoutjs-for-xaml-developers',
    title: 'KnockoutJS For XAML Developers'
  },
  {
    slug: 'kumon-books-creative-workbooks',
    title: 'Tip of the Week: Kumon Books - Creative Workbooks'
  },
  {
    slug: 'lambda-annotation-framework-crud-api',
    title: 'Serverless API Development Made Easy: Using AWS Lambda Annotations for CRUD'
  },
  {
    slug: 'lambda-annotations-dependency-injection',
    title: 'How To Set Up Dependency Injection in Lambda Functions Using Annotations Framework'
  },
  {
    slug: 'lambda-lifecycle-and-net',
    title: 'Why Should You Care About Lambda Lifecycle As A .NET Developer?'
  },
  {
    slug: 'language-agnostic-books-for-every-developer-2',
    title: 'Language Agnostic Books For Every Developer 2'
  },
  {
    slug: 'language-agnostic-books-for-every-developer',
    title: 'Language Agnostic Books For Every Developer'
  },
  {
    slug: 'laps-in-training-mode-garmin-watches',
    title: 'Tip of the Week: Laps in Training Mode - Garmin Watches'
  },
  {
    slug: 'learn-touch-typing',
    title: 'Tip of the Week: Learn Touch Typing'
  },
  {
    slug: 'learning-typescript-setting-up-the-environment',
    title: 'Learning TypeScript: Setting up the Environment'
  },
  {
    slug: 'left-align-your-code-for-better-readability',
    title: 'Left Align Your Code For Better Readability'
  },
  {
    slug: 'life-learnings-after-being-a-parent',
    title: 'Life Learnings After Being a Parent'
  },
  {
    slug: 'life-lessons-from-running',
    title: 'Important Life Lessons Learned From Running'
  },
  {
    slug: 'local-secondary-index-dynamodb',
    title: 'Improving Queries Using Local Secondary Index in DynamoDB with .NET'
  },
  {
    slug: 'maintaining-a-blogging-schedule',
    title: 'Maintaining a Blogging Schedule'
  },
  {
    slug: 'make-it-easy-for-the-new-person-joining-your-team-have-a-project-ramp-up-plan',
    title: 'Make it Easy for the New Person Joining the Team - Have a Project Ramp up Plan'
  },
  {
    slug: 'manage-certificates-in-azure-key-vault',
    title: 'Manage Certificates in Azure Key Vault'
  },
  {
    slug: 'manage-your-postman-api-specs',
    title: 'Managing Your Postman API Specs'
  },
  {
    slug: 'managing-azure-ad-application-for-key-vault',
    title: 'Managing Azure AD Application for Key Vault'
  },
  {
    slug: 'managing-azure-key-vault-over-the-rest-api',
    title: 'Managing Azure Key Vault over the REST API'
  },
  {
    slug: 'managing-azure-key-vault-using-azure-resource-manager-arm-templates',
    title: 'Managing Azure Key Vault using Azure Resource Manager (ARM) Templates'
  },
  {
    slug: 'managing-key-vault-through-azure-portal',
    title: 'Managing Key Vault Through Azure Portal'
  },
  {
    slug: 'managing-user-permissions-for-key-vault',
    title: 'Managing User Permissions for Key Vault'
  },
  {
    slug: 'masstransit-rabbitmq-asp-dotnet',
    title: 'A Beginner\'s Guide to MassTransit and RabbitMQ in ASP NET'
  },
  {
    slug: 'metrics-aws-lambda-powertools',
    title: 'How To Easily Log Metrics Data From AWS Lambda Using Powertools Library'
  },
  {
    slug: 'migrating-blog-from-hugo-to-gatsby',
    title: 'Migrating My Blog From Hugo To Gatsby'
  },
  {
    slug: 'migrating-octopress-to-hugo',
    title: 'Migrating Octopress To Hugo'
  },
  {
    slug: 'morning-routine',
    title: 'My Morning Routine'
  },
  {
    slug: 'moving-selected-lines-in-visual-studio',
    title: 'Tip of the Week: Moving Selected Lines in Visual Studio'
  },
  {
    slug: 'moving-sensitive-information-from-configuration-file-to-azure-key-vault',
    title: 'Moving Sensitive Information from Configuration File to Azure Key Vault'
  },
  {
    slug: 'msdn-magazine-article-on-azure-key-vault',
    title: 'MSDN Magazine Article on Azure Key Vault'
  },
  {
    slug: 'mvvm-a-windows-phone-scenario-part-2',
    title: 'MVVM – A Windows Phone Scenario – Part 2'
  },
  {
    slug: 'mvvm-a-windows-phone-scenario',
    title: 'MVVM – A Windows phone scenario'
  },
  {
    slug: 'mvvm-does-it-really-matter',
    title: 'MVVM – Does it really matter?'
  },
  {
    slug: 'my-writing-sucks',
    title: 'My Writing Sucks'
  },
  {
    slug: 'ndc-security-2018-overview-and-key-takeaways',
    title: 'NDC Security 2018 - Overview and Key Takeaways'
  },
  {
    slug: 'ndc-sydney-2017',
    title: 'NDC Sydney 2017'
  },
  {
    slug: 'ndc-sydney',
    title: 'NDC Sydney'
  },
  {
    slug: 'net-core-pdf',
    title: 'Generating PDF: .Net Core and Azure Web Application'
  },
  {
    slug: 'not-able-to-start-debugging-in-visual-studio',
    title: 'Not Able to “Start Debugging” in Visual Studio'
  },
  {
    slug: 'not-all-that-returns-json-is-restful-understanding-hateoas',
    title: 'Not All That Returns JSON is RESTful: Understanding HATEOAS'
  },
  {
    slug: 'nservicebus-publish-subscribe-aws-sqs-transport-getting-started',
    title: 'NServiceBus on AWS SNS:  Learn How To Publish and Subscribe to Events'
  },
  {
    slug: 'obvious',
    title: 'Is it Obvious? Maybe It\'s Not!'
  },
  {
    slug: 'office-lens-scan-documents-with-your-phone',
    title: 'Tip of the Week: Office Lens - Scan Documents With Your Phone'
  },
  {
    slug: 'ok-i-have-got-https-what-next',
    title: 'Ok I Have Got HTTPS! What Next?'
  },
  {
    slug: 'one-day-trips-around-brisbane',
    title: 'One Day Trips Around Brisbane'
  },
  {
    slug: 'one-day-trips-around-sydney',
    title: 'One Day Trips Around Sydney'
  },
  {
    slug: 'one-thing-i-changed-with-how-i-read',
    title: 'The One Thing I Changed About How I Read'
  },
  {
    slug: 'optimizing-octopress-workflow-for-new-posts',
    title: 'Optimizing Octopress Workflow for New Posts'
  },
  {
    slug: 'organizing-tests-into-test-suites-for-visual-studio',
    title: 'Organizing Tests into Test Suites for Visual Studio'
  },
  {
    slug: 'outcomes-over-todos',
    title: 'Focus On Outcomes And Not Checking Off a List ✔'
  },
  {
    slug: 'own-your-urls',
    title: 'Own Your URLs; Nothing Else Really Matters'
  },
  {
    slug: 'paint-dot-net',
    title: 'Tip of the Week: Paint.net - A Layman\'s Photoshop'
  },
  {
    slug: 'passion-alone-is-not-enough',
    title: 'Passion Will Get You Started. But Is That Enough?'
  },
  {
    slug: 'password-manager-get-one-if-you-havent-already',
    title: 'Tip of the Week: Password Manager - Get One If you Haven\'t Already'
  },
  {
    slug: 'paste-without-formatting',
    title: 'Tip of the Week: Paste Without Formatting'
  },
  {
    slug: 'pfx-certificate-in-azure-key-vault',
    title: 'PFX Certificate in Azure Key Vault'
  },
  {
    slug: 'photography-learning-to-click',
    title: 'Photography - Learning to Click'
  },
  {
    slug: 'pnggauntlet-smash-pngs-for-faster-sites',
    title: 'Tip of the Week: PNGGauntlet - Smash PNGs for Faster Sites'
  },
  {
    slug: 'pocket-offline-reading-made-easy',
    title: 'Tip of the Week: Pocket - Don\'t Miss Out on the Articles That You Want to Read Later'
  },
  {
    slug: 'populating-data-for-tests',
    title: 'Populating Data for Tests'
  },
  {
    slug: 'postman-chaining-requests-to-speed-up-manual-api-tests',
    title: 'Tip of the Week: Postman - Chaining Requests to Speed Up Manual API Tests'
  },
  {
    slug: 'powertools-for-aws-lambda-logger',
    title: 'How To Easily Get Started with AWS Lambda Logging in .NET using Powertools'
  },
  {
    slug: 'powertools-for-aws-lambda-parameters',
    title: 'How To Effectively Manage Sensitive Information in AWS Lambda: Powertools Parameters'
  },
  {
    slug: 'powertools-for-aws-lambda-tracing',
    title: 'How To Easily Get Started with AWS Lambda Tracing in .NET using Powertools'
  },
  {
    slug: 'prettier-an-opinionated-code-formatter',
    title: 'Tip of the Week: Prettier - An Opinionated Code Formatter'
  },
  {
    slug: 'productivity-noise-with-noisli',
    title: 'Tip of the Week: Productivity Noise with Noisli'
  },
  {
    slug: 'productivity',
    title: 'What Does It Mean To Be Productive?'
  },
  {
    slug: 'protect-yourself-against-line-ending-issues-when-using-environment-dot-newline-to-split-text',
    title: 'Protect Yourself Against Line Ending Issues when Using Environment.Newline to Split Text'
  },
  {
    slug: 'psm-learnings',
    title: 'Learnings from The Professional Scrum Master (PSM) Course'
  },
  {
    slug: 'query-object-pattern-and-entity-framework-making-readable-queries',
    title: 'Query Object Pattern and Entity Framework - Making Readable Queries'
  },
  {
    slug: 'quick-launch-in-visual-studio',
    title: 'Tip of the Week: Quick Launch in Visual Studio'
  },
  {
    slug: 'rabbitmq-consumer-ack-dotnet',
    title: 'Exploring Manual and Automatic Acknowledgment in RabbitMQ with .NET'
  },
  {
    slug: 'rabbitmq-exchanges-dotnet',
    title: 'Rabbit MQ Exchange and Exchange Types: What You Need to Know'
  },
  {
    slug: 'rabbitmq-message-dispatching-dotnet',
    title: 'Efficient Message Distribution with RabbitMQ: Understanding Round Robin and Fair Dispatching Modes'
  },
  {
    slug: 'rate-limit',
    title: 'How To Solve \"Rate exceeded for operation \'AWS::CloudFront::Distribution\'.\" Error?'
  },
  {
    slug: 'reactjs-setting-up-the-environment',
    title: 'ReactJS: Setting up the Environment'
  },
  {
    slug: 'reading-eggs-learning-to-read-can-be-easy-and-fun',
    title: 'Tip of the Week: Reading Eggs - Learning To Read Can Be Easy And Fun'
  },
  {
    slug: 'recording-my-first-screencast',
    title: 'Recording My First Screencast'
  },
  {
    slug: 'refactoring-test-code-removing-constructor-dependency',
    title: 'Refactoring Test Code: Removing Constructor Dependency'
  },
  {
    slug: 'refactoring-to-composite-pattern',
    title: 'Refactoring to Composite Pattern'
  },
  {
    slug: 'refactoring-to-improve-readability-separating-business-language-and-programming-language-semantics',
    title: 'Refactoring to Improve Readability - Separating Business Language and Programming Language Semantics'
  },
  {
    slug: 'refactoring-to-improve-testability-extracting-dependencies',
    title: 'Refactoring to Improve Testability: Extracting Dependencies'
  },
  {
    slug: 'refactoring-to-improve-testability-removing-unnecessary-dependencies',
    title: 'Refactoring to Improve Testability: Removing Unnecessary Dependencies'
  },
  {
    slug: 'remote-debugging-azure-virtual-machines-from-visual-studio',
    title: 'Remote Debugging: Azure Virtual Machines With Visual Studio'
  },
  {
    slug: 'rename-sql-table',
    title: 'Rename SQL Table and Update Naming Conventions for Associated Keys and Constraints'
  },
  {
    slug: 'replace-introduce-local-extension-with-extension-methods',
    title: 'Replace ‘Introduce Local Extension’ With ‘Extension Methods’'
  },
  {
    slug: 'rescue-time-track-your-time',
    title: 'Tip of the Week: Rescue Time - Track Your Time'
  },
  {
    slug: 'reset-points',
    title: 'I Had A Bad Start Today. What Can I Do?'
  },
  {
    slug: 'rest-after-a-long-time',
    title: 'REST...after a long time'
  },
  {
    slug: 'retrospect',
    title: '...Retrospect'
  },
  {
    slug: 'review-pixel',
    title: 'Review: Pixel, Phone by Google - Made by Google'
  },
  {
    slug: 'review-six-months-and-counting-logitech-mx-master',
    title: 'Review: Six Months and Counting - Logitech MX Master'
  },
  {
    slug: 'review-two-months-and-counting-android-and-nexus-5',
    title: 'Review: Two Months and Counting - Android and Nexus 5'
  },
  {
    slug: 'role-based-access-control',
    title: 'Role Based Access Control'
  },
  {
    slug: 'routine',
    title: 'My Morning Routine'
  },
  {
    slug: 'scheduling-recurring-jobs-with-a-cool-off-period',
    title: 'Scheduling Recurring Jobs With a Cool-Off Period'
  },
  {
    slug: 'scheduling-tasks-with-aws-lambda',
    title: 'Serverless Task Automation: Task Scheduling with AWS Lambda and Amazon EventBridge'
  },
  {
    slug: 'screenshots-with-snagit',
    title: 'Tip of the Week: Screenshots with Snagit'
  },
  {
    slug: 'scrolling-a-disabled-listbox-in-wpf',
    title: 'Scrolling a Disabled Listbox in WPF'
  },
  {
    slug: 'seek-the-problem-not-the-solution',
    title: 'Seek the problem, Not the Solution'
  },
  {
    slug: 'semantic-comparison-improve-test-assertions',
    title: 'Semantic Comparison: Improve Test Assertions'
  },
  {
    slug: 'set-up-aws-toolkit-for-jetbrains-rider',
    title: 'Guide To Building AWS Lambda Functions with Ease in JetBrains Rider'
  },
  {
    slug: 'setting-up-a-fake-rest-api-using-json-server',
    title: 'Setting Up A Fake REST API Using JSON Server'
  },
  {
    slug: 'setting-up-autohotkey-to-speed-up-trivial-tasks',
    title: 'Setting up AutoHotkey to Speed up Trivial Tasks'
  },
  {
    slug: 'setting-up-dbup-in-azure-pipelines',
    title: 'Setting up DbUp in Azure Pipelines'
  },
  {
    slug: 'setting-up-git-credential-manager-for-windows-with-cmder',
    title: 'Setting up Git Credential Manager for Windows with Cmder'
  },
  {
    slug: 'setting-up-multiple-monitors',
    title: 'Setting Up Dual 4K Monitors - Dell P2715Q and Dell U2718Q'
  },
  {
    slug: 'setting-up-the-development-environment-for-phonegap-on-android',
    title: 'Setting up the Development Environment for PhoneGap on Android'
  },
  {
    slug: 'setting-up-windows-terminal',
    title: 'Setting Up The Windows Terminal'
  },
  {
    slug: 'share-and-inspire',
    title: 'Share and Inspire'
  },
  {
    slug: 'signing-a-pdf-file-using-azure-key-vault',
    title: 'Signing a PDF File Using Azure Key Vault'
  },
  {
    slug: 'simulating-delays-in-http-calls-for-manual-tests',
    title: 'Simulating delays in HTTP Calls For Manual Tests'
  },
  {
    slug: 'simulating-different-api-scenarios-using-json-server',
    title: 'Simulating Different Scenarios Using Fake JSON Server API'
  },
  {
    slug: 'simulating-different-ui-scenarios-during-fronend-development',
    title: 'Simulate UI Scenarios For Front-End Development'
  },
  {
    slug: 'small-push-to-keep-rolling',
    title: 'Sometimes All We Need Is Small Push To Keep Rolling'
  },
  {
    slug: 'social-media-is-your-best-accountability-partner',
    title: 'Social Media Is Your Best Accountability Partner!'
  },
  {
    slug: 'solidcolorbrush-list-from-brushes',
    title: 'SolidColorBrush List from Brushes'
  },
  {
    slug: 'solve-the-business-problem-dont-mimic-the-process',
    title: 'Solve the Business Problem, Don\'t Mimic The Process'
  },
  {
    slug: 'specflow-and-autofixture',
    title: 'How To Easily Generate Data For SpecFlow Tests'
  },
  {
    slug: 'spigen-awesome-phone-cases',
    title: 'Tip of the Week: Spigen - Awesome Phone Cases'
  },
  {
    slug: 'splurge-system',
    title: 'Waiting on Spouse Approval To Buy? Try This System'
  },
  {
    slug: 'squoosh-make-images-smaller',
    title: 'Tip of the Week: Squoosh - Make Images Smaller'
  },
  {
    slug: 'stars-do-count',
    title: 'Stars Do Count!!!!'
  },
  {
    slug: 'start-new-habits-that-stick',
    title: 'How to Start New Habits That Stick'
  },
  {
    slug: 'static-generator-is-all-a-blog-needs-moving-to-octopress',
    title: 'Static Generator is All a Blog Needs - Moving to Octopress'
  },
  {
    slug: 'staying-in-the-learning-loop',
    title: 'Staying in the Learning Loop'
  },
  {
    slug: 'staying-organized-finding-a-system-to-manage-it-all',
    title: 'Staying Organized: Finding a system to manage it all'
  },
  {
    slug: 'staying-productive-offline',
    title: 'Staying Productive Offline'
  },
  {
    slug: 'stream-zip-files-asp-dotnet',
    title: 'Efficient File Bundling in ASP NET: A Guide to Streaming ZIP Archives'
  },
  {
    slug: 'stronger-code-contracts',
    title: 'Make Your Code Contracts Stronger'
  },
  {
    slug: 'stuck-in-creative-multitasking-',
    title: 'Are You Multitasking Within Your Creation Process?'
  },
  {
    slug: 'subresource-integrity-sri',
    title: 'Subresource Integrity (SRI)'
  },
  {
    slug: 'switching-between-subscriptions-under-same-azure-account-to-access-key-vault',
    title: 'Tip of the Week: Switching Subscriptions Under Same Azure Account to Access Key Vaults'
  },
  {
    slug: 'synchronize-sql-server-database-objects',
    title: 'Synchronize SQL Server database objects'
  },
  {
    slug: 'tdd-and-refactoring',
    title: 'TDD and Refactoring'
  },
  {
    slug: 'testing-multiple-implementations-of-same-interface',
    title: 'Testing Multiple Implementations of same Interface'
  },
  {
    slug: 'testing-your-website-under-different-bandwidths',
    title: 'Tip of the Week: Testing Your Website Under Different Bandwidths'
  },
  {
    slug: 'tests-as-a-feedback-tool',
    title: 'Use Tests As A Feedback Tool To Improve Code'
  },
  {
    slug: 'text-editing-convert-text-casing',
    title: 'Tip of the Week: Text Editing - Convert Text Casing'
  },
  {
    slug: 'text-editing-extract-data',
    title: 'Tip of the Week: Text Editing - Extract Data'
  },
  {
    slug: 'text-editing-split-or-combine-multiple-lines',
    title: 'Tip of the Week: Text Editing - Split or Combine Multiple Lines'
  },
  {
    slug: 'thanks-to-everyone-who-attended-my-first-public-talk-at-ccorner-hyderabad-ug',
    title: 'Thanks to Everyone Who Attended My First Public Talk At C#Corner Hyderabad UG'
  },
  {
    slug: 'thanks-to-everyone-who-attended-our-talk-at-microsoft-india-hyderabad',
    title: 'Thanks to Everyone Who Attended Our Talk at Microsoft India, Hyderabad'
  },
  {
    slug: 'the-4am-club',
    title: '6 Years of The 4 AM Club! Here\'s How'
  },
  {
    slug: 'the-5-productivity-apps-i-cant-live-without',
    title: 'The 5 Productivity Apps I Can\'t Live Without'
  },
  {
    slug: 'the-building-block',
    title: 'The Building block'
  },
  {
    slug: 'the-headphones-rule',
    title: 'Tip of the Week: The Headphones Rule'
  },
  {
    slug: 'the-nokia-monster',
    title: 'the Nokia Monster'
  },
  {
    slug: 'the-problems-with-known-exception-and-ignoring-it',
    title: 'The Problems with Known Exceptions and Ignoring It'
  },
  {
    slug: 'the-wait-is-not-over',
    title: 'The wait is not over!!!!!'
  },
  {
    slug: 'thinking-beyond-primitive-values-value-objects',
    title: 'Thinking Beyond Primitive Values: Value Objects'
  },
  {
    slug: 'three-day-trip-to-coffs-harbour-from-sydney',
    title: 'Three Day Trip to Coffs Harbour from Sydney'
  },
  {
    slug: 'three-months-to-a-half-marathon',
    title: 'How I Went From Couch to Half Marathon in Twelve Weeks'
  },
  {
    slug: 'time-is-flying-is-it-really',
    title: 'Time\'s Flying And My Days Are Blank. Is It Really?'
  },
  {
    slug: 'todoist-manage-your-todo-list',
    title: 'Tip of the Week: Todoist: Manage your To-Do List'
  },
  {
    slug: 'todoist-template-transformer-transform-tasks-to-x-days-from-now',
    title: 'Todoist Template Transformer - Transform Tasks to \'X\' Days From Now'
  },
  {
    slug: 'toggl-pomodoro-timer',
    title: 'Tip of the Week: Toggl - A Pomodoro Timer'
  },
  {
    slug: 'tomighty-a-pomodoro-timer',
    title: 'Tip of the Week: Tomighty - A Pomodoro Timer'
  },
  {
    slug: 'tools-that-i-use',
    title: 'Tools that I use'
  },
  {
    slug: 'topic-exchange-rabbitmq-dotnet',
    title: 'RabbitMQ Topic Exchange Explained'
  },
  {
    slug: 'track-current-file-in-visual-studio-solution-explorer',
    title: 'Tip of the Week: Track Current File in Visual Studio Solution Explorer'
  },
  {
    slug: 'trips-for-the-long-weekend-around-sydney',
    title: 'Trips for the (Long) Weekend Around Sydney'
  },
  {
    slug: 'typescript-sum-types',
    title: 'TypeScript: Use Sum Types To Your Advantage When Modelling Data'
  },
  {
    slug: 'ultralearning-book-summary',
    title: 'Book Summary: Ultralearning by Scott.H. Young'
  },
  {
    slug: 'uses',
    title: 'Uses'
  },
  {
    slug: 'using-azure-key-vault-from-a-java-application',
    title: 'Using Azure Key Vault from a Java Application'
  },
  {
    slug: 'using-fiddler-to-help-in-manual-testing',
    title: 'Using Fiddler to help in Manual Testing'
  },
  {
    slug: 'using-git-locally-in-a-tfvc-repository',
    title: 'Tip of the Week: Using Git Locally in a TFVC Repository'
  },
  {
    slug: 'using-repository-pattern-for-abstracting-data-access-from-a-cache-and-data-store',
    title: 'Using Repository Pattern for Abstracting Data Access from a Cache and Data Store'
  },
  {
    slug: 'variable-snapshotting-in-azure-devops-when-using-azure-key-vault',
    title: 'Variable Snapshotting in Azure DevOps When Using Azure Key Vault'
  },
  {
    slug: 'venturing-out',
    title: 'Venturing out '
  },
  {
    slug: 'visual-studio-dev-essentials',
    title: 'Tip of the Week: Visual Studio Dev Essentials'
  },
  {
    slug: 'visual-studio-task-list-keep-track-of-your-todo-comments',
    title: 'Tip of the Week: Visual Studio Task List - Keep Track of Your TODO Comments'
  },
  {
    slug: 'waking-up-early-is-all-about-waking-up-to-an-alarm',
    title: 'Waking up Early is All About Waking up to an Alarm'
  },
  {
    slug: 'wcf-simplified',
    title: 'WCF Simplified'
  },
  {
    slug: 'wcf-to-asp-net-web-api',
    title: 'WCF to ASP.NET Web API'
  },
  {
    slug: 'what-made-me-choose-vanguard-up-rise-45',
    title: 'What made me choose : Vanguard UP-Rise 45'
  },
  {
    slug: 'what-should-i-learn-next',
    title: 'What Should I Learn Next?'
  },
  {
    slug: 'when-to-use-aws-lambda-snapstart',
    title: 'Is AWS Lambda SnapStart Right for Your Workload?'
  },
  {
    slug: 'when-your-architecture-screams-technology',
    title: 'When your Architecture Screams Technology!'
  },
  {
    slug: 'why-dead-letter-queues-are-a-must-have-for-reliable-messaging-systems',
    title: 'Why Dead Letter Queues Are a Must-Have for Reliable Messaging Systems'
  },
  {
    slug: 'why-i-chose-diigo',
    title: 'How To Improve Your Online Reading - Why I Chose Diigo?'
  },
  {
    slug: 'windows-8-series-drop-down-button',
    title: 'Windows 8 Series – Drop Down Button'
  },
  {
    slug: 'windows-8-series-incremental-loading',
    title: 'Windows 8 Series - Incremental Loading'
  },
  {
    slug: 'windows-phone-series-bing-maps-and-turn-by-turn-navigation',
    title: 'Windows Phone Series: Bing Maps and Turn-by-Turn Navigation'
  },
  {
    slug: 'windows-phone-series-image-caching-library-jetimageloader',
    title: 'Windows Phone Series: Image Caching Library - JetImageLoader'
  },
  {
    slug: 'windows-phone-series-incremental-loading-multiple-data-sources-inside-a-pivot',
    title: 'Windows Phone Series – Incremental Loading multiple data sources inside a Pivot'
  },
  {
    slug: 'windows-phone-series-incremental-loading',
    title: 'Windows Phone Series – Incremental Loading'
  },
  {
    slug: 'windows-phone-series-jump-lists',
    title: 'Windows Phone Series – Jump Lists'
  },
  {
    slug: 'windows-phone-series-mvvm-and-applicationbar',
    title: 'Windows Phone Series – MVVM and ApplicationBar'
  },
  {
    slug: 'windows-phone-series-preloading-content',
    title: 'Windows Phone Series – Preloading Content'
  },
  {
    slug: 'windows-phone-series-using-ucwa-to-connect-to-lync-server',
    title: 'Windows Phone Series – Using UCWA to connect to Lync Server'
  },
  {
    slug: 'windows-service-using-topshelf-quartz-and-autofac',
    title: 'Windows Service Using Topshelf, Quartz and Autofac'
  },
  {
    slug: 'working-effectively-under-constraints',
    title: 'Working Effectively Under Constraints'
  },
  {
    slug: 'wp7-application-model',
    title: 'WP7 Application Model'
  },
  {
    slug: 'wpf-certification',
    title: 'WPF Certification !!!!!'
  },
  {
    slug: 'wpf-expander-trigger-on-isexpanded-to-change-the-header',
    title: 'WPF Expander trigger on IsExpanded to change the header'
  },
  {
    slug: 'write-and-grow',
    title: 'What\'s Stopping You From Writing Online?'
  },
  {
    slug: 'writing-your-book-on-the-side-summary',
    title: 'Book Summary: Write Your Book On The Side by Hassan Osman'
  },
  {
    slug: 'yield-statement-csharp-dotnet',
    title: 'C# Yield Return Statement: A Deep Dive'
  },
  {
    slug: 'yo-ko-a-yeoman-generator-for-knockoutjs',
    title: 'yo ko - A Yeoman Generator For KnockoutJS'
  },
  {
    slug: 'youtube-setup-and-workflow',
    title: 'My YouTube Setup and Workflow'
  }
];

testData.forEach(({ slug, title }) => {
  test(`should load blog post "${slug}" and render heading correctly`, async ({ page }) => {
    const postUrl = `http://localhost:3000/posts/${slug}`;
    
    // Navigate to the blog post
    await page.goto(postUrl);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page title contains the site name
    await expect(page).toHaveTitle(/My Blog/);

    // Verify the main heading is rendered correctly
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();

    // Verify the page URL is correct
    expect(page.url()).toBe(postUrl);

    // Verify that the article container is present
    await expect(page.getByRole('article')).toBeVisible();
  });
});