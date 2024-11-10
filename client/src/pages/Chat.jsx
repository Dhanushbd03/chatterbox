import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
	const navigate = useNavigate();
	const socket = useRef();
	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(undefined);
	const [currentUser, setCurrentUser] = useState(undefined);
	useEffect(() => {
		const fetchData = async () => {
			if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
				navigate("/login");
			} else {
				setCurrentUser(
					await JSON.parse(
						localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
					)
				);
			}
		};
		fetchData();
	}, [navigate]);

	useEffect(() => {
		if (currentUser) {
			socket.current = io(host);
			socket.current.emit("add-user", currentUser._id);
		}
	}, [currentUser]);

	useEffect(() => {
		async function fetchData() {
			if (currentUser) {
				if (currentUser.isAvatarImageSet) {
					const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
					setContacts(data.data);
				} else {
					navigate("/setAvatar");
				}
			}
		}
		fetchData();
	}, [currentUser, navigate]);

	const handleChatChange = (chat) => {
		setCurrentChat(chat);
	};
	return (
		<>
			<div className="bg-black h-screen w-screen flex flex-col justify-center">
				<div className="h-screen w-screen grid grid-cols-4 md:grid-cols-8 bg-secondary">
					<Contacts
						contacts={contacts}
						changeChat={handleChatChange}
					/>
					{currentChat === undefined ? (
						<Welcome />
					) : (
						<ChatContainer
							currentChat={currentChat}
							socket={socket}
						/>
					)}
				</div>
			</div>
		</>
	);
}
