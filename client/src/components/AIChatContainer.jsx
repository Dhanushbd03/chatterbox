import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import styled from "styled-components";
import { aiChatRoute } from "../utils/APIRoutes";
import { FaRobot } from "react-icons/fa";

const AIChatContainer = ({ currentUser }) => {
	const [messages, setMessages] = useState([]);
	const scrollRef = useRef();
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		// Load AI chat history from localStorage
		const loadedMessages = localStorage.getItem(`ai-chat-${currentUser._id}`);
		if (loadedMessages) {
			setMessages(JSON.parse(loadedMessages));
		}
	}, [currentUser._id]);

	useEffect(() => {
		// Save AI chat history to localStorage
		if (messages.length > 0) {
			localStorage.setItem(`ai-chat-${currentUser._id}`, JSON.stringify(messages));
		}
	}, [messages, currentUser._id]);

	const handleSendMsg = async (msg) => {
		const userMessage = {
			fromSelf: true,
			message: msg,
			time: new Date().toISOString(),
		};
		
		setMessages((prev) => [...prev, userMessage]);
		setIsTyping(true);

		try {
			const response = await axios.post(aiChatRoute, {
				userId: currentUser._id,
				message: msg,
			});

			const aiMessage = {
				fromSelf: false,
				message: response.data.response,
				time: new Date().toISOString(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error("Error sending message to AI:", error);
			const errorMessage = {
				fromSelf: false,
				message: "Sorry, I'm having trouble connecting right now. Please try again later.",
				time: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsTyping(false);
		}
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

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

	// AI Avatar SVG (robot icon)
	const aiAvatarBase64 = btoa(`
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
			<circle cx="50" cy="50" r="45" fill="#6366f1"/>
			<circle cx="35" cy="40" r="5" fill="white"/>
			<circle cx="65" cy="40" r="5" fill="white"/>
			<rect x="30" y="60" width="40" height="5" rx="2" fill="white"/>
			<rect x="40" y="20" width="20" height="10" rx="2" fill="#6366f1"/>
			<circle cx="50" cy="20" r="8" fill="#4f46e5"/>
		</svg>
	`);

	return (
		<div className="flex flex-col h-full col-span-6 text-primary">
			<div className="chat-header bg-black flex justify-between p-2 items-center">
				<div className="user-details flex items-center gap-5 uppercase font-bold p-5">
					<div className="avatar">
						<img
							src={`data:image/svg+xml;base64,${aiAvatarBase64}`}
							alt="AI Assistant"
							className="h-12"
						/>
					</div>
					<div className="username">
						<h3 className="flex items-center gap-2">
							<FaRobot className="text-indigo-500" />
							AI Assistant
						</h3>
					</div>
				</div>
			</div>

			<ChatMessages className="bg-black flex-grow px-10 space-y-2 flex flex-col max-h-[80vh] overflow-y-scroll py-5">
				{groupedMessages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-gray-400">
						<FaRobot className="text-6xl mb-4 text-indigo-500" />
						<p className="text-xl">Hello! I'm your AI Assistant.</p>
						<p className="text-sm mt-2">Ask me anything!</p>
					</div>
				)}
				
				{groupedMessages.map((group, groupIndex) => (
					<div key={groupIndex} className="flex flex-col gap-3">
						<div className="text-center my-2 bg-primary w-fit mx-auto rounded-full px-3 text-white">
							<span>{new Date(group.date).toLocaleDateString()}</span>
						</div>
						{group.messages.map((message, messageIndex) => (
							<div
								ref={scrollRef}
								key={uuidv4()}
								className={`flex items-center gap-2 ${message.fromSelf ? "flex-row-reverse" : "flex-row"}`}>
								<div>
									<img
										src={`data:image/svg+xml;base64,${message.fromSelf ? currentUser.avatarImage : aiAvatarBase64}`}
										alt=""
										className="h-6"
									/>
								</div>
								<div
									className={`flex flex-col min-w-20 w-fit break-words px-4 py-2 text-lg rounded-xl text-white max-w-80 items-center relative ${
										message.fromSelf ? "bg-indigo-500 ml-auto" : "bg-primary"
									} `}>
									<p className="mr-auto">{message.message}</p>
									<span className="text-[8px] text-gray-400 leading-loose absolute bottom-0 right-1">
										{msgTime(message.time)}
									</span>
								</div>
							</div>
						))}
					</div>
				))}

				{isTyping && (
					<div className="flex items-center gap-2">
						<div>
							<img
								src={`data:image/svg+xml;base64,${aiAvatarBase64}`}
								alt=""
								className="h-6"
							/>
						</div>
						<div className="flex gap-1 bg-primary px-4 py-2 rounded-xl">
							<div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
							<div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
							<div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
						</div>
					</div>
				)}
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

export default AIChatContainer;
