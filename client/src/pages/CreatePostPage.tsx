import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import InputError from '@/ui_components/InputError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlog, updateBlog } from '@/services/apiBlog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SmallSpinner from '@/ui_components/SmallSpinner';
import SmallSpinnerText from '@/ui_components/SmallSpinnerText';
import LoginPage from './LoginPage';
import CustomFileInput from '@/ui_components/CustomFileInput';

interface CreatePostPageProps {
  blog?: Blog;
  isAuthenticated?: boolean;
}

const CreatePostPage = ({ blog, isAuthenticated }: CreatePostPageProps) => {
  const { register, handleSubmit, formState, setValue, control } = useForm({
    defaultValues: blog ? blog : {},
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const blogID = blog?.id;

  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: number }) =>
      updateBlog(data, id),
    onSuccess: () => {
      navigate('/');
      toast.success('Your post has been updated successfully!');
      console.log('Your post has been updated successfully!');
    },

    onError: (err) => {
      toast.error(err.message);
      console.log('Error updating blog', err);
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => createBlog(data),
    onSuccess: () => {
      toast.success('New post added successfully');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      navigate('/');
    },
  });

  function onSubmit(data: Blog) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category || '');

    if (data.featured_image && 
      data.featured_image !== null && 
      data.featured_image !== '' &&
      ((Array.isArray(data.featured_image) && data.featured_image[0]) || 
       (data.featured_image instanceof File && data.featured_image.size > 0))) {
    if (Array.isArray(data.featured_image)) {
      formData.append('featured_image', data.featured_image[0]);
    } else {
      formData.append('featured_image', data.featured_image);
    }
  }

    if (blog && blogID) {
      updateMutation.mutate({ data: formData, id: blogID });
    } else {
      mutation.mutate(formData);
    }
  }

  if (isAuthenticated === false) {
    return <LoginPage />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${
        blog && 'h-[90%] overflow-auto'
      }  md:px-16 px-8 py-0 flex flex-col items-start mx-auto my-9 gap-6 w-fit rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
    >
      <div className="flex flex-col gap-2 justify-center items-center">
        <h3 className="font-semibold text-2xl max-sm:text-xl">
          {blog ? 'Изменить статью' : 'Написать статью'}
        </h3>

        <p className="max-sm:text-[14px]">
          {blog
            ? 'Вы хотите изменить свою статью?'
            : 'Напишите новую статью и поделитесь своими идеями.'}
        </p>
      </div>

      <div>
        <Label htmlFor="title" className="dark:text-[97989F]">
          Заголовок
        </Label>
        <Input
          type="text"
          id="title"
          {...register('title', {
            required: 'Поле обязательно',
            minLength: {
              value: 3,
              message: 'Заголовок должен быть не менее 3 символов',
            },
          })}
          placeholder="Дайте вашей статье заголовок"
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[400px] max-sm:w-[300px] max-sm:text-[14px]"
        />
        <p>
          {errors?.title?.message && (
            <InputError error={errors.title.message} />
          )}
        </p>
      </div>

      <div>
        <Label htmlFor="content">Текст</Label>
        <Textarea
          id="content"
          placeholder="Напишите свой текст"
          {...register('content', {
            required: 'Поле обязательно',
            minLength: {
              value: 10,
              message: 'Текст должен быть не менее 10 символов',
            },
          })}
          className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[400px] text-justify max-sm:w-[300px] max-sm:text-[14px]"
        />
        <p>
          {errors?.content?.message && (
            <InputError error={errors.content.message} />
          )}
        </p>
      </div>

      <div className="w-full">
        <Label htmlFor="category">Категория</Label>

        <Select
          {...register('category', { required: 'Поле обязательно' })}
          onValueChange={(value) => setValue('category', value)}
          defaultValue={blog ? blog.category : ''}
        >
          <SelectTrigger className="border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Категории</SelectLabel>
              <SelectItem value="Жизнь">Жизнь</SelectItem>
              <SelectItem value="Здоровье">Здоровье</SelectItem>
              <SelectItem value="Красота">Красота</SelectItem>
              <SelectItem value="Развлечения">Развлечения</SelectItem>
              <SelectItem value="Стиль">Стиль</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p>
          {errors?.category?.message && (
            <InputError error={errors.category.message} />
          )}
        </p>
      </div>

      <div className="h-fit">
        <Controller
          name="featured_image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomFileInput
              label="Изображение для статьи"
              onChange={onChange}
              value={value as string | File | null}
            />
          )}
          rules={{ required: false }}
        />
        <p className="h-3 leading-[10px] text-[10px] my-0.5">
          {errors?.featured_image?.message && (
            <InputError error={errors.featured_image.message} />
          )}
        </p>
      </div>

      <div className="w-full flex items-center justify-center flex-col mb-4">
        {blog ? (
          <button
            disabled={updateMutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <SmallSpinner /> <SmallSpinnerText text="Измение статьи..." />
              </>
            ) : (
              <SmallSpinnerText text="Изменить статью" />
            )}
          </button>
        ) : (
          <button
            disabled={mutation.isPending}
            className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <SmallSpinner /> <SmallSpinnerText text="Создание статьи..." />
              </>
            ) : (
              <SmallSpinnerText text="Написать статью" />
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreatePostPage;
