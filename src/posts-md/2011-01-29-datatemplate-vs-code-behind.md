---
title: DataTemplate Vs Code Behind
slug: datatemplate-vs-code-behind
date_published: 2011-01-29T11:56:43.000Z
date_updated: 2024-11-28T03:11:49.000Z
tags: Dotnet
---

Most of the people switching to WPF,got to understand the fact the WPF tries to target one major problem of the technologies that existed before, which was tight coupling of the design and the behaviour.WPF has a ‘*lookless control model*’,and that simply means that the look and feel of the control is completely separated from the behaviour of the  control.And that is where the whole concept of XAML comes in,which does its part of defining the visual representation.

But still many people move on to WPF from older technologies fail to absorb this core approach.Mostly this happens when the look of something is to be dynamically generated.Say in the case of a Listbox bound to a itemssource.As far as the item is to be displayed in pure text everything goes fine.People figure out that the *DisplayMemberPath* has to be set to the property that they want to be displayed in the listbox.

    private void Window_Loaded(object sender, RoutedEventArgs e)
           {
             listBox1.ItemsSource = PopulateEmployees();
           }
    
           private static List<Employee> PopulateEmployees()
           {
               List<Employee> employees = new List<Employee>();
               Employee emp;
               for int i = 0; i < 10; i++)
               {
                   emp = new Employee()
                   {
                       FirstName = "Name",
                       LastName = i.ToString(),
                       Id = i
                   };
                   employees.Add(emp);
               }
               return employees;
           }
       }
    
       class Employee
       {
           public string FirstName { get; set; }
    
          public string LastName { get; set; }
    
           public int</span> Id { get; set; }
       }
       ```
    
    
    ![binding displaymemberpath](../images/binding_displaymemberpath.jpg)
    
    But the scenario changes when the item to be displayed has to be more informative.Say you need a image to come up with some text,or maybe a button/checkbox etc.Now people tend to shift to the older approaches of creating the listbox items display from code.As that’s how it had been done before and also that seems easier.
    
    The code changes to something similar to shown below.
    
    ![binding code behind](../images/binding_code_behind.jpg)
    
    Or another approach might be slightly better than this one,by creating a user control to hold this data and then create the User control in the code behind and then add that to the listbox items.
    
    This is where people tend to loose focus of the real power of WPF ..**Templating**.
    
    All this code can be easily replaced and also clearly separate that UI details from the behaviour.The property that's the key here is _ItemTemplate,_and this would how the new code look like.
    
    ![binding data template](../images/binding_data_template.jpg)
    
    And the code in the behind all vanishes,and is as simple in our first case,by just setting up the listbox1’s ItemsSource.
    
    That is the power of templating and clearly separates the UI aspect from code. Any ItemsControl will have the property ItemTemplate that is to be set to the way you want the data to be displayed.If the display is complex in itself then you can move those into a separate user control and create  that user control  as the ItemTemplate.Anytime you want to change the way your control looks you just need to change in the xaml,clearly bringing in the decoupling.
    
