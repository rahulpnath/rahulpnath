---
author: [Rahul Nath]
title: 'Introducing Code Formatting into a Large Code Base'
  
tags:
  - Programming
date: 2016-10-03
completedDate: 2016-09-20 06:02:13 +0530
keywords:
description: A walk through of popular code formatting rules and using source control hooks to introduce styling rules into a large code base.
thumbnail: ../images/codeformatting_column_guide.png
---

Code Formatting is an important aspect of writing code. If followed well it helps keep the code more readable and easy to work with. Here are some of the different aspects of formatting code and my personal preferences. I then explore options to enforce code formatting and ways to introduce it into an existing code base.

Below are some of the popular formatting rules and those that have a high value when enforced in a project.

## **Tabs vs Spaces**

One of the most debated topic in code formatting is whether to use tabs or spaces to intend code. I never knew such a debate existed until my most recent project. It had developers from different parts of the world and with different preferences. I came across the below excerpt from Jeff Atwood, to which I completely agree.

> \*Choose tabs, choose spaces, choose whatever layout conventions make sense to you and your team. It doesn't actually matter which coding styles you pick. What does matter is that you, and everyone else on your team, **sticks with those conventions and uses them consistently.\***

> _That said, only a moron would use tabs to format their code._

> _- [Jeff Atwood](https://blog.codinghorror.com/death-to-the-space-infidels/)_

Settings for these are often available at the IDE level. In Visual Studio this is available under [Options, Text Editor, All Languages, Tabs](https://msdn.microsoft.com/en-us/library/7sffa753.aspx). Be aware of what you choose and make sure you have the same settings across your team members.

### **Horizontal Alignment**

Avoid aligning by common separators (=;,) when they occur in adjacent lines. This kind of alignment falls out of order when we rename variables or properties. It happens when you chaange property names.

```csharp
// Not Refactoring friendly and
// needs extra effort to keep it formatted
var person = new Person()
{
    FirstName = "Rahul",
    LastName  = "Nath",
    Site      = "www.rahulpnath.com"
};
```

```csharp
// Refactoring friendly
var person = new Person()
{
    FirstName = "Rahul",
    LastName = "Nath",
    Site = "www.rahulpnath.com"
};
```

### **Horizontal Formatting**

_You should never have to scroll to the right_ - I caught on with this recommendation from the book Clean Code ([a recommended read](/blog/language-agnostic-books-for-every-developer-2/)). It is also recommended that a function should fit on the screen, without needing to scroll up or down. This encourages to keep functions short and specific.

> _We should strive to keep our lines short. The old Hollerith limit of 80 is a bit arbitrary, and I’m not opposed to lines edging out to 100 or even 120. But beyond that is probably just careless_

> _- Uncle Bob_

The [Productivity Power Tools](https://visualstudiogallery.msdn.microsoft.com/d0d33361-18e2-46c0-8ff2-4adea1e34fef) extension for Visual Studio allows adding a Column Guide. A Column Guide reminds developers their full line of code or comments may not fit on a single screen.

<img class="center" alt="Code Formatting Maximum Width Column Guide in Visual Studio using Power Tools" 
src="../images/codeformatting_column_guide.png" />

### **Aligning Function Parameters**

Always try to keep the number of parameters as less as possible. In cases where there are more parameters or longer function names, the team must choose a style. There are different styling formats followed when splitting parameters to a new line.

Allowing parameters to take the **_natural flow of IDE_** (Visual Studio) is the simplest approach. This often leads to poor readability and code cluttering.

<img class="center" alt="Function Parameters taking natural flow of IDE" 
src="../images/codeformatting_functionparameters_naturalflowide.png" />

Breaking parameters into separate lines is important for readability. Use the Column guide to decide when to break function parameters into different lines. There are different approaches followed when splitting parameters into new lines. Keeping the first parameter on the same line as the function and then having all other **_parameters on new line aligned with the first parameter_** is another approach. This works well when viewed in the same font and resolution used when writing. When you change font or resolution this kind of formatting falls out of place.

<img class="center" alt="Function Parameters on new line aligned with first parameter" 
src="../images/codeformatting_functionparameters_alignzoom.png" />

A better variant of the above style is to have the parameters in the new line aligned to the left. This ensures parameters stay in the same place when changing font or resolutions. The one that I prefer is to have all parameters in a new line. This formatting works well with different font sizes and resolutions.

```csharp
public int ThisIsALongFunctionNameWithLotsOfParameters(
    int parameter1,
    string parameter2,
    int parameter3,
    string optionalParameter = "Test")
{
}
```

### **Visibility Based Ordering**

It is a good practice to maintain a specific order of items within a class. Have all properties declared first, then constructors, public methods, protected methods, private methods etc. This is up to the team to determine the order, but sticking on to it makes the code more readable.

## Code Analysis Tools

Checking for styling and formatting issues in a code review requests is a boring task. It’s best to automate style checks at build time (local and server builds). Making build throw errors for styling issues forces developers to fix them. Once developers get used to the rules, writing code without any formatting issues becomes second nature. [StyleCop](https://stylecop.codeplex.com) is an open source static code analysis tool from Microsoft that checks C# code for conformance to StyleCop's recommended coding styles and a subset of Microsoft's .NET Framework Design Guidelines. It has a Visual Studio plugin and also integrates well with [MsBuild](https://stylecop.codeplex.com/wikipage?title=Setting%20Up%20StyleCop%20MSBuild%20Integration).

### **Cleaning up a Large Code Base**

Introducing StyleCop (or any code format enforcement) into a large pre-existing code base is challenging. Turning the tool on would immediately throw hundreds and thousands of errors. Trying to fix them in a stretch might impact the ongoing development process. This often causes us to delay the introduction of such enforcement's into the project and it continues to be a technical debt.

Taking an incremental approach, fixing one by one as and when a file is changed seems a good idea. Teams can come with the [Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) - '_Leave the file cleaner than you find_'. Every time a file is touched for a fix, run StyleCop analysis and fix the errors. Over a period of time, this will make the project clean. The only problem with this approach is developers often tend to ignore/forget running the analysis and fix them.

> _Trivial things like code formatting is hard to mandate within a team unless it is enforced through tooling_

## Source Control Hooks

We can plug into various hooks that source controls give to enforce code formatting on developer machines. In git, you can add a [custom pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to run the StyleCop analysis on all the staged files. [StyleCopcli](https://github.com/bbadjari/stylecopcli) is an open source application that wraps over the StyleCop DLLs and allows running the analysis from the command line. So in the hook, I use this CLI to run StyleCop analysis on all the staged files.

``` bash
#!/bin/sh
echo "Running Code Analysis"
./stylecopcli/StyleCopCLI.exe -cs $(git diff --cached --name-only)
if [ $? = 2 ]
    then
        echo Commit Failed! Fix StyleCop Errors
        exit 1
    else
        echo No SyleCop Errors!
        exit 0
fi
```

If there are any StyleCop validation errors the commit is aborted, forcing the developer to fix it. The git hooks work fine when committing from a command line or UI tools like Source Tree. However, Visual Studio git plugin does not run the git hooks and fails to do the check.

<img class="center" alt="StyleCop git hook failing commit in console" src="../images/code_formatting_git_hook_console.png" />

<img class="center" alt="StyleCop git hook failing commit in Source Tree" src="../images/code_formatting_git_hook_sourcetree.png" />

Over a period of time, most of the files will get cleaned and remaining can be done all at once with less effort. Once the entire code base passes all StyleCop rules, this can be enforced in the build server. This ensures that no more bad formatted code gets checked into the source control.

Code is read more than written. So it is important to keep it readable and well-formatted. It also makes navigating code bases easier and faster. These are minor things that are often [overlooked by developers](https://vimeo.com/97329157), but have a high impact on productivity when followed. Do you enforce code formatting rules in your current project? What are the rules that you find important. Sound off in the comments below!
