'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { client } from '../../../sanity';
import '../../styles/tvshows-details.css';

const TvshowsDetailsPage = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [tvshow, setTvshow] = useState(null);

  // Fetch TV show details when slug is available
  useEffect(() => {
    if (!slug) return;

    const fetchTvshow = async () => {
      try {
        const query = `
          *[_type == "tvshowsDetails" && slug.current == $slug][0]{
            title,
            year,
            country,
            revenue,
            director,
            studio,
            genre,
            "imageUrl": image.asset->url,
            description
          }
        `;
        const data = await client.fetch(query, { slug });
        setTvshow(data);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
      }
    };

    fetchTvshow();
  }, [slug]);

  if (!slug) {
    return <div className="tvshows-details-loading">Invalid slug.</div>;
  }

  if (!tvshow) {
    return <div className="tvshows-details-loading">Loading TV show details...</div>;
  }

  return (
    <div className="tvshows-details-container">
      <div className="tvshows-details-row">
        <div className="tvshows-details-image">
          <img src={tvshow.imageUrl} alt={tvshow.title} />
        </div>
        <div className="tvshows-details-info">
          <h1>{tvshow.title}</h1>
          <p><strong>Year:</strong> {tvshow.year}</p>
          <p><strong>Studio:</strong> {tvshow.studio}</p>
          <p><strong>Revenue:</strong> ${tvshow.revenue?.toLocaleString()}</p>
          <p><strong>Country:</strong> {tvshow.country}</p>
          <p><strong>Director:</strong> {tvshow.director}</p>
          <p><strong>Genre:</strong> {tvshow.genre?.join(', ')}</p>
        </div>
      </div>
      <div className="tvshows-details-description">
        <h2>Description</h2>
        <p>{tvshow.description}</p>
      </div>
    </div>
  );
};

// Wrap the component inside Suspense to handle the loading state for client-side fetching.
const TvshowsDetailsPageWithSuspense = () => (
  <Suspense fallback={<div className="tvshows-details-loading">Loading...</div>}>
    <TvshowsDetailsPage />
  </Suspense>
);

export default TvshowsDetailsPageWithSuspense;
