import { localeMap } from "./constants"

const EPISODE_LOCALES = {
  'default': `
    body {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'en': `
  body {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'it-it': `
  body {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'pt-br': `
  body: bodyPt {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'es-es': `
  body: bodyEs {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'de-de': `
  body: bodyDe {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'fr-fr': `
  body: bodyFr {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'ro': `
  body: bodyRo {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'pl-pl': `
  body: bodyPl {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'cs-cz': `
  body: bodyCz {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'sv-se': `
  body: bodySe {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'et-ee': `
  body: bodyEe {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'ja-jp': `
  body: bodyJp {
    json
    links {
      entries {
        block {
          sys {
            id
          }
          __typename
          ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
}

const EPISODE = ({ locale }) => `
  title
  date
  end
  isLive
  video {
    url
  }
  videoMp4 {
    url
  }
  image {
    url
  }
  placeholder {
    url
  }
  mixcloud
  url
  show {
    title
    url
    ${SHOW_LOCALES[locale]}
  }
  artist {
    name
    country
  }
  guestsCollection {
    items {
      ... on Artists {
        __typename
        sys {
          id
        }
        name
        aliases
      }
    }
  }
  event {
    title
    url
  }
  genres
  featured
  ${EPISODE_LOCALES[locale]}
`
const EPISODES_QUERY = `
  title
  url
`

const EPISODES_GRID = `
  title
  date
  end
  featured
  video {
    url
  }
  videoMp4 {
    url
  }
  image {
    url
  }
  placeholder {
    url
  }
  url
  guestsCollection {
    items {
      ... on Artists {
        __typename
        sys {
          id
        }
        name
        aliases
      }
    }
  }
  artist {
    name
    aliases
  }
  genres
`

const RELATED_EPISODES_GRID = `
  title
  date
  end
  featured
  video {
    url
  }
  videoMp4 {
    url
  }
  image {
    url
  }
  placeholder {
    url
  }
  url
  artist {
    name
  }
  guestsCollection {
    items {
      ... on Artists {
        __typename
        sys {
          id
        }
        name
      }
    }
  }
`

const HEROS = (pt) => `
  video {
    url
  }
  videoMp4 {
    url
  }
  image {
    url
  }
 
  ${pt ? HERO_PT : HERO_DEFAULT}
`

const HERO_PT = `
title: titlePt
ctaText: ctaTextPt
ctaLink: ctaLinkPt
subTitle: subTitlePt
`

const HERO_DEFAULT = `
title
ctaText
ctaLink
subTitle
`

const PAGES = `
url
`

const PAGE_LOCALES = {
  'default': `
  title
  content {
    json
      links {
        entries {
          block {
            sys {
            id
          }
          __typename
            ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
              type
            }
        }
      }
        assets {
          block {
            sys {
            id
          }
          url
          description
        }
      }
    }
  }
  description
  `,
  'en': `
    title
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description
  `,
  'it-it': `
    title
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description
  `,
  'pt-br': `
    title: titlePt
    content: contentPt {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionPt
  `,
  'es-es': `
    title: titleEs
    content: contentEs {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionEs
  `,
  'de-de': `
  title: titleDe
  content: contentDe {
    json
      links {
        entries {
          block {
            sys {
            id
          }
          __typename
            ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
        assets {
          block {
            sys {
            id
          }
          url
          description
        }
      }
    }
  }
  description: descriptionDe
  `,
  'fr-fr': `
    title: titleFr
    content: contentFr {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionFr
  `,
  'ro': `
    title: titleRo
    content: contentRo {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionRo
  `,
  'pl-pl': `
    title: titlePl
    content: contentPl {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionPl
  `,
  'cs-cz': `
    title: titleCz
    content: contentCz {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionCz
  `,
  'sv-se': `
    title: titleSe
    content: contentSe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionSe
  `,
  'et-ee': `
    title: titleEe
    content: contentEe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionEe
  `,
  'ja-jp': `
    title: titleJp
    content: contentJp {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
    description: descriptionJp
  `
}

const PAGE = ({ locale }) => `
 url
 metaImage {
  url
 }
 ${PAGE_LOCALES[locale]}
`

const POSTS_LOCALES = {
  'default': `
    title
  `,
  'en': `
    title
  `,
  'it-it': `
    title
  `,
  'pt-br': `
    title: titlePt
  `,
  'es-es': `
    title: titleEs
  `,
  'de-de': `
    title: titleDe
  `,
  'fr-fr': `
    title: titleFr
  `,
  'ro': `
    title: titleRo
  `,
  'pl-pl': `
    title: titlePl
  `,
  'cs-cz': `
    title: titleCz
  `,
  'sv-se': `
    title: titleSe
  `,
  'et-ee': `
    title: titleEe
  `,
  'ja-jp': `
    title: titleJp
  `
}

const POST_LOCALES = {
  'default': `
    title
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
              ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'en': `
    title
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'it-it': `
    title
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pt-br': `
    title: titlePt
    content: contentPt {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'es-es': `
    title: titleEs
    content: contentEs {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'de-de': `
  title: titleDe
  content: contentDe {
    json
      links {
        entries {
          block {
            sys {
            id
          }
          __typename
            ... on LiveStreams {
            url
          }
          ... on ContentBlocks {
            type
          }
        }
      }
        assets {
          block {
            sys {
            id
          }
          url
          description
        }
      }
    }
  }
  `,
  'fr-fr': `
    title: titleFr
    content: contentFr {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'ro': `
    title: titleRo
    content: contentRo {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pl-pl': `
    title: titlePl
    content: contentPl {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'cs-cz': `
    title: titleCz
    content: contentCz {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'sv-se': `
    title: titleSe
    content: contentSe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'et-ee': `
    title: titleEe
    content: contentEe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'ja-jp': `
    title: titleJp
    content: contentJp {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `
}

const POSTS = ({ locale }) => `
url
${POSTS_LOCALES[locale]}
image {
  url
}
video {
  url
}
videoMp4 {
  url
}
placeholder {
  url
}
`


const EVENT_LOCALES = {
  'default': `
    title
    body {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'en': `
    title
    body {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'it-it': `
    title
    body {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pt-br': `
    title: titlePt
    body: bodyPt {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'es-es': `
    title: titleEs
    body: bodyEs {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'de-de': `
    title: titleDe
    body: bodyDe {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'fr-fr': `
    title: titleFr
    body: bodyFr {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'ro': `
    title: titleRo
    body: bodyRo {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pl-pl': `
    title: titlePl
    body: bodyPl {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'cs-cz': `
    title: titleCz
    body: bodyCz {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'sv-se': `
    title: titleSe
    body: bodySe {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'et-ee': `
    title: titleEe
    body: bodyEe {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'ja-jp': `
    title: titleJp
    body: bodyJp {
      json
      links {
        entries {
          block {
            sys {
              id
            }
            __typename
            ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `
}

const EVENT = ({ locale }) => `
url
  image {
  url
}
video {
  url
}
videoMp4 {
  url
}
flier {
  url
}
structuredData
date
end
isLive
ungatedTicket
listCta
ticketCta
  artistsCollection {
    items {
      ... on Artists {
      __typename
        sys {
        id
      }
      name
    }
  }
}
  photosCollection {
    items {
      ... on Asset {
      __typename
        sys {
        id
      }
      url
    }
  }
}
country
city
tickets
featured
  episodesCollection(order: date_DESC) {
    items {
      ... on Episodes {
      __typename
        sys {
        id
      }
      image {
        url
      }
      video {
        url
      }
      videoMp4 {
        url
      }
      placeholder {
        url
      }
      url
      title
    }
  }
}
  warmUpCollection(order: date_DESC) {
    items {
      ... on Episodes {
      __typename
        sys {
        id
      }
      image {
        url
      }
      video {
        url
      }
      videoMp4 {
        url
      }
      placeholder {
        url
      }
      url
      title
    }
  }
}
${EVENT_LOCALES[locale]}
`

const EVENTS_LIST = `
title
url
featured
country
date
image {
  url
}
video {
  url
}
videoMp4 {
  url
}
`

const SHOWS_LIST = `
title
url
image {
  url
}
video {
  url
}
videoMp4 {
  url
}
country
  `

const ARTISTS_LIST = `
name
url
image {
  url
}
country
`

const SHOW_LOCALES = {
  'default': `
    bioRich {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'en': `
    bioRich {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'it-it': `
    bioRich {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pt-br': `
    bioRich: bioRichPt {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'es-es': `
    bioRich: bioRichEs {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'de-de': `
    bioRich: bioRichDe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'fr-fr': `
    bioRich: bioRichFr {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'ro': `
    bioRich: bioRichRo {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'pl-pl': `
    bioRich: bioRichPl {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'cs-cz': `
    bioRich: bioRichCz {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'sv-se': `
    bioRich: bioRichSe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'et-ee': `
    bioRich: bioRichEe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'ja-jp': `
    bioRich: bioRichJp {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `
}

const ARTIST_LOCALES = {
  'default': `
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'en': `
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'it-it': `
    content {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'pt-br': `
    content: contentPt {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'es-es': `
    content: contentEs {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'de-de': `
    content: contentDe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    }
  `,
  'fr-fr': `
    content: contentFr {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'ro': `
    content: contentRo {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'pl-pl': `
    content: contentPl {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'cs-cz': `
    content: contentCz {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'sv-se': `
    content: contentSe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'et-ee': `
    content: contentEe {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `,
  'ja-jp': `
    content: contentJp {
      json
        links {
          entries {
            block {
              sys {
              id
            }
            __typename
              ... on LiveStreams {
              url
            }
            ... on ContentBlocks {
              type
            }
          }
        }
          assets {
            block {
              sys {
              id
            }
            url
            description
          }
        }
      }
    },
  `
}

const SHOW = ({ locale }) => `
title
url
country
image {
  url
}
video {
  url
}
videoMp4 {
  url
}
rotationWeeks
date
duration
${SHOW_LOCALES[locale]}
`

const ARTIST = ({ locale }) => `
name
url
country
aliases
links
image {
  url
}
otherCountries
highlightsCollection {
  items {
    ... on Episodes {
      __typename
        sys {
        id
      }
      image {
        url
      }
      video {
        url
      }
      videoMp4 {
        url
      }
      placeholder {
        url
      }
      url
      title
    }
  }
}

imagesCollection {
  items {
    ... on Asset {
    __typename
      sys {
      id
    }
    url
  }
 }
}
${ARTIST_LOCALES[locale]}
`

const POST = ({ locale }) => `
publishedOn
image {
  url
}
video {
  url
}
videoMp4 {
  url
}
placeholder {
  url
}
authorCollection {
    items {
      ... on Authors {
      __typename
        sys {
        id
      }
      name
    }
  }
}
url
${POST_LOCALES[locale]}
`

const CAL = ({ locale }) => `
url
where {
  lat
  lon
}
city
id: gcal
zoom
`


async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT || "master"}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview
          ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
          : process.env.CONTENTFUL_ACCESS_TOKEN
          }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

function extractShow(fetchResponse) {
  return fetchResponse?.data?.showsCollection?.items?.[0]
}

function extractArtist(fetchResponse) {
  return fetchResponse?.data?.artistsCollection?.items?.[0]
}

function extractShows(fetchResponse) {
  return fetchResponse?.data?.showsCollection?.items
}

function extractArtists(fetchResponse) {
  return fetchResponse?.data?.showsCollection?.items
}

function extractEvent(fetchResponse) {
  return fetchResponse?.data?.eventsCollection?.items?.[0]
}

function extractEvents(fetchResponse) {
  return fetchResponse?.data?.eventsCollection?.items
}

function extractEpisode(fetchResponse) {
  return fetchResponse?.data?.episodesCollection?.items?.[0]
}

function extractEpisodes(fetchResponse) {
  return fetchResponse?.data?.episodesCollection?.items
}

function extractHero(fetchResponse) {
  return fetchResponse?.data?.herosCollection?.items[0]
}

function extractPosts(fetchResponse) {
  return fetchResponse?.data?.postsCollection?.items
}

function extractPost(fetchResponse) {
  return fetchResponse?.data?.postsCollection?.items[0]
}

function extractPages(fetchResponse) {
  return fetchResponse?.data?.pagesCollection?.items
}

function extractPage(fetchResponse) {
  return fetchResponse?.data?.pagesCollection?.items[0]
}

function extractCal(fetchResponse) {
  return fetchResponse?.data?.calendarsCollection?.items[0]
}


export async function getEpisodes() {
  const entries = await fetchGraphQL(
    `query {
      episodesCollection(order: date_DESC, limit: 1000) {
        items {
          ${EPISODES_QUERY}
        }
      }
    }`
  )
  return extractEpisodes(entries)
}

// export async function getHomeEpisodes(limit, featured) {
//   const date = new Date();
//   const formattedDate = date.toISOString();

//   const entries = await fetchGraphQL(
//     `query {
//       episodesCollection(${featured ? `where: { featured: true, date_lt: "${formattedDate}" }` : ''},  order: date_DESC, limit: ${limit || "4"}) {
//         items {
//           ${EPISODES_GRID}
//         }
//       }
//     }`
//   )
//   return extractEpisodes(entries)
// }

export async function getHomeEpisodes(limit, featured) {
  const entries = await fetchGraphQL(
    `query {
      episodesCollection(${featured ? `where: { featured: true }` : ''},  order: date_DESC, limit: ${limit || "4"}) {
        items {
          ${EPISODES_GRID}
        }
      }
    }`
  )
  return extractEpisodes(entries)
}

export async function getHomePosts({ limit = 4, featured = false, locale = 'en' }) {
  const entries = await fetchGraphQL(
    `query {
      postsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}limit: ${limit || "4"}, order: publishedOn_DESC) {
        items {
          ${POSTS({ locale })}
        }
      }
    }`
  )

  return extractPosts(entries)
}

export async function getAllPages({ locale }) {
  const entries = await fetchGraphQL(
    `query {
      pagesCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}",` : ""}limit: 100) {
        items {
          ${PAGES}
        }
      }
    }`
  )

  return extractPages(entries)
}

export async function getHeros(locale) {
  const entries = await fetchGraphQL(
    `query {
      herosCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}limit: 1) {
        items {
          ${HEROS(!localeMap[locale])}
        }
      }
    }`
  )
  return extractHero(entries)
}



export async function getEpisode(slug, preview, locale = "en") {
  const entry = await fetchGraphQL(
    `query {
      episodesCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${EPISODE({ locale })}
        }
      }
    }`,
    preview
  )

  return {
    post: extractEpisode(entry)
  }
}

export async function getEvent(slug, preview, locale = 'en') {
  const entry = await fetchGraphQL(
    `query {
      eventsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}",` : ""} where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${EVENT({ locale })}
        }
      }
    }`,
    preview
  )

  return {
    event: extractEvent(entry)
  }
}

export async function getShow(slug, preview, locale = 'en') {
  const entry = await fetchGraphQL(
    `query {
      showsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${SHOW({ locale })}
          linkedFrom(allowedLocales: ["en-US", "it-IT"]) {
            episodesCollection(limit: 32, order: date_DESC) {
              items {
                ${RELATED_EPISODES_GRID}
              }
            }
          }
        }
      }
    }`,
    preview
  )


  return {
    show: extractShow(entry)
  }
}

export async function getArtist(slug, preview, locale = 'en') {
  const entry = await fetchGraphQL(
    `query {
      artistsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${ARTIST({ locale })}
          linkedFrom(allowedLocales: ["en-US", "it-IT"]) {
            episodesCollection(limit: 32, order: date_DESC) {
              items {
                ${RELATED_EPISODES_GRID}
              }
            }
          }
        }
      }
    }`,
    preview
  )

  return {
    artist: extractArtist(entry)
  }
}

export async function getShows() {
  const entries = await fetchGraphQL(
    `query {
      showsCollection(order: date_DESC, limit: 1000) {
        items {
          ${SHOWS_LIST}
        }
      }
    }`
  )
  return extractShows(entries)
}

export async function getArtists() {
  const entries = await fetchGraphQL(
    `query {
      artistsCollection(limit: 1000) {
        items {
          ${ARTISTS_LIST}
        }
      }
    }`
  )
  return extractArtists(entries)
}

export async function getEvents() {
  const entries = await fetchGraphQL(
    `query {
      eventsCollection(order: date_DESC, limit: 100) {
        items {
          ${EVENTS_LIST}
        }
      }
    }`
  )
  return extractEvents(entries)
}

export async function getPost(slug, preview, locale = "en") {
  const entry = await fetchGraphQL(
    `query {
      postsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${POST({ locale })}
        }
      }
    }`,
    preview
  )

  return {
    post: extractPost(entry)
  }
}

export async function getCalData(slug, preview, locale = "en") {
  const entry = await fetchGraphQL(
    `query {
      calendarsCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${slug}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${CAL({ locale })}
        }
      }
    }`,
    preview
  )
  return {
    cal: extractCal(entry)
  }
}

export async function getPage(url, preview, locale = "en") {
  const entry = await fetchGraphQL(
    `query {
      pagesCollection(${localeMap[locale] ? `locale: "${localeMap[locale]}", ` : ""}where: { url: "${url}" }, preview: ${preview ? 'true' : 'false'}, limit: 1) {
        items {
          ${PAGE({ locale })}
        }
      }
    }`,
    preview
  )

  return {
    page: extractPage(entry)
  }
}
