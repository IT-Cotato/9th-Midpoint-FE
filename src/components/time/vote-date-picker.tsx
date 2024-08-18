import { Value, ValuePiece } from '@/pages/Time/time';
import React, { useEffect, useState } from 'react';
import { formatTime, Time } from './vote-calendar';
import { checkVoted } from '@/apis/time-vote.api';
import { useNavigate } from 'react-router-dom';
import { defineRoomType } from './calendar';

interface DateOptionProps {
  date: ValuePiece | Value;
  onTimeChange: (date: Value, startTime: Time, endTime: Time) => void;
  roomId: string;
  setVoteExistence: (exists: boolean) => void;
}

export const DateOption = ({ date, onTimeChange, roomId, setVoteExistence }: DateOptionProps) => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);

  const [startTime, setStartTime] = useState<Time>({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState<Time>({ hour: 0, minute: 0 });

  const { roomType } = defineRoomType();

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const isVoted = await checkVoted({ roomId, roomType, navigate });
        setVoteExistence(isVoted.myVotesExistence);
        if (isVoted.myVotesExistence) {
          type Vote = {
            votedDate: string;
            startTime: string;
            endTime: string;
          };

          const formattedMyVotes = isVoted.myVotes.map(
            (vote: { memberAvailableStartTime: string; memberAvailableEndTime: string }) => {
              if (vote.memberAvailableStartTime && vote.memberAvailableEndTime) {
                const [dateString] = vote.memberAvailableStartTime.split(' '); // 날짜 부분 추출
                const [startHour, startMinute] = vote.memberAvailableStartTime.split(' ')[1].split(':').map(Number);
                const [endHour, endMinute] = vote.memberAvailableEndTime.split(' ')[1].split(':').map(Number);

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
            (vote: Vote) => vote.votedDate === (date instanceof Date ? date.toISOString().split('T')[0] : date),
          );
          if (matchVotedDates.length > 0) {
            setIsChecked(true);
            const todayVote = matchVotedDates[0];
            const [startHour, startMinute] = todayVote.startTime.split(':').map(Number);
            const [endHour, endMinute] = todayVote.endTime.split(':').map(Number);

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
      className={`flex flex-col justify-center items-start mb-2.5 bg-white rounded-[15px] h-[120px] w-full mx-auto p-4 ${!isChecked ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-center mb-2 pointer-events-auto">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className="mx-2.5">{date instanceof Date ? date.toLocaleDateString() : '날짜없음'}</span>
      </div>
      <div className="flex justify-center items-center space-x-4 mx-auto w-full">
        <TimeSelect onChange={handleStartTimeChange} initialHour={startTime.hour} initialMinute={startTime.minute} />
        <p>~</p>
        <TimeSelect onChange={handleEndTimeChange} initialHour={endTime.hour} initialMinute={endTime.minute} />
      </div>
    </div>
  );
};

interface TimeSelectProps {
  onChange: (hour: number, minute: number) => void;
  initialHour: number;
  initialMinute: number;
}

export const TimeSelect = ({ onChange, initialHour, initialMinute }: TimeSelectProps) => {
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
    <>
      <select
        className="p-2 border border-gray-300 rounded-md bg-white h-10 w-20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        value={hour}
        onChange={handleHourChange}
      >
        {Array.from({ length: 24 }, (_, index) => (
          <option key={index} value={index} className="bg-white">
            {formatTime(index)} 시
          </option>
        ))}
      </select>
      <select
        className="p-2 border border-gray-300 rounded-md bg-white h-10 w-20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        value={minute}
        onChange={handleMinuteChange}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <option key={index} value={index * 10} className="bg-white">
            {formatTime(index * 10)} 분
          </option>
        ))}
      </select>
    </>
  );
};
