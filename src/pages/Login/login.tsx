import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { loginAtom } from '@/stores/login-state';
import { useMutation } from '@tanstack/react-query';
import { fetchLogin } from '@/apis/login';
import LoginLogo from '@/assets/imgs/loginLogo.svg?react';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/types/Login';
import {
  FROM_ALONE_RESULT,
  FROM_ALONE_TIME,
  FROM_EACH_RESULT,
  FROM_EACH_TIME,
  FROM_ENTER_ALONE,
  FROM_ENTER_EACH,
} from '@/constants';

interface IForm {
  name: string;
  pw: string;
}

export default function Login() {
  const location = useLocation();
  const from = location.state.from;

  const { roomId } = useParams();

  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const setLoginState = useSetAtom(loginAtom);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  // 사용자 로그인을 위한 과정
  const { mutate: userLogin } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.data.refreshToken);
      localStorage.setItem('roomId', roomId!);
      setLoginState(true);
      switch (from) {
        case FROM_ALONE_RESULT:
          navigate(`/page/a/results/${roomId}`);
          break;
        case FROM_EACH_RESULT:
          navigate(`/page/e/results/${roomId}`);
          break;
        case FROM_ENTER_ALONE:
          navigate(`/page/alone/${roomId}`);
          break;
        case FROM_ENTER_EACH:
          navigate(`/page/each/${roomId}`);
          break;
        case FROM_ALONE_TIME:
          navigate(`/page/${roomId}/a/time`);
          break;
        case FROM_EACH_TIME:
          navigate(`/page/${roomId}/e/time`);
          break;
        default:
          navigate('/');
          break;
      }
    },
    onError: (error) => {
      console.log('로그인 과정 에러', error);
    },
  });

  const onSubmit = (data: IForm) => {
    setFormLoading(true);

    const { name, pw } = data;

    if (roomId === undefined) {
      alert('login.tsx roomId오류!');
      setFormLoading(false);
      return;
    }

    const payload = {
      roomId,
      name,
      pw,
    };

    // 유저 로그인 요청
    userLogin(payload);

    setFormLoading(false);
  };

  return (
    <div className="w-[60%] mx-auto flex flex-col items-center gap-5 mt-14">
      <LoginLogo />
      <h1 className="text-2xl font-semibold text-[#1A3C95]">싱크스팟 로그인</h1>
      <p className="flex flex-col items-center w-full">
        <span>번거롭기만 한 회원 가입은 이제 그만!</span>
        <span> 일회용 비밀번호를 사용해 편하게 로그인할 수 있어요!</span>
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-4/5 gap-6 py-5 mx-auto *:rounded-lg *:w-[90%] *:mx-auto"
      >
        <input
          {...register('name')}
          type="text"
          placeholder="이름"
          className="w-full py-2 transition bg-gray-100 border-none outline-none focus:ring-2 ring-indigo-100 focus:outline-none"
        />
        {errors.name && <span className="font-semibold text-red-500">{errors.name.message}</span>}

        <input
          {...register('pw')}
          type="password"
          placeholder="비밀번호"
          className="w-full py-2 transition bg-gray-100 border-none focus:ring-2 ring-indigo-100 focus:outline-none"
        />
        {errors.pw && <span className="font-semibold text-red-500">{errors.pw.message}</span>}

        <button
          type="submit"
          className={`w-full min-h-10 ${isValid ? 'primary-btn' : 'bg-gray-50 cursor-not-allowed'} disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed`}
          disabled={!isValid || formLoading}
        >
          {formLoading ? '잠시만 기다려 주세요...' : '사용자등록'}
        </button>
      </form>
    </div>
  );
}
