let path = require('path');
let regexArray = [];

const config = require('../../config/default_config');
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
const steps = require(path.resolve(config.steps_path)).call(NWC_MOCK);

module.exports = (step, assert) => {
    //test step
    let isMatching = false;
    for (let i = 0; i < regexArray.length; i++) {
        let regex = regexArray[i];
        let matching = step.match(regex);
        if (matching !== null && matching[0] == step) {
            isMatching = true;
            break;
        }
    }
    assert.equal(isMatching, true, '"' + step + '" step match');
}