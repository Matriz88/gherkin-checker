# gherkin-checker

Consistency gherkins checker for [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) projects.

###How to use
Install the module in your source folder
```
npm install gherkin-checker --save
```
of globally
```
npm install -g gherkin-checker
```
###Run
In your source folder simply run
```
gherkin-checker
```

###Configuration
In your project root create a file named `gherkin-checker.conf.js` if you want to override the default configs.
```js
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
The folder containing your gherkins (.features).

####steps_path_path (string | required)
The file containing your steps definition.

####components (object | optional)
Components configurations.

If you use a file that exports a list of components used used for mapping css-selectors, for example:
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
and your gherkin you have something like this:
```gherkin
#gherkin that uses components

Scenario:
	Given I do something
	When I click "component1"
	Then "component2" is displayed
```
then you should set `components.enable = true`.

####components_path (string | required if `components.enable = true`)
The file containing your components definition.
####excludedComponents (array | optional)
Array of components you want to skip in consistency check.