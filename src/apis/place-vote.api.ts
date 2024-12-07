import { CreateSubmissionData } from '@/types/location';
import { axiosInstance } from './index.api';

//room 방 생성
export const postPlaceVoteRoom = async (
  payload: CreateSubmissionData[],
  roomId: string,
) => {
  const { data } = await axiosInstance.post(
    `/api/place-vote-rooms/rooms/${roomId}`,
    { placeCandidates: payload },
  );
  return data.data;
};

//room 방 재생성 업데이트
export const putPlaceVoteRoom = async (
  payload: CreateSubmissionData[],
  roomId: string,
) => {
  const { data } = await axiosInstance.put(
    `/api/place-vote-rooms/rooms/${roomId}`,
    { placeCandidates: payload },
  );
  return data.data;
};

//장소 투표하기
export const postPlaceVote = async (roomId: string, payload: number) => {
  const { data } = await axiosInstance.post(
    `/api/place-votes/rooms/${roomId}`,
    payload,
  );

  return data.data;
};

//장소 재투표하기
export const putPlaceVote = async (roomId: string, payload: number) => {
  const { data } = await axiosInstance.put(
    `/api/place-votes/rooms/${roomId}`,
    payload,
  );
  return data.data;
};

//장소 투표방 결과 조회
export const getPlaceVotes = async (roomId: string) => {
  const { data } = await axiosInstance.get(
    `/api/place-votes/result/rooms/${roomId}`,
  );
  return data.data;
};

//장소 투표여부, 항목 조회
export const getPlaceVoted = async (roomId: string) => {
  const { data } = await axiosInstance.get(
    `/api/place-votes/voted/rooms/${roomId}`,
  );
  return data.data;
};
