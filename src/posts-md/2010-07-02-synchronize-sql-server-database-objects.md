---
title: Synchronize SQL Server database objects
slug: synchronize-sql-server-database-objects
date_published: 2010-07-01T15:41:00.000Z
date_updated: 2010-07-01T15:41:00.000Z
tags: Dotnet, Tools
---

![Database Synchronization](__GHOST_URL__/content/images/database_sync.jpg)
Updating an old database, with newly created/modified database objects(mostly stored procedures,views,functions and table value parameters), from a new database was a very common,tedious,error prone task that was performed at my workplace for the past few months.This came up with the client requesting to retain their existing data and just make updates to their old database from our development database(which of course is the new/latest one), whenever a deliverable was made.
When the very work I do is to automate peoples work,I felt perturbed seeing this being done manually.So decided on to automate it :)
Writing SQL scripts would be db expert way I guess.But I am no expert in that so decided to do it in my way.
The .Net way :)
Thanks to the whole concept of .Net and Microsoft for having exposed such complex functionalities in the most elegant way ..... [SMO](http://msdn.microsoft.com/en-us/library/ms162169.aspx)(SQL Server Management Objects).
You have to add a reference to Microsoft.SqlServer.Smo and a few other assemblies(Check the source code for more details).
Rest everything the API provides.

Code quality might not be that good.Just did it in an hour :)
A help is there within the app.

Thanks to .Net once more :)
