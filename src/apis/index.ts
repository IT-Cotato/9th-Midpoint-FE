// login이 완료된 사람의 요청의 경우 axiosInstance를 사용하여 요청한다

import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
export const axiosInstance = axios.create({
  baseURL: '',
});
const REFRESH_URL = '';

// 로그 아웃 함수
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// accessToken, refreshToken 재발급하는 함수
const getNewToken = async () => {
  try {
    const accessToken = '';
    const refreshToken = '';
    return { accessToken, refreshToken };
    // Refresh Token을 사용하여 REFRESH_URL로 요청을 하여 새로운 Access Token, Refresh Token을 받아와 2값을 리턴하도록 구현
  } catch (e) {
    // Refresh Token에 문제가 있는 상황이며 이는 올바르지 않은 유저 로그인 과정이므로, 로그아웃 처리
    logout();
  }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 헤더에 엑세스 토큰 담기
    const accessToken: string | null = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    //  401에러가 아니거나 재요청이거나 refresh 요청인 경우 그냥 에러 발생
    if (response.status !== 401 || config.sent || config.url === REFRESH_URL) {
      return Promise.reject(error);
    }
    // 아닌 경우 토큰 갱신
    config.sent = true; // 무한 재요청 방지
    const newToken = await getNewToken();
    if (newToken) {
      localStorage.setItem('accessToken', newToken.accessToken);
      localStorage.setItem('refreshToken', newToken.refreshToken);
      config.headers.Authorization = `Bearer ${newToken.accessToken}`;
    }
    return axiosInstance(config); // 재요청
  },
);
