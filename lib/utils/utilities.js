let fs = require('fs');
let path = require('path');
let Gherkin = require('gherkin');
let parser = new Gherkin.Parser();

/**
 * read directory recursively and return and array of files found
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
 * read file asynchronously
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
 * @param file
 */
exports.readFileSync = (file) => {
    try{
        return fs.readFileSync(file, 'utf8');
    } catch (e){
        console.log(e.message)
    }
}

/**
 * check if the value is defined
 * @param value
 * @returns {*}
 */
exports.checkIfExist = (value) => {
    if (typeof value !== 'undefined') return 'found';
    return 'not found'
}

/**
 * given 'utf8' file content, return compiled gherkin
 * @param data
 */
exports.getCompiledGherkin = (data) => {
    let gherkinDocument = parser.parse(data);
    return new Gherkin.Compiler().compile(gherkinDocument);
}