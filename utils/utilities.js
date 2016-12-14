let fs = require('fs');
let path = require('path');

module.exports = {
	readDirRecurs: readDirRecurs,
	readFileAsync: readFileAsync,
	checkIfExist: checkIfExist
};

function readDirRecurs(dir, done) {
	let results = [];
	fs.readdir(dir, (err, list) => {
		if (err) return done(err);
		let pending = list.length;
		if (!pending) return done(null, results);
		list.forEach((file) => {
			file = path.resolve(dir, file);
			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					readDirRecurs(file, (err, res) => {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
}

function readFileAsync(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) reject(err);
			resolve(data)
		});
	})
}

function checkIfExist(value) {
	if (value.length > 0) return 'found';
	return 'not found'
}
