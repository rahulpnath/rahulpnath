---
title: "Tip of the Week: Text Editing - Convert Text Casing"
slug: text-editing-convert-text-casing
date_published: 2018-01-02T00:00:00.000Z
date_updated: 2024-11-28T03:40:26.000Z
tags: Productivity
excerpt: Convert between text casing quick and easy.
---

Often when working with SQL queries, I come across the need to capitalize SQL keywords across in a large query. For, e.g., to capitalize SELECT, WHERE, FROM clauses in an SQL query. When it is a large query/stored procedure, it is faster done using some text editor. Sublime Text is my preferred editor for such kind of text manipulations.

Sublime Text Editor comes with a few built-in text casing converters that we can use, to convert text from one case to another. Using the [simultaneous editing](https://en.wikipedia.org/wiki/Simultaneous_editing) feature, we can combine it with case conversion and manipulate large documents easily.
![Convert case options in sublime text](__GHOST_URL__/content/images/textediting_convert_case.png)
For example, let's say I have this below SQL query. As you can notice the SELECT and FROM keywords are cased differently across the query.

    select * From Table1
    select * From Table2
    select * From Table3
    SELECT * FROM Table4
    Select * From Table5
    

To standardize this (preferably capitalize all), highlight one of the 'select' keywords and highlight all occurrences of the keyword (ALT + F3). Once all occurrences of 'select' is highlighted, bring up the [command pallete](http://docs.sublimetext.info/en/latest/extensibility/command_palette.html) (CTRL + SHIFT + P on windows) and search for 'Convert Case'. From the options listed choose the case that you want to convert. All selected occurrences of the keyword will now be in the selected case.

Hope this helps you when you have a lot of text case manipulations to be done.
