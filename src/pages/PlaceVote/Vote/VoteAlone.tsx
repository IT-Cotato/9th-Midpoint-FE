import FountainIcon from '@/assets/imgs/PlaceVote/fountainIcon.svg?react';
import EnterEachMap from '@/components/common/shared/EnterEachMap';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/apis';
import { useNavigate, useParams } from 'react-router-dom';
import { FROM_ALONE_PLACE_VOTE, ROOM_TYPE_ALONE } from '@/constants';
import { useQueryClient } from '@tanstack/react-query';

// 각 후보지에 대한 타입 정의
interface PlaceCandidate {
  id: number;
  name: string;
  siDo: string;
  siGunGu: string;
  lat: number;
  lng: number;
}

export default function VoteAlone() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }[]>([]); // 사용자들의 좌표 목록
  const [selectedCoordinate, setSelectedCoordinate] = useState<{ lat: number; lng: number } | null>(null);
  const [placeCandidates, setPlaceCandidates] = useState<PlaceCandidate[]>([]); // 후보지 목록을 저장할 상태
  const [isVoteButtonEnabled, setVoteButtonEnabled] = useState(false);
  const [isVotedBefore, setVotedBefore] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null); // 선택된 장소의 ID를 저장

  // 장소 투표방 정보 가져오기
  useEffect(() => {
    async function fetchPlaceVoteRoomInfo() {
      try {
        const { data } = await axiosInstance.get('/api/place-vote-rooms', {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_ALONE,
          },
        });

        if (data.data.existence) {
          queryClient.invalidateQueries({ queryKey: ['placeVoteRoomExists', roomId] });
        }

        const candidates: PlaceCandidate[] = data.data.placeCandidates.map((candidate: any) => ({
          id: candidate.id,
          name: candidate.name,
          siDo: candidate.siDo,
          siGunGu: candidate.siGunGu,
          lat: candidate.addressLat,
          lng: candidate.addressLong,
        }));

        setPlaceCandidates(candidates);
        setCoordinates(candidates.map((candidate) => ({ lat: candidate.lat, lng: candidate.lng })));

        // 이후에 fetchVotedInfo 호출
        fetchVotedInfo(candidates);
      } catch (error: any) {
        handleErrors(error);
      }
    }

    async function fetchVotedInfo(candidates: PlaceCandidate[]) {
      try {
        const { data } = await axiosInstance.get('/api/place-vote-rooms/voted', {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_ALONE,
          },
        });
        if (data.data.existence && data.data.voteItem !== null) {
          setVotedBefore(true);
          const selectedCandidate = candidates.find((candidate) => candidate.id === data.data.voteItem);
          if (selectedCandidate) {
            setSelectedCoordinate({ lat: selectedCandidate.lat, lng: selectedCandidate.lng });
            setSelectedPlaceId(selectedCandidate.id);
            setVoteButtonEnabled(true);
          }
        }
      } catch (error: any) {
        handleErrors(error);
      }
    }

    function handleErrors(error: any) {
      if (error.response && error.response.status === 401) {
        navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_PLACE_VOTE } });
      } else if (error.response && error.response.status === 403) {
        navigate(`/page/alone/${roomId}`, { state: { from: FROM_ALONE_PLACE_VOTE } });
      } else if (error.response && error.response.status === 422) {
        navigate('/not-found');
      } else {
        console.error('Unexpected error:', error);
      }
    }

    fetchPlaceVoteRoomInfo();
  }, [roomId, navigate]);

  function handleVoteSelection(id: number) {
    const selectedCandidate = placeCandidates.find((candidate) => candidate.id === id);
    if (selectedCandidate) {
      setSelectedCoordinate({ lat: selectedCandidate.lat, lng: selectedCandidate.lng });
      setSelectedPlaceId(id);
      setVoteButtonEnabled(true);
    }
  }

  async function handleOnPlaceClick() {
    if (selectedPlaceId === null) return;

    try {
      const url = '/api/place-vote-rooms/vote';
      const requestBody = { choicePlace: selectedPlaceId };

      if (!isVotedBefore) {
        await axiosInstance.post(url, requestBody, {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_ALONE,
          },
        });
      } else {
        await axiosInstance.put(url, requestBody, {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_ALONE,
          },
        });
      }
    } catch (error: any) {
      console.error('장소투표하기 에러 VoteAlone.tsx', error);
    }
    queryClient.invalidateQueries({ queryKey: ['isPlaceVoted', roomId] });
    navigate(`/page/a/place-vote/results/${roomId}`);
  }

  return (
    <>
      <div className="grid w-4/5 gap-3 grid-cols-2 grid-rows-[auto_1fr]">
        <div className="bg-[#F8F8FB] rounded-2xl shadow-lg flex flex-col justify-between gap-2 px-2 pt-5 row-span-2 py-2 h-[560px]">
          <div className="flex flex-col items-center gap-2">
            <FountainIcon />
            <h1 className="text-2xl font-semibold text-[#1A3C95]">모임 장소 투표하기</h1>
            <div className="flex flex-col items-center *:text-[#5E6D93]">
              <span>우리 같이 투표해요!</span>
              <span>원하는 모임 장소를 선택한 후 투표를 진행하세요!</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {placeCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => handleVoteSelection(candidate.id)}
                className={`w-full cursor-pointer flex justify-center items-center  rounded-2xl py-3 text-lg border ${
                  selectedPlaceId === candidate.id ? 'bg-[#EFF3FF] ring-2 ring-[#5786FF] text-[#2F5FDD]' : 'bg-white'
                }`}
              >
                {candidate.name}
              </div>
            ))}
            <button
              type="button"
              onClick={handleOnPlaceClick}
              disabled={!isVoteButtonEnabled}
              className={`primary-btn min-h-10 w-full h-12 rounded-2xl font-semibold disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
            >
              모임 장소 투표하기
            </button>
          </div>
        </div>
        <div className="h-[560px] shadow-lg rounded-2xl row-span-2">
          <EnterEachMap coordinates={coordinates} selectedCoordinate={selectedCoordinate} />
        </div>
      </div>
    </>
  );
}
