---
title: "ReactJS: Setting up the Environment"
slug: reactjs-setting-up-the-environment
date_published: 2016-05-12T04:27:36.000Z
date_updated: 2024-11-28T03:04:17.000Z
tags: Programming
---

*This post helps setting up the development environment for React on VS Code using Browserify and Gulp*

I have been playing around with [React](https://facebook.github.io/react/) for the past few days and liking the one way binding and immutability concept that it puts forward. The component-based approach and having all related code in a single place is really interesting. Need to explore more and see how it really turns out building UI's with React.

The openness of the Web makes it really difficult to get started with any development platform on it and is the same with React. There are a lot of options for getting things done and can get [overwhelming when newly starting out](https://en.wikipedia.org/wiki/Decision_fatigue). This post explains 'one way' to set up the development environment when developing an application using the React JavaScript framework. I am using VS Code for some time now and wanted to use the same for React development. Except for setting up VS Code, everything else would still make sense to you if you are using a different editor.

## Package Manager for External Dependencies

One of the first things we need when starting with a fresh project on React, is the React library itself. I use Node Package Manager(npm) for managing all my code and development dependencies. Use the below commands to set up the [npm configuration (*package.json*) ](https://docs.npmjs.com/cli/init) and install the latest version of React library.

    npm init
    npm i --save react
    npm i --save react-dom
    

> *When installing npm packages use [--save](https://docs.npmjs.com/files/package.json#dependencies) if it needs to be deployed with the application and use [--save-dev](https://docs.npmjs.com/files/package.json#devdependencies) for a package added to support development.*

## Setting up VS Code

JavaScript development experience is better when you have *[jsconfig.json](https://code.visualstudio.com/Docs/languages/javascript)* file in your project root. VSCode recommends adding this file through a small light bulb notification on the right side of the status bar (as shown below). With this configuration file, VSCode treats all the *js* files under the same project context.
![Visual Studio code jsconfig balloon notification](__GHOST_URL__/content/images/vscode_jsconfig_balloon.png)
Intellisense for libraries is available through type definition files, usually available in the [DefinitelyTyped](http://definitelytyped.org/)[repository](https://github.com/DefinitelyTyped/DefinitelyTyped). With npm, you can manage these definition files using the [TypeScript Definition Manager (typings)](https://github.com/typings/typings) package. To get started install the typings package and support for node packages. Now you can use [typings](https://github.com/typings/typings/blob/master/docs/commands.md) to manage all the typescript definitions and use it for getting IntelliSense support. Once you have the correct type definitions installed for the packages you use, VSCode will show IntelliSense as shown below.

    npm i --save-dev typings
    typings install --ambient node
    typings install --save-dev gulp
    

![Visual Studio code Intellisense](__GHOST_URL__/content/images/react_vscode_intellisense.png)
## Hello World from React

Now that we have enough to get us started let's write our first react component, which displays a message passed into it.

    'use strict';
    
    import React from 'react';
    
    var HelloWorld = React.createClass({
      render: function () {
        return <div>{this.props.message}</div>;
      },
    });
    
    export default HelloWorld;
    

Let's save the above into *[components/helloworld.js](https://github.com/rahulpnath/Blog/blob/master/React_Template/src/components/helloworld.js)*. To use this component in the application, it needs to be rendered into the HTML page. So let's add a main entry point for the application as below and save it into *[main.js](https://github.com/rahulpnath/Blog/blob/master/React_Template/src/main.js)*. Notice how the component is referred in here and rendered into the HTML div element *app*.

    'use strict';
    
    import React from 'react';
    import ReactDOM from 'react-dom';
    import HelloWorld from './components/helloworld';
    
    ReactDOM.render(<HelloWorld message="Hello World From React" />, document.getElementById('app'));
    

For completeness below is how the *[Index.html](https://github.com/rahulpnath/Blog/blob/master/React_Template/src/Index.html)* looks

    <html>
      <head> </head>
      <body>
        <div id="app"></div>
        <script type="text/javascript" src="main.js"></script>
      </body>
    </html>
    

### Using Browserify for Bundling

Now that we have all the code needed for rendering the component, let's bundle up all the different JavaScript files together so that we can deploy it as a single file. Since we are using *JSX* and ES6 features, which not all browsers support, we need to transform it. [Babel](https://babeljs.io/) is a JavaScript compiler to get this done and it also has preset specific to [react](https://babeljs.io/docs/plugins/preset-react/) and [es2015](https://babeljs.io/docs/plugins/preset-es2015/). [Browserify](http://browserify.org) bundles all the JavaScript modules and also enables specifying transforms using the [--transform (-t)](https://github.com/substack/node-browserify#usage) switch, to pass in [babel](https://github.com/babel/babelify) along with the presets required.

    browserify -t [babelify --presets [react es2015] ] src\main.js -o dest\main.js -d
    

If you now manually copy over the HTML file into the *dest* folder and open it from there you should be seeing the '*Hello World from React*' message.

### Automating Build and More

I definitely did not want to keep running the above command and copy the HTML(/CSS) files, every time I make a change, to see the output - so automating it was very much required. What I would essentially like to have is every time I make a change on any of the files in the project, the build to trigger and output the updated application into the *dest* folder and automatically refreshing the browser so that I can see the changes (near) real-time. I chose to use [Gulp](http://gulpjs.com/) as this is popular and I have had some [experience using it before](__GHOST_URL__/blog/organizing-tests-into-test-suites-for-visual-studio/).

### **[gulpfile.js](https://github.com/rahulpnath/Blog/blob/master/React_Template/gulpfile.js)**

To organize all the different path's used in the gulp build file, I have an object, *path* holding all the properties together, that's used in the [gulp tasks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps-fn). The different tasks that I have defined are to *build* ( which *copyHtmlFiles* and builds and transforms *js* files), *[lint](https://github.com/adametry/gulp-eslint)*, *[watch](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb)*'es the source folder for changes and triggers the required build, *[connect](https://www.npmjs.com/package/gulp-connect)*'s a server to host the application and automatically *reload*'s the browser whenever code is changed.

    var appConfig = {
      localBaseUrl: 'http://localhost',
      port: 8090,
      paths: path,
    };
    
    gulp.task('copyHtmlFiles', function () {
      gulp.src(path.HTML).pipe(gulp.dest(path.DEST)).pipe(connect.reload());
    });
    
    gulp.task('js', function () {
      browserify(path.MAINJS, { debug: true })
        .transform(babelify, { presets: ['react', 'es2015'] })
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('main.js'))
        .pipe(gulp.dest(path.DEST))
        .pipe(connect.reload());
    });
    
    gulp.task('build', ['copyHtmlFiles', 'js']);
    
    gulp.task('lint', function () {
      gulp
        .src(path.JS)
        .pipe(lint({ config: 'eslint.config.json' }))
        .pipe(lint.format());
    });
    
    gulp.task('watch', function () {
      gulp.watch(path.HTML, ['copyHtmlFiles']);
      gulp.watch(path.JS, ['js']);
    });
    
    gulp.task('connect', function () {
      connect.server({
        root: 'dist',
        livereload: true,
        port: appConfig.port,
      });
    });
    
    gulp.task('reload', function () {
      gulp.src('dist/**/*').pipe(connect.reload());
    });
    
    gulp.task('open', function () {
      gulp
        .src(path.DEST + 'Index.html')
        .pipe(open({ uri: appConfig.localBaseUrl + ':' + appConfig.port + '/' }));
    });
    
    gulp.task('default', ['build', 'connect', 'lint', 'open', 'watch']);
    

With the default gulp task running, either using [VSCode Task Runner](https://code.visualstudio.com/Docs/editor/tasks) or the [command line](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#4-run-gulp), any edits that I make to the code gets build and pushed to the output directory and the browser refreshes to show the latest changes.
![React real-time browser refresh](__GHOST_URL__/content/images/react_realtime_edits.gif)
*If you find any package details missing see the [package.json](https://github.com/rahulpnath/Blog/blob/master/React_Template/package.json) file.*

You can find the hello world project template [here](https://github.com/rahulpnath/Blog/tree/master/React_Template). The repository size is a bit high as I have [included the npm packages](__GHOST_URL__/blog/checking-in-package-dependencies-into-source-control/) (*node_modules*) in the repository, which you would have anyways downloaded when doing a '[npm install](https://docs.npmjs.com/cli/install)'.

Hope this helps you to get started with React!
