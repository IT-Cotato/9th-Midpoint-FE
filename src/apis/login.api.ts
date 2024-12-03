import axios from 'axios';
import { BACKEND_URL } from './index.api';
import { ILoginPayload, ISignupPayload } from '@/types/Login';

export const postSignup = async (signupPayload: ISignupPayload) => {
  return axios.post(`${BACKEND_URL}/api/members`, signupPayload, {
    withCredentials: true,
  });
};

export const postLogin = async ({ email, pw }: ILoginPayload) => {
  return axios.post(`${BACKEND_URL}/api/members/login?email=${email}pw=${pw}`, {
    withCredentials: true,
  });
};

export const postLogout = async (loginPayload: ILoginPayload) => {
  return axios.post(`${BACKEND_URL}/api/members/logout`, loginPayload, {
    withCredentials: true,
  });
};

//마이페이지
