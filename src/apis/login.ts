import axios from 'axios';

interface ILoginPayload {
  readonly roomId: string;
  readonly id: string;
  readonly pw: string;
}

// 유저 로그인을 위한 함수
export const fetchLogin = async (loginPayload: ILoginPayload) => {
  return axios.post('/api/auth/login', loginPayload);
};
