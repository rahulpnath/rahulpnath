---
author: [Rahul Nath]
title: 'Setting up AutoHotkey to Speed up Trivial Tasks'
tags:
  - Productivity
  - Tools
date: 2016-02-09 04:22:03
keywords:
description:
thumbnail: ../images/ahk_task_general.png
---

A lot of trivial tasks that we do daily on our computer can be automated to make it faster and reduce the number of keystrokes ([as they are limited](http://www.keysleft.com)). [AutoHoykey](https://autohotkey.com/)(AHK) is an excellent tool to automate a lot of these and is [one of my favorite tool](/blog/tools-that-I-use/). I use a very limited set of functionality of AHK, to set up hot strings, launch applications, and mapping caps lock as backspace. The installer to the latest version is available [here](https://autohotkey.com/download/ahk-install.exe).

> "AutoHotkey (AHK) is a free, open-source macro-creation and automation software for Windows that allows users to automate repetitive tasks. It is driven by a scripting language that was initially aimed at providing keyboard shortcuts, otherwise known as hotkeys, that over time evolved into a full-fledged scripting language."

**Hotstrings** are to map short key combinations that expand on completion. This one is to handle all common phrases, words like emails, default mail replies, etc. Defining a hotstring is as shown below or look up the [documentation here](https://autohotkey.com/docs/Hotstrings.htm) for more details

```text
::emg::rahulpnath@gmail.com
::myn::Rahul P Nath
::myb::http://www.rahulpnath.com
```

You can use some easy to remember keywords for these like emg means 'Email Gmail' and myn means 'My Name' etc.

**Hot keys** are to launch applications on those key combinations. You can use this to launch your favorite applications with the key combinations of your choice. Defining hot keys is as shown below or look up the [documentation here](https://autohotkey.com/docs/Hotkeys.htm) for more details

```text
^!C::
Run "C:\Users\rahulpnath\Documents\Apps\cmder\Cmder.exe"
return
```

**Capslock to Backspace** mapping is something that I got inspired from the [Colemak layout](http://colemak.com/) and find it useful even with the QWERTY layout. I use the [Send](https://autohotkey.com/docs/commands/Send.htm) command to send simulated keystrokes. In the rare case of actually needing the CapsLock key, I just need to press it along with Shift to toggle on and off.

```text
CapsLock:: Send {BackSpace}
```

#### **Running AHK scripts on startup**

To automatically run these scripts on startup, I use the [Task Scheduler](http://windows.microsoft.com/en-au/windows/schedule-task#1TC=windows-7) that comes with Windows. To create a new task follow the steps as shown below.

In Task Scheduler select 'Create Task' and enter the Name and Description. Set it to run with highest privileges, so that the scripts work even when on application's running in admin mode. Create a trigger for the task to run and I have set it 'At log on' to run every time I log on. Create an Action to 'Start a program' and select the script file (.ahk) with all your scripts. Once created you can right-click on the task and select Run and verify that the script has started and is working.

<img class="center" alt="Visual Studio Code Coverage" src="../images/ahk_task_general.png" />

<img class="center" alt="Visual Studio Code Coverage" src="../images/ahk_task_trigger.png" />

<img class="center" alt="Visual Studio Code Coverage" src="../images/ahk_task_actions.png" />

I synchronize these scripts over Onedrive, to make it available on all my computers. The only thing to do on all the computers is to create the startup task. The features discussed above is just the tip of an iceberg, and should help you get started. AHK has a lot more features that you can explore at the project site. Hope this helps you to set up and automate some of your tasks!
