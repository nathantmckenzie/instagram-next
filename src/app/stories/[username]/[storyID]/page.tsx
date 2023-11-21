"use client";

import React, { useState, useEffect, useRef } from "react";
import getData from "../../../lib/getData";
import { useRouter } from "next/navigation";
import { timeSincePosted } from "../../../helperFunctions";
import axios from "axios";
import Link from "next/link";

const App = ({ params }) => {
  const router = useRouter();
  const [indexSelected, setIndexSelected] = useState(0);
  const [difference, setDifference] = useState(0);
  const [key, setKey] = useState(0);
  const [percent, setPercent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(4000);
  const [intervalId, setIntervalId] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newDur, setNewDur] = useState(0);
  const [pausePer, setPausePer] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [inputFieldIsFocused, setInputFieldIsFocused] = useState(false);
  const [inputFieldsText, setInputFieldsText] = useState({});
  const [muted, setMuted] = useState(true);
  const [stories, setStories] = useState(null);
  const [hasInitialStoriesLoaded, setHasInitialStoriesLoaded] = useState(false);

  const videoRefs = useRef([]);
  const quickReactionRef = useRef(null);

  const goToProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  useEffect(() => {
    console.log(params);
  }, []);

  const handlePopstate = (event) => {
    // Check if the back button was clicked
    if (event.type === "popstate") {
      // Perform any necessary actions or updates when the back button is clicked
      console.log("Back button clicked");

      // Navigate to the home page
      this.$router.push("/");
    }
  };

  const selectSlide = (index, event) => {
    // event.preventDefault();

    //this is only called when actually clicking on a slide
    const newDifference = difference + (indexSelected - index);
    console.log("newDifference", newDifference);
    setDifference(newDifference);
    setIndexSelected(index);
    setKey(0);
    setNewDur(0);
    changeStoryRoute(index);
    reset(index);
  };

  const addStoryReply = () => {
    axios.post("http://localhost:7003/addDirectMessage").then(() => {
      console.log("");
    });
  };

  const next = (index) => {
    if (
      indexSelected >= stories.length - 1 &&
      key >= stories[this.indexSelected].stories.length - 1
    ) {
      clearInterval(intervalId);
      clearInterval(progress);
    } else if (key >= stories[indexSelected].stories.length - 1) {
      setTimeout(() => {
        const newDifference = difference + (index - (index + 1));
        setDifference(newDifference);
        setIndexSelected((indexSelected) => indexSelected + 1);
        setKey(0);
      });
    } else {
      setKey((key) => key + 1);
      console.log(key);
    }
    setNewDur(0);
    changeStoryRoute(index + 1);
    reset();
  };

  const changeStoryRoute = (index) => {
    console.log("index", index, "stories", stories);
    const username = stories[index].username;
    const storyID = stories[index].stories[0].story_id;
    console.log("lol", username, storyID);
    // router.push(`/stories/${username}/${storyID}`);

    window.history.pushState({}, "", `/stories/${username}/${storyID}`);
  };

  const prev = (index) => {
    if (indexSelected <= 0 && key <= 0) {
      setKey(0);
    } else if (key <= 0) {
      setTimeout(() => {
        const newDifference = difference + (index - (index - 1));
        setDifference(newDifference);
        setIndexSelected((indexSelected) => indexSelected - 1);
        setKey(0);
      });
    } else {
      setKey((key) => key - 1);
    }
    setNewDur(0);
    changeStoryRoute(index - 1);
    reset();
  };

  const autoPlay = () => {
    console.log("index", indexSelected);
    const username = stories[indexSelected].username;
    const storyID = stories[indexSelected].stories[0].story_id;

    //runs every 5 seconds (because of the setInterval with duration of 5000 ms)
    if (
      stories &&
      indexSelected >= stories.length - 1 &&
      key >= stories[indexSelected].stories.length - 1
    ) {
      //once all the users stories are done

      setDifference(0);
      setIndexSelected(0);
      setKey(0);

      router.push("/");
    } else if (key >= stories[indexSelected].stories.length - 1) {
      //once a single user's stories are done

      //difference is mostly for determining the position of the story stylistically
      setDifference((difference) => difference - 1);
      setIndexSelected((indexSelected) => indexSelected + 1);
      setKey(0);
      clearInterval(intervalId);
      clearInterval(progress);

      changeStoryRoute(indexSelected + 1);
    } else {
      //one a unique story is done
      setKey((previousValue) => {
        return previousValue + 1;
      });

      changeStoryRoute(indexSelected + 1);
    }
  };

  const play = (index) => {
    //note that play is being called in the useEffect for the initial render of the page and play is also called
    //in the reset function

    // if (stories[indexSelected]?.stories[key]?.content_type === 2) {
    //   const videoElement = videoRefs.current[index];
    //   console.log("video ELEE", videoElement);
    //   videoElement.addEventListener("loadedmetadata", () => {
    //     console.log("duration", videoElement.duration);
    //     const videoDuration = videoElement.duration;
    //     setNewDur(videoDuration * 1000);
    //     console.log("Video duration:", videoDuration, "seconds");
    //   });
    // } else {
    // }
    // Load the video to retrieve metadata
    // videoElement.load();
    let timer = new Date().getTime();

    const progressID = setInterval(() => {
      let time = new Date().getTime();
      if (newDur > 0) {
        const percentage =
          pausePer + Math.floor((100 * (time - timer)) / duration);
        setPercent(percentage);
        if (percentage > 99) {
          setNewDur(0);
        }
      } else {
        //no newDur
        const percentage = Math.floor((100 * (time - timer)) / duration);
        setPercent(percentage);
      }
    }, duration / 100);

    setProgress(progressID);

    if (newDur > 0) {
      //if the newDur is greater than 0, then this will run (newDur is updated via setNewDur(duration - (pausePer * duration) / 100); from the pauseStory function)
      //this is where autoPlay is called

      const intervalID = setInterval(() => autoPlay(index), newDur);

      // const newIntervalIds = [...intervalIds];
      // newIntervalIds.push(intervalID);
      // setIntervalIds(newIntervalIds);
      setIntervalId(intervalID);
    } else {
      //if the newDur is at 0, then this will run (duration set to 5000)
      //this is where autoPlay is called

      const intervalID = setInterval(() => autoPlay(index), duration);
      setIntervalId(intervalID);
    }
  };

  const reset = (index) => {
    //this function runs each time a unique story changes
    //it's called at the bottom of the autoPlay function and runs every time

    console.log(
      "index",
      index,
      "indexSelected",
      indexSelected,
      "difference",
      difference,
    );
    setPercent(0);
    clearInterval(intervalId);
    clearInterval(progress);
    playStory(index);
  };

  const pauseStory = (contentType, index) => {
    //this is the function attached to the play button

    if (contentType === 2) {
      videoRefs.current[index].pause();
    }
    //displays the pause button
    setIsPaused(true);

    console.log("percent", percent);
    setPausePer(percent);
    console.log("progress", progress, "intervalId", intervalId);
    clearInterval(progress);
    clearInterval(intervalId);

    setNewDur(duration - (percent * duration) / 100);
  };

  const playStory = (index) => {
    //this is just the function attached to the pause button
    console.log("okaayyy", videoRefs.current[index]);
    console.log("index", index);
    if (videoRefs.current[indexSelected]) {
      console.log("okaayyy", videoRefs.current[indexSelected]);
      videoRefs.current[indexSelected].play();
    }
    setIsPaused(false);
    play(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData();
      setStories(response.stories.rows);
      setHasInitialStoriesLoaded(true);
    };

    fetchData();

    // const index = stories.findIndex((el) => el.username === params.username);

    // selectSlide(1);
  }, []);

  useEffect(() => {
    if (key > 0 || indexSelected > 0) {
      reset();
    }
  }, [key, indexSelected]);

  useEffect(() => {
    if (hasInitialStoriesLoaded && stories) {
      console.log("params", params);
      const index = stories.findIndex((el) => el.username === params.username);
      console.log("index", index);

      selectSlide(index);
      // play();
    }
  }, [stories, hasInitialStoriesLoaded]);

  const returnHome = () => {
    clearInterval(intervalId);
    clearInterval(progress);
    router.push("/");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        quickReactionRef.current &&
        !quickReactionRef.current.contains(event.target)
      ) {
        console.log("outside of i");
        setInputFieldIsFocused(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div className="flex h-[100vh] flex-row items-center justify-center">
        {console.log("STORIES", stories)}
        {stories
          ? stories.map((story, index) => (
              <div
                key={index}
                className="absolute mb-5 aspect-[9/16] cursor-pointer rounded-lg bg-red-400 transition-transform duration-200 ease-in sm:h-[80%] md:h-[93%] md:max-w-[70%]"
                style={{
                  display:
                    index - 3 === indexSelected || index + 3 === indexSelected
                      ? "none"
                      : null,
                  transform: `translate(${
                    index === indexSelected
                      ? 60 * (index + difference)
                      : index - 1 === indexSelected
                      ? 87 * (index + difference)
                      : index + 1 === indexSelected
                      ? 87 * (index + difference)
                      : 73 * (index + difference)
                  }%) scale(${index === indexSelected ? 1 : 0.45})`,
                  // }px) scale(${index === indexSelected ? 1.5 : 0.7})`,
                }}
                onClick={(event) =>
                  index !== indexSelected ? selectSlide(index, event) : null
                }
              >
                <div className="h-full rounded-lg bg-cover bg-no-repeat">
                  <div className="h-full">
                    {index === indexSelected ? (
                      story.stories[key]?.content_type === 1 ? (
                        <div className="mt-24 flex justify-center">
                          <img
                            src={story.stories[key]?.content}
                            className="w-full"
                            alt="Story Image"
                          />
                        </div>
                      ) : story.stories[key]?.content_type === 2 ? (
                        <video
                          key={story.stories[key]?.story_id}
                          className="w-full"
                          autoPlay
                          muted={muted}
                          ref={(el) => (videoRefs.current[index] = el)} // Assign the ref to the array
                          playsInline
                        >
                          <source
                            src={story.stories[key]?.content}
                            type="video/mp4"
                          />
                          <source
                            src={story.stories[key]?.content}
                            type="video/ogg"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : null
                    ) : story.stories[0]?.content_type === 2 ? (
                      <video
                        key={story.stories[0]?.story_id + 100}
                        className="w-full"
                        muted
                        ref={(el) => (videoRefs.current[index] = el)} // Assign the ref to the array
                        playsInline
                      >
                        <source
                          src={story.stories[0]?.content}
                          type="video/mp4"
                        />
                        <source
                          src={story.stories[0]?.content}
                          type="video/ogg"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : story.stories[0]?.content_type === 1 ? (
                      <div className="mt-24 flex justify-center">
                        <img
                          src={story.stories[0]?.content}
                          className="w-full"
                          alt="Story Image"
                        />
                      </div>
                    ) : null}
                  </div>
                  {index === indexSelected ? (
                    <div className="absolute top-0 w-full pt-4">
                      <div className="m-auto flex w-11/12">
                        {story.stories.map((elm, index) => (
                          <div
                            key={index}
                            className="relative mr-2 h-auto w-full rounded-lg"
                          >
                            {/* length slide */}
                            <div
                              className="absolute w-full rounded-lg"
                              style={{
                                height: "4px",
                                backgroundColor: "rgba(255, 255, 255, 0.35)",
                              }}
                            ></div>
                            {/* end length */}
                            <div
                              className="absolute w-full rounded-lg"
                              style={{
                                height: "4px",
                                backgroundColor: "white",
                                width:
                                  index === key
                                    ? `${percent}%`
                                    : key > index
                                    ? "100%"
                                    : "0%",
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                      <div className="m-auto mt-4 flex w-11/12">
                        <div className="flex w-1/2 items-center justify-start">
                          <div style={{ width: "35px", height: "35px" }}>
                            <img
                              src={story.profile_picture}
                              className="w-12 rounded-full"
                              onClick={() => goToProfile(story.username)}
                              alt="Profile Picture"
                            />
                          </div>
                          <div className="ml-4 flex flex-row">
                            <p
                              className="mr-1 cursor-pointer text-sm font-semibold text-white"
                              onClick={() => goToProfile(story.username)}
                            >
                              {story.username}
                            </p>
                            <p className="text-sm font-semibold">
                              {timeSincePosted(story.stories[key].timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-1/2 items-center justify-end">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#fff"
                            onClick={() =>
                              isPaused
                                ? playStory(
                                    index === indexSelected
                                      ? story.stories[key]?.content_type
                                      : story.stories[0]?.content_type,
                                    index,
                                  )
                                : pauseStory(
                                    index === indexSelected
                                      ? story.stories[key]?.content_type
                                      : story.stories[0]?.content_type,
                                    index,
                                  )
                            }
                          >
                            <path
                              className={isPaused ? "hidden" : ""}
                              d="M9 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1z"
                              fill="#fff"
                            />
                            <path
                              className={isPaused ? "" : "hidden"}
                              d="M6 6.741c0-1.544 1.674-2.505 3.008-1.728l9.015 5.26c1.323.771 1.323 2.683 0 3.455l-9.015 5.258C7.674 19.764 6 18.803 6 17.26V6.741zM17.015 12L8 6.741V17.26L17.015 12z"
                              fill="#fff"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col items-center">
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            transform: "translate(-50%, -50%) scale(2.5)",
                          }}
                          className="absolute left-2/4 top-[45%] -translate-x-2/4 translate-y-[-45%] scale-[2.5] rounded-full border-2 border-indigo-400 transition-transform duration-100"
                        >
                          <img
                            src={story.profile_picture}
                            className="h-12 w-12 rounded-full"
                            alt="Profile Picture"
                          />
                        </div>
                        <div className="absolute left-2/4 top-[56%] mt-6 -translate-x-2/4 translate-y-[-56%]">
                          <p className="text-sm font-semibold text-white">
                            {story.username}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 z-10 rounded-lg"
                        style={{
                          background:
                            "linear-gradient(rgba(38, 38, 38, 0.6), rgba(38, 38, 38, 0))",
                        }}
                      ></div>
                    </div>
                  )}
                  {index === indexSelected ? (
                    <div ref={quickReactionRef}>
                      {inputFieldIsFocused ? (
                        <div className="absolute bottom-[20%] left-[30%]">
                          <div className="mb-5 text-center text-xl font-bold">
                            Quick Reaction
                          </div>
                          <div className="flex flex-row justify-around">
                            <div className="mr-2 text-3xl">😀</div>
                            <div className="mr-2 text-3xl">😍</div>
                            <div className="mr-2 text-3xl">😢</div>
                            <div className="mr-2 text-3xl">🔥 </div>
                          </div>
                        </div>
                      ) : null}
                      <div className="absolute left-[3%] top-[90%] flex w-full flex-row">
                        <input
                          placeholder={`Reply to ${story.username}...`}
                          value={
                            inputFieldsText[story.stories[key]?.story_id] || ""
                          }
                          onChange={(e) =>
                            setInputFieldsText({
                              ...inputFieldsText,
                              [story.stories[key]?.story_id]: e.target.value,
                            })
                          }
                          onFocus={() => setInputFieldIsFocused(true)}
                          className={`mr-3 h-10 rounded-full border border-solid border-[white] bg-transparent p-[10px] text-xs text-[white] placeholder-white ${
                            inputFieldIsFocused ? "w-[93%]" : "w-[93%]"
                          }`}
                        />
                        {/* Replace this onClick logic with your desired function */}
                        {console.log("WEOOO", story.content)}
                        {inputFieldIsFocused ? (
                          <button
                            className="absolute left-[81%] top-[12%] text-[white]"
                            onClick={() =>
                              addStoryReply(
                                inputFieldsText[story.stories[key]?.story_id],
                                story.stories[key]?.story_id,
                                story.user_id,
                                story.stories[key]?.content,
                              )
                            }
                          >
                            Send
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
                {index === indexSelected ? (
                  <div className="absolute left-11 top-1/2">
                    <i
                      onClick={() => prev(index)}
                      className="fas fa-chevron-circle-left z-150 cursor-pointer text-gray-500 transition-colors duration-150 ease-linear hover:text-gray-300"
                    ></i>
                    <button onClick={() => prev(index)}>Prev</button>
                  </div>
                ) : null}
                {index === indexSelected ? (
                  <div className="absolute right-11 top-1/2 z-10">
                    <i
                      onClick={() => next(index)}
                      className="fas fa-chevron-circle-right z-150 cursor-pointer text-gray-500 transition-colors duration-150 ease-linear hover:text-gray-300"
                    ></i>
                    <button onClick={() => next(index)}>Next</button>
                  </div>
                ) : null}
                {/* {inputFieldIsFocused ? (
                  <div
                    className="absolute bottom-[20%] left-[30%]"
                    ref={quickReactionRef}
                  >
                    <div className="mb-5 text-center font-bold text-xl">
                      Quick Reaction
                    </div>
                    <div className="flex flex-row justify-around">
                      <div className="text-3xl mr-2">😀</div>
                      <div className="text-3xl mr-2">😍</div>
                      <div className="text-3xl mr-2">😢</div>
                      <div className="text-3xl mr-2">🔥 </div>
                    </div>
                  </div>
                ) : null} */}
              </div>
            ))
          : null}
        <div
          onClick={returnHome}
          className="fixed right-8 top-5 cursor-pointer"
        >
          X
        </div>
      </div>
    </div>
  );
};

export default App;
