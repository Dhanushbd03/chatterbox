import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";

export default function Contacts({ contacts, changeChat }) {
	const [currentUserName, setCurrentUserName] = useState(undefined);
	const [currentUserImage, setCurrentUserImage] = useState(undefined);
	const [currentSelected, setCurrentSelected] = useState(undefined);
	const [isHovered, setIsHovered] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			const data = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			setCurrentUserName(data.username);
			setCurrentUserImage(data.avatarImage);
		};
		fetchData();
	}, []);

	const changeCurrentChat = (index, contact) => {
		setCurrentSelected(index);
		changeChat(contact);
	};
	return (
		<>
			{currentUserImage && currentUserImage && (
				<div className="bg-light flex flex-col overflow-hidden col-span-2 ">
					<div className="flex h-full w-full">
						<div className="w-1/6 bg-primary flex flex-col text-white py-5 justify-between">
							<div className="hover:bg-white/30 rounded-full ">
								<svg
									className="size-10 mx-auto"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									stroke="currentColor">
									<g
										id="SVGRepo_bgCarrier"
										strokeWidth="0"></g>
									<g
										id="SVGRepo_tracurrentColorerCarrier"
										strokeLinecap="round"
										strokeLinejoin="round"></g>
									<g id="SVGRepo_icurrentColoronCarrier">
										<path
											d="M7 9H17M7 13H17M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"></path>
									</g>
								</svg>
							</div>
							<div
								className={`hover:scale-105 rounded-full relative ${isHovered ? "scale-110" : ""}`}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}>
								<img
									src={`data:image/svg+xml;base64,${currentUserImage}`}
									alt="avatar"
									className="h-14 mx-auto transition-all duration-300"
								/>
								<div
									className={`absolute top-[31%] -right-16 bg-primary px-2 rounded-lg ${isHovered ? "opacity-100" : "opacity-0"} transition-all duration-300`}>
									<h1 className="text-center">{currentUserName}</h1>
								</div>
							</div>
						</div>
						<ScrollableContainer className="flex flex-col items-center overflow-auto gap-1 px-2 row-span-4 w-8/12 mt-2">
							<h1 className="text-xl font-bold self-start py-5">Chats</h1>
							{contacts.map((contact, index) => {
								return (
									<div
										key={contact._id}
										className={`px-4 py-2 cursor-pointer w-full rounded-full h-fit flex gap-4 items-center transition-all duration-500 ease-in-out ${
											index === currentSelected ? "bg-primary text-white" : ""
										}`}
										onClick={() => changeCurrentChat(index, contact)}>
										<div className="">
											<img
												src={`data:image/svg+xml;base64,${contact.avatarImage}`}
												alt=""
												className="h-12"
											/>
										</div>
										<div className=" ">
											<h3>{contact.username}</h3>
										</div>
									</div>
								);
							})}
						</ScrollableContainer>
					</div>
				</div>
			)}
		</>
	);
}

const ScrollableContainer = styled.div`
	/* Webkit scrollbar styles */
	&::-webkit-scrollbar {
		width: 0.2rem;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ffffff39;
		width: 0.1rem;
		border-radius: 1rem;
	}
`;
