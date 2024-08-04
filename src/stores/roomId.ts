import { atom } from 'jotai';

export const roomIdAtom = atom(Boolean(localStorage.getItem('roomId')));
