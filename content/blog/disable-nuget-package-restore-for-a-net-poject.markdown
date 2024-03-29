---
author: [Rahul Nath]
title: 'Disable NuGet Package Restore for a .Net Poject'
  
tags:
  - Programming
date: 2016-05-02 13:26:59
keywords:
description:
---

_If you have decided on [Checking in Package Dependencies into Source Control](/blog/checking-in-package-dependencies-into-source-control/) for an existing project that uses Nuget Packages then this post is for you_

When using NuGet package references that are not included in the source control, these packages gets restored during build time. There are [multiple ways that NuGet supports restore these dependencies at build time](https://docs.nuget.org/consume/package-restore)

- Automatic Package Restore is the current recommended approach (within Visual Studio), which is available from NuGet 2.7.
- Command-line package restore on build servers
- MSBuild-integrated package restore approach is the original Package Restore implementation and is still used in many projects.

Depending on the type to of restore the project uses, NuGet has different configuration entries in the _csproj_ files and _.nuget_ folder in the solution root. So when choosing to check in package dependencies into the source control, it is a good idea to remove all these [generated configurations](https://docs.nuget.org/consume/package-restore/migrating-to-automatic-package-restore) and files that are not required any more. The below script does this for you!

<div class="alert alert-warning">
<strong>WARNING!</strong> The script deletes the <em>.nuget</em> folder (if it exists), updates the <em>.csproj</em> files. Please make sure that the project folder is under source control or you have a backup of the folder. After running the script make sure that all the changes that you see are expected as explained here and the project builds and runs as before.
</div>

The PowerShell script does the below for a given solution directory folder (mandatory)

- For each of the _csproj_ file in the given folder, the script removes the
  - _RestorePackages_ node
  - _NugetPackageImportStamp_ node
  - _nuget target import_ from the solution root .nuget folder
  - _EnsureNuGetPackageBuildImports_ node
- Removes _.nuget_ folder from the solution root if it exists.

*The script leaves blank lines in the *csproj* files in place of the removed nodes.*

```powershell
//  Remove NuGet Restore https://gist.github.com/rahulpnath/13d3b4f54cec51e22344876b1566b911#file-remove-nuget-restore-ps1
param([Parameter(Mandatory=$true)][string]$solutionDirectory)

 $importNugetTargetsTag= [regex]::escape(@'
<Import Project="$(SolutionDir)\.nuget\NuGet.targets" Condition="Exists('$(SolutionDir)\.nuget\NuGet.targets')" />
'@)

$restorePackagesTag = '<RestorePackages>.*?</RestorePackages>'
$nuGetPackageImportStamp = '<NuGetPackageImportStamp>.*?</NuGetPackageImportStamp>'

$EnsureNuGetPackageBuildImportsTargetTag = '(?smi)<Target Name="EnsureNuGetPackageBuildImports".*?</Target>'

foreach ($f in Get-ChildItem -Recurse -Path $solutionDirectory -Filter *.csproj | sort-object)
{
    $text = Get-Content $f.FullName -Raw
    $text `
        -replace $importNugetTargetsTag, "" `
        -replace $nuGetPackageImportStamp, "" `
        -replace $restorePackagesTag, "" `
        -replace $EnsureNuGetPackageBuildImportsTargetTag, "" `
        | set-content $f.FullName
}

Get-ChildItem -Path $solutionDirectory -include .nuget -Recurse | foreach ($_) { remove-item $_.fullname -Force -Recurse }
```

Any similarity with the scripts [here](http://weblogs.asp.net/jongalloway/scripting-net-project-migration-to-automatic-nuget-package-restore) is intended as that was my starting place. To explicitly [opt out of the Automatic Package Restore](https://docs.nuget.org/consume/package-restore#opting-out) on Visual Studio add a _Nuget.config_ in the solution root.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageRestore>
    <!-- Opts out of both Automatic Package Restore and MSBuild-Integrated Package Restore -->
    <add key="enabled" value="False" />

    <!-- Opts out of Automatic Package Restore in Visual Studio -->
    <add key="automatic" value="False" />
  </packageRestore>
</configuration>
```

Hope this helps you to move away from NuGet restore at build time.
