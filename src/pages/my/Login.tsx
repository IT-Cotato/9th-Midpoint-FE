import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { loginAtom } from '@/stores/login-state';
import { useMutation } from '@tanstack/react-query';
import { postLogin } from '@/apis/login.api';
import LoginLogo from '@/assets/imgs/loginLogo.svg?react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ILoginPayload, schema } from '@/types/Login';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QUERY_KEYS } from '@/constants';
import Button from '@/components/common/button/Button';

export default function Login() {
  const location = useLocation();

  const { roomId } = useParams();

  const [formLoading, setFormLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }, //isValid
  } = useForm<ILoginPayload>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const from = location.state?.from;
  const navigate = useNavigate();
  const setLoginState = useSetAtom(loginAtom);

  const { mutate: userLogin } = useMutation({
    mutationFn: postLogin,
    onSuccess: (data: any) => {
      console.log('성공', data.data);
      if (data.data.status === 200) {
        localStorage.setItem('accessToken', data.data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.data.refreshToken);
        setLoginState(true);
        console.log('성공', data.status);
        switch (from) {
          case QUERY_KEYS.FROM_ENTER:
            navigate(`/page/syncspot/${roomId}`);
            break;
          case QUERY_KEYS.FROM_RESULT:
            navigate(`/page/syncspot/results/${roomId}`);
            break;
          case QUERY_KEYS.FROM_CREATE_PLACE_VOTE:
            navigate(`/page/place/create/${roomId}`);
            break;
          case QUERY_KEYS.FROM_PLACE_VOTE:
            navigate(`/page/place/vote/${roomId}`);
            break;
          case QUERY_KEYS.FROM_RESULT_PLACE_VOTE:
            navigate(`/page/place/results/${roomId}`);
            break;
          case QUERY_KEYS.FROM_CREATE_TIME_VOTE:
            navigate(`/page/time/create/${roomId}`);
            break;
          case QUERY_KEYS.FROM_TIME_VOTE:
            navigate(`/page/time/vote/${roomId}`);
            break;
          case QUERY_KEYS.FROM_RESULT_TIME_VOTE:
            navigate(`/page/time/results/${roomId}`);
            break;
          default:
            navigate('/page/room-list');
            break;
        }
      } else {
        toast.error('로그인 정보가 올바르지 않습니다!', {
          position: 'top-center',
        }); // 로그인 실패 시 토스트 메시지
        console.log('200 아님');
      }
    },
    onError: (error) => {
      console.log('로그인 과정 에러', error);
      toast.error('로그인 중 문제가 발생했습니다!', {
        position: 'top-center',
      }); // 에러 발생 시 토스트 메시지
    },
  });

  const onSubmit = (data: ILoginPayload) => {
    setFormLoading(true);

    const { email, pw } = data;
    const payload = {
      email,
      pw,
    };
    // 유저 로그인 요청
    userLogin(payload);

    setFormLoading(false);
  };

  return (
    <div className="w-[60%] mx-auto flex flex-col items-center gap-5 mt-14">
      <LoginLogo />
      <h1 className="text-2xl font-semibold text-primary-700">
        싱크스팟 로그인
      </h1>
      <div className="flex flex-row items-center justify-center w-full">
        <p className="mr-5 text-primary-grayDark">아직 계정이 없으신가요?</p>
        <p
          className="cursor-pointer text-primary-base"
          onClick={() => navigate('/page/signup')}
        >
          회원가입하기
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-4/5 gap-6 py-5 mx-auto *:rounded-2xl *:w-[90%] *:mx-auto"
      >
        <input
          {...register('email')}
          type="text"
          placeholder="아이디(이메일)"
          className="w-full py-2 pl-5 transition border-none outline-none h-14 bg-primary-grayLight focus:shadow-focus placeholder:text-primary-grayNormal"
        />
        {errors.email && (
          <span className="font-semibold text-primary-red">
            {errors.email.message}
          </span>
        )}
        <input
          {...register('pw')}
          type="password"
          placeholder="비밀번호"
          className="w-full py-2 pl-5 transition border-none outline-none h-14 bg-primary-grayLight focus:shadow-focus placeholder:text-primary-grayNormal"
        />
        {errors.pw && (
          <span className="font-semibold text-primary-redNormal">
            {errors.pw.message}
          </span>
        )}
        <Button text="로그인" isLoading={formLoading} />
        <div
          className="flex justify-end cursor-pointer text-primary-grayNormal"
          onClick={() => navigate('/page/find-user')}
        >
          아이디/비밀번호 찾기
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
