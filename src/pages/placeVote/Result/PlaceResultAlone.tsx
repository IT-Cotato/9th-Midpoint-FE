// import { axiosInstance } from '@/apis/index.api';
// import { FROM_ALONE_PLACE_VOTE_RESULT, ROOM_TYPE_ALONE } from '@/constants';
// import { useQueryClient } from '@tanstack/react-query';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import FolderIcon from '@/assets/imgs/PlaceVote/folderIcon.svg?react';

// interface PlaceVoteResult {
//   id: number;
//   name: string;
//   siDo: string;
//   siGunGu: string;
//   roadNameAddress: string;
//   addressLat: number;
//   addressLong: number;
//   count: number;
//   voters: string[];
// }

// export default function PlaceResultAlone() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [placeVoteResult, setPlaceVoteResult] = useState<PlaceVoteResult[]>([]);

//   useEffect(() => {
//     async function fetchPlaceVoteResult() {
//       try {
//         const { data } = await axiosInstance.get(
//           '/api/place-vote-rooms/result',
//           {
//             headers: {
//               RoomId: roomId,
//               RoomType: ROOM_TYPE_ALONE,
//             },
//           },
//         );
//         // 결과를 투표 수(count) 기준으로 내림차순 정렬
//         const sortedResults = data.data.placeCandidates.sort(
//           (a: PlaceVoteResult, b: PlaceVoteResult) => b.count - a.count,
//         );
//         setPlaceVoteResult(sortedResults);
//         queryClient.invalidateQueries({
//           queryKey: ['placeVoteRoomExists', roomId],
//         });
//       } catch (error: any) {
//         if (error.response && error.response.status === 401) {
//           navigate(`/page/login/${roomId}`, {
//             state: { from: FROM_ALONE_PLACE_VOTE_RESULT },
//           });
//         }
//         if (error.response && error.response.status === 403) {
//           navigate(`/page/alone/${roomId}`, {
//             state: { from: FROM_ALONE_PLACE_VOTE_RESULT },
//           });
//         }
//         if (error.response && error.response.status === 422) {
//           navigate('/not-found');
//         }
//       }
//     }
//     fetchPlaceVoteResult();
//   }, [roomId, navigate, queryClient]);

//   return (
//     <div className="w-4/5 bg-[#F8F8FB] p-3 rounded-lg shadow-lg ">
//       <div className="flex flex-col items-center gap-2 mt-5 mb-6 ">
//         <FolderIcon />
//         <h1 className="text-2xl font-semibold text-[#1A3C95]">
//           이번 모임 장소는...
//         </h1>
//         <p className="text-gray-600 text-md">
//           이번 모임 만남이 가능한 장소를 확인해보세요!
//         </p>
//       </div>
//       <div className="flex flex-col items-center justify-center">
//         {placeVoteResult.map((place) => (
//           <div key={place.id} className="flex w-[60%] gap-3 p-1">
//             <span className="p-1 py-4 text-xl font-semibold text-center text-blue-500 bg-white w-36 rounded-2xl justify-self-center">
//               {place.count}표
//             </span>
//             <span className="w-4/5 px-4 py-4 text-xl  text-center bg-white rounded-2xl  min-w-2/5 text-nowrap text-[#5E6D93]">
//               {place.roadNameAddress}
//             </span>
//           </div>
//         ))}
//         <div className="flex justify-center w-full gap-3 p-3 mt-3">
//           <button
//             type="button"
//             className="w-full py-3 font-semibold text-white transition-colors rounded-2xl min-h-14 primary-btn"
//             onClick={() => navigate(`/page/a/place-vote/${roomId}`)}
//           >
//             투표 다시하기
//           </button>
//           <button
//             type="button"
//             className="w-full py-3 font-semibold text-gray-600 transition-colors bg-gray-300 rounded-2xl hover:bg-gray-400"
//             onClick={() => navigate(`/page/a/create/place-vote-room/${roomId}`)}
//           >
//             투표 재생성하기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
