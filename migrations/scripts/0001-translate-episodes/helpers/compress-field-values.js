const fs = require('fs');

const flatResults = () => {
    function flattenArray(inputFilePath, outputFilePath) {
        // Load the JSON file
        const dataArray = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

        // Extract the 'value' key from each object and create a new array
        const flattenedArray = dataArray.map(obj => obj.value);

        // Save the flattened array to a new JSON file
        fs.writeFileSync(outputFilePath, JSON.stringify(flattenedArray, null, 4), 'utf-8');
        console.log(`Flattened array saved to '${outputFilePath}'`);
    }

    // Example usage:
    flattenArray('./migrations/data/results-dry.json', './migrations/data/results-flat.json');
}

module.exports = {
    flatResults
}