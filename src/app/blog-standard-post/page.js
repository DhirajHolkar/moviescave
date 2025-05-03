'use client';

import { Suspense } from 'react';
import BlogPostContent from './BlogPostContent';

export default function BlogPostPage() {
  return (
    <Suspense fallback={<div>Loading post...</div>}>
      <BlogPostContent />
    </Suspense>
  );
}
