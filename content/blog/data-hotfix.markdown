---
author: [Rahul Nath]
title: 'Data Hotfix : Things to Remember'
  
tags:
  - Programming
date: 2016-08-25 04:27:32
keywords:
description: A retrospective into a recent data hotfix that I did.
thumbnail: ../images/data_hotfix.jpg
---

Yesterday I was late to leave office as I had to data fix some of the systems that we are currently building. We had just migrated few hundred clients onto the new platform. Invoices generated for the clients had wrong invoice amounts due to some mismatching data used when migrating. We had the expected invoice from the old system which made finding the problem easy. We ran a few scripts to correct the data in different systems and fixed the issue.

[![Data Hotfix](../images/data_hotfix.jpg)](http://static1.squarespace.com/static/54652521e4b0045935420a6c/t/548dee03e4b0f1b25cb560d5/1418587652009/Data.jpg?format=1500w)

<div class="alert alert-warning">
<strong>WARNING!</strong> Normally I do not recommend making any changes directly in production server. In this case, there was a business urgency and was forced to do the data fix the same night, for smooth functioning the day after. We still managed to get in some testing in the development environment before running it in production.
</div>

## It All Starts with a Few

I have seen it repeatedly happen that this kind of data fixes starts with a few in the beginning. Within a short span of time the affected data size grows drastically and manual updates might not be a good solution.

> _If you get a second thought of whether to script the fix or not, then you should script it._

Yesterday it started with data fix for 30 clients and the fix was relatively small. It could either be through UI or API. Fix through the UI took around 45 seconds each, and there were two of us. So it was just a matter of 12-15 minutes to fix it. While fixing, one of us found an extra scenario where the same fix needs to be applied. Re-running the query to find such clients bombarded the number to 379. At this moment, I stood up and said _I am going to script this. There is no way I am doing this manually._ Manually fixing this would take five man hours, but will finish in two and half hours, as there were two of us. Even writing the script is going to take around an hour but that's just one man hour.

> _There is happiness you get when you script the fix and not manually plow through the UI fixing each of them_

The script was in C#, written as a test case, invoked from a test runner (which I don't feel great about now) updating the systems with the data fix. It did its job and fixed all the cases it was supposed to. But I was not happy with the approach that I had chosen to make the fix. Correcting production data through a unit test script does not sound a robust solution. The reason to choose tests was that the test project had all the code required to access the other systems. It was just about changing the configuration values to point to the production system. It was the shortest path to having at least one client updated and verified.

Having it as a test script restricted me from scaling the update process (though I could have done some fancy things to [run tests in parallel](https://xunit.github.io/docs/running-tests-in-parallel.html)). It also forced me to hard-code the input data.Logging was harder and I used [Debug.WriteLine](https://msdn.microsoft.com/en-us/library/system.diagnostics.debug.writeline(v=vs.110\).aspx) to the VS output window. All those were the aftermath of choosing the wrong execution method - running it as a test script!

In retrospective, here are a few things that I should have done different and should be doing if ever I am in a similar situation again.

### **Create Stand-alone Executable**

Having a stand-alone executable running the script provides the capability to scale the number of processes as I wanted. Input can be passed as a file or as an argument to the application allowing to break the large data set into smaller subsets.

### **Log Error and Success**

It's very much possible that the 'fix-to-fix errors' can go wrong or throw exceptions. So handle for errors and log appropriate message to take any corrective actions. It's better to log to a file or other durable storage as that is more foolproof. Logging to the output window (Debug.Writeline/Console.Writeline) is not recommended, as there is a risk of accidentally losing it (with another test run or closing VS).

Logging successes are equally important to keep track of fixed records. It helps in cases where the process terminates suddenly while processing a set of data. It gives a track of all data sets that were successfully processed and exclude from following runs.

### **Test**

It is very likely that the script has bugs and does not handle all possible cases. So as with any code, testing the data fix script is also mandatory. Preferably, test in a development/test environment, if not try for a small subset of input in the production. In my case, I was able to test in the development environment and then in production. But still, I ran a small subset in production first and ended up finding an issue that I could not find in development.

### **Parallelize if Possible**

In cases where the data fixes are independent of each other (which likely is when dealing with large data fixes), each of the updates can be in parallel. Also using nonblocking calls when updating across the network helps speed up the process, by reducing the idle time and improves the overall processing time.

### **Parameterize Input**

Parameterizing of input to the script (console) application helps when you want to scale the application. In my case updating each of the clients took around 8-10 seconds as it involved calling multiple geographically distributed systems. (Updating a system in the US from Australia does take a while!). Having a parameterized application enables to have multiple applications running with different input sets updating the data and speeds up the overall processing time.

It's hard to come up with a solid plan for critical data fixes. It might not be possible to follow all of the points above. Also, there might be a lot other things to be done other than these. These are just a few things for reference so that I can stop, take a look and move on when a similar need arises. Hope this helps someone else too! Drop in a comment if you have any tips for the 'eleventh hour' fix!
