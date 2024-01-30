const fs = require('fs');
const { params } = require('../params');


const replaceStringsKey = ({ locale }) => {
    function replaceValues(objArray, strArray) {
        if (objArray.length !== strArray.length) {
            console.error('The arrays do not have the same length!');
            return;
        }

        const result = []
        for (let i = 0; i < objArray.length; i++) {
            result.push(strArray[i])
        }
        return result;
    }

    //const locale = params.locale
    const objArray = JSON.parse(fs.readFileSync('./migrations/data/results-flat.json', 'utf-8'));
    const strArray = JSON.parse(fs.readFileSync(`./migrations/data/src-${locale}.json`, 'utf-8'));

    const updatedArray = replaceValues(objArray, strArray);

    fs.writeFileSync(`./migrations/data/migration-${locale}.json`, JSON.stringify(updatedArray, null, 4), 'utf-8');
}

module.exports = {
    replaceStringsKey
};