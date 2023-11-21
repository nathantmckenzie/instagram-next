"use client";

import NavBar from "../(components)/NavBar";
import SearchBar from "../(components)/SearchBar";
import getProfile from "../lib/getProfile";
import { useState, useEffect, Suspense } from "react";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

interface ProfileData {
  profile_picture: string;
  username: string;
}

interface Post {
  id: number;
  content_type: number;
  content: string;
}

export default function Profile({ params }: PageProps) {
  const data = getProfile("likemike");
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  useEffect(() => {
    data
      .then((res) => {
        console.log("RESSS", res.userData.rows[0]);
        setProfileData(res.userData.rows[0]);
        setProfilePosts(res.posts.rows);
      })
      .catch((err) => {
        if (err instanceof isNotFoundError) {
          notFound();
        } else {
          throw new Error(err);
        }
      });
  }, []);

  return (
    <div className="flex h-[100vh] bg-white sm:flex-col-reverse">
      <NavBar showSearch={showSearch} setShowSearch={setShowSearch} />
      <SearchBar showSearch={showSearch} />
      <div className="flex w-full items-center overflow-y-scroll border border-solid text-black sm:fixed sm:top-0 sm:h-[60px] lg:hidden">
        <div onClick={() => router.push("/")} className="ml-3 cursor-pointer">
          Back
        </div>
        <div className="flex w-[100vw] justify-center">
          <div>Notifications</div>
        </div>
      </div>
      <div>
        <div className="ml-[30%] mt-[100%] flex h-[100vh] items-center justify-center text-black">
          Today
        </div>
      </div>
    </div>
  );
}
