import React, { useState, useEffect } from "react";
import wave from "../assets/waving.gif";
export default function Welcome() {
	const [userName, setUserName] = useState("");
	useEffect(() => {
		async function fetchData() {
			setUserName(
				await JSON.parse(
					localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
				).username
			);
		}
    fetchData();
	}, []);
	return (
		<div className="flex justify-center items-center text-white text-xl flex-col col-span-6 bg-black">
			<img
				src={wave}
				alt=""
				className="h-64"
			/>
			<h1>
				Welcome, <span className="text-primary text-2xl">{userName}!</span>
			</h1>
			<h3>Please select a chat to Start messaging.</h3>
		</div>
	);
}
