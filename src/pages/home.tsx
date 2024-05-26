import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '@/components/button';
import KakaoMap from '@/components/kakao-map';
import styled from 'styled-components';
import SideBar from '@/components/Sidebar';

// 운행 수단
enum Transport {
  Subway = '지하철',
  Bus = '버스',
}

// 입력란의 형식
interface IFriendList {
  readonly username: string;
  readonly transport: Transport;
  readonly address: string;
}

// 입력 폼으로 부터 받은 값의 형식
interface IForm {
  readonly friendList: IFriendList[];
}

// 입력란의 기본 형태 템플릿
const default_format: IFriendList = { username: '', transport: Transport.Subway, address: '' };

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // form제출 상태
  const [addresses, setAddresses] = useState<string[]>([]); // 사용자들의 주소 목록
  const { control, register, handleSubmit, setValue, watch } = useForm<IForm>({
    defaultValues: {
      friendList: [default_format],
    },
  });
  const { fields, append } = useFieldArray({
    control,
    name: 'friendList',
  });

  // 주소 검색하는 함수
  const openAddressSearch = (index: number) => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddress = data.roadAddress;
        setValue(`friendList.${index}.address`, fullAddress);
        setAddresses((prev) => {
          const newAddresses = [...prev];
          newAddresses[index] = fullAddress;
          return newAddresses;
        });
      },
    }).open();
  };

  // 중간지점찾기 API 요청
  const { mutate: searchMiddlePoint } = useMutation({
    mutationFn: (data: Omit<IFriendList, 'username'>[]) => {
      // + 추후에 요청 url의 앞부분에 백엔드의 url을 붙여주어야 한다. (백엔드의 url은 .env파일에 넣고 관리할 것)
      return axios.post('/api/middle-points', data);
    },
    onSuccess: (data, variable) => {
      // 요청 성공시 응답으로 부터 얻은 중간 지점 장소 리스트를 중간 지점 화면에 navigate의 state로 보내준다.
      // navigate('중간 지점 화면을 보여줄 주소', {state: data});
      console.log('API 요청 성공');
      console.log('중간지점찾기 API 요청시 보낸 데이터', variable);
      console.log('중간지점찾기 API 요청 이후 받은 응답 데이터', data);
    },
    onError: (error) => {
      // 에러 발생시 alert로 에러를 보여준다. (서버 에러)
      console.error(`중간 지점 결과 조회 API 요청 실패, 에러명 : ${error}`);
      setIsLoading(false);
    },
  });

  // 중간지점찾기 버튼 클릭시 수행되는 함수
  const onSubmit = (data: IForm) => {
    // form 보내는 상태를 true로 설정해준다
    setIsLoading(true);

    // friendList에 있는 모든 사람에 대해 이름, 운송수단, 주소(위치)가 모두 입력되었는지 확인하는 과정
    const allFieldsFilled = data.friendList.every((friend) => friend.username && friend.transport && friend.address);

    // 모두 입력되지 않은 경우에는 '모두 입력해주세요' 라는 에러메세지 보여주고 종료한다.
    if (!allFieldsFilled) {
      setIsLoading(false);
      alert('모둗 입력해주세요!');
      return;
    }

    // username을 제외한 데이터 추출
    const submissionData = data.friendList.map(({ username, ...rest }) => rest);

    console.log('중간지점 찾기 요청시 서버로 보내는 값', submissionData);

    // API 요청 보내기
    searchMiddlePoint(submissionData, {
      onSuccess: () => {
        console.log('2번째로 불림- API 요청 성공');
      },
      onError: (error) => {
        // 에러 발생시 에러를 보여준다. (서버 에러)
        console.error(`2번째로 불림중간 지점 결과 조회 API 요청 실패, 에러명 : ${error}`);
        setIsLoading(false);
      },
    });
  };

  return (
    <Container className="max-w-[1800px]">
      <SideBar />
      <Content>
        <Title className="text-4xl font-medium pt-9">모두의 중간</Title>
        <Textbox className="rounded-lg">
          <p>상대방에게 링크를 공유하여 주소를 입력하게 하고 중간 지점을 찾아보세요!</p>
        </Textbox>

        <div className="flex w-full gap-20 min-w-[1024px] justify-center mt-20">
          <div className="w-[45%] min-w-[540px] h-96 flex flex-col gap-3">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 overflow-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="px-1">
                  <h2 className="text-lg font-semibold">친구 {index + 1}</h2>
                  <div className="flex items-center justify-between w-full *:rounded-lg gap-3">
                    <input
                      {...register(`friendList.${index}.username` as const, { required: true })}
                      placeholder="이름 입력"
                      className="w-40 transition bg-indigo-100 border-none ring-1 focus:ring-2 ring-indigo-100 focus:outline-none"
                    />
                    <div className="relative w-40">
                      <select
                        {...register(`friendList.${index}.transport` as const, { required: true })}
                        className="w-40 bg-indigo-100 border-none rounded-lg outline-none appearance-none ring-0 focus:ring-0"
                      >
                        {Object.values(Transport).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 flex items-center px-2 pointer-events-none right-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 17 11" fill="none">
                          <path
                            d="M6.96356 10.1563C7.76315 11.1158 9.23685 11.1158 10.0364 10.1563L15.7664 3.28036C16.8519 1.97771 15.9256 -9.53674e-07 14.2299 -9.53674e-07H2.77008C1.07441 -9.53674e-07 0.148095 1.97771 1.23364 3.28037L6.96356 10.1563Z"
                            fill="#5142FF"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="relative overflow-x-scroll w-72 hide-scrollbar hide-x-scrollbar">
                      <div
                        className={`flex items-center min-w-full h-10 px-3 transition bg-indigo-100 w-max border-none rounded-lg cursor-pointer ring-1 focus:ring-2 ring-indigo-100 ${watch(`friendList.${index}.address`) ? 'text-black' : 'text-gray-500'}`}
                        onClick={() => openAddressSearch(index)}
                      >
                        {watch(`friendList.${index}.address`) || '주소 입력'}
                      </div>
                      <input type="hidden" {...register(`friendList.${index}.address` as const, { required: true })} />
                    </div>
                  </div>
                </div>
              ))}
            </form>
            <button
              type="button"
              onClick={() => append(default_format)}
              className="w-full font-semibold text-indigo-600 bg-indigo-100 rounded-lg min-h-10"
            >
              +
            </button>
            <Button isLoading={isLoading} text="중간 지점 찾기" onClick={handleSubmit(onSubmit)} />
          </div>
          <div className="w-[36%] rounded-xl h-[500px] -mt-8 shadow-lg">
            <KakaoMap addresses={addresses} />
          </div>
        </div>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100vw;
`;

const Content = styled.div`
  width: 80%;
  min-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const Title = styled.h1``;

const Textbox = styled.div`
  width: 55%;
  min-width: 700px;
  background: rgba(81, 66, 255, 0.1);
  color: ${(props) => props.theme.mainColor};
  padding: 10px 5px;
  font-size: 18px;
  text-align: center;
`;
