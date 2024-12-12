import { axiosInstance } from './index.api';
import { IRecommendPlaces } from '@/types/Location';

//장소 저장
export const postPlace = async (usersPlace: any, roomId: string) => {
  return axiosInstance.post(
    `/api/place-rooms/rooms/${roomId}`,
    { addresses: usersPlace },
    {
      withCredentials: true,
    },
  );
};

//장소 조회
export const getPlaceInfo = async (roomId: string) => {
  const { data } = await axiosInstance.get(`/api/place-rooms/rooms/${roomId}`);
  return data.data;
};

//장소 삭제
export const deletePlace = async (roomId: string) => {
  const { data } = await axiosInstance.delete(
    `/api/place-rooms/rooms/${roomId}`,
  );
  return data.data;
};

//중간지점 결과 조회
export const getMidPoints = async (roomId: string) => {
  const { data } = await axiosInstance.get(`/api/mid-points/rooms/${roomId}`);
  return data.data;
};

//추천장소 조회
export const getRecommendPlaces = async (payload: IRecommendPlaces) => {
  const { data } = await axiosInstance.get('/api/recommend-places', {
    params: {
      payload,
    },
  });
  return data;
};
