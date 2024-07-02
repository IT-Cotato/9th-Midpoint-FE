import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Button from './button';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { loginAtom } from '@/stores/login-state';
import { useMutation } from '@tanstack/react-query';
import { fetchLogin } from '@/apis/login';

interface IForm {
  name: string;
  pw: string;
}

export default function Login() {
  const { roomId } = useParams<{ roomId: string }>();
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const setLoginState = useSetAtom(loginAtom);
  const { register, handleSubmit } = useForm<IForm>();

  // 사용자 로그인을 위한 과정
  const { mutate: userLogin } = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.data.refreshToken);
      setLoginState(true);
      navigate(`/enter-location/${roomId}`);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 mb-6 overflow-auto">
        <div className="px-1">
          <div className="flex flex-col items-start justify-between w-full *:rounded-lg gap-3">
            <span className="text-xl font-semibold">아이디</span>
            <input
              {...register('name')}
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full transition bg-indigo-100 border-none ring-1 focus:ring-2 ring-indigo-100 focus:outline-none"
            />
            <span className="text-xl font-semibold">비밀번호</span>
            <input
              {...register('pw')}
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full transition bg-indigo-100 border-none ring-1 focus:ring-2 ring-indigo-100 focus:outline-none"
            />
          </div>
        </div>
      </form>
      <Button isLoading={formLoading} text="로그인" onClick={handleSubmit(onSubmit)} />
    </>
  );
}
