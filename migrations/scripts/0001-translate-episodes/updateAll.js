require('dotenv').config()
const fs = require('fs');
const contentfulManagement = require('contentful-management');
const { params } = require('./params');
const { prepareToTranslate } = require('./prepareToTranslate');
const { doTranslations } = require('./translate');
const { prepareToUpdate } = require('./prepareToUpdate');
const { getData } = require('./helpers/get-data');

localeMap = {
  'pt': 'Pt',
  'it': '',
  'es': 'Es',
  'de': 'De',
  'fr': 'Fr',
  'ro': 'Ro',
  'pl': 'Pl',
  'cz': 'Cz',
  'se': 'Se',
  'jp': 'Jp',
  'ee': 'Ee'
}

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = params.targetEnv; // typically 'master' unless you've changed it

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function updateEntries({ locale, fieldName, isRichText }) {
  const localizedFieldName = `${fieldName}${localeMap[locale]}`;
  await getData({ fieldName })
  prepareToTranslate({ locale, fieldName, isRichText })
  await doTranslations({ locale, fieldName })
  prepareToUpdate({ locale, fieldName, isRichText })

  const entriesToUpdate = JSON.parse(fs.readFileSync(`./migrations/data/destination-${locale}.json`, 'utf-8'));

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  for (const entryToUpdate of entriesToUpdate['items']) {
    const entryId = entryToUpdate?.sys?.id
    const newValue = entryToUpdate?.fields && entryToUpdate?.fields[fieldName] && entryToUpdate?.fields[fieldName]

    if (!newValue || !entryId) {
      console.log("Err: Nothing to update with")
      return;
    }

    let contentfulLocale = 'en-US'
    if (locale === 'it') contentfulLocale = 'it-IT'

    try {
      const entry = await environment.getEntry(entryId);
      if (!(entry?.fields && entry.fields[localizedFieldName] && entry.fields[localizedFieldName][contentfulLocale])) {
        console.log("adding missing locale field")
        if(locale === "it") {
          entry.fields[localizedFieldName] = { 'en-US': {...entry.fields[localizedFieldName]['en-US']}, [contentfulLocale]: { ...newValue } }
        } else {
          entry.fields[localizedFieldName] = { [contentfulLocale]: { ...newValue } }
        }
      }
      entry.fields[localizedFieldName][contentfulLocale] = newValue;  // assuming 'en-US' locale; adjust if different
      await entry.update();
      console.log(`SUCCESS Updated entry ${entryId} on the field ${localizedFieldName} with new value: ${JSON.stringify(newValue)}.`);

    } catch (error) {
      console.error(`Error updating entry ${entryId}:`, error);
    }
  }
}


const updateAll = async () => {
  if(!params.slug) {
    console.log("-------- WARNING: UPDATING ALL CONTENT! ----------\nWaiting 15s for you to be sure......")
    await sleep(15000)
  } else {
    console.log(`--------  UPDATING ${params.slug} CONTENT! ----------\nWaiting 2s for you to be sure......`)
    await sleep(2000)
  }

  for (const locale of params.locale) {
    // update rich texts
    if (params?.richFieldName?.length) {
      for (const fieldName of params.richFieldName) {
        await updateEntries({ fieldName, locale, isRichText: true })
      }
    }

    // update other fields
    if (params?.fieldName?.length) {
      for (const fieldName of params.fieldName) {
        await updateEntries({ fieldName, locale, isRichText: false })
      }
    }
  }
}
updateAll();
