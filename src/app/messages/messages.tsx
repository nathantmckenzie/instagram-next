"use client";

import React, { useState, useEffect, useRef } from "react";
import NavBar from "../(components)/NavBar";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from "axios";

interface ChildProps {
  id: number;
  name: string;
  age: number;
  male: boolean;
}

interface Message {
  id: number;
  text: string;
  content: string;
  content_type: number;
  time_sent: string;
  post_id: number;
  sender_id: number;
  recipient_id: number;
  story_id: number;
}

interface Conversation {
  conversation_id: number;
  user1: {
    id: number;
    name: string;
    username: string;
    profile_picture: string;
  };
  user2: {
    id: number;
    name: string;
    username: string;
    profile_picture: string;
  };
  direct_messages: Message[];
}

interface ParentComponentProps {
  messagesProp: Conversation[];
}

function Messages(props): JSX.Element {
  const { setExpandedPhoto, expandedPhoto } = props;

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [input, setInput] = useState<string>("");

  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const [displayEmojiPicker, setDisplayEmojiPicker] = useState<boolean>(false);

  const [displayCommentEmojiPicker, setDisplayCommentEmojiPicker] =
    useState<boolean>(false);

  const [selectedConversation, setSelectedConversation] = useState<
    Message[] | null
  >(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [conversations, setConversations] = useState<Conversation[]>();

  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const [textAreaRows, setTextAreaRows] = useState(null);

  const [dropzoneFile, setDropzoneFile] = useState(null);

  const [photoIsLiked, setPhotoIsLiked] = useState();

  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const [commentReply, setCommentReply] = useState(false);

  const textareaRef = useRef(null);

  const addMessage = (
    e: React.FormEvent<HTMLFormElement>,
    contentType: number,
  ) => {
    e.preventDefault();
    console.log("contentType", contentType);

    if (contentType === 2) {
      let formData = new FormData();
      console.log("selectimage", selectedImage);
      console.log("dropzoneFIle", dropzoneFile);
      formData.append("file", dropzoneFile);
      formData.append("id", 1);
      formData.append("text", input);
      formData.append("contentType", 2);

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      setSelectedConversation([
        ...selectedConversation,
        {
          id: 1,
          text: input,
          content_type: contentType,
          content: selectedImage?.image ?? "",
        },
      ]);

      axios
        .post("http://localhost:7003/addDirectMessage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          console.log("");
          setInput("");
          setSelectedImage(null);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // axios({
      //   method: "post",
      //   url: "http://localhost:7003/addDirectMessage",
      //   data: formData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // })
      //   .then(function (response) {
      //     //handle success
      //     console.log(response);
      //   })
      //   .catch(function (response) {
      //     //handle error
      //     console.log(response);
      //   });
    } else {
      setSelectedConversation([
        ...selectedConversation,
        {
          id: 1,
          text: input,
          content_type: contentType,
          content: selectedImage?.image ?? "",
        },
      ]);

      axios
        .post("http://localhost:7003/addDirectMessage", {
          id: 1,
          text: input,
          content_type: 1,
        })
        .then(() => {
          console.log("");
          setInput("");
          setSelectedImage(null);
        });
    }
  };

  useEffect(() => {
    axios.get("http://localhost:7003/inbox").then((res) => {
      console.log("res", res.data.conversations.rows);
      setConversations(res.data.conversations.rows);
    });
  }, []);

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Call scrollToBottom whenever new messages are received or sent
  useEffect(() => {
    console.log("selectedConversation", selectedConversation);
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  const handleSelectEmoji = (emoji) => {
    // Do something with the selected emoji
    setSelectedEmoji(emoji);
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const handleSelectedFiles = (event) => {
    event.preventDefault();
    console.log("event", event);
    // console.log("event.target.files", event.target.files[0]);
    console.log("event.dataTransfer.files", event.dataTransfer.files[0]);
    setDropzoneFile(event.dataTransfer.files[0]);
    const file = event.dataTransfer.files[0];
    if (file) {
      // If the selected file is an image
      const reader = new FileReader();
      reader.onload = (event) => {
        // Set the selected image to be displayed
        // console.log("e.target.result", e.dataT.result);
        setSelectedImage({ image: event.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      // Handle cases where the selected file is not an image
      setSelectedImage(null);
      console.error("Please select a valid image file.");
    }
    return false;
  };

  const removeImagePreview = () => {
    setSelectedImage(null);
  };

  const updateTextArea = (event) => {
    setInput(event.target.value);

    // const textarea = textareaRef.current;
    // textarea.style.height = "auto"; // Reset the height
    // const scrollHeight = textarea.scrollHeight;
    // textarea.style.height = "5px"; // Set a small height initially

    // // Calculate the required height for the content
    // const requiredHeight = Math.max(textarea.scrollHeight, scrollHeight);

    // // Set the new height for the textarea to expand upward
    // textarea.style.height = `${requiredHeight}px`;
  };

  const test = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = "5px"; // Set a small height initially

    // Calculate the required height for the content
    const requiredHeight = Math.max(textarea.scrollHeight, scrollHeight);

    // Set the new height for the textarea to expand upward
    textarea.style.height = `${requiredHeight}px`;
  };

  const likePhoto = () => {
    setPhotoIsLiked(!photoIsLiked);
  };

  const expandPhoto = (e) => {
    const srcValue = e.target.getAttribute("src");
    setExpandedPhoto(srcValue);
  };

  const closePhoto = (e) => {
    e.stopPropagation();
  };
  const handleMouseEnterComment = (index) => {
    if (!displayCommentEmojiPicker) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeaveComment = () => {
    console.log("displayComment", displayCommentEmojiPicker);
    if (!displayCommentEmojiPicker) {
      setHoveredIndex(-1);
    }
  };

  useEffect(() => {
    console.log("commentREply", commentReply, selectedUser);
  }, [commentReply]);

  return (
    // <Suspense fallback={<div>Loading...</div>}>
    <div
      className={`flex flex-row sm:h-[calc(100%_-_80px)] lg:h-full lg:w-[calc(100%_-_150px)]`}
    >
      <div className="h-full border border-solid p-4 sm:w-[100px] lg:w-[300px]">
        {conversations
          ? conversations.map((conversation) => (
              <div
                className="flex cursor-pointer flex-row items-center"
                key={conversation.conversation_id}
                onClick={() => {
                  setSelectedUser(conversation.user2);
                  setSelectedConversation(conversation.direct_messages);
                }}
              >
                {console.log(selectedConversation)}
                <img
                  src={conversation.user2.profile_picture}
                  className="h-[60px] w-[60px] rounded-full"
                />
                <div className="sm:hidden lg:inline">
                  {conversation.user2.name}
                </div>
              </div>
            ))
          : null}
      </div>
      <div
        className={`items-center border border-solid sm:w-[calc(100%_-_100px)] lg:w-[calc(100%_-_300px)] ${
          selectedConversation ? "" : "flex justify-center"
        }`}
      >
        {!selectedConversation ? (
          <div
            onDrop={handleSelectedFiles}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
          >
            Select a conversation
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            onDrop={handleSelectedFiles}
            className={`scrollbar-w-2 scrollbar-track-gray-200 scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full ${
              selectedImage || commentReply
                ? "h-[calc(100%_-_100px)]"
                : "h-[calc(100%_-_60px)]"
            } overflow-y-scroll border border-solid`}
          >
            <div className="fixed flex h-[75px] flex-row items-center justify-start border border-solid bg-white pl-3 sm:w-[calc(100%_-_100px)] lg:w-[calc(100%_-_450px)]">
              <img
                src={selectedUser.profile_picture}
                className="mr-3 h-[55px] w-[55px] rounded-full"
              />
              <div>{selectedUser.name}</div>
            </div>
            <div className="mb-4 mt-[80px]">
              {selectedConversation.map((message, index) =>
                message.content_type == 2 ? (
                  <div
                    className={`
                    flex items-center
                      ${
                        message.id === 2
                          ? "relative flex justify-start"
                          : "relative mb-1 mr-2 flex justify-end"
                      }
                     `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                  >
                    {hoveredIndex === index && message.id !== 2 && (
                      <div className={`cursor-pointer`}>😄</div>
                    )}
                    <img
                      src={message.content}
                      className="ml-2 h-[200px] cursor-pointer rounded-[20px]"
                      onClick={expandPhoto}
                      onDoubleClick={likePhoto}
                    />
                    {hoveredIndex === index && message.id === 2 && (
                      <div className={`cursor-pointer`}>😄</div>
                    )}
                    {photoIsLiked && (
                      <div className="absolute bottom-0 z-20 cursor-pointer">
                        X
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className={`relative z-40 flex items-center 
                        ${
                          message.id === 2
                            ? "flex justify-start"
                            : "mb-1 mr-2 flex justify-end"
                        }`}
                      key={message.id}
                      onMouseEnter={() => handleMouseEnterComment(index)}
                      onMouseLeave={() => handleMouseLeaveComment()}
                    >
                      {console.log("message", message)}
                      {hoveredIndex === index && message.id !== 2 && (
                        <>
                          {displayCommentEmojiPicker ? (
                            <div className="z-100 absolute right-[60px] top-[30px]">
                              <Picker
                                data={data}
                                onEmojiSelect={(emoji) =>
                                  setInput(input.concat(emoji.native))
                                }
                                onClickOutside={() =>
                                  setDisplayCommentEmojiPicker(
                                    !displayCommentEmojiPicker,
                                  )
                                }
                              />
                            </div>
                          ) : null}
                          <div
                            className="mr-2 cursor-pointer"
                            onClick={() => setCommentReply(message)}
                          >
                            Reply
                          </div>
                          <div
                            onClick={() =>
                              setDisplayCommentEmojiPicker(!displayEmojiPicker)
                            }
                            className={`cursor-pointer`}
                          >
                            😄
                          </div>
                        </>
                      )}
                      <div
                        className={`ml-2 flex w-fit items-end rounded-[20px] border p-2 ${
                          message.id === 2
                            ? "justify-end bg-[#39f]"
                            : "justify-start bg-white"
                        }`}
                      >
                        {message.text}
                      </div>
                      {hoveredIndex === index && message.id === 2 && (
                        <>
                          {displayCommentEmojiPicker ? (
                            <div className="absolute bottom-14">
                              <Picker
                                className="absolute bottom-14"
                                data={data}
                                onEmojiSelect={(emoji) =>
                                  setInput(input.concat(emoji.native))
                                }
                                onClickOutside={() =>
                                  setDisplayCommentEmojiPicker(
                                    !displayCommentEmojiPicker,
                                  )
                                }
                              />
                            </div>
                          ) : null}
                          <div
                            onClick={() =>
                              setDisplayCommentEmojiPicker(!displayEmojiPicker)
                            }
                            className={`cursor-pointer`}
                          >
                            😄
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ),
              )}
            </div>
            <form
              onSubmit={(e) => addMessage(e, selectedImage ? 2 : 1)}
              className="fixed flex h-[35px] flex-row sm:bottom-24 sm:w-[calc(100vw_-_100px)] lg:bottom-3 lg:w-[calc(100vw_-_450px)]"
            >
              {commentReply && (
                <>
                  <div className="absolute bottom-10 left-7">
                    <div className="text-sm">
                      Replying to <b>{selectedUser.name}</b>
                    </div>
                    <div className="text-sm text-gray-400">
                      {commentReply.text}
                    </div>
                  </div>
                  <div className="absolute bottom-14 right-4 z-50 cursor-pointer">
                    x
                  </div>
                </>
              )}
              {displayEmojiPicker ? (
                <div className="absolute bottom-14">
                  <Picker
                    className="absolute bottom-14"
                    data={data}
                    onEmojiSelect={(emoji) =>
                      setInput(input.concat(emoji.native))
                    }
                    onClickOutside={() =>
                      setDisplayEmojiPicker(!displayEmojiPicker)
                    }
                  />
                </div>
              ) : null}
              <div
                onClick={() => setDisplayEmojiPicker(!displayEmojiPicker)}
                className="absolute bottom-1 left-6 z-10 cursor-pointer"
              >
                😄
              </div>
              {selectedImage && (
                <>
                  <div className="absolute bottom-11 left-6 z-10">
                    <img
                      src={selectedImage.image}
                      alt="Selected"
                      className="h-[40px] w-[40px] rounded-md"
                    />
                  </div>
                  <div
                    onClick={removeImagePreview}
                    className="absolute bottom-16 left-14 z-20 cursor-pointer"
                  >
                    X
                  </div>
                </>
              )}
              <textarea
                ref={textareaRef}
                placeholder="Type something..."
                className="bottom-25 fixed ml-3 mr-3 h-[30px] w-[85%] resize-none overflow-visible rounded-[20px] border border-solid pl-9 pr-16 pt-2"
                value={input}
                onChange={updateTextArea}
                onInput={test}
                contentEditable
                onDrop={handleSelectedFiles}
                onDragOver={dragOver}
                onDragLeave={dragLeave}
              />
              {selectedImage || input ? null : (
                <div className="absolute bottom-1 right-8 z-10 cursor-pointer">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                    // className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  >
                    Photos
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSelectedFiles}
                    className="hidden"
                    accept=".png,.jpeg,.jpg"
                    multiple
                  />
                  {/* 'hidden' class visually hides the default file input */}
                </div>
              )}
              {input || selectedImage ? (
                <button
                  type="submit"
                  className="absolute bottom-[5px] right-7 text-blue-400 hover:text-blue-800"
                >
                  Send
                </button>
              ) : null}
            </form>
            {console.log("EXPANDED", expandedPhoto)}
            {expandedPhoto && (
              <img
                src={expandedPhoto}
                className="fixed left-1/2 top-1/2 z-40 h-[70%] -translate-x-1/2 -translate-y-1/2 transform rounded-[30px]"
                onClick={closePhoto}
              />
            )}
          </div>
        )}
      </div>
    </div>
    // </Suspense>
  );
}

export default Messages;
