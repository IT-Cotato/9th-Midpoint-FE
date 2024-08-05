import { axiosInstance } from '.';

export const fetchAloneSavePlace = async (usersPlace: any) => {
  return axiosInstance.post(
    '/api/place-rooms/self',
    { addresses: usersPlace },
    {
      withCredentials: true,
    },
  );
};

export const fetchEachSavePlace = async (data: any) => {
  return axiosInstance.post('/api/place-rooms', data, {
    withCredentials: true,
  });
};
