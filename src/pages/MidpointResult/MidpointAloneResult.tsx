import { BACKEND_URL } from '@/apis';
import MidpointMap from '@/components/common/shared/MidpointMap';
import { FROM_ALONE_RESULT, ROOM_TYPE_ALONE } from '@/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WherePin from '@/assets/imgs/Midpoints/wherePin.svg?react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface Midpoints {
  name: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

interface Coordinate {
  lat: number;
  lng: number;
  name: string;
}

const sequece = ['첫', '두', '세', '네', '다섯'];

export default function MidpointAloneResult() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [midPoints, setMidPoints] = useState<Midpoints[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [clickedItemNum, setClickedItemNum] = useState<number | null>(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState<Coordinate | null>(null);
  const [clickedSpotName, setClickedSpotName] = useState<string | null>(null);

  async function handleAloneResult() {
    try {
      const { data } = await axios.get(BACKEND_URL + '/api/mid-points', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          RoomId: roomId,
          RoomType: ROOM_TYPE_ALONE,
        },
      });
      setMidPoints(data.data);
      if (data.data) {
        setCoordinates(
          data.data.map(({ name, addressLat, addressLong }: Midpoints) => ({
            lat: addressLat,
            lng: addressLong,
            name,
          })),
        );
        setClickedItemNum(0);
        setSelectedCoordinate({ lat: data.data[0].addressLat, lng: data.data[0].addressLong, name: data.data[0].name });
        setClickedSpotName(data.data[0].name);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate(`/page/login/${roomId}`, { state: { from: FROM_ALONE_RESULT } });
      }
      if (error.response && error.response.status === 403) {
        navigate(`/page/alone/${roomId}`);
      }
      if (error.response && error.response.status === 422) {
        navigate('/not-found');
      }
    }
  }

  useEffect(() => {
    handleAloneResult();
  }, [roomId]);

  function handleClickItem(name: string, addressLat: number, addressLong: number, index: number) {
    setClickedItemNum(index);
    setClickedSpotName(name);
    setSelectedCoordinate({ lat: addressLat, lng: addressLong, name });
  }

  function handleNavigate(lat: number, lng: number, name: string) {
    navigate(`/page/a/results/${roomId}/recommendations?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}`);
  }

  return (
    <div className="grid grid-cols-2 w-4/5 gap-3 grid-rows-[auto_1fr] h-max">
      <div className="relative">
        {clickedSpotName && (
          <span className="absolute top-2 z-50 w-max gap-2 p-2 rounded-xl bg-blue-100  transform -translate-x-1/2 opacity-95 left-1/2 flex justify-center items-center text-[#2F5FDD]">
            <WherePin />
            <span
              className="font-semibold cursor-pointer"
              onClick={() => handleNavigate(selectedCoordinate?.lat!, selectedCoordinate?.lng!, clickedSpotName)}
            >
              {clickedSpotName}에서 어디가지?
            </span>
          </span>
        )}
        <div className="h-[650px] rounded-2xl shadow-lg">
          <MidpointMap coordinates={coordinates} selectedCoordinate={selectedCoordinate} />
        </div>
      </div>
      <div className="grid grid-rows-5 gap-2">
        {midPoints.map(({ name, siDo, siGunGu, addressLat, addressLong }, index) => (
          <div
            key={index}
            className={`bg-[#F8F8FB] rounded-xl shadow-md cursor-pointer flex flex-col p-3 gap-2 transition-all ${clickedItemNum === index ? 'bg-blue-100 opacity-95 ring-2 ring-blue-500' : ''}`}
            onClick={() => handleClickItem(name, addressLat, addressLong, index)}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center p-[10px] text-white bg-blue-400 rounded-full size-4">
                {index + 1}
              </span>
              <span className="text-[#1A3C95] font-semibold">우리의 {sequece[index]}번째 중간 지점</span>
            </div>
            <h1 className="text-xl text-[#2F5FDD] font-semibold">{name}</h1>
            <div className="flex items-center justify-between">
              <h1 className="text-[#5E6D93]">
                {siDo} {siGunGu} {name}
              </h1>
              {clickedItemNum === index && (
                <span
                  onClick={() => handleNavigate(addressLat, addressLong, name)}
                  className="p-1 transition-all bg-blue-100 rounded-lg opacity-95 hover:bg-blue-200"
                >
                  <ArrowRightIcon className="text-blue-700 size-6" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
