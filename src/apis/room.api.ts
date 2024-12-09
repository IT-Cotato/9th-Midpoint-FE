import { axiosInstance } from './index.api';

//회원이 속한 방 조회
export const getRooms = async () => {
  const { data } = await axiosInstance.get(`/api/member-rooms`);
  return data.data;
};

//회원을 방에 저장
export const postMemberRoom = async (roomId: string) => {
  const { data } = await axiosInstance.post(
    `/api/member-rooms.rooms/${roomId}`,
  );
  return data.data;
};

//방 생성
export const postRoom = async (name: string) => {
  const { data } = await axiosInstance.post(`/api/rooms`, name);
  return data.data;
};

//방 이름 수정
export const putRoom = async (roomId: string, name: string) => {
  const { data } = await axiosInstance.post(`/api/rooms/${roomId}`, name);
  return data.data;
};
