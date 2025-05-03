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
        (_type == "blogsList" || _type == "blogsStandard") && $query in tags
      ]{
        title,
        "slug": slug.current,
        "image": image.asset->url,
        description,
        _type
      }
    `,
    movies: `
      *[_type == "movies" && $query in tags]{
        title,
        "slug": slug.current,
        "image": image.asset->url,
        description
      }
    `,
    tvshows: `
      *[_type == "tvshows" && $query in tags]{
        title,
        "slug": slug.current,
        "image": image.asset->url,
        description
      }
    `,
    anime: `
      *[_type == "animes" && $query in tags]{
        title,
        "slug": slug.current,
        "image": image.asset->url,
        description
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
    if (category === 'movies') return `/movies-details?slug=${item.slug}`;
    if (category === 'tvshows') return `/tvshows-details?slug=${item.slug}`;
    if (category === 'anime') return `/anime-details?slug=${item.slug}`;
    if (category === 'blogs') {
      if (item._type === 'blogsList') return `/blog-list?slug=${item.slug}`;
      if (item._type === 'blogsStandard') return `/blog-standard-post?slug=${item.slug}`;
    }
    return '/';
  };

  return (
    <div className="search-container">
      {/* Category Filters */}
      <div className="search-filters">
        {['blogs', 'movies', 'tvshows', 'anime'].map((category) => (
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
          <p className="search-loading">Loading...</p>
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
                <h3 className="search-result-title">{item.title}</h3>
                {item.description && (
                  <p className="search-result-description">
                    {item.description.length > 150
                      ? item.description.slice(0, 150) + '...'
                      : item.description}
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
    <Suspense fallback={<div className="search-loading">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
