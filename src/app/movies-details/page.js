'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { client } from '../../../sanity';
import { useSearchParams } from 'next/navigation';
import '../../styles/movies-details.css';

function MoviesDetailsContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const query = `*[_type == "moviesDetails" && slug.current == $slug][0]{
          title,
          year,
          country,
          revenue,
          director,
          studio,
          genre,
          "imageUrl": image.asset->url,
          description
        }`;
        const data = await client.fetch(query, { slug });
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    if (slug) {
      fetchMovie();
    }
  }, [slug]);

  if (!movie) {
    return <div className="movies-details-loading">Loading movie details...</div>;
  }

  return (
    <div className="movies-details-container">

      <div className="movies-details-row">

        <div className="movies-details-image">
          <img src={movie.imageUrl} alt={movie.title} />
        </div>

        <div className="movies-details-info">
          <h1>{movie.title}</h1>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Studio:</strong> {movie.studio}</p>
          <p><strong>Revenue:</strong> ${movie.revenue?.toLocaleString()}</p>
          <p><strong>Country:</strong> {movie.country}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Genre:</strong> {movie.genre?.join(', ')}</p>
        </div>
        
      </div>

      <div className="movies-details-description">
        <h2>Description</h2>
        <p>{movie.description}</p>
      </div>

    </div>
  );
}

export default function MoviesDetailsPage() {
  return (
    <Suspense fallback={<div className="movies-details-loading">Loading movie details...</div>}>
      <MoviesDetailsContent />
    </Suspense>
  );
}
