import { axiosInstance } from '.';

export const fetchMidPointResults = async () => {
  const { data } = await axiosInstance.get('/api/mid-points');
  return data;
};
