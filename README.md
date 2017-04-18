# gherkin-checker
[![npm version](https://badge.fury.io/js/gherkin-checker.svg)](https://badge.fury.io/js/gherkin-checker) [![travis build](https://travis-ci.org/Matriz88/gherkin-checker.svg?branch=master)](https://travis-ci.org/Matriz88/gherkin-checker)

Consistency gherkins checker for [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) projects.

Given a folder containing gherkin files (`.features`), a consistency test will check if all the steps used in the gherkins will match in your steps definition file.

### How to use
Install the module in your source folder
```
npm install gherkin-checker --save
```
and add it to your scripts
```
"scripts": {
	"gherkin-checker": "gherkin-checker"
}
```
or install globally
```
npm install -g gherkin-checker
```
and in your source folder simply run
```
gherkin-checker
```
### Configuration
In the folder where you'll run the module create a file named `gherkin-checker.conf.js` if you want to override the default configs.
```js
//default configurations

module.exports = {
    features_path: "./features",
    steps_path: "./steps/common-steps",
    mode: 'full',
    components: {
        enabled: false,
        components_path: "./components/components",
        excludedComponents: []
    },
    reporter: {
        type: 'light'
    }
}
```
#### features_path (string)
The folder containing your gherkin files (`.features`).

#### steps_path (string)
The file containing your steps definitions.

#### mode (string)
Define the test running mode.
- `full`: a **separate test** will be performed for each `.feature` file in the `features_path` folder
- `light`: a **global test** will be performed for all `.feature` files in the `features_path` folder

#### components (object)
Additional components configurations.

If you use a module that exports a list of components used for mapping css-selectors with this structure:
```js
// example: components.js

module.exports {
    _components: {
        'component1': 'body',
        'component2': '.container',
        'component3': '.container div',
        'component4': '.footer a.link'
    }
}
```
and in your gherkin you have something like this:
```gherkin
#gherkin that uses components

Scenario:
	Given I do something
	When I click "component1"
	Then "component2" is displayed
```
then you should set `components.enable = true`.

#### components.enable (bool)
Enable additional components support

#### components.components_path (string)
The file containing your components definition.

#### components.excludedComponents (array)
Array of components you want to skip in consistency check.

#### reporter (object)
Console reporter configurations.

#### reporter.type (string)
Define the console report style.
- `full`: both successful and failed assertions will be shown
- `light`: only failed assertions will be shown

###### credits: the reporter is a custom version of [tap-diff](https://github.com/axross/tap-diff)

### Parameters
you can specify the `--path` parameter to change the `features_path` option
```
Usage: gherkin-checker [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -p, --path <path>     features folder location (priority over configuration files)
  -m, --mode <value>    (optional) test mode [full|light])
  -r, --report <value>  (optional) report style [full|light])
```
