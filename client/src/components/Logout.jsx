import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <div 
    onClick={handleClick} 
    className="flex items-center justify-center w-10 h-10 text-white font-bold rounded-full cursor-pointer  transition-all duration-300 shadow-md"
    aria-label="Logout"
  >
    <IoIosLogOut size={35} className="text-white ml-auto" style={{ fontWeight: "bold" }} />
  </div>
  );
}


