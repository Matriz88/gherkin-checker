module.exports = function (step, assert) {
    let self = this;
    let isMatching = false;

    let matching = step.match(self.stepsRegExp);
    if (matching !== null && matching[0] == step) {
        isMatching = true;
    }

    assert.equal(isMatching, true, '"' + step + '" step match');
};