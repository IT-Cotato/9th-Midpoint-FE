import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

interface IDatePayload {
  readonly roomId: string;
  readonly dates: string[]; // 날짜 리스트
  readonly dateTime: {
    memberAvailableStartTime: string; // 시작
    memberAvailableEndTime: string; // 마지막
  }[];
}

// 시간투표방 생성하기
export const createVoteRoom = async (payload: Omit<IDatePayload, 'dateTime'>) => {
  return axios.post(`${BACKEND_URL}/api/time-vote-rooms`, payload);
};//response의 id 제외

export const postVoteTime = async (payload: IDatePayload) => {
  return axios.post(`${BACKEND_URL}/api/time-vote-rooms/vote`, payload);
};
