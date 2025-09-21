declare global {
  interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    featured_image: string;
    category?: string;
    author: {
      username: string;
      profile_picture: string;
      first_name: string;
      last_name: string;
    };
    published_date?: string;
  }
  interface UserSignInfo {
    username: string;
    first_name: string;
    last_name: string;
    job_title?: string;
    bio?: string;
    profile_picture?: FileList | string;
    password: string;
    confirmPassword: string;
  }
  interface UserLoginInfo {
    username: string;
    password: string;
  }
}

export {};
