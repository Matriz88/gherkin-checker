module.exports = function (step, assert) {
    let self = this;
    //test step
    let isMatching = false;
    for (let i = 0; i < self.regexArray.length; i++) {
        let regex = self.regexArray[i];
        let matching = step.match(regex);
        if (matching !== null && matching[0] == step) {
            isMatching = true;
            break;
        }
    }
    assert.equal(isMatching, true, '"' + step + '" step match');
}