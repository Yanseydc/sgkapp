import create from 'zustand';
import { persist } from 'zustand/middleware'

const useStore = create( persist(
    (set, get) => ({
        jwt: null,
        setJwt: (token) => set( () => ({ jwt: token })), 
        clearJwt: () => set({ jwt: '' })
    })
));

export default useStore;
