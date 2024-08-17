import { axiosInstance } from '.';

export const fetchTimeRoomExists = async (RoomId: string, RoomType: string) => {
  const { data } = await axiosInstance.get('/api/time-vote-rooms', {
    headers: {
      RoomId,
      RoomType,
    },
  });
  return data.data;
};

export const fetchTimeVoted = async (RoomId: string, RoomType: string) => {
  const { data } = await axiosInstance.get('/api/time-vote-rooms/voted', {
    headers: {
      RoomId,
      RoomType,
    },
  });
  return data.data;
};
