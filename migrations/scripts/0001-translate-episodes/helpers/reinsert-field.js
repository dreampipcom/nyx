const fs = require('fs');
const { params } = require('../params');


const reinsertField = ({ locale, fieldName }) => {
    //const fieldName = params.fieldName
    //const locale = params.locale
    function updateOriginalWithFilteredData(originalFilePath, filteredDataPath) {
        // Load the original exported JSON file and the filtered data
        const originalData = JSON.parse(fs.readFileSync(originalFilePath, 'utf-8'));
        const filteredData = JSON.parse(fs.readFileSync(filteredDataPath, 'utf-8'));

        // For each filtered data item, navigate to the original entry and replace
        const result = filteredData.map((dataItem, i) => {
            const result = { ...originalData }
            if (result?.items && result.items[i] && result.items[i].fields && result.items[i].fields[fieldName]) {
                result.items[i].fields[fieldName] = dataItem
            }
            return result
        })[0];

        // Save the updated data back to the original file
        fs.writeFileSync(`./migrations/data/destination-${locale}.json`, JSON.stringify(result, null, 4), 'utf-8');
        console.log("Updated the original data with filtered results.");
    }

    updateOriginalWithFilteredData(`./migrations/data/export.json`, `./migrations/data/migration-${locale}.json`);
}

module.exports = {
    reinsertField
};
