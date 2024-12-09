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

//each.ts
// 입력란의 형식
export interface IForm_each {
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

// 기본 입력란 형태
export const default_format_each: IForm_each = {
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};

//
export interface Midpoints {
  name: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
  name: string;
}

export interface IContents {
  name: string;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
  phoneNumber: string;
  placeUrl: string;
  placeStandard: 'ALL' | 'STUDY' | 'CAFE' | 'RESTAURANT';
  distance: string;
}

export interface IRecommendPlaces {
  addressLat: number;
  addressLong: number;
  placeStandard: 'ALL' | 'STUDY' | 'CAFE' | 'RESTAURANT';
  page: number;
}
