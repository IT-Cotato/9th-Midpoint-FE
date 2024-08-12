/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

interface IKakaoMap {
  coordinates: { lat: number; lng: number }[]; // 좌표 목록
  selectedCoordinate: { lat: number; lng: number } | null; // 선택된 좌표
}

export default function EnterEachMap({ coordinates, selectedCoordinate }: IKakaoMap) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<any[]>([]);

  const placeMarker = (lat: number, lng: number, map: any, isSelected: boolean = false) => {
    const coords = new window.kakao.maps.LatLng(lat, lng);

    // 커스텀 마커 생성
    const markerContent = document.createElement('div');
    markerContent.className = `relative flex items-center justify-center size-12`;

    const ping = document.createElement('div');
    ping.className = `absolute w-full h-full ${isSelected ? 'bg-red-400' : 'bg-indigo-400'} rounded-full opacity-75 animate-ping`;
    markerContent.appendChild(ping);

    const markerElement = document.createElement('div');
    markerElement.className = `relative ${isSelected ? 'bg-red-600' : 'bg-indigo-600'} rounded-full size-3`;
    markerContent.appendChild(markerElement);

    const markerSvg = document.createElement('img');
    markerSvg.src = isSelected ? '/selectedMarker.svg' : '/marker.svg';
    markerSvg.className = 'absolute size-9';
    markerContent.appendChild(markerSvg);

    // CustomOverlay를 사용하여 마커 표시
    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: coords,
      content: markerContent,
      yAnchor: 1,
      zIndex: isSelected ? 1000 : 1,
    });

    markersRef.current.push(customOverlay);
    customOverlay.setMap(map);
  };

  const updateMap = () => {
    if (!mapRef.current) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    markersRef.current.forEach((customOverlay) => {
      customOverlay.setMap(null);
    });
    markersRef.current = [];

    coordinates.forEach(({ lat, lng }) => {
      const isSelected = selectedCoordinate?.lat === lat && selectedCoordinate?.lng === lng;
      placeMarker(lat, lng, mapRef.current, isSelected);
    });

    if (coordinates.length > 0) {
      coordinates.forEach(({ lat, lng }) => {
        const coords = new window.kakao.maps.LatLng(lat, lng);
        bounds.extend(coords);
      });

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setBounds(bounds);
        }
      }, 500);
    }
  };

  const initMap = () => {
    if (!containerRef.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.556328, 126.923634), // 지도의 중심좌표로 (위도, 경도) 순으로 입력
      level: 2, // 지도의 확대 축소 정도
    };

    const map = new window.kakao.maps.Map(containerRef.current, options);
    mapRef.current = map;
    updateMap();
  };

  useEffect(() => {
    const checkContainer = () => {
      if (containerRef.current && containerRef.current.offsetHeight > 0) {
        initMap();
      } else {
        setTimeout(checkContainer, 100); // 컨테이너가 렌더링될 때까지 100ms마다 재시도
      }
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => checkContainer());
    }
  }, []);

  useEffect(() => {
    updateMap();
  }, [coordinates, selectedCoordinate]);

  return <div id="map" ref={containerRef} className="w-full h-full"></div>;
}
