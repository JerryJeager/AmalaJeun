"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/map/Navbar";
import { useEffect } from "react";
import { getCookie } from "@/actions/handleCookies";
import { setCookie as setClientCookie } from "@/actions/clientCookies";
import axios from "axios";
import { BASE_URL } from "@/data/data";
import useUserStore from "@/store/useUserStore";

const AmalaMap = dynamic(() => import("@/components/map/AmalaMap"), {
  ssr: false,
});

export default function Map() {
  const { setUser } = useUserStore();
  useEffect(() => {
    // If token is passed in query params (?amalajeun_token=...), store it in a client cookie and remove it from the URL
    const storeTokenFromQuery = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("amalajeun_token");
        if (token) {
          // store for 1 hour
          setClientCookie("amalajeun_token", token, { maxAge: 3600, path: "/" });
          // remove the token from the URL without reloading
          params.delete("amalajeun_token");
          const newSearch = params.toString();
          const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (e) {
        // ignore in non-browser environments
      }
    };

    storeTokenFromQuery();

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
