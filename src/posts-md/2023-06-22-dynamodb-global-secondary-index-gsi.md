---
title: "Exploring Global Secondary Index: Advanced Querying in DynamoDB From .NET"
slug: dynamodb-global-secondary-index-gsi
date_published: 2023-06-21T20:01:27.000Z
date_updated: 2025-01-09T19:18:21.000Z
tags: AWS, DynamoDB
excerpt: Learn how to create, set up and use a Global Secondary Index (GSI) in DynamoDB for more efficient data access and optimizing cost.
---

*This article is sponsored by AWS and is part of my [AWS Series](__GHOST_URL__/tag/aws/).*

Amazon DynamoDB provides fast access to items in a table by specifying primary key values.

However, applications often require accessing data using alternate keys as well. In these cases, defining a second set of keys, a Secondary Index, is advantageous and beneficial to enable data access.

DynamoDB supports two types of secondary indexes - Global Secondary Index (GSI) and Local Secondary index (LSI).

In this post, I’ll show you 

- Create a Global Secondary Index
- Phases of Index Creation
- Query data using the Index
- Things to consider when creating a Global Secondary Index.

*The sample code below is on the `WeatherForecast` table, which has `CityName` and `Date` as the hash and range key, respectively.*

If you are new to DynamoDB, I highly recommend checking out my Getting Started with AWS DynamoDB For the .NET Developer blog post below, where I also show you how to set up the table used in this blog post.
[

AWS DynamoDB For The .NET Developer: How To Easily Get Started

Learn how to get started with AWS DynamoDB with .NET Core by updating the default ASP NET Web API template to use DynamoDB as it’s data store. We will learn to do basic Creat, Read, Update and Delete operations from the API.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/aws_dynamodb.jpg)
](__GHOST_URL__/blog/aws-dynamodb-net-core/)
## Create a DynamoDB GSI

You can create a Global Secondary Index (GSI) on a new or an existing table. 

GSI can be created from the AWS Console and also programmatically. Below I'll show you how to create a GSI using the AWS Console.

### GSI On a New Table

When creating a new DynamoDB table in the AWS Console, choose the `Customize settings` options. This allows configuring advanced features on the DynamoDB table, including creating GSI.
![Create Table UI in Amazon AWS Console. Select Customize settings options to create GSI along with creating your DynamoDB Table.](__GHOST_URL__/content/images/2023/06/image-3.png)
Selecting the `Customize settings` option, enable the Secondary Indexes dialog as you scroll down in the advanced setting options. 

You can create both Global and Local indexes on the table.
![Create Secondary Index option in AWS Console. You can create Global and Local Index when creating the table.](__GHOST_URL__/content/images/2023/06/image-4.png)
The `Create global index` button opens a popup with the details for the GSI. 

The important properties required when creating a GSI on a DynamoDB Table, are the Partition Key and the Sort Key (optional) for the Index. 

This is very similar to when creating a DynamoDB table.
![Create GSI dialog which prompty for Partition key, Sort key, Index name and also the Attribure projections.](__GHOST_URL__/content/images/2023/06/image-5.png)
You can specify a name for the Index and also the [Attributes to be projected into the Index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html#GSI.Projections). It provides three options.

- *KEYS_ONLY* –  Only the index and the primary keys are projected.
- *INCLUDE* – All attributes from `KEYS_ONLY` and attributes you specify additionally.
- *ALL* – All attributes are projected. 

Based on the option selected, the set of attributes is copied from the main table to the secondary index. The partition key and sort key of the table are always projected into the Index.

### GSI On an Existing Table

Creating a GSI Index is very similar when on an existing DynamoDB table.

Navigate to the DynamoDB table in the AWS Console and under the `Index` tab, you can create a new Index. 

You can only create a Global Secondary Index on an existing table. You cannot create a Local Secondary Index once the table is created.
![Creating a GSI on existing table from the 'Indexes' tab under the table details in AWS Console.](__GHOST_URL__/content/images/2023/06/image-8.png)
Choose the `Create index` button for the same dialog to create the GSI on an existing table. 
![Create GSI popup with the same required details as when creating on a new table.](__GHOST_URL__/content/images/2023/06/image-6.png)

❌

*Once a Secondary Index is created, you cannot modify it. You need to delete and recreate it.*

### Phases of Index Creation

The time required to create a GSI depends on several factors, including the size of the table, the number of items qualified to be on the index, attributes projected into the index, write capacity of the index, activity on the main table while the index creation is in progress, etc.

However, the main table also called the base table, is still available while the index creation is in progress. Index creation happens in 2 phases:

- **Resource Allocation **- DynamoDB allocated the specified compute and storage resources required for the Index.
- **Backfilling **- For each item in the base table, DynamoDB backfills the Index with the required data based on the new keys and the attributes projected. DynamoDB also tracks the base table for active add/update/delete to update the Index appropriately. You can delete the Index if required when in this phase.

You can read more about these [phases in index creation here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.OnlineOps.html#GSI.OnlineOps.Creating.Phases). 

## Querying Data Using GSI Index

Once the Index is created and active, you can use it to query the data using the new sets of keys. Based on the Attributes projected into the Index, you can either query all those or a subset of them. 

We learned more about that in How to Optimize Your DynamoDB Queries With Projection Expressions in .NET.
[

How to Optimize Your DynamoDB Queries With Projection Expressions in .NET

When reading data from a DynamoDB table, by default, it returns all of the attributes of the items. However, in some application scenarios, you might only require a subset of the attributes of the items. In these scenarios, you can use a ProjectionExpression to limit the item attributes returned a…

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2023/03/DynamoDB-Projection-Expressions.png)
](__GHOST_URL__/blog/dynamodb-projection-expressions/)

💡

*You can query or scan the GSI just like you would query or scan a table.*

### Querying using AWS Console

You can use the GSI from the AWS Console itself to query data from the Index. As shown below in the screenshot, choose the Index that you want to query/scan on and specify the appropriate partition key on the Index.
![](__GHOST_URL__/content/images/2023/06/image-9.png)
You can only get the attributes that are projected into the Index, as specified when creating the Index. 

If you want more attributes retrieved, you can use the primary keys for the base table and load the specific item. This pattern is useful when you want to show a list view of data with reduced information (based on a different access pattern) and click into it to load further details.

### Querying using DynamoDB GSI and .NET

You can use the Index when querying data from .NET applications. 

To use Index based querying, you need to use the Low-Level API provided in the .NET SDK. We learned more about this in the 5 Ways To Query Data From Amazon DynamoDB using .NET blog post.
[

5 Ways To Query Data From Amazon DynamoDB using .NET

Querying is an essential operation in DynamoDB. It allows you to filter and select items in your database based on your application and user needs. When moving over to DynamoDB from more traditional relational databases like SQL Server, you must understand the different ways you can retrieve data…

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2023/02/DynamoDB-Querying-new.png)
](__GHOST_URL__/blog/dynamodb-querying-dotnet/)
Using the `IAmazonDynamoDB` and the `QueryAsync` method you can specify the `IndexName` on the `QueryRequest` class. 

With that specified the rest of the properties are exactly as you would query a normal DynamoDB table. 

    [HttpGet("gsi-query")]
    public async Task<IEnumerable<WeatherForecastListItem>> GetUsingGSIQuery(DateTime startDate)
    {
        var request = new QueryRequest()
        {
            TableName = nameof(WeatherForecast),
            IndexName = "Date-CityName-index",
            KeyConditionExpression = "#Date = :startDate",
            ExpressionAttributeNames = new Dictionary<string, string>()
            {
                {"#Date", "Date"}
            },
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>()
            {
                {":startDate", new AttributeValue(startDate.ToString(AWSSDKUtils.ISO8601DateFormat))},
            },
        };
    
        var response = await _amazonDynamoDbClient.QueryAsync(request);
    
        return response.Items
            .Select(Document.FromAttributeMap)
            .Select(_dynamoDbContext.FromDocument<WeatherForecastListItem>);
    }

Keep in mind that the query will only return the attributes that are projected into the Index or as specified in the `ProjectionExpression` property.

You can also perform pagination on the Index to load only specific pages of information as required by the application.
[

3 Different Ways To Do Data Pagination from Amazon DynamoDB Using .NET

DynamoDB charges for reading, writing, and storing data in your DynamoDB tables. As a rule of thumb, when querying data, you can consider that each record that you retrieve from the database has a direct cost attached to it. Limiting the items you retrieve has a direct impact on saving

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/2023/03/DynamoDB-Pagination.png)
](__GHOST_URL__/blog/dynamodb-pagination/)
## Designing DynamoDB GSI

To ensure efficient and optimal query performance, you need to design the schema of your GSI carefully.

Each DynamoDB table can have up to 20 GSI on the default quote. But keep in mind there is also a cost attached to the creation and the usage of the Index.

When creating a DynamoDB Global Secondary Index (GSI), consider the following guidelines:

1. **Keep the number of GSIs in check**: Avoid excessive GSIs to prevent increased storage costs and write performance degradation.
2. **Plan partition and sort keys**: Design the GSI partition key to distribute data evenly and choose a sort key that helps in query filtering and sorting operations.
3. **Choose appropriate attribute projections**: Select only the attributes that are frequently used in queries. This helps keep a smaller index size and get all attributes you expect quickly.
4. **Consider read/write capacity**: Allocate read and write capacity based on the expected workload of the GSI to ensure optimal performance.

Remember to analyze your application's requirements and data access patterns to make informed decisions while creating a DynamoDB GSI.

The below two articles provide good guidance on designing DynamoDB GSI.

- [General guidelines for secondary indexes in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html)
- [How to design Amazon DynamoDB global secondary indexes](https://aws.amazon.com/blogs/database/how-to-design-amazon-dynamodb-global-secondary-indexes/)
