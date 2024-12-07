import * as yup from 'yup';

// 비밀번호 유효성 검사 스키마
export const schema = yup.object().shape({
  email: yup.string().required('이메일을 입력해주세요'),
  pw: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      '비밀번호는 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다',
    ),
});

export interface ILoginPayload {
  readonly email: string;
  readonly pw: string;
}

export interface ISignupPayload {
  readonly name: string;
  readonly email: string;
  readonly pw: string;
}