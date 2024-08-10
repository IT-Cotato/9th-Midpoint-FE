import { BACKEND_URL } from '@/apis';
import { FROM_EACH_RESULT, ROOM_TYPE_EACH } from '@/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/not-found';

export default function MidpointEachResult() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [midPoints, setMidPoints] = useState(null);

  async function handleEachResult() {
    try {
      const { data } = await axios.get(BACKEND_URL + '/api/mid-points', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          RoomId: roomId,
          RoomType: ROOM_TYPE_EACH,
        },
      });
      setMidPoints(data.data);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate(`/page/login/${roomId}`, { state: { from: FROM_EACH_RESULT } });
      }
      if (error.response && error.response.status === 403) {
        navigate(`/page/each/${roomId}`);
      }
      if (error.response && error.response.status === 422) {
        console.log('midpoint-each-results 422 에러확인');
        return <NotFound />; // navigate만됨 (컴포넌트 렌더링 안되는 부분 고치기)
      }
    }
  }

  useEffect(() => {
    handleEachResult();
  }, [roomId]);

  return (
    <>
      <h1>중간지점결과화면</h1>
      <h1>{JSON.stringify(midPoints)}</h1>
    </>
  );
}
