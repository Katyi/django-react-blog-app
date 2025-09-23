import Badge from '@/ui_components/Badge';
import BlogWriter from '@/ui_components/BlogWriter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteBlog, getBlog } from '@/services/apiBlog';
import Spinner from '@/ui_components/Spinner';
import { BASE_URL } from '@/api';
import { HiPencilAlt } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import Modal from '@/ui_components/Modal';
import CreatePostPage from './CreatePostPage';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DetailPageProps {
  username: string | null;
  isAuthenticated: boolean;
}

const DetailPage = ({ username, isAuthenticated }: DetailPageProps) => {
  const { slug } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  function toggleModal() {
    setShowModal((curr) => !curr);
  }

  const {
    isPending,
    // isError,
    // error,
    data: blog,
  } = useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => getBlog(slug || ''),
  });

  const blogID = blog?.id;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBlog(id),
    onSuccess: () => {
      toast.success('Your post has been deleted successfully!');
      navigate('/');
    },

    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  function handleDeleteBlog() {
    const toastId = toast(
      <div>
        <p>Вы уверены, что хотите удалить этот пост?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              deleteMutation.mutate(blogID);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Да
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Нет
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  }

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <div className="padding-dx max-container py-9">
        <Badge blog={blog} />

        <div className="flex justify-between items-center gap-4">
          <h2 className="py-6 leading-normal text-2xl md:text-3xl text-[#181A2A] tracking-wide font-semibold dark:text-[#FFFFFF]">
            {blog?.title}
          </h2>

          {isAuthenticated && username === blog.author.username && (
            <span className="flex justify-between items-center gap-2">
              <HiPencilAlt
                onClick={toggleModal}
                className="dark:text-white text-3xl cursor-pointer"
              />

              <MdDelete
                onClick={handleDeleteBlog}
                className="dark:text-white text-3xl cursor-pointer"
              />
            </span>
          )}
        </div>

        <BlogWriter blog={blog} />

        <div className="w-full h-[350px] my-9 overflow-hidden rounded-sm">
          <img
            className="w-full h-full object-cover rounded-sm"
            src={`${BASE_URL}${blog.featured_image}`}
          />
        </div>
        <p className="text-[16px] leading-[2rem] text-justify text-[#3B3C4A] dark:text-[#BABABF]">
          {blog.content}
        </p>
      </div>

      {showModal && (
        <Modal toggleModal={toggleModal}>
          <CreatePostPage blog={blog} />
        </Modal>
      )}
    </>
  );
};

export default DetailPage;
