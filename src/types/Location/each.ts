// 입력란의 형식
export interface IForm {
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

// 기본 입력란 형태
export const default_format: IForm = {
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};
