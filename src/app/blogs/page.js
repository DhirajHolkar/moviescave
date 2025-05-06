'use client';
import React, { useEffect, useState } from 'react';
import { client } from '../../../sanity'; // adjust the path if needed
import '../../styles/blogs-page.css'

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const standardPosts = await client.fetch(`
          
          
          *[_type == "blogsStandardDetails"] {
            _id,
            _type,
            title,
            slug,
            "image":mainImage.asset->url,
            description
          }
        `);

        // "image": items[0].image.asset->url,
        
        const listPosts = await client.fetch(`
          *[_type == "blogsListDetails"] {
            _id,
            _type,
            title,
            slug,
            "image":mainImage.asset->url,
            intro
          }
        `);

        const allPosts = [
          ...standardPosts.map(post => ({
            id: post._id,
            type: 'standard',
            title: post.title,
            slug: post.slug?.current || '',
            image: post.image,
            intro: post.intro,
          })),
          ...listPosts.map(post => ({
            id: post._id,
            type: 'list',
            title: post.title,
            slug: post.slug?.current || '',
            image: post.image,
            intro: post.intro,
          })),
        ];

        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className='blogs-page-loading'>Loading Posts...</div>;
  }

  if (!posts.length) {
    return <div className='blogs-page-loading'>No Posts Found.</div>;
  }

  return (

    <div className='blogs-container'>


      {posts.map(post => (

        <div key={post.id} className='blogs-container-postcard'>

          <a 
          
          href={
            post.type === 'list'
            ? `/blog-list?slug=${post.slug}`
            : `/blog-standard-post?slug=${post.slug}`
          } 

            className='blogs-link'>


            {post.image && <img src={post.image} alt={post.title} className='blogs-image' />}
            <div className='blogs-title'>{post.title}</div>
            <p className='blogs-description'>
              {post.intro?.length > 100 ? post.intro.slice(0, 100) + '...' : post.intro}
            </p>


          </a>


        </div>


      ))}


    </div>
  );
}
