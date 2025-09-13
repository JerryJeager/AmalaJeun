import { User } from "@/types/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
}

const useUserStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
    //   setUserValue: (key: keyof User, value: any) =>
    //     set((state) => ({
    //       user: {
    //         ...state.user,
    //         [key]: value,
    //       } as User,
    //     })),
      resetUser: () => set({ user: null }),
    }),
    {
      name: "amalajeun-user-store",
      partialize: (state) => ({
        // user: state.user,
      }),
    }
  )
);

export default useUserStore;
