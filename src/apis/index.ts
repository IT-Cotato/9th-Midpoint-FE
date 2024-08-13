import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;
export const REFRESH_URL = BACKEND_URL + '/api/auth/refresh';

// login이 완료된 사람의 요청의 경우 axiosInstance를 사용하여 요청
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

// 로그 아웃 함수
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('roomId');
};

// accessToken, refreshToken 재발급하는 함수
const getNewToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.get(REFRESH_URL, {
      headers: {
        'Authorization-refresh': `Bearer ${refreshToken}`,
      },
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    return { accessToken, refreshToken: newRefreshToken };
  } catch (e) {
    logout();
    return null;
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
    //  402에러가 아니거나 재요청이거나 refresh 요청인 경우 그냥 에러 발생
    if (response.status !== 402 || config.sent || config.url === REFRESH_URL) {
      return Promise.reject(error);
    }

    // 아닌 경우 토큰 갱신
    config.sent = true; // 무한 재요청 방지
    const newToken = await getNewToken();

    if (newToken) {
      localStorage.setItem('accessToken', newToken.accessToken);
      localStorage.setItem('refreshToken', newToken.refreshToken);
      config.headers.Authorization = `Bearer ${newToken.accessToken}`;
      return axiosInstance(config); // 재요청
    }

    return Promise.reject(error);
  },
);
