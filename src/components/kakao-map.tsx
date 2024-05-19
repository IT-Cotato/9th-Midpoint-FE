/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

interface IKakaoMap {
  addresses: string[]; // 사용자가 입력한 도로명 주소들이 저장되어 있는 배열
}

export default function KakaoMap({ addresses }: IKakaoMap) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const geocodeAddress = (address: string, map: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        // 애니메이션을 적용하기 위한 커스텀 엘리먼트
        const content = document.createElement('div');
        content.className = 'relative flex items-center justify-center size-12';

        const ping = document.createElement('div');
        ping.className = 'absolute w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping';
        content.appendChild(ping);

        const markerElement = document.createElement('div');
        markerElement.className = 'relative bg-indigo-600 rounded-full size-3';
        content.appendChild(markerElement);

        const markerSvg = document.createElement('img');
        markerSvg.src = '/marker.svg'; // 마커 이미지 경로
        markerSvg.className = 'absolute size-9';
        content.appendChild(markerSvg);

        // CustomOverlay를 사용 + 이 경우, 기본 마커 이미지를 사용하지 않고 커스텀 마커만 표시가능
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: coords,
          content: content,
          yAnchor: 1, // 마커의 밑부분이 지도 위치에 고정되도록 설정
        });

        markersRef.current.push(customOverlay);
        customOverlay.setMap(map);
        map.setCenter(coords);
      }
    });
  };

  const updateMap = () => {
    if (!mapRef.current) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    markersRef.current.forEach((customOverlay) => {
      customOverlay.setMap(null);
    });
    markersRef.current = [];

    addresses.forEach((address) => {
      geocodeAddress(address, mapRef.current);
    });

    if (addresses.length > 0) {
      addresses.forEach((address) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            bounds.extend(coords);
          }
        });
      });

      // 비동기 작업인 주소 검색이 완료되기 전에 setBounds를 호출하지 않도록 지연을 두기 위한 코드
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setBounds(bounds);
        }
      }, 500);
    }
  };

  const initMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.556328, 126.923634), // 지도의 중심좌표로 (위도, 경도) 순으로 입력 (기본으로 홍대 입구역으로 하였음)
      level: 2, // 지도의 확대 축소 정도
    };

    const map = new window.kakao.maps.Map(container as HTMLElement, options);
    mapRef.current = map;
    updateMap();
  };

  useEffect(() => {
    window.kakao.maps.load(() => initMap());
  }, []);

  useEffect(() => {
    updateMap();
  }, [addresses]);

  // 기본적으로 width: 100% , height:100%로 지도가 보이도록 만들어 놨습니다.
  // 따라서 해당 컴포넌트를 사용하는 상위컴포넌트에서 width, height를 지정해주면 됩니다.
  return <div id="map" className="w-full h-full"></div>;
}
