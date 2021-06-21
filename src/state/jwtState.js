import create from 'zustand';
import { devtools } from 'zustand/middleware'

let tokenStore = (set) => ({
    jwt: localStorage.getItem("jwt"),
    addToken: () => set( () => ({ jwt: localStorage.getItem("jwt") }) ),
    removeToken: () => set( () => ({ jwt: localStorage.clear() }) )
});

tokenStore = devtools(tokenStore);

export const useTokenStore = create(tokenStore);
