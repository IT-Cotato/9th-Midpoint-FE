import {
  FROM_ALONE_CREATE_VOTE_TIME,
  FROM_ALONE_TIME_VOTE,
  FROM_ALONE_TIME_VOTE_RESULT,
  FROM_EACH_CREATE_VOTE_TIME,
  FROM_EACH_TIME_VOTE,
  FROM_EACH_TIME_VOTE_RESULT,
  ROOM_TYPE_ALONE,
  ROOM_TYPE_EACH,
} from '@/constants';
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
        RoomId: roomId,
        RoomType: roomType,
      },
    });
    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_CREATE_VOTE_TIME } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          }
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

    throw error;
  }
};

//시간투표방 존재여부 확인하기
export const checkVoteCreate = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms`, {
      headers: {
        RoomId: roomId,
        RoomType: roomType,
      },
    });
    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
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
          RoomId: roomId,
          RoomType: roomType,
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
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_CREATE_VOTE_TIME } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_CREATE_VOTE_TIME } });
          }
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

    throw error;
  }
};

// 시간투표방 재생성하기
export const recreateVoteRoom = async ({ roomId, dates, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.put(
      `/api/time-vote-rooms`,
      {
        dates,
      },
      {
        headers: {
          RoomId: roomId,
          RoomType: roomType,
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
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_CREATE_VOTE_TIME } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_CREATE_VOTE_TIME } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_CREATE_VOTE_TIME } });
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

//시간투표여부 및 투표항목 조회
export const checkVoted = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/voted`, {
      headers: {
        RoomId: roomId,
        RoomType: roomType,
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
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
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

    throw error;
  }
};

//시간투표 후보날짜, 각 날짜에 대한 투표현황, 총 투표한 인원
export const resultVoteRoom = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/result`, {
      headers: {
        RoomId: roomId,
        RoomType: roomType,
      },
    });

    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
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

    throw error;
  }
};

//결과 페이지
export const resultVote = async ({ roomId, roomType, navigate }: IDatePayload) => {
  try {
    const response = await axiosInstance.get(`/api/time-vote-rooms/result`, {
      headers: {
        RoomId: roomId,
        RoomType: roomType,
      },
    });

    return response.data.data; // 응답 데이터 반환
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 401:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE_RESULT } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE_RESULT } });
          }
          break;

        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE_RESULT } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE_RESULT } });
          }
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
          RoomId: roomId,
          RoomType: roomType,
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
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
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
          RoomId: roomId,
          RoomType: roomType,
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
            navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
          break;
        case 403:
          if (roomType === ROOM_TYPE_ALONE) {
            navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_TIME_VOTE } });
          } else if (roomType === ROOM_TYPE_EACH) {
            navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_TIME_VOTE } });
          }
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

    throw error;
  }
};

