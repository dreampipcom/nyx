const { reinsertField } = require("./helpers/reinsert-field");
const { reinsertRichField } = require("./helpers/reinsert-rich-field");
const { replaceRichStringsKeys } = require("./helpers/replace-rich-strings-keys");
const { replaceStringsKey } = require("./helpers/replace-strings-key");
const { params } = require("./params");

const prepareToUpdate = ({ isRichText, locale, fieldName }) => {
  if (isRichText) {
    replaceRichStringsKeys({ locale, fieldName });
    reinsertRichField({ locale, fieldName });
  } else {
    replaceStringsKey({ locale, fieldName });
    reinsertField({ locale, fieldName });
  }
}

//prepareToUpdate()

module.exports = {
  prepareToUpdate
}