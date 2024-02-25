import { User } from '../../authentication/interfaces';
import baseApi from './baseApi';

type loginForm = {
  email: string;
  password: string;
};

type signupForm = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, loginForm>({
      query: (credentials) => {
        return {
          url: 'auth/signin',
          method: 'POST',
          body: credentials
        };
      },
      invalidatesTags: ['User']
    }),
    signup: build.mutation<User, signupForm>({
      query: (credentials) => {
        return {
          url: 'auth/signup',
          method: 'POST',
          body: credentials
        };
      },
      invalidatesTags: ['User']
    })
  })
});

export const { useLoginMutation, useSignupMutation } = authApi;
