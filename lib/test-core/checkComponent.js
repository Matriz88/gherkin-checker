let path = require('path');
let checkIfExist = require('../utils/utilities').checkIfExist;

const componentPattern = /"(.*?)"/;
const Components = require(path.resolve(global.cg_cofig.components.components_path));
const components = Components._components;

module.exports = (step, assert) => {
    if (!global.cg_cofig.components.enabled) return;
    //test component
    let matching = step.match(componentPattern);
    if (matching === null) {
        assert.skip("no components found in '" + step + "'");
    } else {
        if (global.cg_cofig.components.excludedComponents.indexOf(matching[1].toLowerCase()) > -1) {
            assert.skip('skip excluded component "' + matching[1] + '"');
        } else {
            let comp = components[matching[1]];
            assert.equal(checkIfExist(comp), 'found', '"' + matching[1] + '" component exists');
        }
    }
}