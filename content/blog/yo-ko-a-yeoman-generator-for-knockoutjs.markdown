---
slug: yo-ko-a-yeoman-generator-for-knockoutjs
author: [Rahul Nath]
title: 'yo ko - A Yeoman Generator For KnockoutJS'
date: 2014-08-20 10:20:06
  
tags:
  - JavaScript
  - Web
thumbnail: ../images/yo_ko.png
---

Templates/Scaffolding is something that we are all used to nowadays, given that we use an IDE for development. Visual Studio is one popular IDE, that is very popular among people developing on the Microsoft platform. Visual studio comes with a lot of pre-installed templates and scaffolding templates and also has a rich extension support from the [community](http://visualstudiogallery.msdn.microsoft.com/site/search?f%5B0%5D.Type=RootCategory&f%5B0%5D.Value=templates&f%5B0%5D.Text=Templates). While developing on text editors(say like [Sublime Text](http://www.sublimetext.com/) which is what I have been using), which are not for any specific technology you might not have all the templating and scaffolding supported right out of the box. You might find plugins for specific editors but not for all the frameworks that are available today.

[Yeoman](http://yeoman.io/) is the Web's scaffolding tool for Modern Web Apps. Yeoman is a command line tool that runs over [Node.js](http://nodejs.org/). Setting it up is pretty easy with the instructions [here](http://yeoman.io/learning/index.html). To scaffold web applications, which is the same as creating a new project in Visual Studio from a template, we need to install framework specific generators for Yeoman. There are some `[officially maintained generators](http://yeoman.io/generators/official.html) and also ones that are [maintained by the community](http://yeoman.io/generators/community.html).

KnockoutJs helps you simplify dynamic JavaScript UIs using the Model-View-ViewModel (MVVM) pattern. If you are new to knockout and come from a XAML backgorund, [KnockoutJS For XAML Developers](/blog/knockoutjs-for-xaml-developers/), would help you. For KnockoutJs, there is an awesome generator that is written by [Steve Sanderson](https://twitter.com/stevensanderson), the creator of knockout itself and is available [here](https://www.npmjs.org/package/generator-ko). You can install this as below

> \$ npm install generator-ko

Once installed you can generate your web app from the command prompt and running the command '**yo ko**'. This is will ask for the name of the project, whether to use JavaScript or TypeScript and also if you need to include automated tests using Jasmine and Karma. On giving your options your web app would be scaffolded out.

<img class="center" alt="hp_dv4" src="../images/yo_ko.png" />

**Project Structure**

The generated web app is a simple Single Page Application(SPA), using the components feature released with [Knockout 3.2.0](http://blog.stevensanderson.com/2014/08/18/knockout-3-2-0-released/), [Bower](http://bower.io/) to manage packages and [Gulp](http://gulpjs.com/) for the build

<img class="left" alt="hp_dv4" src="../images/yo_ko_structure.png" /> The generator creates the folder structure as shown here and by default has setup the required packages. It uses the following packages:

- [Bootstrap](http://getbootstrap.com/): Responsive UI framework
- [Crossroads](http://millermedeiros.github.io/crossroads.js/): Routing Library
- [Hahser](https://github.com/millermedeiros/hasher/): Browsing History Manager
- [Jquery](http://jquery.com/): Feature rich library
- [Js-Signals](http://millermedeiros.github.io/js-signals/): Custom/Event Messaging System
- [Knockout](/blog/knockoutjs-for-xaml-developers/): Simplifies dynamic Javascript UIs with [MVVM pattern](/blog/tag/mvvm/)
- [Requirejs](http://requirejs.org/): File and Module Loader
- [Requirejs-text](https://github.com/requirejs/text): AMD loader plugin for text resources

There are three components: _about-page_, _home-page_ and _nav-bar_. The main, _index.html_ composes these components into the full blown view. The nav-bar component is referred as is and the home and about page are dynamically loaded based on the nav-bar menu interaction. As shown below the _div_ binds to the component based on the selected route.We look further deep on how the view models bind and these components are tied together.<br style="clear:both;" />

```html
<body>
  <nav-bar params="route: route"></nav-bar>
  <div
    id="page"
    class="container"
    data-bind="component: { name: route().page, params: route }"
  ></div>
</body>
```

The javascript modules are loaded using Requirejs and the startup class for this is _app/starup.js_ as defined in the data-main attribute in index.html. The knockout components are registered here and view-bindings are setup.Registering a component can be in multiple ways and is well explained in the article [here](http://www.knockmeout.net/2014/06/knockout-3-2-preview-components.html). The _currentRoute_ object is what gets binded to the page and is defined in the app/router.js where the crossroads is setup. To use any other routing library of your choice this is where you would need to update. Whenever a user clicks a menu item and navigates to a new route, the currentRoute is updated, which in turn triggers the corresponding component to get loaded. [Hasher](https://github.com/millermedeiros/hasher/) library is used to listen to browser navigation events and update them to crossroads, where the input is parsed and dispatch matched signal for the first Route that matches the input.

The knockout components are defined in the _components_ folder and has both the html and js parts in the same component folder. Whenever the component is loaded the viewmodel defined in the corresponding js file gets bounded to it. This way of developments helps to keep different components of the app well separated as modules and compose them into the view as required.

The build is managed is using [Gulp](http://gulpjs.com/), which can be installed using [npm](https://www.npmjs.org/package/gulp). To build the project, you need to run _gulp_ at the root folder. The build packages all the javascript modules/files into a single file, replaces the required updates in the html file, minifies the html, js and css etc. If not for the build systems, the application would have to make lots of file/scripts/css requests or would have to have it all in the same file while development which makes working as a team difficult. These build system are highly configurable and can be used to setup output as required. The build tasks are defined in the _gulpfile.js_ and the '_default_' task runs when running the gulp command. This is will generate the optimized files in the _dist_ folder, which can be hosted in the server of your choice. I use the [zero-configuration command-line http-server](https://www.npmjs.org/package/http-server) available on nodejs.

![yo ko application ](../images/yo_ko_app.png)

**Adding New Components**

To add new components the knockout generator provides a command which generated the html/css components in the appropriate folder. You would still need to add the registration of the component in the startup file.

> yo ko:component &lt;component name&gt;

This is just a starting point on building Single Page Applications using knockoutjs. Start on from here to build great web applications.

**Additional Resources**

- [Architecting large Single Page Applications with Knockout.js](http://blog.stevensanderson.com/2014/06/11/architecting-large-single-page-applications-with-knockout-js/)
- [Knockout.js 3.2 Preview : Components](http://www.knockmeout.net/2014/06/knockout-3-2-preview-components.html)
- [Developing Large Scale Knockoutjs Applications](http://www.scottlogic.com/blog/2014/02/28/developing-large-scale-knockoutjs-applications.html)
- [Single Page Applications - Angular Vs Knockout](http://www.scottlogic.com/blog/2014/07/30/spa-angular-knockout.html)
