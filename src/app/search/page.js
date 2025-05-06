'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { client } from '../../../sanity';
import '../../styles/search.css';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';
  const [selectedCategory, setSelectedCategory] = useState('blogs');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const queries = {
    blogs: `
      *[
        (_type == "blogsListDetails" || _type == "blogsStandardDetails") && $query in tags
      ]{
        title,
        "slug": slug.current,
        "image": mainImage.asset->url,
        intro,
        _type
      }
    `,


    anime: `
      *[_type == "animesDetails" && $query in tags]{
        title,
        "slug": slug.current,
        "image": image.asset->url,
        "intro":description
      }
    `,
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    const fetchResults = async () => {
      try {
        const fetchedResults = await client.fetch(queries[selectedCategory], { query });
        setResults(fetchedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCategory]);

  const getDetailsLink = (category, item) => {

    if (category === 'anime') return `/anime-details?slug=${item.slug}`;
    if (category === 'blogs') {
      if (item._type === 'blogsListDetails') return `/blog-list?slug=${item.slug}`;
      if (item._type === 'blogsStandardDetails') return `/blog-standard-post?slug=${item.slug}`;
    }
    return '/';
  };

  return (
    <div className="search-container">
      {/* Category Filters */}
      <div className="search-filters">

        {['blogs', 
          'anime'].map((category) => (
          <button
            key={category}
            className={`search-filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Results */}
      <div className="search-results-container">
        {loading ? (
          <p className="search-loading">Loading Post...</p>
        ) : results.length > 0 ? (
          results.filter((item) => item.slug).map((item) => (
            <Link
              key={`${item._type || selectedCategory}-${item.slug}`}
              href={getDetailsLink(selectedCategory, item)}
              className="search-result-item"
            >
              <div className="search-result-image-container">
                <img src={item.image} alt={item.title} className="search-square-image" />
              </div>
              <div className="search-result-content">
                <div className="search-result-title">{item.title}</div>
                {item.intro && (
                  <p className="search-result-description">
                    {item.intro.length > 150
                      ? item.intro.slice(0, 150) + '...'
                      : item.intro}
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="search-no-results">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="search-loading">Loading Post...</div>}>
      <SearchContent />
    </Suspense>
  );
}
