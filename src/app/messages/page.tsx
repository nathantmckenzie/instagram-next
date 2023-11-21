"use client";

import NavBar from "../(components)/NavBar";
import Messages from "./messages";
import { useState } from "react";

interface ChildProps {
  id: number;
  name: string;
  age: number;
  male: boolean;
}

interface Message {
  id: number;
  message: string;
}

function Page() {
  const [expandedPhoto, setExpandedPhoto] = useState();

  const closePhoto = (event) => {
    console.log("hi", event.target);
    setExpandedPhoto(false);
  };

  return (
    <div
      className={`h-[100vh] ${
        expandedPhoto ? "bg-white" : "bg-white"
      } text-black sm:flex sm:flex-col-reverse lg:flex lg:flex-row`}
      onClick={expandedPhoto ? closePhoto : null}
    >
      <NavBar />
      <Messages
        setExpandedPhoto={setExpandedPhoto}
        expandedPhoto={expandedPhoto}
      />
      {expandedPhoto && (
        <div
          onClick={closePhoto}
          className="fixed right-5 top-5 z-50 cursor-pointer text-[30px]"
        >
          X
        </div>
      )}
    </div>
  );
}

export default Page;
