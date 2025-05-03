'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { client } from '../../../sanity'; // adjust if path different
import '../../styles/blog-list-page.css';

const BlogListPostPage = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      const query = `
        *[_type == "blogsListDetails" && slug.current == $slug][0]{
          title,
          intro,
          slug,
          type,
          ascending,
          items[] {
            title,
            description,
            "imageUrl": image.asset->url,
            "slug": slug.current,
            type
          }
        }
      `;
      const data = await client.fetch(query, { slug });
      setPost(data);
    };

    fetchPost();
  }, [slug]);

  if (!post) return <p className='bloglist-loading'>Loading post...</p>;

  const getRedirectPath = (type) => {
    if (!type) return '/';
    if (type === 'movies') return '/movies-details';
    if (type === 'tvshows') return '/tvshows-details';
    if (type === 'anime') return '/anime-details';
    return '/';
  };

  const isAscending = post.ascending === 'false' ? false : true;
  const totalItems = post.items.length;

  return (
    <div className='bloglist-container'>
      <div className='bloglist-heading'>{post.title}</div>
      <p className='bloglist-intro'>{post.intro}</p>

      <div className='bloglist-main-card'>
        {post.items.map((item, index) => {
          const redirectBase = getRedirectPath(item.type);
          const itemSlug = item.slug;
          const number = isAscending ? index + 1 : totalItems - index;

          return (
            <Link
              key={index}
              href={`${redirectBase}?slug=${itemSlug}`}
              className='bloglist-link'
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className='bloglist-main-image'
                />
              )}
              <div className='bloglist-info-container'>
                <h3 className='bloglist-info-title'>{`${number}. ${item.title}`}</h3>
                <p className='bloglist-info-text'>{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BlogListPostPage;
