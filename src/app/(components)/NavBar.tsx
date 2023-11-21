"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBar({
  setShowSearch,
  showSearch,
  setShowMediaUploadModal,
}) {
  const router = useRouter();

  // const [showSearch, setShowSearch] = useState<boolean>(false);

  const redirectToStories = (): void => {
    console.log("WTF");
    router.push("/profile/1");
  };

  return (
    <div
      className={`z-20 flex sm:inline sm:h-[80px] sm:w-full sm:flex-row ${
        showSearch ? "lg:w-[50px] lg:flex-row" : "lg:w-[150px] lg:flex-col"
      } overflow-none bg-white text-black lg:h-full`}
    >
      <div
        className={`flex h-[100vh] border border-solid sm:w-full sm:flex-row sm:justify-between lg:flex-col lg:justify-normal`}
      >
        <div className="mb-10 cursor-pointer sm:m-5 lg:m-6">
          {showSearch ? "L" : "Linkup"}
        </div>
        <div
          className="cursor-pointer sm:m-5 lg:m-6"
          onClick={() => router.push("/")}
        >
          {showSearch ? "H" : "Home"}
        </div>
        <div
          onClick={() => setShowSearch(!showSearch)}
          className="cursor-pointer sm:m-5 lg:m-6"
        >
          {showSearch ? "S" : "Search"}
        </div>
        <div
          className="cursor-pointer sm:m-5 lg:m-6"
          onClick={redirectToStories}
        >
          {showSearch ? "P" : "Profile"}
        </div>
        <div
          className="cursor-pointer sm:m-5 lg:m-6"
          onClick={() => router.push("/messages")}
        >
          {showSearch ? "M" : "Messages"}
        </div>
        <div
          className="cursor-pointer sm:m-5 lg:m-6"
          onClick={() => setShowMediaUploadModal(true)}
        >
          {showSearch ? "C" : "Create"}
        </div>
        <div className="cursor-pointer sm:m-5 lg:m-6">
          {showSearch ? "L" : "Logout"}
        </div>
      </div>
    </div>
  );
}
