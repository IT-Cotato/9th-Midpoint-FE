import axios from 'axios';
import { BACKEND_URL } from '.';

interface ILoginPayload {
  readonly roomId: string;
  readonly name: string;
  readonly pw: string;
}

// 유저 로그인을 위한 함수
export const fetchLogin = async (loginPayload: ILoginPayload) => {
  return axios.post(`${BACKEND_URL}/api/auth/login`, loginPayload, {
    withCredentials: true,
  });
};
