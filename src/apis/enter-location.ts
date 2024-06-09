import axios from 'axios';
import { axiosInstance } from '.';

export const fetchIsValidRoomId = async (roomId: string) => {
  const { data } = await axios.get(`/api/rooms/${roomId}/duplicate`);
  return data;
};

export const fetchSavePlace = async (data: any) => {
  return axiosInstance.post('/api/place-rooms', data, {
    withCredentials: true,
  });
};

export const fetchRoomUsersInfo = async (roomId: string) => {
  const { data } = await axiosInstance.get(`/api/place-rooms/${roomId}/users`);
  return data;
};
