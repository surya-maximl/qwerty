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
  userId: string;
  token: string;
};

type LoginInfo = {
  msg: string;
  emailSent: boolean;
};

type SignupInfo = {
  msg: Object;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchUserDetails: build.query<User, string>({
      query: (token) => {
        return {
          url: 'auth',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
      }
    }),
    login: build.mutation<User | LoginInfo, loginForm>({
      query: (credentials) => {
        return {
          url: 'auth/signin',
          method: 'POST',
          body: credentials
        };
      },
      invalidatesTags: ['User']
    }),
    signup: build.mutation<User | SignupInfo, signupForm>({
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
      query: ({ companyName, phoneNumber, userId }) => {
        return {
          url: 'auth/setup-account-from-token',
          method: 'POST',
          body: {
            companyName,
            phoneNumber,
            userId
          }
        };
      },
      transformResponse: (response: User, meta, arg) => {
        return {
          ...response,
          token: arg.token
        };
      },
      invalidatesTags: ['User']
    })
  })
});

export const {
  useLoginMutation,
  useSignupMutation,
  useHandleInvitationMutation,
  useFetchUserDetailsQuery
} = authApi;
