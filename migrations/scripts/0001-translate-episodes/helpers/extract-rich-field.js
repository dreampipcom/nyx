const fs = require('fs');
const { params } = require('../params');



const extractRichField = ({ fieldName }) => {
  //const fieldName = params.fieldName
  // Function to recursively parse the Rich Text nodes
  function parseNodes(nodes, results = [], dry = [], entryId, path = []) {
    nodes.forEach((node, index) => {
      const currentPath = path.concat([index]);

      if (node.nodeType === 'text') {
        results.push({
          entryId,
          path: currentPath,
          value: node.value
        });

        dry.push({
          value: node.value
        });
      }

      // If the node has content, recursively check its content as well
      if (node.content && node.content.length > 0) {
        parseNodes(node.content, results, dry, entryId, currentPath);
      }
    });
  }

  function filterTextNodesFromRichText(jsonFilePath) {
    // Load the exported JSON file
    const rawData = fs.readFileSync(jsonFilePath);
    const data = JSON.parse(rawData);

    const results = [];
    const dry = [];

    data.items.forEach(entry => {
      if (entry.fields && entry.fields[fieldName]) {
        const richTextContent = entry.fields[fieldName].content;
        parseNodes(richTextContent, results, dry, entry.sys.id);
      }
    });

    return { results, dry };
  }

  const parse = filterTextNodesFromRichText('./migrations/data/export.json')
  const result = parse.results;
  const dry = parse.dry;
  fs.writeFileSync('./migrations/data/results.json', JSON.stringify(result, null, 4), 'utf-8');
  fs.writeFileSync('./migrations/data/results-dry.json', JSON.stringify(dry, null, 4), 'utf-8');
  console.log("Saved the filtered results to 'filteredResults.json'");
}

module.exports = {
  extractRichField
};