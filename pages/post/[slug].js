import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { AppContext } from '../../context'
import Head from 'next/head'
import Link from 'next/link';
import { getHomePosts, getPost } from '../../lib/api';
import { Template } from '../../templates';
import Image from '../../components/ImageBlock';
import { useRouter } from 'next/router';
import { BlogLocale } from '../../locale';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { localeMap } from '../../lib/constants';
import VideoPlayer from '../../components/VideoPlayer';
import { addPlaceholders } from '../../lib/server-helpers';
import { ContentBlock } from '../../components/ContentBlock';

const renderOptions = (content) => {
  // create an entry map
  const entryMap = new Map();
  // loop through the block linked entries and add them to the map

  if (content?.entries?.block) {
    for (const entry of content?.entries?.block) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  // loop through the inline linked entries and add them to the map
  if (content?.entries?.inline) {

    for (const entry of content?.entries?.inline) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  return {
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        return <a target="_blank" rel="noopener noreferrer" href={node.data.uri}>{children}</a>
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        // find the entry in the entryMap by ID
        const entry = entryMap.get(node.data.target.sys.id)

        if (entry.__typename === "ContentBlocks") {
          return <ContentBlock type={entry.type} />
        }

        if (entry.__typename === "LiveStreams") {
          const isYoutube = entry.url.includes("youtube")
          let view, autoplay
          return (
            <div>
              {isYoutube && (
                <div style={{ paddingBottom: "56.25%", position: "relative" }}>
                  <iframe style={{ position: "absolute", width: "100%", height: "100%" }} src={entry.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              )}
              {!isYoutube && (
                <VideoPlayer
                  slug={entry.url}
                />
              )}
            </div>
          );
        }
      },
    }
  }
}

const Wrapper = styled.section`
  max-width: 768px;
  width: 100%;
  p {
    white-space: pre-wrap;
  }

  @media screen and (min-width: 768px) {
    margin-left: 48px;
  }
`;

const Title = styled.h1`
`


export default function Post(props) {
  const { locale: orig, pathname, isFallback } = useRouter()
  const locale = orig === "default" ? "en" : orig
  const { post } = props

  const url = `https://www.remometro.com/${orig !== 'default' ? `${locale}/` : ''}post/${post?.url}`

  const localization = BlogLocale[locale] || BlogLocale["default"]

  const context = useContext(AppContext)

  const authors = post?.authorCollection?.items?.map((author) => author.name).join(', ')

  const source = post?.content
  const metaTitle = post?.title

  const content = documentToReactComponents(source?.json, renderOptions(source?.links))

  const snippet = documentToPlainTextString(source?.json).substring(0, 252) + "..."

  const heroContent = <Image fill eager={true} video={post?.video?.url} videoMp4={post?.videoMp4?.url} shim={post?.placeholderUrl} placeholder={post?.placeholder?.url} className="landscape" customStyles={{ alignSelf: "flex-start" }} alt={post?.title + " image"} src={post?.image?.url + "?fm=webp"} />


  useEffect(() => {
    if (context?.setContext) {
      context.setContext({ ...context, post })
    }
  }, [context?.post, post]);

  return (
    <>
      <Head>
        <title>{post?.title} — Remometro</title>
        <meta property="og:title" content={`${metaTitle} — Remometro`} />
        <meta property="og:site_name" content="Remometro" />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={snippet || "Purity, light, groove."} />
        <meta name="description" content={snippet || "Purity, light, groove."} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={authors} />
        <meta property="article:published_time" content={post?.publishedOn} />
        <meta
          property="og:image"
          content={(post?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta
          property="twitter:image"
          content={(post?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta
          property="og:image:secure_url"
          content={(post?.image?.url || "https://www.remometro.com/og-image.png") + "?fm=jpg&w=512"}
        />
        <meta property="og:image:type" content="image/jpeg" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={"https://www.remometro.com/" + "post/" + post?.url} />
        {Object.keys(localeMap).map((locale) => {
          return <link key={locale} rel="alternate" hrefLang={locale} href={`https://www.remometro.com/${locale}/post/${post?.url}`} />
        })}
      </Head>
      <article className="content content-single">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1a1a1a", flexWrap: "wrap", padding: "32px" }}>
          <section className="landscape" style={{ maxHeight: '100%', flexBasis: '33.333%', flexGrow: 1, maxWidth: '500px', position: 'relative', alignSelf: "flex-start", overflow: "hidden" }} >
            {heroContent}
          </section>
          <Wrapper>
            <header style={{ marginBottom: '48px' }}>
              <Title>{metaTitle}</Title>
              <p style={{ fontWeight: "300", color: "white" }}>{localization['by']} {authors}, {new Date(post?.publishedOn).toLocaleString(locale, {})}</p>
            </header>
            <section style={{ color: "white" }}>
              {content}
            </section>
            <hr style={{ marginBottom: "32px" }} />
            <Link href="/" style={{ color: "white" }}>{localization['back']}.</Link>
          </Wrapper>
        </div>
      </article>
    </>
  );
}

export async function getStaticProps({ params, preview = false, locale }) {
  const source = await getPost(params.slug, preview, locale)
  const data = source?.post

  if (!data) {
    return {
      notFound: true
    }
  }

  const newData = await addPlaceholders(data)

  return {
    props: {
      preview,
      post: newData ?? null,
    },
  }
}

export async function getStaticPaths() {
  const posts = await getHomePosts({ limit: 100 })


  return {
    paths: posts?.map(({ url }) => `/post/${url}`) ?? [],
    fallback: 'blocking',
  }
}

Post.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}
