---
title: Deleting Multiple Selected Items in WPF
slug: deleting-multiple-selected-items-in-wpf
date_published: 2009-09-11T10:57:00.000Z
date_updated: 2024-11-28T03:11:33.000Z
tags: Dotnet
---

Hi, Many a times while using listbox,listview etc there might be a need to delete the multiple selected items. This can be easily achieved by the following piece of code

     While ControlName.SelectedItems.Count &gt; 0 
       ControlName.Items.Remove(ControlName.SelectedItem)
    End While
    

Happy Coding :)
