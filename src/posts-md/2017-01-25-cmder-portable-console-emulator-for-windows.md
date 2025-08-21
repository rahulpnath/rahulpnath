---
title: "Tip of the Week: Cmder - Portable Console Emulator for Windows"
slug: cmder-portable-console-emulator-for-windows
date_published: 2017-01-25T00:00:00.000Z
date_updated: 2024-11-28T03:46:07.000Z
tags: Productivity, Tools
---

I have been using Cmder as my command line for around two years and been loving it. I am not a super user of the command line, but try to use it more and more.

> *Cmder is a software package created out of pure frustration over the absence of good console emulator on Windows. It is based on ConEmu with major config overhaul, comes with a Monokai color scheme, and a custom prompt layout.*

This is not right with Windows 10, as there is a new command prompt which has a lot more features. I have not yet thought of moving to that as Cmder has been working well for me.

## **Installation and setting up**

Cmder is open source and free to download from [Cmder.net](http://cmder.net/). One of the advantages of Cmder is its portability. You can carry it with you on a USB stick or in the Cloud, so all your settings can go anywhere you go. Installation is simple, all you need to do is download the latest release, extract the archive and run Cmder executable. Check out the documentation if you face any difficulties.

### **Features I Like**

Able to ***paste into the console using the Windows shortcut Ctrl + V*** is one of the key things that got me started with this command line tool. It also supports most of the other text traversal keyboard shortcuts of Windows.

Cmder supports ***multiple console tabs within a window***. Tabs makes having multiple consoles open and managing them easy. All tab manipulation has associated keyboard shortcuts making it even faster. When creating a new tab, using Ctrl + T, you can choose to run different predefined tasks on command line startup. You can also set the user and user rights to run them as. Setting up the predefined tasks is under Settings -> Startup->Tasks. I have added ***custom tasks*** for PowerShell, and Visual Studio developer command prompt as that is what I use mostly.

``` text // Powershell Administrator Task *PowerShell -ExecutionPolicy Bypass -NoLogo -NoProfile -NoExit -Command "Invoke-Expression '. ''%ConEmuDir%\..\profile.ps1'''" -new_console:d:"%USERPROFILE%" ```

    // Visual Studio Developer Prompt Task
    cmd /k ""%ConEmuDir%\..\init.bat" &
    "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\Tools\VsDevCmd.bat""
    -new_console:d:%USERPROFILE%
    

***Alias*** is one of the key features that keeps me to Cmder. You can create short commands to map to longer commands. Aliases avoid typing long commands every time you want to perform that action. You can see all existing aliases by running alias command. I use this feature a lot. Most of the git commands are aliases, so I do not have to type them every time. For e.g., when on a git repository I can type *gs* to run git status. You can also pass arguments to alias. To do a git commit with a message I run *gc The commit message*. Aliases support optional parameters through the $1-9 or the $*.

To define a alias *alias gs=git status*. Below are some of the alias examples.

    gl=git log --oneline --all --graph --decorate  $*
    gs=git status
    ga=git add -A
    gc=git commit -m "$*"
    gcb=git checkout -b $*
    gpsu=git push --set-upstream origin $*
    

Check out the [video](https://www.youtube.com/watch?v=fpxx8hlNTzc) for a walk-through of the setup and its usage. Cmder allows to get things done fast and looks great. Try it out to see if it works for you.
