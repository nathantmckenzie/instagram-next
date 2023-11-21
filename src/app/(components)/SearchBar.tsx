"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ showSearch }) {
  const router = useRouter();

  return (
    <div
      className={`${
        showSearch
          ? "absolute left-12 lg:inline lg:h-full lg:w-[350px] lg:border lg:border-solid"
          : "lg:hidden"
      } z-10 bg-white sm:hidden`}
    >
      <div className="h-[160px] border border-solid">
        <div className="mb-[30px] ml-[30px] mt-[30px] font-[bold] text-2xl">
          Search
        </div>
        <div className="flex justify-center">
          <input
            className="w-[88%] rounded-[7px] border p-2"
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  );
}
