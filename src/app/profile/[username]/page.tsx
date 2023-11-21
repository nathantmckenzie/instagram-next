"use client";

import NavBar from "../../(components)/NavBar";
import getProfile from "../../lib/getProfile";
import { useState, useEffect, Suspense } from "react";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { notFound } from "next/navigation";

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
  const data = getProfile(params.username);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [hasError, setHasError] = useState(false);

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

  if (hasError) throw new Error("LMAO");

  return (
    <div className="flex h-[100vh] flex-row overflow-y-scroll">
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex h-full w-[100vw] justify-center overflow-y-scroll bg-white text-black">
          {profileData ? (
            <div>
              <div className="mb-40 mt-6 flex flex-row justify-center">
                <img
                  src={profileData.profile_picture}
                  className="mr-10 h-[130px] w-[130px] rounded-full"
                />
                <div>
                  <div className="mb-3 flex flex-row">
                    <div className="mr-4 font-[bold] text-xl">
                      {profileData.username}
                    </div>
                    <button className="mr-4">Following</button>
                    <button className="mr-4">Message</button>
                  </div>
                  <div className="flex flex-row">
                    <div className="mr-4">{profilePosts.length} Posts</div>
                    <div className="mr-4">Followers</div>
                    <div className="mr-4">Following</div>
                  </div>
                </div>
              </div>
              <div className="m-10 md:flex md:flex-col lg:grid lg:grid-cols-[repeat(3,300px)] lg:gap-[5px]">
                {profilePosts.map((post) => {
                  return (
                    <div key={post.id}>
                      {post.content_type === 1 ? (
                        <img
                          src={post.content}
                          className="md:h-[400px] md:w-[400px] lg:h-[300px] lg:w-[300px]"
                        />
                      ) : (
                        <video className="object-cover md:h-[400px] md:w-[400px] lg:h-[300px] lg:w-[300px]">
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
                        </video>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </Suspense>
    </div>
  );
}
