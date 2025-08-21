---
title: KnockoutJS For XAML Developers
slug: knockoutjs-for-xaml-developers
date_published: 2014-07-07T23:35:39.000Z
date_updated: 2024-11-28T03:02:44.000Z
tags: Programming
---

After a very long time since I have actually wanted to move out to web development, recently I have started developing a website as part of my personal project, along with a friend of mine. I have been into desktop/mobile development on Microsoft technologies, using XAML for a very long time. [Model-View-View Model (MVVM)](__GHOST_URL__/tag/mvvm/) is a pattern that got popular because of the powerful binding engine in XAML. It is always comforting to see familiar patterns while moving into unexplored technology areas. Same is the reason I chose to explore [KnockoutJS](http://knockoutjs.com/index.html)(KO), which simplifies dynamic JavaScript UIs with the MVVM pattern.
![MVVM Knockout](__GHOST_URL__/content/images/MVVM_Knockoutjs.jpg)
KnockoutJS acts as the binding engine in XAML and binds your ViewModel(VM) with your View as shown in the figure. As you expect, like in XAML it provides a way to specify declarative-bindings on html using the [data-bind](http://knockoutjs.com/documentation/binding-syntax.html) attribute and is also widely [supported across different browsers](http://knockoutjs.com/documentation/browser-support.html). The Model is the data that is populated from the server after your business logics applied,  mostly populated out of Ajax JSON calls from a web service/api. This Model data might mostly need some transformation to map to your View needs which is what exactly the ViewModel does. It transforms the Model data and wraps over it to provide features like 2-way-binding, client side validation, transformation of properties, UI specific state and a lot more

We will see below how some of the major constructs in XAML map over to KnockoutJS.

> *I assume that you are a XAML developer and am not including detailed code samples for the XAML part and would be just mentioning them.*

**1. INotifyPropertyChanged**

Notifying data bounded clients on updates to the underlying bound data is a typical scenario in XAML, where we use [INotifyPropertyChanged](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged(v=vs.110).aspx) interface. This is also required on web pages and is handled by KO using *[observables](http://knockoutjs.com/documentation/observables.html)*

    var personVM = {
      Name: ko.observable('Rahul'),
      Age: ko.observable(50),
    };
    

Declaring the property as an observable, makes any changes to the property immediately reflect on the bound UI elements, just like it happens on a property of a class that implements INotifyPropertyChanged.

{% codepen CuIfK rahulpnath js %}

**2. DataContext**

In XAML we set the DataContext as the ViewModel to start binding the data from the ViewModel on the UI. Similarly in KO we have to call on to _applyBindings _method, passing on the ViewModel object to bind. You can see this in the above sample. You can also pass in an additional parameter indicating the part of the document that you want to explicitly bind to.

**3. DataBinding**

Binding the data to the UI in XAML is done declaratively using the [Binding](http://msdn.microsoft.com/en-us/library/system.windows.data.binding(v=vs.110).aspx) syntax. Similarly in KO we use the [data-bind](http://knockoutjs.com/documentation/binding-syntax.html) attribute to bind to a registered, built-in or custom, binding handler. As opposed to XAML where we bind to different properties, in KO all bindings are mentioned in the same data-bind attribute, separated by comma. A binding in KO consists of a name value pair separated by a colon, where the name corresponds to the binding handler/the property that we are binding to and the value from the VM that we need it to be bound to. A simple example of binding to the text property of a label would be _data-bind="text: Name" . _You can also use the [with binding](http://knockoutjs.com/documentation/with-binding.html) to create binding contexts for descendant elements as in XAML

**4. INotifyCollectionChanged**

In XAML updates to a collection is usually handled using an [ObservableCollection](http://msdn.microsoft.com/en-us/library/ms668604(v=vs.110).aspx), which notifies the UI whenever an item is added/removed to the collection. Similarly in KO you can use *observableArray*, which behaves the same as ObservableCollection. It notifies the bound UI elements whenever an element is added/removed from the array. Updates or changes to individual properties on the actual objects in the array is notified to the UI only if the property is an _observable, _as in XAML. In the below sample, you can try adding an observable item or a non-observable item to the list. As soon as you add an item it reflects in the list. But selecting and editing an item will reflect in the list only if you are editing an observable item.

{% codepen FreIv rahulpnath js %}

**5. Dependent Properties**

In XAML when there are properties dependent on others , to notify changes we have to explicitly call RaisePropertyChanged on all the dependent properties. A very common example is below

    private string firstName;
    public string FirstName
    {
       get { return firstName; }
       set
       {
            if (firstName!= value)
            {
                firstName= value;
                OnPropertyChanged("FirstName");
                OnPropertyChanged("FullName");
            }
       }
    }
    public string FullName
    {
        get { return FirstName +" " + LastName; }
    }
    

Here whenever FirstName is updated to notify UI elements bound to FullName would be updated only if we explicitly call PropertyChanged on FullName property too. In KO this is handled using [computed observables](http://knockoutjs.com/documentation/computedObservables.html) and is much more elegant.

    this.fullName = ko.computed(function () {
      return this.firstName() + ' ' + this.lastName();
    }, this);
    

**6. Commanding**

Commanding is how user interactions are bound to actions/functions on ViewModel, which will in turn perform something useful for the user. Like e.g. clicking a button. In KO this is handled using the same [data-bind](http://knockoutjs.com/documentation/click-binding.html) attribute using key’s corresponding to event handlers. ``

    <button data-bind="click: performSomeAction">Click me</button>
    

**7. Value Converters **

The [IValueConverter](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter(v=vs.110).aspx) interface is to create a converter that can be applied on a Binding to provide custom logic on the data that gets bounded to the UI element. For a similar functionality in KO, there is [writable computed observable](http://knockoutjs.com/documentation/computedObservables.html) to convert to and from a specific format of data. The read and write function on the computed observable, corresponds to the Convert and ConvertBack functions on IValueConverter on XAML.

{% codepen dJhLm rahulpnath js %}

There are a lot of useful resources on the web that are freely available to get started with KnockoutJS. Some of them are listed below

- [Official Documentation](http://knockoutjs.com/documentation/introduction.html)
- [Learn By Doing](http://learn.knockoutjs.com/)
- [Videos](https://www.youtube.com/results?search_query=knockout+javascript)
- [More Videos](http://channel9.msdn.com/Search?term=knockout#ch9Search)

Hope you find this useful to easily understand KnockoutJS, re-applying your XAML knowledge . Do drop in a comment in case you find any other similarities with XAML that I have missed mentioning here and I would be happy to add it in. I am sure I have not covered it completely!
