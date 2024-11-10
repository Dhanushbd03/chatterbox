import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import styled from "styled-components";


export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="w-full flex py-2 px-5 bg-primary items-center gap-5">
      <div className="">
        <Emoji className="px-5 text-white">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} className="size-6" />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} className="absolute top-0"/>}
        </Emoji>
      </div>
      <form className="flex flex-grow gap-5" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here ....."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="h-10 rounded-lg w-full p-3 bg-white text-black"
        />
        <button type="submit" className=" text-white">
          <IoMdSend className="size-6" />
        </button>
      </form>
    </div>
  );
}

const Emoji = styled.div`
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #000000;
        box-shadow: 0 5px 10px #A91D3A;
        border-color: #A91D3A;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #000000;
          width: 5px;
          &-thumb {
            background-color: #A91D3A;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #A91D3A;
        }
        .emoji-group:before {
          background-color: #000000;
        }
      }
`;