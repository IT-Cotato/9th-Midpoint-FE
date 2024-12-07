
import React, { useEffect, useState } from 'react';
import { formatTime, Time } from './vote-calendar';
import styled from 'styled-components';
import { MdArrowDropDown } from 'react-icons/md';
import Checked from '@/assets/imgs/Time/checked.svg?react';
import { getTimeVoted } from '@/apis/time-vote.api';
import { Value, ValuePiece } from '@/types/time-vote';

interface DateOptionProps {
  date: ValuePiece | Value;
  onTimeChange: (date: Value, startTime: Time, endTime: Time) => void;
  roomId: string;
  setVoteExistence: (exists: boolean) => void;
}

export const DateOption = ({
  date,
  onTimeChange,
  roomId,
  setVoteExistence,
}: DateOptionProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const [startTime, setStartTime] = useState<Time>({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState<Time>({ hour: 0, minute: 0 });

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const isVoted = await getTimeVoted({ roomId });
        setVoteExistence(isVoted.myVotesExistence);
        if (isVoted.myVotesExistence) {
          type Vote = {
            votedDate: string;
            startTime: string;
            endTime: string;
          };

          const formattedMyVotes = isVoted.myVotes.map(
            (vote: {
              memberAvailableStartTime: string;
              memberAvailableEndTime: string;
            }) => {
              if (
                vote.memberAvailableStartTime &&
                vote.memberAvailableEndTime
              ) {
                const [dateString] = vote.memberAvailableStartTime.split(' '); // 날짜 부분 추출
                const [startHour, startMinute] = vote.memberAvailableStartTime
                  .split(' ')[1]
                  .split(':')
                  .map(Number);
                const [endHour, endMinute] = vote.memberAvailableEndTime
                  .split(' ')[1]
                  .split(':')
                  .map(Number);

                return {
                  votedDate: dateString,
                  startTime: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
                  endTime: `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`,
                };
              } else {
                console.warn('startTime 또는 endTime이 없습니다:', vote);
                return {
                  votedDate: '',
                  startTime: '00:00',
                  endTime: '00:00',
                };
              }
            },
          );

          const matchVotedDates = formattedMyVotes.filter(
            (vote: Vote) =>
              vote.votedDate ===
              (date instanceof Date ? date.toISOString().split('T')[0] : date),
          );
          if (matchVotedDates.length > 0) {
            setIsChecked(true);
            const todayVote = matchVotedDates[0];
            const [startHour, startMinute] = todayVote.startTime
              .split(':')
              .map(Number);
            const [endHour, endMinute] = todayVote.endTime
              .split(':')
              .map(Number);

            setStartTime({ hour: startHour, minute: startMinute });
            setEndTime({ hour: endHour, minute: endMinute });
          } else {
            setIsChecked(false);
          }
        } else {
          setIsChecked(false);
        }
      } catch (err) {
        console.log('투표여부 확인 실패', err);
      }
    };
    fetchVoteStatus();
  }, [roomId, date]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartTimeChange = (hour: number, minute: number) => {
    const newStartTime = { hour, minute };

    setStartTime(newStartTime);
    if (isChecked) onTimeChange(date, newStartTime, endTime);
  };

  const handleEndTimeChange = (hour: number, minute: number) => {
    const newEndTime = { hour, minute };
    setEndTime(newEndTime);
    if (isChecked) onTimeChange(date, startTime, newEndTime);
  };

  return (
    <div
      className={`flex flex-col justify-center items-start mb-2.5 bg-white rounded-[15px] h-[120px] w-[95%] mx-auto p-4 ${!isChecked ? 'text-[#B7BDCC] pointer-events-none' : ''}`}
    >
      <div className="flex items-center mb-2 ml-2 pointer-events-auto">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="hidden"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          {isChecked ? (
            <Checked className="w-5 h-5" />
          ) : (
            <span className="w-5 h-5 bg-[#F8F8FB] border-0 rounded-full" />
          )}
        </label>
        <span
          className={`mx-2.5 ${isChecked ? 'text-[#15254D]' : 'text-[#B7BDCC]'}`}
        >
          {date instanceof Date
            ? `${date.toLocaleDateString('ko-KR', { month: 'numeric' })} ${date.toLocaleDateString('ko-KR', { day: 'numeric' })}`
            : '날짜없음'}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 mx-auto w-[95%]">
        <TimeSelect
          onChange={handleStartTimeChange}
          initialHour={startTime.hour}
          initialMinute={startTime.minute}
          isChecked={isChecked}
        />
        <p>~</p>
        <TimeSelect
          onChange={handleEndTimeChange}
          initialHour={endTime.hour}
          initialMinute={endTime.minute}
          isChecked={isChecked}
        />
      </div>
    </div>
  );
};

interface TimeSelectProps {
  onChange: (hour: number, minute: number) => void;
  initialHour: number;
  initialMinute: number;
  isChecked: boolean;
}

export const TimeSelect = ({
  onChange,
  initialHour,
  initialMinute,
  isChecked,
}: TimeSelectProps) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // 초기값이 변경될 때 상태 업데이트
  useEffect(() => {
    setHour(initialHour);
    setMinute(initialMinute);
    onChange(initialHour, initialMinute);
  }, [initialHour, initialMinute]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = parseInt(e.target.value, 10);
    setHour(newHour);
    onChange(newHour, minute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = parseInt(e.target.value, 10);
    setMinute(newMinute);
    onChange(hour, newMinute);
  };

  return (
    <SelectCustom>
      <div className="relative inline-block w-22">
        <select
          className={`duration-200 h-10 transition rounded-xl custom-select focus:outline-none focus:border-transparent border-0 ${isChecked ? 'text-[#15254D]' : 'text-[#B7BDCC]'}`}
          value={hour}
          onChange={handleHourChange}
        >
          {Array.from({ length: 24 }, (_, index) => (
            <option key={index} value={index} className="bg-white">
              {formatTime(index)} 시
            </option>
          ))}
        </select>
        <span className="custom-arrow">
          <MdArrowDropDown className="text-2xl" />
        </span>
      </div>

      <div className="relative inline-block w-22">
        <select
          className={`duration-200 h-10transition rounded-xl custom-select focus:outline-none focus:border-transparent border-0 ${isChecked ? 'text-[#15254D]' : 'text-[#B7BDCC]'}`}
          value={minute}
          onChange={handleMinuteChange}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <option key={index} value={index * 10} className="bg-white">
              {formatTime(index * 10)} 분
            </option>
          ))}
        </select>
        <span className="custom-arrow">
          <MdArrowDropDown className="text-2xl" />
        </span>
      </div>
    </SelectCustom>
  );
};

const SelectCustom = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .custom-select {
    -webkit-appearance: none; /* Chrome */
    -moz-appearance: none; /* Firefox */
    appearance: none; /* 기본 appearance 제거 */
    -ms-expand: none; /* IE10,11에서 기본 화살표 제거 */
    padding-right: 30px;
    background: none;
    background-color: #f8f8fb;
    width: 100%;
  }

  .custom-arrow {
    position: absolute;
    top: 50%;
    right: 5px; /* 아이콘 위치 조정 */
    transform: translateY(-50%); /* 수직 중앙 정렬 */
    pointer-events: none; /* 클릭 이벤트 무시 */
  }
`;
