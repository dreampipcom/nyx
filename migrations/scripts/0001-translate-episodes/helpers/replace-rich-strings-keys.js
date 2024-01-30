const fs = require('fs');
const { params } = require('../params');


const replaceRichStringsKeys = ({ locale }) => {
    //const locale = params.locale
    function replaceValues(objArray, strArray) {
        if (objArray.length !== strArray.length) {
            console.error('The arrays do not have the same length!');
            return;
        }

        for (let i = 0; i < objArray.length; i++) {
            objArray[i].value = strArray[i];
        }
        return objArray;
    }

    const objArray = JSON.parse(fs.readFileSync('./migrations/data/results.json', 'utf-8'));
    const strArray = JSON.parse(fs.readFileSync(`./migrations/data/src-${locale}.json`, 'utf-8'));

    console.log({ objArray, strArray })

    const updatedArray = replaceValues(objArray, strArray);

    fs.writeFileSync(`./migrations/data/migration-${locale}.json`, JSON.stringify(updatedArray, null, 4), 'utf-8');
}

module.exports = {
    replaceRichStringsKeys
};