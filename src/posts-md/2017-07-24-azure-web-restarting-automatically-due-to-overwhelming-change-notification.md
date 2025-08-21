---
title: Azure Web App Restarting Automatically Due to Overwhelming Change Notification
slug: azure-web-restarting-automatically-due-to-overwhelming-change-notification
date_published: 2017-07-24T00:00:00.000Z
date_updated: 2017-07-24T00:00:00.000Z
tags: Azure, Programming
excerpt: Explore how the fcnMode setting and changes to files within wwwroot can cause application restarts.
---

At one of my clients, we faced a strange issue recently. The Azure Web application restarted automatically very often. The event log in the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console) showed the below error message.

> *2017-07-13 00:09:50,333 [P45516/D4/T171] INFO Umbraco.Core.UmbracoApplicationBase - Application shutdown. Details: HostingEnvironment*

> *_shutDownMessage=Directory rename change notification for 'D:\home\site\wwwroot'.*
> *Overwhelming Change Notification in wwwroot*
> *HostingEnvironment initiated shutdown*
> *Directory rename change notification for 'D:\home\site\wwwroot'.*
> *Overwhelming Change Notification in wwwroot*
> *Initialization Error*
> *HostingEnvironment caused shutdown*

As you can tell from the logs, the website is an [Umbraco](https://umbraco.com/) CMS hosted as an Azure Web application. We noticed that the restarts were happening more when the content was getting updated through [backoffice](https://our.umbraco.org/documentation/getting-started/backoffice/). The error also states that the restart was caused due to *Overwhelming Change Notification in wwwroot*. This hints that there are changes that are happening under the wwwroot folder, where the site is hosted.

Even though this post details on why the specific site on Umbraco was restarting, most of the contents are still applicable for any other ASP.NET MVC application.

## fcnMode Configuration

A quick search got me to the [fcnMode](https://msdn.microsoft.com/en-us/library/system.web.configuration.httpruntimesection.fcnmode(v=vs.110).aspx)setting under [httpRuntime](https://msdn.microsoft.com/en-us/library/system.web.configuration.httpruntimesection(v=vs.110).aspx) section. An ASP.net application monitors certain files and folders under the wwwroot folder and will restart the application domain whenever it detects changes. This likely look looks the reason why the web site is restarting.

The [fcnMode enumeration](https://msdn.microsoft.com/en-us/library/system.web.configuration.fcnmode(v=vs.110).aspx) can take one of the four values below. For an Umbraco application this is by [default set to *Single*](http://issues.umbraco.org/issue/U4-7712).

- **Default**: For each subdirectory, the application creates an object that monitors the subdirectory. This is the default behavior.
- **Disabled**: File change notification is disabled.
- **NotSet**: File change notification is not set, so the application creates an object that monitors each subdirectory. This is the default behavior.
- **Single**: The application creates one object to monitor the main directory and uses this object to monitor each subdirectory.

    <system.web>
        ...
        <httpRuntime
            requestValidationMode="2.0"
            enableVersionHeader="false"
            targetFramework="4.5"
            maxRequestLength="51200"
            fcnMode="Single" />
        ...
    <system.web>
    

> *FCNMode creates a monitor object with a buffer size of 4KB for each folder. When FCNMode is set to Single, a single monitor object is created with a buffer size of 64KB. When there are file changes, the buffer is filled with file change information. If the buffer gets overwhelmed with too many file change notifications an “Overwhelming File Change Notifications” error will occur and the app domain will recycle. The likelihood of the buffer getting overwhelmed is higher in an environment where you are using separate file server because the folder paths are much larger.*

> -[ ASP.NET File Change Notifications and DNN](http://www.dnnsoftware.com/community-blog/cid/154980/aspnet-file-change-notifications-and-dnn)

You can read more about fcnMode setting and how it affects ASP.Net applications [here](https://shazwazza.com/post/all-about-aspnet-file-change-notification-fcn/).

## What's causing file changes?

Default reaction when you come across such a setting or configuration value might be to turn that off and fcnMode does allow that as well - *Disabled*. But first, it is better that we understand what is causing file changes under the wwwroot folder and see if we can address that. The [FCN Viewer](https://shazwazza.com/post/fcn-file-change-notification-viewer-for-aspnet/) helps visualize how many files and folders are being watched in as ASP.Net application.

In the Umbraco website, we are using a third party library [ImageProcessor](http://imageprocessor.org/) that helps to process images dynamically. The ImageProcessor caches images and the [cache location is configurable](http://imageprocessor.org/imageprocessor-web/configuration/#cacheconfig). By default, it caches files under the App*Data/cache folder, which also happens to be one of the folders that the ASP.Net application monitors for changes. So anytime there are lots of files changing in the cache folder it causes the single monitor object monitoring the folders. This causes a buffer overflow and triggers an application restart due to _Overwhelming file change notifications*. However, ImageProcessor does allow moving the [cache folder outside of the wwwroot folder](https://github.com/JimBobSquarePants/ImageProcessor/issues/518). This causes the file not to be monitored and still work fine with the application. Since the [library does not create the cache folder automatically](https://twitter.com/Shazwazza/status/885770960321773568), we need to make sure that the folder specified in the config file exists.

Having moved the cache folder outside of the wwwroot, I no longer need to update the fcnMode setting and can leave it as intended. If you are facing application restarts as well due to overwhelming change notification in wwwroot see what is likely causing the file changes and then try and fix that instead of just setting the fcnMode to disabled.

Hope that helps fix your application restarting problem!
