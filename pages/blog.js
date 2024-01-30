import { getHomePosts } from '../lib/api';
import Head from 'next/head';
import { Template } from '../templates';
import { Posts as PostsList } from '../components';
import { useRouter } from 'next/router';
import { addPlaceholders } from '../lib/server-helpers';

export default function Posts(props) {
  const { posts } = props
  return (
    <>
      <Head>
        <title>DreamPip — Blog</title>
        <meta property="og:title" content="DreamPip — Blog" />
        <meta property="og:site_name" content="DreamPip" />
        <meta property="og:url" content="https://www.dreampip.com/blog" />
        <meta property="og:description" content="Some words promised, word." />
        <meta name="description" content="Some words promised, word." />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://www.dreampip.com/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href="https://www.dreampip.com/blog" />
      </Head>
      <article className="content-page">
        <section className='wrap'>
          <PostsList
            posts={posts}
            heading="Posts"
            headingLevel="h1"
            postTitleLevel="h2"
          />
        </section>
      </article>
    </>

  );
}

export const maxDuration = 30;

export async function getStaticProps({ locale }) {
  const posts = await getHomePosts({ locale, limit: 25 });
  const newData = await addPlaceholders(posts)
  return {
    props: {
      posts: newData ?? null,
    },
  }
}

Posts.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}