import Badge from './Badge';
import CardFooter from './CardFooter';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/api';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="px-3 py-3 rounded-md w-full md:w-[calc(100% / 2)] lg:x-[calc(100% / 2)] h-auto flex flex-col gap-4 dark:border-gray-800 border shadow-lg">
      <div className="w-full h-[200px] border rounded-md overflow-hidden">
        <img
          src={`${BASE_URL}${blog.featured_image}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <Badge blog={blog} />

      <Link to={`/blogs/${blog.slug}`}>
        <h3 className="font-semibold  leading-normal text-[#181A2A] mb-0 dark:text-white">
          {blog.title}
        </h3>
      </Link>

      <CardFooter blog={blog} />
    </div>
  );
};

export default BlogCard;
