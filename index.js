let Gherkin = require('gherkin');
let parser = new Gherkin.Parser();
let tape = require('tape');

let readDirRecurs = require('./utilities').readDirRecurs;
let readFileAsync = require('./utilities').readFileAsync;

let performTest = require('./test-runner');
let stepsCache = [];

readDirRecurs('features', (err, data) => {
	if (err) throw err;

	tape('Check gherkin components', function (assert) {
		data.forEach(file => {
			let fileReadTask = readFileAsync(file);
			fileReadTask.then(function (data) {
				let gherkinDocument = parser.parse(data);
				let compiledGherkin = new Gherkin.Compiler().compile(gherkinDocument);

				compiledGherkin.forEach(function (scenario) {
					scenario.steps.forEach(function (step) {
						//skip already checked steps
						if (stepsCache.indexOf(step.text) > -1) return;
						stepsCache.push(step.text);

						performTest(step, assert);
					})
				})
			})
		});
		assert.end();
	});
});
