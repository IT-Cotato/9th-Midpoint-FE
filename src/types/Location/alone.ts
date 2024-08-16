// 입력란의 형식
interface IFriendList {
  readonly siDo: string;
  readonly siGunGu: string;
  readonly roadNameAddress: string;
  readonly addressLat: number;
  readonly addressLong: number;
}

// 입력 폼으로 부터 받은 값의 형식
export interface IForm {
  readonly friendList: IFriendList[];
}

// 입력란의 기본 형태 템플릿
export const default_format: IFriendList = {
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};

export interface SubmissionData {
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

interface ICreatePlaceVote {
  readonly name: string;
  readonly siDo: string;
  readonly siGunGu: string;
  readonly roadNameAddress: string;
  readonly addressLat: number;
  readonly addressLong: number;
}

export interface IPlaceVoteForm {
  readonly friendList: ICreatePlaceVote[];
}

export const create_place_vote_default_format: ICreatePlaceVote = {
  name: '',
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};

export interface CreateSubmissionData {
  name: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}
