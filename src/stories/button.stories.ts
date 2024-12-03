import { postLogin } from '@/apis/login.api';
import Button from '@/components/common/Button/button';

export default {
  title: 'stories/Button',
  tags: ['autodocs'],
  component: Button,
  argTypes: {
    isLoading: {
      description: '로딩 시 버튼 비활성화',
    },
    isMore: {
      description: '데이터 받는 중일 시 버튼 비활성화',
    },
    text: {
      description: '버튼에 표시되는 레이블을 지정합니다.',
    },
  },
};

export const Login = {
  args: {
    theme: 'login',
    isLoading: false,
    isMore: false,
    onClick: () => postLogin,
    text: '로그인',
  },
};

export const addLocation = {
  args: {
    theme: 'add',
    isLoading: false,
    isMore: false,
    onClick: () => console.log('장소 입력 추가'),
    text: '+ 장소 추가하기',
  },
};
