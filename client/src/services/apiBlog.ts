import api from '@/api';

export async function getBlogs(page: number) {
  try {
    const response = await api.get(`blog_list?page=${page}`);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function getBlog(slug: string) {
  try {
    const response = await api.get(`blogs/${slug}`);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function registerUser(data: UserSignInfo) {
  try {
    const response = await api.post('register_user/', data);
    return response.data;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      (err as { status?: number }).status === 400
    ) {
      throw new Error('Username already exists');
    }
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function signin(data: UserLoginInfo) {
  try {
    const response = await api.post('token/', data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function getUsername() {
  try {
    const response = await api.get('get_username/');
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function createBlog(data: FormData) {
  try {
    const response = await api.post('create_blog/', data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function updateBlog(data: FormData, id: number) {
  try {
    const response = await api.put(`update_blog/${id}`, data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function deleteBlog(id: number) {
  try {
    const response = await api.post(`delete_blog/${id}/`);
    return response.data;
  } catch (err) {
    // if (err.response) {
    //   throw new Error(err.response?.data?.message || 'Failed to delete blog');
    // }

    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function getUserInfo(username: string) {
  try {
    const response = await api.get(`get_userinfo/${username}`);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}

export async function updateProfile(data: FormData) {
  try {
    const response = await api.put(`update_user/`, data);
    return response.data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred');
  }
}
