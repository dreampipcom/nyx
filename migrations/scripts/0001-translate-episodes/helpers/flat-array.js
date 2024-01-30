const fs = require('fs');
const { params } = require("../params");

// Function to flatten nested arrays
function flattenArray(data) {
  const result = [];

  for (const item of data) {
      if (Array.isArray(item)) {
          // If the current item is an array, recursively flatten it and append its contents to the result
          result.push(...flattenArray(item));
      } else {
          // Otherwise, just append the item
          result.push(item);
      }
  }

  return result;
}

// Test the function
const strArray = JSON.parse(fs.readFileSync(`./migrations/data/src-${locale}.json`, 'utf-8'));
const flatArray = flattenArray(strArray);
fs.writeFileSync(`./migrations/data/src-${locale}-flat.json`, JSON.stringify(flatArray, null, 4), 'utf-8');

console.log(flatArray);  // Expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
