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

type invitationForm = {
  companyName: string;
  phoneNumber: string;
  token: string;
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
    }),
    handleInvitation: build.mutation<User, invitationForm>({
      query: (invitationDetails) => {
        return {
          url: 'auth/setup-account-from-token',
          method: 'POST',
          body: invitationDetails
        };
      },
      invalidatesTags: ['User']
    })
  })
});

export const { useLoginMutation, useSignupMutation, useHandleInvitationMutation } = authApi;
