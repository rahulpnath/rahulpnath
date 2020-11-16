---
author: [Rahul Nath]
title: "Dynamically Create Powershell Alias"
  
date: 2019-12-10
tags:
  - Tools
thumbnail: ../images/windows_terminal_custom_alias.jpg
---

While playing around with the Windows Terminal, I had set up [Aliasing](https://www.rahulpnath.com/blog/setting_up_windows_terminal/#aliasing) to enable alias for commonly used commands.

**For e.g. Typing in _s_ implies _git status_.**

I wanted to create new command aliases from the command line itself, instead of opening up the script file and modifying it manually. So I created a PowerShell function for it.

```powershell
$aliasFilePath = "<Alias file path>"

function New-CommandAlias {
param(
    [parameter(Mandatory=$true)]$CommandName,
    [parameter(Mandatory=$true)]$Command,
    [parameter(Mandatory=$true)]$CommandAlias
    )

    $functionFormat = "function $commandName { & $command $args }
New-Alias -Name $commandAlias -Value $commandName -Force -Option AllScope"

    $newLine = [Environment]::NewLine
    Add-Content -Path $aliasFilePath -Value "$newLine$functionFormat"
}

. $aliasFilePath
```

> The script does override existing alias with the same name. Use the 'Get-Alias' cmdlet to find existing aliases.

The above script writes a new function and maps it to the alias command using the existing [New-Alias cmdlet](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/new-alias?view=powershell-6)

```powershell
function Get-GitStatus { & git status -sb $args }
New-Alias -Name s -Value Get-GitStatus -Force -Option AllScope
```

Add this to your PowerShell profile file (run notepad \$PROFILE) as we did for theming when we [set up the windows terminal](https://www.rahulpnath.com/blog/setting_up_windows_terminal/). In the above script, I write to the '_\$aliasFIlePath_' and load all the alias from that file using the Dot sourcing operator.

Below are a few sample usages

```powershell
New-CommandAlias -CommandName "Get-GitStatus" -Command "git status -sb" -CommandAlias "s"
New-CommandAlias -CommandName "Move-ToWorkFolder" -Command "cd C:\Work\" -CommandAlias "mwf"
```

The full gist is available [here](https://gist.github.com/rahulpnath/0007a3bdd7da2efc7024bd92c002cf17#file-dynamicpowershellalias-ps1). I have tried adding only a couple of commands, and it did work fine. If you find any issues, please drop a comment.
