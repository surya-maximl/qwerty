import { getCookie } from '../../core/utils/authUtils';
import { type AuthState } from '../interfaces';
import { getCookie } from '../../core/utils/authUtils';

export const AUTH_INITIAL_STATE: AuthState = {
  user: {
    email: 'har@gmail.com',
    id: 'f7e61c15-5449-475a-bf68-368b7fed536a',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGFyc2ggR3VwdGEiLCJpZCI6ImY3ZTYxYzE1LTU0NDktNDc1YS1iZjY4LTM2OGI3ZmVkNTM2YSIsImlhdCI6MTcwODc2Mjg5NiwiZXhwIjoxNzA5MTIyODk2fQ.fUQvQ6i87Y3TpxRQRj4QtDA5Ro2LZG2ZHBRHIB3MdpM',
    username: 'Harsh Gupta'
  },
  loggedIn: getCookie('accessToken') ? true : false
};
