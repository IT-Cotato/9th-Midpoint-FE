import { axiosInstance } from '.';

export const fetchPlaceRoomExists = async (RoomId: string, RoomType: string) => {
  const { data } = await axiosInstance.get('/api/place-vote-rooms', {
    headers: {
      RoomId,
      RoomType,
    },
  });
  return data.data;
};

export const fetchVoted = async (RoomId: string, RoomType: string) => {
  const { data } = await axiosInstance.get('/api/place-vote-rooms/voted', {
    headers: {
      RoomId,
      RoomType,
    },
  });
  return data.data;
};
