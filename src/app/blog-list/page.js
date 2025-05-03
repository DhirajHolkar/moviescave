import React, { Suspense } from 'react';
import BlogListPostPage from './BlogListPostPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="loading">Loading post...</p>}>
      <BlogListPostPage />
    </Suspense>
  );
}
