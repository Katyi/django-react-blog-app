import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { registerUser, updateProfile } from '@/services/apiBlog';
import InputError from '@/ui_components/InputError';
import SmallSpinner from '@/ui_components/SmallSpinner';
import SmallSpinnerText from '@/ui_components/SmallSpinnerText';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SignupPageProps {
  userInfo?: UserSignInfo;
  updateForm?: boolean;
  toggleModal?: () => void;
}

const SignupPage = ({ userInfo, updateForm, toggleModal }: SignupPageProps) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState, reset, watch } = useForm({
    defaultValues: userInfo ? userInfo : {},
  });
  const { errors } = formState;

  const password = watch('password');

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
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
      toast.success('You have successfully created an account!!!');
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

      if (data.profile_picture && data.profile_picture[0]) {
        if (data.profile_picture[0] != '/') {
          formData.append('profile_picture', data.profile_picture[0]);
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
      } md:px-16 px-8 py-6 flex flex-col mx-auto my-9 items-center gap-0.5 w-fit 
    rounded-lg bg-[#FFFFFF] shadow-xl dark:text-white dark:bg-[#141624]`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2 justify-center items-center mb-2">
        <h3 className="font-semibold text-2xl">
          {updateForm ? 'Update Profile Form' : 'SignUp Form'}
        </h3>
        <p>
          {updateForm
            ? 'You can tell us more about you.'
            : 'Create your account to get started!'}
        </p>
      </div>

      {/* USERNAME */}
      <div>
        <Label htmlFor="username" className="dark:text-[97989F]">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Enter username"
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
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
        <Label htmlFor="first_name">First Name</Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          {...register('first_name', {
            required: 'Firstname is required',
            minLength: {
              value: 3,
              message: 'Firstname must be at least 3 characters',
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
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          {...register('last_name', {
            required: 'Lastname is required',
            minLength: {
              value: 3,
              message: 'Lastname must be at least 3 characters',
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
            Job Title
          </Label>
          <Input
            type="text"
            id="job_title"
            placeholder="Enter Job Title"
            {...register('job_title', {
              required: 'Your job title is required',
              minLength: {
                value: 3,
                message: 'Your job title must be at least 3 characters',
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
          <Label htmlFor="content">Bio</Label>
          <Textarea
            id="content"
            placeholder="Tell us more about you"
            {...register('bio', {
              required: 'Your bio is required',
              minLength: {
                value: 10,
                message: 'The content must be at least 10 characters',
              },
            })}
            className="mt-0.5 border-2 border-[#141624] dark:border-[#3B3C4A] focus:outline-0 h-[180px]  w-[300px] text-justify"
          />
          <p className="h-3 leading-[10px] text-[10px] my-0.5">
            {errors?.bio?.message && <InputError error={errors.bio.message} />}
          </p>
        </div>
      )}

      {/* FILE */}
      {updateForm && (
        <div className="w-full">
          <Label htmlFor="profile_picture">Profile Picture</Label>
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
        </div>
      )}

      {/* PASSWORD */}
      {updateForm || (
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            {...register('confirmPassword', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              validate: (value) =>
                value === password || 'Passwords do not match',
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
                <SmallSpinnerText text="Updating user..." />
              </>
            ) : (
              <SmallSpinnerText text="Update user profile" />
            )}
          </button>
        ) : (
          <button className="bg-[#4B6BFB] text-white w-full py-3 px-2 rounded-md flex items-center justify-center gap-2">
            {mutation.isPending ? (
              <>
                <SmallSpinner />
                <SmallSpinnerText text="Creating user..." />
              </>
            ) : (
              <SmallSpinnerText text="Signup" />
            )}
          </button>
        )}
        {updateForm || (
          <p className="text-[14px]">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default SignupPage;
