import { atom } from 'jotai';

export const loginAtom = atom(Boolean(localStorage.getItem('accessToken')));
