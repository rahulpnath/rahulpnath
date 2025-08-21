---
title: Setting up the Development Environment for PhoneGap on Android
slug: setting-up-the-development-environment-for-phonegap-on-android
date_published: 2014-03-04T05:49:22.000Z
date_updated: 2024-11-28T02:15:09.000Z
tags: Programming
---

I have been working on Microsoft stack for over a long time, in fact almost my entire career. Now that with all the platforms out there and cross platform being a very important factor in any application development, knowing about other platforms and developing for them is very important . Since I have had some prior experience on Java, I thought of ramping back on it so that I could also explore the Android operating system.

Setting up Java and choosing an [IDE](http://en.wikipedia.org/wiki/Integrated_development_environment) was always confusing for me and so is it now. For .Net it was, is and always will be [Visual Studio](http://www.visualstudio.com/) and the setup experience is seamless. For a person in the .net world moving into java would take some time in setting up the environment, and getting used to the IDE’s. Personally I feel that none of the java IDE’s matches the experience and features provided by Visual Studio - but that might be just me. But lets be happy with what we have and start setting up our development environment.

- **Download** the [Java SDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html). I have chosen to download the latest one as on writing this blog, as I did not have any reason not to. If you have a specific need to have a particular java version then you should get that. Install it into the appropriate location (e.g. *C:\Program Files\java\jdk1.7*)
- **Set JAVA_HOME** in the system environment variables. Right Click on MyComputer –> Properties –>Advanced System Settings –> Environment Variables Under System Variables, add a new variable by clicking New and entering *Variable Name _as JAVA_HOME and _Variable value* as the path to the root jdk folder installed in previous step.(*C:\Program Files\java\jdk1.7*). Save the changes. To see if this has been saved you can verify by opening a command prompt and typing in _echo %JAVA_HOME%, _which should echo out the path set above.
- Update **PATH **to include java path too, so that this can be executed from anywhere, without knowing the full path of the java compiler. Under system variables there would already be a variable with name *path *(if not add it), to which you can append the java path. Java is in the bin folder under the root folder, so append “*;%JAVA_HOME%/bin;*” to the path variable. Save and close. To check if this is successfully setup, open up command prompt and type in java. You should see usage information help for java.
- **Installing ANT. **Download [ant library](http://ant.apache.org/) and copy/install into a suitable location. Ant is used in the build of java applications and is more comparable to msbuild in .net.
- Set **ANT_HOME **and** PATH **like we set for Java. Should be easy for you now.
- Download and install [Android SDK](http://developer.android.com/sdk/index.html).
- Set **ANDROID_HOME **to the android sdk root folder.
- Set **PATH **for android tools(*%ANDROID_HOME%\tools;*) and platform-tools*(%ANDROID_HOME%\platform-tools;*)
- **Download an IDE**. [Eclipse](https://www.eclipse.org/downloads/), [IntelliJ Community Edition](http://www.jetbrains.com/idea/) , [Android Studio](http://developer.android.com/sdk/installing/studio.html) are all freely available IDE’s that you can choose from. Android studio is based on IntelliJ IDEA. I chose to use IntelliJ for now for no specific reason.

Now you are all setup for starting your development with PhoneGap on Android . Hope this helps you to quick start your development.
