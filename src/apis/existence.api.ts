import { axiosInstance } from './index.api';
import { IDatePayload } from './time-vote.api';
import { FROM_CREATE_PLACE_VOTE, FROM_CREATE_TIME_VOTE } from '@/constants';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

//에러코드 예외처리 함수
export const handleApiErrorCase = (error: any, roomId: string, state: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.log(error.response.reason);
        break;
      case 401:
        navigate(`/page/login`, {
          state: state,
        });
        break;
      case 403:
        console.log(error.response.reason, '해당 방의 회원이 아닙니다.');
        navigate(`/room-list`, {
          state: state,
        });
        break;
      case 409:
        console.log(error.response.reason, '이미 투표방이 존재합니다.');
        if (state.from === FROM_CREATE_PLACE_VOTE)
          navigate(`place/vote/:${roomId}`);
        else if (state.from === FROM_CREATE_TIME_VOTE)
          navigate(`time/vote/:${roomId}`);
        break;
      case 422:
        navigate('/not-found');
        break;
      default:
        navigate('/');
    }
  } else {
    console.error('API 호출 오류:', error); // 네트워크 오류 등
  }
};

//방 조회
export const getRoomExistence = async (roomId: string) => {
  const { data } = await axiosInstance.get(
    `/api/member-rooms/rooms/exists/${roomId}`,
  );
  return data.data;
};

//장소투표 방 조회
export const getPlaceRoomExists = async (roomId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/place-vote-rooms/rooms/${roomId}`,
    );
    return data.data;
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_CREATE_PLACE_VOTE });
    throw error;
  }
};

//시간투표 방 조회
export const getTimeRoomExists = async ({ roomId }: IDatePayload) => {
  try {
    const { data } = await axiosInstance.get(
      `/api/time-vote-rooms/rooms/${roomId}`,
    );
    return data.data; // 응답 데이터 반환
  } catch (error) {
    handleApiErrorCase(error, roomId, { from: FROM_CREATE_TIME_VOTE });
    throw error;
  }
};
