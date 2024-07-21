import axios from 'axios';
import { BACKEND_URL } from '.';

export const fetchExistence = async (roomId: string) => {
  const { data } = await axios.get(`${BACKEND_URL}/api/rooms/${roomId}/existence`);
  return data.data;
};
