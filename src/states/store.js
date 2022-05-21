import { atom } from 'jotai';

export const textAtom = atom('hello');
export const uppercaseAtom = atom((get) => get(textAtom).toUpperCase());
