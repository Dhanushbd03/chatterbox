import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import styled from "styled-components";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

const ChatContainer = ({ currentChat, socket, currentUser }) => {
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

		setMessages((prev) => [
			...prev,
			{ fromSelf: true, message: msg, time: new Date().toISOString() },
		]);
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.off("msg-recieve");
			socket.current.on("msg-recieve", (msg) => {
				setArrivalMessage({
					fromSelf: false,
					message: msg,
					time: new Date().toISOString(),
				});
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

	// Function to format the timestamp
	function msgTime(time) {
		const date = new Date(time);
		const readableDate = date.toLocaleString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
		return readableDate;
	}

	// Function to group messages by day
	function groupMessagesByDay(messages) {
		const groupedMessages = [];
		let currentGroup = [];
		let currentDate = null;

		messages.forEach((message) => {
			const messageDate = new Date(message.time).toLocaleDateString();

			if (messageDate !== currentDate) {
				if (currentGroup.length > 0) {
					groupedMessages.push({ date: currentDate, messages: currentGroup });
				}
				currentGroup = [];
				currentDate = messageDate;
			}

			currentGroup.push(message);
		});

		if (currentGroup.length > 0) {
			groupedMessages.push({ date: currentDate, messages: currentGroup });
		}

		return groupedMessages;
	}

	const groupedMessages = groupMessagesByDay(messages);

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
			</div>

			<ChatMessages className="bg-black flex-grow px-10 space-y-2 flex flex-col max-h-[80vh] overflow-y-scroll py-5">
				{groupedMessages.map((group, groupIndex) => (
					<div key={groupIndex} className="flex flex-col gap-3">
						<div className="text-center  my-2 bg-primary w-fit mx-auto rounded-full px-3 text-white">
							{/* Display the date as a heading */}
							<span>{new Date(group.date).toLocaleDateString()}</span>
						</div>
						{group.messages.map((message, messageIndex) => (
							<div
								ref={scrollRef}
								key={uuidv4()}
								className={`flex items-center gap-2 ${message.fromSelf ? "flex-row-reverse" : "flex-row"}`}>
								<div>
									<img
										src={`data:image/svg+xml;base64,${message.fromSelf ? currentUser.avatarImage : currentChat.avatarImage}`}
										alt=""
										className="h-6"
									/>
								</div>
								<div
									className={`flex flex-col min-w-20 w-fit break-words px-4 py-2 text-lg rounded-xl text-white max-w-80 items-center relative ${
										message.fromSelf ? "bg-indigo-500 ml-auto" : "bg-primary"
									} `}>
									<p className="mr-auto ">{message.message}</p>
									<span className="text-[8px] text-gray-400 leading-loose absolute bottom-0 right-1">
										{msgTime(message.time)}
									</span>
								</div>
							</div>
						))}
					</div>
				))}
			</ChatMessages>

			<ChatInput handleSendMsg={handleSendMsg} />
		</div>
	);
};

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

export default ChatContainer;
