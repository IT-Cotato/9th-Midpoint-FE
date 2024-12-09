export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type DatePickerProps = {
  selectedDates: Value[];
  isValue: boolean;
  onDateChange: (value: Value) => void;
};

export interface IDatePayload {
  roomId: string;
  dates?: string[]; // 날짜 리스트
  dateTime?: {
    memberAvailableStartTime: string; // 시작
    memberAvailableEndTime: string; // 마지막
  }[];
}

export interface ResultResponse {
  result: {
    [date: string]: {
      memberName: string;
      dateTime: {
        memberAvailableStartTime: string;
        memberAvailableEndTime: string;
      }[];
    }[];
  };
  totalMemberNum: number;
}

export type VoteDateInfo = Pick<
  ResultResponse['result'][string][0],
  'memberName' | 'dateTime'
>;
