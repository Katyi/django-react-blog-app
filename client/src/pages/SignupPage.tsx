import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { registerUser, updateProfile } from '@/services/apiBlog';
import CustomFileInput from '@/ui_components/CustomFileInput';
import InputError from '@/ui_components/InputError';
import SmallSpinner from '@/ui_components/SmallSpinner';
import SmallSpinnerText from '@/ui_components/SmallSpinnerText';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SignupPageProps {
  userInfo?: UserSignInfo;
  updateForm?: boolean;
  toggleModal?: () => void;
}

const SignupPage = ({ userInfo, updateForm, toggleModal }: SignupPageProps) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, reset, watch, control } = useForm({
    defaultValues: userInfo ? userInfo : {},
  });
  const { errors } = formState;

  const password = watch('password');

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: () => {
      toast.success('Профиль успешно обновлён!');
      toggleModal?.();
      queryClient.invalidateQueries({
        queryKey: ['users', userInfo?.username],
      });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserSignInfo) => registerUser(data),
    onSuccess: () => {
      toast.success('Вы успешно создали аккаунт!!!');
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(
    data: UserSignInfo & { password?: string; confirmPassword?: string }
  ) {
    if (updateForm) {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('job_title', data.job_title || '');
      formData.append('bio', data.bio || '');

      // if (data.profile_picture && data.profile_picture[0]) {
      //   if (data.profile_picture[0] != '/') {
      //     formData.append('profile_picture', data.profile_picture[0]);
      //   }
      // }
      // if (data.profile_picture && data.profile_picture[0]) {
      //   formData.append('profile_picture', data.profile_picture[0]);
      // } else if (data.profile_picture instanceof File) {
      //   formData.append('profile_picture', data.profile_picture);
      // }
      if (data.profile_picture && 
        data.profile_picture !== null && 
        data.profile_picture !== '' &&
        ((Array.isArray(data.profile_picture) && data.profile_picture[0]) || 
         (data.profile_picture instanceof File && data.profile_picture.size > 0))) {
      if (Array.isArray(data.profile_picture)) {
        formData.append('profile_picture', data.profile_picture[0]);
      } else {
        formData.append('profile_picture', data.profile_picture);
      }
    }

      updateProfileMutation.mutate(formData);
    } else {
      mutation.mutate(data);
    }
  }

  return (
    <form
      className={`${
        updateForm && 'h-[90%] overflow-auto'
      } md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-0.5 w-[60%] 
    rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {updateForm ? 'Обновить профиль' : 'Регистрация'}
        </h3>
        <p>
          {updateForm
            ? 'Расскажите нам больше о себе.'
            : 'Создайте аккаунт, чтобы начать!'}
        </p>
      </div>

      <div className="flex flex-wrap justify-between gap-4">
        {/* USERNAME */}
        <div>
          <Label htmlFor="username" className="dark:text-[97989F]">
            Имя пользователя
          </Label>
          <Input
            type="text"
            id="username"
            placeholder="Введите имя пользователя"
            {...register('username', {
              required: 'Поле обязательно',
              minLength: {
                value: 3,
                message: 'Имя пользователя должно быть не менее 3 символов',
              },
            })}
            className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          <p className="h-3 leading-[10px] text-[10px] my-0.5">
            {errors?.username?.message && (
              <InputError error={errors.username.message} />
            )}
          </p>
        </div>

        {/* FIRST NAME */}
        <div>
          <Label htmlFor="first_name">Имя</Label>
          <Input
            type="text"
            id="first_name"
            placeholder="Введите имя"
            {...register('first_name', {
              required: 'Поле обязательно',
              minLength: {
                value: 3,
                message: 'Имя должно быть не менее 3 символов',
              },
            })}
            className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          <p className="h-3 leading-[10px] text-[10px] my-0.5">
            {errors?.first_name?.message && (
              <InputError error={errors.first_name.message} />
            )}
          </p>
        </div>

        {/* LAST NAME */}
        <div>
          <Label htmlFor="last_name">Фамилия</Label>
          <Input
            type="text"
            id="last_name"
            placeholder="Введите фамилию"
            {...register('last_name', {
              required: 'Поле обязательно',
              minLength: {
                value: 3,
                message: 'Фамилия должна быть не менее 3 символов',
              },
            })}
            className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
          />
          <p className="h-3 leading-[10px] text-[10px] my-0.5">
            {errors?.last_name?.message && (
              <InputError error={errors.last_name.message} />
            )}
          </p>
        </div>

        {/* JOB TITLE */}
        {updateForm && (
          <div>
            <Label htmlFor="job_title" className="dark:text-[97989F]">
              Профессия
            </Label>
            <Input
              type="text"
              id="job_title"
              placeholder="Введите свою профессию"
              {...register('job_title', {
                required: 'Поле обязательно',
                minLength: {
                  value: 3,
                  message: 'Ваша профессия должна быть не менее 3 символов',
                },
              })}
              className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
            <p className="h-3 leading-[10px] text-[10px] my-0.5">
              {errors?.job_title?.message && (
                <InputError error={errors.job_title.message} />
              )}
            </p>
          </div>
        )}

        {/* BIO */}
        {updateForm && (
          <div>
            <Label htmlFor="content">Био</Label>
            <Textarea
              id="content"
              placeholder="Расскажите о себе"
              {...register('bio', {
                required: 'Поле обязательно',
                minLength: {
                  value: 10,
                  message: 'Текст должен быть не менее 10 символов',
                },
              })}
              className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[300px] text-justify"
            />
            <p className="h-3 leading-[10px] text-[10px] my-0.5">
              {errors?.bio?.message && (
                <InputError error={errors.bio.message} />
              )}
            </p>
          </div>
        )}

        {/* FILE */}
        {/* {updateForm && (
        <div className="w-full">
          <Label htmlFor="profile_picture">Фото профиля</Label>

          <Input
            type="file"
            id="picture"
            {...register('profile_picture', {
              required: false,
            })}
            className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-full max-sm:w-[300px] max-sm:text-[14px]"
          />

          {/* {errors?.profile_picture?.message && (
            <InputError error={errors.profile_picture.message} />
          )} */}
        {/* </div> */}
        {/* )} */}

        {/* FILE */}
        {updateForm && (
          <div>
            <Controller
              name="profile_picture"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomFileInput
                  label="Фото профиля"
                  onChange={onChange}
                  value={value as string | File | null}
                />
              )}
              rules={{ required: false }}
            />
            <p className="h-3 leading-[10px] text-[10px] my-0.5">
              {errors?.profile_picture?.message && (
                <InputError error={errors.profile_picture.message} />
              )}
            </p>
          </div>
        )}

        {/* PASSWORD */}
        {updateForm || (
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              type="password"
              id="password"
              placeholder="Введите пароль"
              {...register('password', {
                required: 'Поле обязательно',
                minLength: {
                  value: 8,
                  message: 'Пароль должен быть не менее 8 символов',
                },
              })}
              className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
            <p className="h-3 leading-[10px] text-[10px] my-0.5">
              {errors?.password?.message && (
                <InputError error={errors.password.message} />
              )}
            </p>
          </div>
        )}

        {/* CONFIRM PASSWORD */}
        {updateForm || (
          <div>
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Подтвердите пароль"
              {...register('confirmPassword', {
                required: 'Поле обязательно',
                minLength: {
                  value: 8,
                  message: 'Пароль должен быть не менее 8 символов',
                },
                validate: (value) =>
                  value === password || 'Пароли не совпадают',
              })}
              className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[40px] w-[300px]"
            />
            <p className="h-3 leading-[10px] text-[10px] my-0.5">
              {errors?.confirmPassword?.message && (
                <InputError error={errors.confirmPassword.message} />
              )}
            </p>
          </div>
        )}

        <div className="w-full flex items-center justify-center flex-col my-4">
          {updateForm ? (
            <button className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
              {updateProfileMutation.isPending ? (
                <>
                  <SmallSpinner />
                  <SmallSpinnerText text="Обновление пользователя..." />
                </>
              ) : (
                <SmallSpinnerText text="Обновить профиль пользователя" />
              )}
            </button>
          ) : (
            <button className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
              {mutation.isPending ? (
                <>
                  <SmallSpinner />
                  <SmallSpinnerText text="Регистрация..." />
                </>
              ) : (
                <SmallSpinnerText text="Зарегистрироваться" />
              )}
            </button>
          )}
          {updateForm || (
            <p className="text-[14px]">
              <Link to="/signin">Уже есть аккаунт? Войти</Link>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignupPage;
