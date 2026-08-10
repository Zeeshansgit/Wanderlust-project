import axios from 'axios';
import { useEffect, useState } from 'react';
import FeaturedPostCard from '@/components/featured-post-card';
import LatestPostCard from '@/components/latest-post-card';
import { FeaturedPostCardSkeleton } from '@/components/skeletons/featured-post-card-skeleton';
import { LatestPostCardSkeleton } from '@/components/skeletons/latest-post-card-skeleton';
import CategoryPill from '@/components/category-pill';
import { categories } from '@/utils/category-colors';

export default function BlogFeed() {
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [posts, setPosts] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryEndpoint =
      selectedCategory === 'featured'
        ? '/api/posts/featured'
        : `/api/posts/categories/${selectedCategory}`;

    setLoading(true);

    axios
      .get(import.meta.env.VITE_API_PATH + categoryEndpoint)
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.posts || [];

        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPosts([]);
        setLoading(false);
      });
  }, [selectedCategory]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_PATH + '/api/posts/latest')
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.posts || [];

        setLatestPosts(data);
      })
      .catch((error) => {
        console.error(error);
        setLatestPosts([]);
      });
  }, []);

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold">
          What's hot?
        </h2>

        <h3 className="text-xl">
          {selectedCategory === 'featured'
            ? 'Featured Posts'
            : `Posts related to "${selectedCategory}"`}
        </h3>

        {posts.length === 0 || loading ? (
          Array(5)
            .fill(0)
            .map((_, index) => (
              <FeaturedPostCardSkeleton key={index} />
            ))
        ) : (
          posts.slice(0, 5).map((post, index) => (
            <FeaturedPostCard
              key={post._id || index}
              post={post}
            />
          ))
        )}
      </section>


      <section>
        <h2 className="text-2xl font-bold">
          Discover by topic
        </h2>

        <h3 className="text-xl">
          Categories
        </h3>

        <div>
          {categories.map((category) => (
            <button
              key={category}
              aria-label={category}
              type="button"
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category
                    ? 'featured'
                    : category
                )
              }
            >
              <CategoryPill
                category={category}
                selected={selectedCategory === category}
              />
            </button>
          ))}
        </div>
      </section>


      <section>
        <h2 className="text-2xl font-bold">
          What's new?
        </h2>

        <h3 className="text-xl">
          Latest Posts
        </h3>

        {latestPosts.length === 0 ? (
          Array(5)
            .fill(0)
            .map((_, index) => (
              <LatestPostCardSkeleton key={index} />
            ))
        ) : (
          latestPosts.slice(0, 5).map((post, index) => (
            <LatestPostCard
              key={post._id || index}
              post={post}
            />
          ))
        )}
      </section>
    </>
  );
}