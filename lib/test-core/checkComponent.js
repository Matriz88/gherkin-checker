let path = require('path');
let checkIfExist = require('../utils/utilities').checkIfExist;
const componentPattern = /"(.*?)"/;

module.exports = function (step, assert) {
    let self = this;
    if (!self.config.components.enabled) return;
    //test component
    let matching = step.match(componentPattern);
    if (matching === null) {
        assert.skip("no components found in '" + step + "'");
    } else {
        if (self.config.components.excludedComponents.indexOf(matching[1].toLowerCase()) > -1) {
            assert.skip('skip excluded component "' + matching[1] + '"');
        } else {
            let comp = self.componentsArray[matching[1]];
            assert.equal(checkIfExist(comp), 'found', '"' + matching[1] + '" component exists');
        }
    }
}