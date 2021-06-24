import create from 'zustand';
import { devtools } from 'zustand/middleware'

let tokenStore = (set) => ({
    jwt: localStorage.getItem("jwt"),
    addToken: () => set( () => ({ jwt: localStorage.getItem("jwt") }) ),
    removeToken: () => set( () => ({ jwt: localStorage.clear() }) ),
});

let axiosStore = (set) => ({
    loading: true,
    setLoading: (value) => set( () => ({ loading: value }))
})

tokenStore = devtools(tokenStore);
axiosStore = devtools(axiosStore);

export const useTokenStore = create(tokenStore);
export const useAxiosStore = create(axiosStore);
