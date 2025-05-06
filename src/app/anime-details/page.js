// app/anime-details/page.js

import React, { Suspense } from 'react';
import AnimeDetailsPage from './AnimeDetailsPage';
import '../../styles/anime-details.css'

export default function Page() {
  return (
    <Suspense fallback={<div className="anime-details-loading">Loading Post...</div>}>
      <AnimeDetailsPage />
    </Suspense>
  );
}
