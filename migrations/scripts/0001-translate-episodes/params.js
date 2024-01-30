ALL_TRANSLATION_LOCALES = ['it', 'pt', 'es', 'de', 'fr', 'ro', 'pl', 'cz', 'se', 'ee', 'jp']

const entry = {
  slug: 'deep-frequencies',
  slugField: 'url'
}

const params = {
  ...entry,
  fieldName: [],
  richFieldName: ['bioRich'],
  locale: entry.slug ? ALL_TRANSLATION_LOCALES : ['it', 'pt', 'es', 'de', 'fr', 'ro', 'pl', 'cz', 'se', 'ee', 'jp'],
  type: 'shows',
  model: 'gpt-4',
  chunkSize: 3,
  limit: 3500,
  sourceEnv: 'master',
  targetEnv: 'master'
}

module.exports = {
  params
};