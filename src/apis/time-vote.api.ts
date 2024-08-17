// import axios from 'axios';
import { FROM_ALONE_TIME, FROM_EACH_TIME, ROOM_TYPE_ALONE, ROOM_TYPE_EACH } from '@/constants';
import { axiosInstance } from '.';
import { AxiosError } from 'axios';

export interface IDatePayload {
  navigate: Function;
  roomId: string;
  roomType: string;
  dates?: string[]; // 날짜 리스트
  dateTime?: {
    memberAvailableStartTime: string; // 시작
    memberAvailableEndTime: string; // 마지막
  }[];
}

//시간투표방 존재여부 확인하기
export const checkVoteRoom = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms`, {
      headers: {
        roomId,
        roomType,
      },
      withCredentials: true,
    });

    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`);
          }
          break;

        case 422:
          navigate('/not-found');
          console.log(roomId, roomType);
          break;

        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};

//시간투표여부 및 투표항목 조회
export const checkVoted = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/voted`, {
      headers: {
        roomId,
        roomType,
      },
      withCredentials: true,
    });

    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`);
          }
          break;
        case 404:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/a/time/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/e/time/${roomId}`);
          }
          break;

        case 422:
          navigate('/not-found');
          console.log(roomId, roomType);
          break;

        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};

//시간투표 후보날짜, 각 날짜에 대한 투표현황, 총 투표한 인원
export const resultVoteRoom = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/result`, {
      headers: {
        roomId,
        roomType,
      },
      withCredentials: true,
    });

    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`);
          } else {
            console.log(roomType);
          }
          break;

        case 404:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/a/time/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/e/time/${roomId}`);
          }
          break;

        case 422:
          navigate('/not-found');
          console.log(roomId, roomType);
          break;

        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};

// 시간투표방 생성하기
export const createVoteRoom = async ({ roomId, dates, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.post(
      `/api/time-vote-rooms`,
      {
        dates,
      },
      {
        headers: {
          roomId,
          roomType,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/each/${roomId}`);
          }
          break;
        case 422:
          navigate('/not-found');
          break;
        case 409:
          console.log('이미 방이 생성되었습니다');
          break;
        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};

//투표하기
export const postVoteTime = async ({ roomId, dateTime, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.post(
      `/api/time-vote-rooms/vote`,
      {
        dateTime,
      },
      {
        headers: {
          roomId,
          roomType,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/each/${roomId}`);
          }
          break;
        case 404:
          console.log('생성된 투표방이 없습니다');
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/a/time/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/e/time/${roomId}`);
          }
          break;
        case 409:
          console.log('이미 투표를 하였습니다');
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/a/time/results/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/e/time/results/${roomId}`);
          }
          break;
        case 422:
          navigate('/not-found');
          break;
        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};

//재투표하기
export const rePostVoteTime = async ({ roomId, dateTime, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.put(
      `/api/time-vote-rooms/vote`,
      {
        dateTime,
      },
      {
        headers: {
          roomId,
          roomType,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/alone/${roomId}`);
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/each/${roomId}`);
          }
          break;
        case 404:
          console.log('투표를 한 적이 없습니다', axiosError);
          break;
        case 422:
          navigate('/not-found');
          break;
        default:
          console.error('알 수 없는 오류:', axiosError);
      }
    } else {
      console.error('API 호출 오류:', error); // 네트워크 오류 등
    }

    throw error;
  }
};
