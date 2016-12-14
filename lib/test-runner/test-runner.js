let checkComponent = require('../test-core/checkComponent')
let checkStepMatch = require('../test-core/checkStepMatch')

module.exports = function performTest(step, assert) {
    checkComponent(step.text, assert);
    checkStepMatch(step.text, assert);
};


