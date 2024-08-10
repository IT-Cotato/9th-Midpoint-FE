import axios from 'axios';
import { BACKEND_URL } from '.';

interface ILoginPayload {
  readonly roomId: string;
  readonly name: string;
  readonly pw: string;
}

export const fetchLogin = async (loginPayload: ILoginPayload) => {
  return axios.post(`${BACKEND_URL}/api/members/login`, loginPayload, {
    withCredentials: true,
  });
};
