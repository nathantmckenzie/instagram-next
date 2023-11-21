"use client";

import Image from "next/image";
import getData from "./lib/getData";
import getPosts from "./lib/getPosts";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./(components)/SearchBar";

import NavBar from "./(components)/NavBar";
import MediaUploadModal from "./(components)/MediaUploadModal";

export default function Home() {
  const data = getData();
  const router = useRouter();

  const videoContainers = useRef([]);

  console.log("DATA", data);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [pausedVideos, setPausedVideos] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);

  useEffect(() => {
    data.then((res) => {
      console.log("DAFAQ", res.posts.rows);
      setStories(res.stories.rows);
      setPosts(res.posts.rows);
    });
  }, []);

  const redirectToStories = (username, storyID) => {
    console.log("WTF", username, storyID);
    router.push(`/stories/${username}/${storyID}`);
    // router.push(`/stories`);
  };

  const toggleVideo = (index) => {
    console.log(index);
    console.log("containere", videoContainers);
    if (videoContainers.current) {
      console.log("pausedVideos", pausedVideos);
      if (pausedVideos[index]) {
        console.log("pausedVideos", pausedVideos);
        videoContainers.current[index].play();
      } else {
        videoContainers.current[index].pause();
      }
      setPausedVideos((prevPausedVideos) => {
        const updatedPausedVideos = [...prevPausedVideos];
        updatedPausedVideos[index] = !prevPausedVideos[index];
        return updatedPausedVideos;
      });
      console.log(pausedVideos);
    }
  };

  return (
    <main>
      <div className="h-[100vh] bg-white text-black sm:flex sm:w-full sm:flex-col-reverse lg:flex-row">
        <div className={`z-20 flex flex-row`}>
          <NavBar
            setShowSearch={setShowSearch}
            showSearch={showSearch}
            setShowMediaUploadModal={setShowMediaUploadModal}
          />
          {showSearch && (
            // <div className="transition-all delay-200 duration-1000 ">
            <SearchBar showSearch={showSearch} />
            // </div>
          )}
          {/* <div className=" absolute left-[100px] h-full w-[400px] border border-solid bg-white">
            <SearchBar />
          </div> */}
        </div>
        <div className="relative flex w-full flex-col overflow-y-scroll sm:h-[calc(100%_-_150px)] lg:h-full">
          {
            <div className="flex justify-center border border-solid">
              <div className="mb-5 mt-5 flex flex-row items-center">
                {stories.map((story) => {
                  {
                    console.log("story", story);
                  }
                  return (
                    <img
                      src={story.profile_picture}
                      className="mr-2 h-[50px] w-[50px] cursor-pointer rounded-[50%] border"
                      onClick={() =>
                        redirectToStories(
                          story.username,
                          story.stories[0].story_id,
                        )
                      }
                    />
                  );
                })}
              </div>
            </div>
          }
          <div className="mt-[10px] flex flex-col items-center">
            {posts?.map((post, index) => {
              return (
                <div className="mb-[20px] flex min-h-[600px] w-[500px] flex-col border border-black">
                  <div className="m-2 flex flex-row items-center">
                    <img
                      src={post.user.profile_picture}
                      className="mr-3 h-10 w-10 cursor-pointer rounded-[50%]"
                    />
                    <span className="cursor-pointer">{post.user.username}</span>
                  </div>
                  <div className="flex justify-center">
                    {post.content_type === 1 && (
                      <img src={post.content} className="w-full" />
                    )}
                    {post.content_type === 2 && (
                      <div className="relative">
                        <video
                          onClick={() => toggleVideo(index)}
                          width="300"
                          height="480"
                          autoPlay
                          muted={isMuted}
                          ref={(el) => (videoContainers.current[index] = el)}
                        >
                          <source
                            id="videoPreview1"
                            src={post.content}
                            type="video/mp4"
                          />
                          <source
                            id="videoPreview2"
                            src={post.content}
                            type="video/ogg"
                          />
                          Your browser does not support the video tag.
                        </video>
                        {pausedVideos[index] && (
                          <div
                            onClick={() => toggleVideo(index)}
                            className="absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer items-center justify-center"
                          >
                            Pause
                          </div>
                        )}
                        <div
                          className="absolute bottom-0 left-0 right-0 top-0 flex h-[30px] w-[30px] cursor-pointer items-start justify-center"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? "Muted" : "Unmuted"}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="h-[100px]">Comments</div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`flex h-[70px] flex-row items-center justify-between border border-solid lg:hidden`}
        >
          <div className="ml-3 cursor-pointer">Instagram</div>
          <div className="mr-3 flex flex-row">
            <input
              placeholder="Search"
              className="mr-3 h-[30px] w-[270px] rounded-[8px] border border-solid p-3"
            />
            <div
              className="cursor-pointer"
              onClick={() => router.push("/notifications")}
            >
              Heart
            </div>
          </div>
        </div>
        {showMediaUploadModal && (
          <MediaUploadModal
            showMediaUploadModal={showMediaUploadModal}
            setShowMediaUploadModal={setShowMediaUploadModal}
          />
        )}
      </div>
    </main>
  );
}
