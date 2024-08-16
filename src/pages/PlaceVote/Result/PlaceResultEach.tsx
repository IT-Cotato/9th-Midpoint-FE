import { axiosInstance } from '@/apis';
import { FROM_EACH_PLACE_VOTE_RESULT, ROOM_TYPE_EACH } from '@/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FolderIcon from '@/assets/imgs/PlaceVote/folderIcon.svg?react';

interface PlaceVoteResult {
  id: number;
  name: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
  count: number;
  voters: string[];
}

export default function PlaceResultEach() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [placeVoteResult, setPlaceVoteResult] = useState<PlaceVoteResult[]>([]);

  useEffect(() => {
    async function fetchPlaceVoteResult() {
      try {
        const { data } = await axiosInstance.get('/api/place-vote-rooms/result', {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_EACH,
          },
        });
        // 결과를 투표 수(count) 기준으로 내림차순 정렬
        const sortedResults = data.data.placeCandidates.sort(
          (a: PlaceVoteResult, b: PlaceVoteResult) => b.count - a.count,
        );
        setPlaceVoteResult(sortedResults);
        queryClient.invalidateQueries({ queryKey: ['placeVoteRoomExists', roomId] });
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_PLACE_VOTE_RESULT } });
        }
        if (error.response && error.response.status === 403) {
          navigate(`/page/each/${roomId}`, { state: { from: FROM_EACH_PLACE_VOTE_RESULT } });
        }
        if (error.response && error.response.status === 422) {
          navigate('/not-found');
        }
      }
    }
    fetchPlaceVoteResult();
  }, [roomId, navigate, queryClient]);

  return (
    <div className="w-4/5 bg-[#F8F8FB] p-3 rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-2 mb-6">
        <FolderIcon className="mb-3" />
        <h1 className="text-2xl font-semibold text-[#1A3C95]">이번 모임 장소는...</h1>
        <p className="text-gray-600 text-md">이번 모임 만남이 가능한 장소를 확인해보세요!</p>
      </div>
      <div>
        {placeVoteResult.map((place) => (
          <div key={place.id} className="grid grid-cols-2 gap-3 p-3">
            <span className="w-1/5 p-2 text-xl font-semibold text-center text-blue-500 bg-white rounded-md shadow-md justify-self-center">
              {place.count}표
            </span>
            <span className="w-4/5 p-2 px-4 text-xl font-medium bg-white rounded-md shadow-md">
              {place.roadNameAddress}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-5 mt-6">
        <button
          type="button"
          className="w-2/5 py-3 font-semibold text-white transition-colors rounded-lg min-h-10 primary-btn"
          onClick={() => navigate(`/page/e/place-vote/${roomId}`)}
        >
          투표 다시하기
        </button>
        <button
          type="button"
          className="w-2/5 py-3 font-semibold text-gray-600 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={() => navigate(`/page/e/create/place-vote-room/${roomId}`)}
        >
          투표 재생성하기
        </button>
      </div>
    </div>
  );
}