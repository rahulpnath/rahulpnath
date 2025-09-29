#!/bin/bash

# Script to move misplaced images to their correct date-based folders
# Based on Ghost JSON export data

cd "$(dirname "$0")/public/content/images" || exit 1

echo "Moving images to correct date folders..."

# Function to move image if it exists
move_if_exists() {
    local filename="$1"
    local target_path="$2"
    
    if [ -f "$filename" ]; then
        echo "Moving $filename -> $target_path"
        mv "$filename" "$target_path"
    else
        echo "Skip: $filename (not found)"
    fi
}

# 2022 images
move_if_exists "AWS-Lambda-Function-URLs-Auth.png" "2022/10/"
move_if_exists "AWS-Lambda-Function-URLs.png" "2022/10/"
move_if_exists "us.jpg" "2022/10/"

# 2023 images
move_if_exists "NServiceBus-on-AWS-SQS.png" "2023/01/"
move_if_exists "DynamoDB-Querying-new.png" "2023/02/"
move_if_exists "Lambda-Lifecycle-2.png" "2023/02/"
move_if_exists "DynamoDB-Custom-Converters.png" "2023/03/"
move_if_exists "DynamoDB-Pagination.png" "2023/03/"
move_if_exists "DynamoDB-Projection-Expressions.png" "2023/03/"
move_if_exists "DynamoDB-Condition-Expressions.png" "2023/04/"
move_if_exists "NServiceBus-Events-on-AWS-SQS--1-.png" "2023/04/"
move_if_exists "Rate-Exceeded.png" "2023/04/"
move_if_exists "AWS-Lambda.png" "2023/05/"
move_if_exists "DynamoDB-Optimistic-Locking.png" "2023/05/"
move_if_exists "Amazon-DynamoDB.png" "2023/06/"
move_if_exists "DynamoDB-GSI.png" "2023/06/"
move_if_exists "DynamoDB-LSI.png" "2023/06/"
move_if_exists "DynamoDB-UpdateItem-vs-Put.png" "2023/06/"
move_if_exists "Rider---Mock-Lambda-Tool.png" "2023/06/"
move_if_exists "DynamoDB-Sparse-Index.png" "2023/07/"
move_if_exists "DynamoDB-Table-Name-Conventions.png" "2023/07/"
move_if_exists "DynamoDBContext-Indexes.png" "2023/07/"
move_if_exists "DynamoDB-BatchDelete.png" "2023/08/"
move_if_exists "DynamoDB-BatchGet.png" "2023/08/"
move_if_exists "DynamoDB-BatchWrite.png" "2023/08/"
move_if_exists "Lambda-Annotation-Framework---CRUD.png" "2023/08/"
move_if_exists "Lambda-Annotation-Framework---Introduction.png" "2023/08/"
move_if_exists "Lambda-Annotation-Framework---DI.png" "2023/09/"
move_if_exists "Add-To-Apple-Wallet.png" "2023/10/"
move_if_exists "Apple-Wallet-Push-Notifications.png" "2023/10/"
move_if_exists "Lambda-Function-JetBrains-Rider---Deploy.png" "2023/10/"
move_if_exists "Lambda-Function-JetBrains-Rider.png" "2023/10/"
move_if_exists "Powertools---Tracing.png" "2023/10/"
move_if_exists "scheduling-tasks-lambda.png" "2023/10/"
move_if_exists "Lambda-Annotations-and-AWS-Services.png" "2023/11/"
move_if_exists "Powertools---Idempotency.png" "2023/11/"
move_if_exists "Powertools---Logging.png" "2023/11/"
move_if_exists "Powertools---Metrics.png" "2023/11/"
move_if_exists "DynamoDB-TTL.png" "2023/12/"

# 2024 images
move_if_exists "_Powertools---Batch.png" "2024/01/"
move_if_exists "Powertools---Parameters.png" "2024/01/"
move_if_exists "rabbit-mq-dotnet.png" "2024/01/"
move_if_exists "_RabbitMQ---ACK.png" "2024/02/"
move_if_exists "RabbitMQ---Exchange.png" "2024/02/"
move_if_exists "RabbitMQ---Message-Dispatching.png" "2024/02/"
move_if_exists "Cancellation-Token-Practices-2.png" "2024/03/"
move_if_exists "Cancellation-Token.png" "2024/03/"
move_if_exists "RabbitMQ---Direct-Exchange.png" "2024/03/"
move_if_exists "RabbitMQ---Fanout-Exchange.png" "2024/03/"
move_if_exists "RabbitMQ---Topic-Exchange.png" "2024/04/"
move_if_exists "RABBITMQ-1.png" "2024/04/"
move_if_exists "http-files.png" "2024/06/"
move_if_exists "AsyncEnumerable--2-.png" "2024/07/"
move_if_exists "EC2-ASP-NET.png" "2024/07/"
move_if_exists "ECS-ASP-NET.png" "2024/07/"
move_if_exists "Enable-S3-Versioning.png" "2024/07/"
move_if_exists "Stream-Zip-Files-in-ASP-NET.png" "2024/07/"
move_if_exists "Beanstalk---AWS-Toolkit--1-.png" "2024/08/"
move_if_exists "Cancel-Button-Trap.png" "2024/08/"
move_if_exists "DynamoDB-Transactions-2.png" "2024/08/"
move_if_exists "Health-Checks-1.png" "2024/08/"
move_if_exists "RDS-SQL-Server--1-.png" "2024/08/"
move_if_exists "MassTransit---RabbitMQ.png" "2024/09/"
move_if_exists "MassTransit-RabbitMQ-Queue-Topology.png" "2024/09/"
move_if_exists "RabbitMQ-2.png" "2024/09/"
move_if_exists "C--Yield-Statement.png" "2024/10/"
move_if_exists "Copy-of-Amazon-S3-Versioning.png" "2024/10/"
move_if_exists "AWS-CDK.png" "2024/11/"
move_if_exists "AWS-Message-Processing-Fwk--1-.png" "2024/11/"
move_if_exists "CDK-LocalStack.png" "2024/11/"
move_if_exists "DynamoDB-Zero-ETL.png" "2024/11/"
move_if_exists "Lambda-.NET-8.png" "2024/11/"
move_if_exists "LocalStack.png" "2024/11/"
move_if_exists "S3-Etags.png" "2024/11/"
move_if_exists "CDK---GitHub-Actions.png" "2024/12/"
move_if_exists "Dead-Letter-Queue.png" "2024/12/"

# 2025 images
move_if_exists "OpenSearch-.NET.png" "2025/01/"
move_if_exists "Lambda-SnapStart-For-You-.png" "2025/02/"
move_if_exists "Lambda-SnapStart.png" "2025/02/"
move_if_exists "AWS-S3-Presigned-URLs.png" "2025/03/"
move_if_exists "Cognito-User-Pools.png" "2025/08/"

echo "Image organization complete!"