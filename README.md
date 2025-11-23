# SimpleApp SPA Template
This is a single page application starter template with example pages to get you started.

## Prerequisites
- [**npm**](https://www.npmjs.com/) to install all the necessary packages
- [**Grunt**](https://gruntjs.com) to build the application

## Installing
First clone the project and install dependencies:
```bash
mkdir es6-spa
cd es6-spa
git clone https://github.com/kappytown/es6-spa.git
npm install
```

## Server
Clone the php-server repository.
**Note:** you may have to update the `API_PATH` inside the GruntFile.cjs file.

## Building
```bash
grunt dev
```

## Features
- **Token-based authorization**
When the user logs in, credentials are verified in MySQL users table. Upon successfull login, a token is generated, saved into MySQL, and sent back in the response as an HTTP-only cookie to keep the user logged in.
- **Router based page navigation**
- **Service manager**
Handles all of your RESTful API calls.
- **Caching system**
Cache anything that you may need cached such as API responses.
- **Event observer**
Subscribe to and publish events such as when a user log into the app.
- **Javascript templating system**
Renders dynamic content in your templates.
- **Lazy loading**
Dynamically loads pages and associated assets to reduce the initial load of the app.
- **ES13 based syntax**
Upgraded from ES6 for spread operator and private class fields and methods. Depending on your requirements, you may need a transpiler such as Babel.
- **Cache busting**
The application version number `v=v1.00.00` is automatically appended to each asset file name upon build.

## Dependencies
Although lightweight, SimpleApp is not completely Vanilla and has the following dependencies:

- **Router**
Navigo 8.11.1 - Simple dependency-free minimalistic Javascript router used to navigate between pages
- **DOM**
jQuery 3.7.1 - For all DOM manipulation
- **Templates**
Underscore.js 1.8.3 - Lightweight library we use for it's Javascript templating system
- **Layout**
Bootstrap 5.3.3 - Used for responsive page layout and modal functionality
- **Build**
Grunt 1.6.1 (Optional) - Used to create build directory, minify, concatinate, replace, copy, and compile Sass to CSS.


## Main layout structure:
```pug
// Wrapper
div.wrapper
  // Header
  header.header
    ...

  // Main
  main
    // Section (Page Content)
    section#content
      ...

  // Footer
  footer.footer
    ...
```

## Authors
- [**@kappytown**](https://github.com/kappytown)

## License
**es6-spa** is licensed under the [GNU General Public License v3.0](LICENSE).