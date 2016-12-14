let fs = require('fs');
let path = require('path');
let Gherkin = require('gherkin');
let parser = new Gherkin.Parser();

/**
 *
 * @param dir
 * @param done
 */
let readDirRecurs = (dir, done) => {
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
exports.readDirRecurs = readDirRecurs;

/**
 *
 * @param file
 * @returns {Promise}
 */
exports.readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) reject(err);
            resolve(data)
        });
    })
}

/**
 *
 * @param value
 * @returns {*}
 */
exports.checkIfExist = (value) => {
    if (value.length > 0) return 'found';
    return 'not found'
}

/**
 *
 * @param data
 */
exports.getCompiledGherkin = (data) => {
    let gherkinDocument = parser.parse(data);
    return new Gherkin.Compiler().compile(gherkinDocument);
}