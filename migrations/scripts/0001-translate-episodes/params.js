ALL_TRANSLATION_LOCALES = ['it', 'pt', 'es', 'de', 'fr', 'ro', 'pl', 'cz', 'se', 'ee', 'jp']

const entry = {
  slug: 'who',
  slugField: 'url'
}

const params = {
  ...entry,
  fieldName: [],
  richFieldName: ['content'],
  locale: entry.slug ? ALL_TRANSLATION_LOCALES : ['it', 'pt', 'es', 'de', 'fr', 'ro', 'pl', 'cz', 'se', 'ee', 'jp'],
  type: 'pages',
  model: 'gpt-4',
  chunkSize: 3,
  limit: 3500,
  sourceEnv: 'staging',
  targetEnv: 'prod-0008'
}

module.exports = {
  params
};