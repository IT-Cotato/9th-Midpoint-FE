import { axiosInstance } from '.';

export const fetchSavePlace = async (data: any) => {
  return axiosInstance.post('/api/place-rooms', data, {
    withCredentials: true,
  });
};

export const fetchRoomUsersInfo = async (roomId: string) => {
  const { data } = await axiosInstance.get(`/api/place-rooms/${roomId}/users`);
  return data;
};
