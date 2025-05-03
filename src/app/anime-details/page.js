// app/anime-details/page.js

import React, { Suspense } from 'react';
import AnimeDetailsPage from './AnimeDetailsPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="loading">Loading anime details...</div>}>
      <AnimeDetailsPage />
    </Suspense>
  );
}
