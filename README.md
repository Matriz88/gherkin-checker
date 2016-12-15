# gherkin-checker
[![npm version](https://badge.fury.io/js/gherkin-checker.svg)](https://badge.fury.io/js/gherkin-checker)

Consistency gherkins checker for [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) projects.

###How to use
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
###Configuration
In the folder where you'll run the module create a file named `gherkin-checker.conf.js` if you want to override the default configs.
```js
//default configurations

module.exports = {
    features_path: "./features",
    steps_path: "./scripts/steps/common-steps",
    components: {
        enabled: true,
		components_path: "./scripts/libs/components",
		excludedComponents: ["component1", "component2"]
    }
}
```
####features_path (string | required)
The folder containing your gherkin files (`.features`).

####steps_path (string | required)
The file containing your steps definitions.

####components (object | required)
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

####components.enable (bool | required)
Enable additional components support

####components_path (string | required only if `components.enable = true`)
The file containing your components definition.

####excludedComponents (array | optional)
Array of components you want to skip in consistency check.


###Parameters
you can specify the `--path` parameter to change the `features_path` option
```
Usage: gherkin-checker [options]

Options:

  -h, --help        output usage information
  -V, --version     output the version number
  -p, --path <path> features folder location (priority over configuration files)

```