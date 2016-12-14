let path = require('path');
let checkIfExist = require('./utilities').checkIfExist;
let regexArray = [];

const config = require('../config/default_config');

//constants
const NWC_MOCK = {
    _call: function (regex, action) {
        regexArray.push(regex)
    },
    Then: function (regex, action) {
        this._call(regex, action);
    },
    Given: function (regex, action) {
        this._call(regex, action);
    },
    When: function (regex, action) {
        this._call(regex, action);
    }
};
const componentPattern = /"(.*?)"/;
const Components = require(path.resolve(config.components.options.components_path));
const components = Components._components;
const steps = require(path.resolve(config.steps_path)).call(NWC_MOCK);

module.exports = function performTest(step, assert) {
    //test component
    let matching = step.text.match(componentPattern);
    if (matching === null) {
        assert.skip("no components found in '" + step.text + "'");
    } else {
        if (config.components.options.excludedComponents.indexOf(matching[1].toLowerCase()) > -1) {
            assert.skip('skip excluded component "' + matching[1] + '"');
        } else {
            let comp = Components.get(matching[1]);
            assert.equal(checkIfExist(comp.selector), 'found', '"' + matching[1] + '" component exists');
        }
    }

    //test step
    let isMatching = false;
    for (let i = 0; i < regexArray.length; i++) {
        let regex = regexArray[i];
        let matching = step.text.match(regex);
        if (matching !== null && matching[0] == step.text) {
            isMatching = true;
            break;
        }
    }
    assert.equal(isMatching, true, '"' + step.text + '" step match');
};
