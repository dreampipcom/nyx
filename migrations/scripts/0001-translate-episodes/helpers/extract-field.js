const fs = require('fs');
const { params } = require('../params');


const extractField = ({ fieldName }) => {
  //const fieldName = params.fieldName
  function filterTextNodesFromRichText(jsonFilePath) {
    // Load the exported JSON file
    const rawData = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(rawData);
  
    return data.items.map(entry => {
      if (entry.fields && entry.fields[fieldName]) {
        return entry.fields[fieldName]
      }
    });
  }
  
  const parse = filterTextNodesFromRichText('./migrations/data/export.json')
  const dry = parse;
  //fs.writeFileSync('./migrations/data/results.json', JSON.stringify(result, null, 4), 'utf-8');
  fs.writeFileSync('./migrations/data/results-flat.json', JSON.stringify(dry, null, 4), 'utf-8');
  console.log("Saved the filtered results to 'results-flat.json'");
}

module.exports = {
  extractField
};