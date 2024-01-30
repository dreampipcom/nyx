import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BlogLocale } from '../locale';
import Image from './ImageBlock';
import { localizeUrl } from '../lib/helpers';
import styled from 'styled-components';

const PostsGrid = styled.div`
  grid-template-columns: 1fr;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

function Posts({
  posts,
  intro,
  heading,
  id,
  headingLevel = 'h1',
  postTitleLevel = 'h2',
  readMoreText = 'See more >',
}) {
  const { locale: orig, pathname, isFallback } = useRouter()
  const locale = orig === "default" ? "en" : orig
  const localization = BlogLocale[locale] || BlogLocale["default"]
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <section {...(id && { id })}>
      <div>
        <PostsGrid style={{ display: 'grid', gridGap: '48px 32px' }}>
          {posts &&
            posts.map((post, index) => (
              <article
                key={post.url}
                id={`post-${post.url}`}>
                <div>
                  <Link className='landscape' style={{ overflow: 'hidden', display: 'block' }} href={localizeUrl(`/post/${post.url}`, locale)} prefetch={false}>
                    <Image className="landscape mb-4" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 20vw, 20vw" eager={index <= 1} video={post?.video?.url} videoMp4={post?.videoMp4?.url} placeholder={post?.placeholder?.url} shim={post.placeholderUrl} customStyles={{ width: '100%', height: 'auto', cursor: 'pointer' }} src={post.image?.url} alt="Post image" width="768" height="320" />
                  </Link>
                  <h3 level={postTitleLevel}>
                    <Link href={`/post/${post.url}`} prefetch={false}>
                      {post?.title}
                    </Link>
                  </h3>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: post.excerpt ?? '' }}
                  />
                </div>
              </article>
            ))}
          {posts && posts?.length < 1 && <p>{localization['not']}</p>}
        </PostsGrid>
      </div>
    </section>
  );
}

export default Posts;
