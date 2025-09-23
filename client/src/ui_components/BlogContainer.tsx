import BlogCard from './BlogCard';
import Spinner from './Spinner';

interface BlogContainerProps {
  isPending?: boolean;
  blogs: Blog[];
  title?: string;
}

const BlogContainer = ({
  isPending,
  blogs = [],
  title = 'Публикации',
}: BlogContainerProps) => {
  if (isPending) {
    return <Spinner />;
  }

  return (
    <section className="padding-x py-6 max-container">
      <h2 className="font-semibold text-xl mb-6 dark:text-white">{title}</h2>

      {/* <div className="flex items-center gap-6 justify-center md:justify-between flex-wrap"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
        {blogs?.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default BlogContainer;
