import React from "react";

const Input = (type) => {
	return (
		<input
			type="text"
			placeholder="Username"
			name="username"
			onChange={(e) => handleChange(e)}
			className="bg-transparent text-black p-3 border border-primary rounded-lg focus:border-secondary outline-none w-full"
			minLength="3"
		/>
	);
};

export default Input;