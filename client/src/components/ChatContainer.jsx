import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import styled from "styled-components";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
	const [messages, setMessages] = useState([]);
	const scrollRef = useRef();
	const [arrivalMessage, setArrivalMessage] = useState(null);

	useEffect(() => {
		const fetchMessages = async () => {
			const data = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			const response = await axios.post(recieveMessageRoute, {
				from: data._id,
				to: currentChat._id,
			});
			setMessages(response.data);
		};
		if (currentChat) fetchMessages();
	}, [currentChat]);

	const handleSendMsg = async (msg) => {
		const data = await JSON.parse(
			localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
		);
		socket.current.emit("send-msg", {
			to: currentChat._id,
			from: data._id,
			msg,
		});
		await axios.post(sendMessageRoute, {
			from: data._id,
			to: currentChat._id,
			message: msg,
		});

		setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.off("msg-recieve");
			socket.current.on("msg-recieve", (msg) => {
				setArrivalMessage({ fromSelf: false, message: msg });
			});
		}
	}, [socket]);

	useEffect(() => {
		if (arrivalMessage) {
			setMessages((prev) => [...prev, arrivalMessage]);
		}
	}, [arrivalMessage]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col h-full col-span-6 text-primary">
			<div className="chat-header bg-black flex justify-between p-2 items-center">
				<div className="user-details flex items-center gap-5 uppercase font-bold p-5">
					<div className="avatar">
						<img
							src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
							alt=""
							className="h-12"
						/>
					</div>
					<div className="username">
						<h3>{currentChat.username}</h3>
					</div>
				</div>
				<Logout />
			</div>
			<ChatMessages className="bg-black flex-grow px-10 space-y-2 flex flex-col max-h-[80vh] overflow-y-scroll py-5">
				{messages.map((message, index) => {
					return (
						<div
							ref={scrollRef}
							key={uuidv4()}>
							<div
								className={`flex min-w-5 break-words p-4 text-lg rounded-xl text-white max-w-80 ${
									message.fromSelf ? "bg-indigo-500 ml-auto" : "bg-primary"
								}`}>
								<p>{message.message}</p>
							</div>
						</div>
					);
				})}
			</ChatMessages>
			<ChatInput handleSendMsg={handleSendMsg} />
		</div>
	);
}

const ChatMessages = styled.div`
	&::-webkit-scrollbar {
		width: 0.2rem;
		&-thumb {
			background-color: #ffffff39;
			width: 0.1rem;
			border-radius: 1rem;
		}
	}
`;
