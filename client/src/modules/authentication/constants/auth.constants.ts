import { type AuthState } from '../interfaces';
import { getCookie } from '../../core/utils/authUtils';

export const AUTH_INITIAL_STATE: AuthState = {
  user: {
    id: '9e1e9caf-e44d-4b0f-be1e-71100fb70920',
    // department: 'Inspection',
    // designation: 'Manager',
    email: 'nabajyoti.das@maximl.com',
    // role: 'Admin',
    // signature: 'Nabajyoti Das',
    // skills: [],
    username: 'Nabajyoti Das',
    token: ""
    // city: 'Bengaluru',
    // country: 'India',
    // settings: {
    //   language: {
    //     name: 'English',
    //     value: 'en'
    //   },
    //   locale: 'en_US',
    //   timezone: 'Asia/Kolkata'
    // }
  },
  loggedIn: getCookie("accessToken") ? true : false
};