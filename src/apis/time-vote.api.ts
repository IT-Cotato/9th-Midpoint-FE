import { FROM_CREATE_TIME_VOTE, FROM_TIME_VOTE } from '@/constants';
import { axiosInstance } from './index.api';
import { handleApiErrorCase } from './existence.api';

export interface IDatePayload {
  roomId: string;
  dates?: string[]; // 날짜 리스트
  dateTime?: {
    memberAvailableStartTime: string; // 시작
    memberAvailableEndTime: string; // 마지막
  }[];
}

//room 방 생성
export const postTimeVoteRoom = async ({ roomId, dates }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.post(
      `/api/time-vote-rooms/rooms/${roomId}`,
      dates,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_CREATE_TIME_VOTE });
    throw error;
  }
};

//room 방 재생성 업데이트
export const putTimeVoteRoom = async ({ roomId, dates }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.put(
      `/api/place-vote-rooms/rooms/${roomId}`,
      dates,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_CREATE_TIME_VOTE });
    throw error;
  }
};

//시간 투표하기
export const postTimeVote = async ({ roomId, dateTime }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.post(
      `/api/time-votes/rooms/${roomId}`,
      dateTime,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_TIME_VOTE });
    throw error;
  }
};

//시간 재투표하기
export const putTimeVote = async ({ roomId, dateTime }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.put(
      `/api/time-votes/rooms/${roomId}`,
      dateTime,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_TIME_VOTE });
    throw error;
  }
};

//시간 투표방 결과 조회
export const getTimeVotes = async ({ roomId }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/time-votes/result/rooms/${roomId}`,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_TIME_VOTE });
    throw error;
  }
};

//시간 투표여부, 항목 조회
export const getTimeVoted = async ({ roomId }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/place-votes/voted/rooms/${roomId}`,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_TIME_VOTE });
    throw error;
  }
};
