---
author: [Rahul Nath]
title: "Rename SQL Table and Update Naming Conventions for Associated Keys and Constraints"
  
date: 2019-11-30
tags:
- Programming
---

At work, we usually [DbUp](https://dbup.github.io/) changes to SQL Server. We follow certain naming conventions when creating table constraints and Indexes. Here is an example 

``` sql
create table Product
(
  Id uniqueidentifier not null unique,
  CategoryId uniqueidentifier not null,
  VendorId uniqueidentifier not null,

  constraint PK_Product primary key clustered (Id),
  constraint FK_Product_Category foreign key (CategoryId) references Category (Id),
  constraint FK_Product_Vendor foreign key (VendorId) references Vendor (Id)
)

create index IX_Product_CategoryId on Product (CategoryId);
```

I had to rename a table as part of a new feature. I could have just renamed the table name and moved on, but I wanted all the constraints and indexes also renamed to match the name convention. I could not find any easy way to do this and decided to script it. 

*If you know of a tool that can do this, let know in the comments and stop reading any further* :smile:.

Since I have been playing around with F# for a while, I chose to write it in that. The SQL Server Management Objects (SMO) provides a collection of objects to manage SQL Server programmatically, and it can be used from F# as well. Using the [#I and #r](https://docs.microsoft.com/en-us/dotnet/fsharp/tutorials/fsharp-interactive/#differences-between-the-interactive-scripting-and-compiled-environments) directives, the SMO library path and DLL's can be referred.

``` FSharp
#I @"C:\Program Files\Microsoft SQL Server\140\SDK\Assemblies\";;
#I @"C:\Program Files (x86)\Microsoft SQL Server\140\SDK\Assemblies";;
#r "Microsoft.SqlServer.Smo.dll";;
#r "Microsoft.SqlServer.ConnectionInfo.dll";;
#r "Microsoft.SqlServer.Management.Sdk.Sfc.dll";;
```

The SMO object model is a hierarchy of objects with the Server as the top-level object. Given a server name, we can start navigating through the entire structure and interact with the related objects. Below is how we can narrow down to the table that we want to rename.

``` FSharp
let generateRenameScripts (serverName:string) (databaseName:string) (oldTableName:string) newTableName = 
    let server = Server(serverName)
    let db = server.Databases.[databaseName]
    let oldTable = db.Tables |> Seq.cast |> Seq.tryFind (fun (t:Table) -> t.Name = oldTableName)
```

SMO does allow generating scripts programmatically, very similar to how SSMS allows to right-click on a table and generate relevant scripts. The [ScriptingOptions](https://docs.microsoft.com/en-us/dotnet/api/microsoft.sqlserver.management.smo.scriptingoptions?view=sql-smo-140.17283.0) class allows passing in various parameters determining the scripts generated. Below is how I create the drop and create scripts.

``` FSharp
let generateScripts scriptingOpitons (table:Table) = 
    let indexes = table.Indexes |> Seq.cast |> Seq.collect (fun (index:Index) -> (index.Script scriptingOpitons |> Seq.cast<string>)) 
    let fks = table.ForeignKeys |> Seq.cast |> Seq.collect (fun (fk:ForeignKey) -> fk.Script scriptingOpitons |> Seq.cast<string>)
    let all = Seq.concat [fks; indexes]
    Seq.toList all

let generateDropScripts (table:Table) =
    let scriptingOpitons = ScriptingOptions(ScriptDrops = true, DriAll = true, DriAllKeys = true, DriPrimaryKey = true, SchemaQualify = false)
    generateScripts scriptingOpitons table

let generateCreateScripts (table:Table) =
    let scriptingOpitons = ScriptingOptions( DriAll = true, DriAllKeys = true, DriPrimaryKey = true, SchemaQualify = false)
    generateScripts scriptingOpitons table
```

For the create scripts, I do a string replace of the old table name with the new table name. The full gist is available [here](https://gist.github.com/rahulpnath/ffb2d67cf094d682c394faf11477323d). 

Below is what the script generated for renaming the above table from 'Product' to 'ProductRenamed'. This output can further be optimized, passing in the appropriate parameters to the ScriptingOptions class.

``` fsharp
let script = generateRenameScripts "(localdb)\\MSSQLLocalDB" "Warehouse" "Product" "ProductRenamed"
File.WriteAllLines (@"C:\Work\Scripts\test.sql", script) |> ignore
```

``` sql
ALTER TABLE [Product] DROP CONSTRAINT [FK_Product_Category]
ALTER TABLE [Product] DROP CONSTRAINT [FK_Product_Vendor]
DROP INDEX [IX_Product_CategoryId] ON [Product]
ALTER TABLE [Product] DROP CONSTRAINT [PK_Product] WITH ( ONLINE = OFF )
ALTER TABLE [Product] DROP CONSTRAINT [UQ__Product__3214EC065B6D1E82]
EXEC sp_rename 'Product', 'ProductRenamed'
ALTER TABLE [ProductRenamed]  WITH CHECK ADD  CONSTRAINT [FK_ProductRenamed_Category] FOREIGN KEY([CategoryId])
REFERENCES [Category] ([Id])
ALTER TABLE [ProductRenamed] CHECK CONSTRAINT [FK_ProductRenamed_Category]
ALTER TABLE [ProductRenamed]  WITH CHECK ADD  CONSTRAINT [FK_ProductRenamed_Vendor] FOREIGN KEY([VendorId])
REFERENCES [Vendor] ([Id])
ALTER TABLE [ProductRenamed] CHECK CONSTRAINT [FK_ProductRenamed_Vendor]
CREATE NONCLUSTERED INDEX [IX_ProductRenamed_CategoryId] ON [ProductRenamed]
(
  [CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
ALTER TABLE [ProductRenamed] ADD  CONSTRAINT [PK_ProductRenamed] PRIMARY KEY CLUSTERED 
(
  [Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
ALTER TABLE [ProductRenamed] ADD UNIQUE NONCLUSTERED 
(
  [Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
```
One thing that is missing at the moment is renaming foreign key references from other tables in the database to this newly renamed table. The FSharp code is possible not at its best, and I still have a lot of influence from C#. If you have any suggestions making better sound off in the comments

Hope this helps and makes it easy to rename a table and update all associated naming conventions.
