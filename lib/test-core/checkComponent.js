let path = require('path');
let checkIfExist = require('../utils/utilities').checkIfExist;

const config = require('../../config/default_config');
const componentPattern = /"(.*?)"/;
const Components = require(path.resolve(config.components.options.components_path));
const components = Components._components;

module.exports = (step, assert) => {
    if (!config.components.enabled) return;
    //test component
    let matching = step.match(componentPattern);
    if (matching === null) {
        assert.skip("no components found in '" + step + "'");
    } else {
        if (config.components.options.excludedComponents.indexOf(matching[1].toLowerCase()) > -1) {
            assert.skip('skip excluded component "' + matching[1] + '"');
        } else {
            let comp = Components.get(matching[1]);
            assert.equal(checkIfExist(comp.selector), 'found', '"' + matching[1] + '" component exists');
        }
    }
}