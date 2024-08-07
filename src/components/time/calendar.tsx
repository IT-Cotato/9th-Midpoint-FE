// import { useState } from 'react';
// import styled from 'styled-components';
// import CalItemIcon from '@/assets/imgs/time-calItem-icon1.svg?react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// // import { CalendarProps } from '@/pages/time';
// // import { createVoteRoom } from '@/apis/time-vote.api';
// // import { useParams } from 'react-router-dom';
// // import { useNavigate } from 'react-router-dom';

// // type ValuePiece = Date | null;
// // type Value = ValuePiece | [ValuePiece, ValuePiece];

// const FristCalendar = ({ setSelectedDates }:any) => {
//   // const navigate = useNavigate();
//   const [selectedLocalDates, setSelectedLocalDates] = useState<Date[]>([]);

//   // const { id } = useParams<{ id?: string }>(); // URL에서 id 파라미터 가져오기
//   // if (!id) {
//   //   console.error('방 ID가 없습니다.'); // id가 없는 경우
//   //   return;
//   // }
//   // const roomId = id;

//   const handleDateChange = (newDate: Date) => {
//     if (!newDate) return; // newDate가 null인 경우 처리

//     // 단일 날짜 선택 처리
//     if (newDate instanceof Date) {
//       const isSelected = selectedLocalDates.some((date) => date.toDateString() === newDate.toDateString());

//       if (isSelected) {
//         // 이미 선택된 날짜라면 제거
//         const updatedDates = selectedLocalDates.filter((date) => date.toDateString() !== newDate.toDateString());
//         setSelectedLocalDates(updatedDates);
//       } else {
//         // 새로운 날짜라면 추가
//         const updatedDates = [...selectedLocalDates, newDate];
//         updatedDates.length < 8 ? setSelectedLocalDates(updatedDates) : alert('7개까지 담을 수 있음');
//       }
//     }
//   };

//   const renderDate = () => {
//     const options: Intl.DateTimeFormatOptions = {
//       month: 'long',
//       day: '2-digit',
//     };

//     return selectedLocalDates.length > 0 ? (
//       <ul className="list-none">
//         {selectedLocalDates.map((date, index) => (
//           <li key={index}>{date.toLocaleDateString('ko-KR', options)}</li>
//         ))}
//       </ul>
//     ) : (
//       <ul className="list-none">
//         <li>선택된 날짜가 없습니다.</li>
//       </ul>
//     );
//   };

//   const gotoVote = async () => {
//     setSelectedDates(selectedLocalDates);
//     // const payload = {
//     //   roomId,
//     //   dates: selectedLocalDates.map((date) => date.toISOString().split('T')[0]),
//     //   dateTime: [],
//     // };
//     // try {
//     //   await createVoteRoom(payload); // API 호출
//     //   console.log('시간투표방 생성 완료');
//     // } catch (error) {
//     //   console.error('시간투표방 생성 실패:', error);
//     // }
//   };

//   return (
//     <div className="flex flex-col item-center h-screen w-screen">
//       <ContainerBox>
//         <div className="flex flex-col items-center justify-center">
//           <CalItemIcon />
//           <StyledCalendar
//             value={selectedLocalDates.length > 0 ? selectedLocalDates : undefined}
//             onChange={handleDateChange}
//             locale="ko-KR"
//             formatDay={(_locale, date) => date.getDate().toString()} //일 제거
//             calendarType="gregory" //일요일
//             showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
//             next2Label={null} // +1년 & +10년 이동 버튼 숨기기
//             prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
//             minDetail="year" // 10년단위 년도 숨기기
//             tileClassName={({ date }) =>
//               selectedLocalDates.some((selectedLocalDates) => selectedLocalDates.toDateString() === date.toDateString())
//                 ? 'selected'
//                 : ''
//             }
//           />
//         </div>
//         <div className="ml-4 w-1/5">
//           <ul className="list-none">{renderDate()}</ul>
//         </div>
//       </ContainerBox>
//       <LinkBtn onClick={gotoVote}>다음</LinkBtn>
//     </div>
//   );
// };

// const ContainerBox = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   min-width: 500px;
//   min-height: 400px;
//   // background: #f8f8fb;
//   padding: 10px 5px;
//   margin: 0 auto;
//   border-radius: 15px;
//   font-size: 18px;
//   text-align: center;
//   color: #2f5fdd;
// `;

// const LinkBtn = styled.button`
//   width: 30%;
//   margin: 0 auto;
//   padding: 10px 20px;
//   font-size: 16px;
//   background-color: #2f5fdd;
//   color: white;
//   border: none;
//   border-radius: 10px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #5786ff;
//   }
// `;

// const StyledCalendar = styled(Calendar)`
//   width: 80%;
//   height: 100%;
//   // background: #f8f8fb;
//   border: none;
//   border-radius: 10px;
//   margin-top: 10px;

//   //전체 폰트 컬러
//   .react-calendar__month-view {
//     abbr {
//       color: #15254d;
//     }
//   }
//   //년/월 상단 네비게이션 정렬, 크기 줄이기
//   .react-calendar__navigation {
//     justify-content: center;
//   }
//   .react-calendar__navigation__label {
//     font-weight: bold; /* 년월을 굵게 표시 */
//     color: #2f5fdd;
//     flex-grow: 0 !important;
//   }
//   .react-calendar__navigation:enabled:hover {
//     background-color: #5786ff !important;
//     border-radius: 5px !important;
//   }

//   //요일 색, 밑줄
//   .react-calendar__month-view__weekdays__weekday--weekend abbr[title='일요일'] {
//     color: #ff3629;
//   }
//   .react-calendar__month-view__weekdays__weekday abbr[title='토요일'] {
//     color: #5786ff;
//   }
//   .react-calendar__month-view__weekdays abbr {
//     text-decoration: none;
//     font-weight: 800;
//   }

//   //일 스타일
//   .react-calendar__tile {
//     max-width: initial !important;
//     border-radius: 5px; /* 모든 날짜 타일을 동그랗게 */
//     cursor: pointer;

//     &:hover {
//       background: #5786ff;
//       color: white;
//       border-radius: 5px;
//     }
//   }
//   //일 날짜 간격
//   .react-calendar__tile {
//     padding: 5px 0px 30px;
//     position: relative;
//   }
//   //일 오늘 날짜
//   .react-calendar__tile--now {
//     background: none;
//     abbr {
//       color: #5c76ff;
//     }
//   }

//   /* 클릭한 날짜 (마우스 오버 또는 포커스 상태) */
//   .react-calendar__tile:enabled:hover,
//   .react-calendar__tile:enabled:focus {
//     background-color: #377bff !important; /* 클릭한 날짜 색상 */
//     border-radius: 5px !important;
//   }

//   /* 클릭된 날짜 (현재 선택된 날짜) */
//   .react-calendar__tile--active,
//   .selected {
//     background-color: #bcd7ff !important; /* 클릭된 날짜 색상 */
//     border-radius: 5px !important;
//   }

//   /* 클릭한 날짜의 텍스트 색상 */
//   .react-calendar__tile--active abbr,
//   .selected abbr {
//     color: #377bff; /* 텍스트 색상 */
//   }
//   .react-calendar__tile:enabled:hover abbr,
//   .react-calendar__tile:enabled:focus abbr {
//     color: white;
//   }
// `;

// export default FristCalendar;
