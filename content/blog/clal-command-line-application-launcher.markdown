---
author: [Rahul Nath]
title: 'CLAL - Command Line Application Launcher'
  
tags:
  - Tools
date: 2016-04-07 06:11:22
keywords:
description:
thumbnail: ../images/clal.png
---

CLAL (Command Line Application Launcher) is a desktop application to launch any (currently supports only SQL Server Management Studio - [ssms](https://msdn.microsoft.com/en-us/library/ms162825.aspx)) command line application. It helps manage different configurations with which a command line application can be launched - such as different connection strings to various databases.

** [Install the latest version here](http://bit.ly/1REGiFT) **

CLAL allows you to first specify the meta data of the command line application first and then create the various configurations for that by filling in the parameters as specified in the metadata. Currently since this only supports _ssms_, the metadata edit screen is not present and is hard coded into the application. The image below shows the various database servers that I connect to, and CLAL helps me reach them quickly

<img class="center" alt="Command Line Application Launcher" src="../images/clal.png" />

Use the '_Add Configuration_' button to add a new configuration. You can specify a _Friendly Name_ for the configuration and then fill in the other details required by the command line. Alternatively for _ssms_ you can also paste in a connection string and have all the fields automatically populated.

<img class="center" alt="Command Line Application Launcher" src="../images/clal_new.png" />

Once new configuration is saved you can launch the application with the specified configuration either using the _Launch_ button or double click on the configuration name in the list.

> _Work in progress to support other command line applications and to update the look and feel._

[**Contribute**](https://github.com/rahulpnath/clal/issues) to the development by coding or reporting issues that you find file using the application. [Check out these articles](/blog/category/clal/) for my learnings while building this application.

**Credits**

[Icons/Logo](https://github.com/rahulpnath/clal/tree/master/Resources): [Rosh TS](https://twitter.com/RoshTS)
