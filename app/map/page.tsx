"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/map/Navbar";
import { useEffect } from "react";
import { getCookie } from "@/actions/handleCookies";
import axios from "axios";
import { BASE_URL } from "@/data/data";
import useUserStore from "@/store/useUserStore";

const AmalaMap = dynamic(() => import("@/components/map/AmalaMap"), {
  ssr: false,
});

export default function Map() {
  const { setUser } = useUserStore();
  useEffect(() => {
    const getUser = async () => {
      const token = await getCookie("amalajeun_token");
      if (token?.value) {
        const res = await axios.get(`${BASE_URL()}/api/v1/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token?.value}`,
          },
        });

        console.log(res.status)

        console.log(res.data);
        if (res.status == 200) {
          setUser(res.data.user);
        }
      }
    };

    getUser()
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AmalaMap />
    </div>
  );
}
