import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
	const navigate = useNavigate();
	const [values, setValues] = useState({ username: "", password: "" });
	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};
	useEffect(() => {
		if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
			navigate("/");
		}
	}, [navigate]);

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const validateForm = () => {
		const { username, password } = values;
		if (username === "") {
			toast.error("Email and Password is required.", toastOptions);
			return false;
		} else if (password === "") {
			toast.error("Email and Password is required.", toastOptions);
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			const { username, password } = values;
			const { data } = await axios.post(loginRoute, {
				username,
				password,
			});
			if (data.status === false) {
				toast.error(data.msg, toastOptions);
			}
			if (data.status === true) {
				localStorage.setItem(
					process.env.REACT_APP_LOCALHOST_KEY,
					JSON.stringify(data.user)
				);

				navigate("/");
			}
		}
	};

	return (
		<div className="flex items-center justify-center h-screen w-screen bg-black">
			<form
				onSubmit={(event) => handleSubmit(event)}
				className="flex flex-col gap-4 rounded-2xl p-10 bg-light">
				<div className="flex items-center justify-center gap-2 mb-4">
					<img
						src={Logo}
						alt="logo"
						className=" h-40"
					/>
				</div>
				<input
					type="text"
					placeholder="Username"
					name="username"
					onChange={(e) => handleChange(e)}
					className="bg-transparent text-black p-3 border border-primary rounded-lg focus:border-secondary outline-none w-full"
					minLength="3"
				/>
				<input
					type="password"
					placeholder="Password"
					name="password"
					onChange={(e) => handleChange(e)}
					className="bg-transparent text-black p-3 border border-primary rounded-lg focus:border-secondary outline-none w-full"
				/>
				<button
					type="submit"
					className="bg-secondary text-white py-3 px-6 font-bold rounded-lg hover:bg-color2 uppercase">
					Log In
				</button>
				<span className="text-secondary uppercase text-center">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-800 font-bold">
						Create One.
					</Link>
				</span>
			</form>
			<ToastContainer />
		</div>
	);
}
