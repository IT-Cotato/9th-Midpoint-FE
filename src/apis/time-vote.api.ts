// import axios from 'axios';
import { ROOM_TYPE_ALONE, ROOM_TYPE_EACH } from '@/constants';
import { axiosInstance } from '.';

// interface IDatePayload {
//   readonly roomId: string | undefined;
//   readonly dates: string[]; // 날짜 리스트
//   readonly dateTime: {
//     memberAvailableStartTime: string; // 시작
//     memberAvailableEndTime: string; // 마지막
//   }[];
// }

//시간투표방 존재여부 확인하기
export const checkVoteRoom = async (roomId: string) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/existence`, {
      headers: {
        roomId,
        RoomType: ROOM_TYPE_ALONE,
      },
      withCredentials: true,
    });

    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('방 존재 여부 확인 실패:', error); // 오류 처리
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

// 시간투표방 생성하기
export const createVoteRoom = async (roomId: string, dates: string[]) => {
  try {
    const response = await axiosInstance.post(
      `/api/time-vote-rooms`,
      {
        dates, // 요청 본문에 dates 포함
      },
      {
        headers: {
          roomId, // URL 쿼리 파라미터로 roomId 전달
          RoomType: ROOM_TYPE_ALONE, // URL 쿼리 파라미터로 RoomType 전달
        },
        withCredentials: true, // 자격 증명 포함
      },
    );

    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('API 호출 오류:', error); // 오류 처리
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
}; //response의 id 제외

// export const postVoteTime = async (payload: IDatePayload) => {
//   return axios.post(`${BACKEND_URL}/api/time-vote-rooms/vote`, payload);
// };
