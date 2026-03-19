import { useEffect, useState } from "react";

import { ChevronRight, CircleUserRound, History, KeyRound, Menu, X } from "lucide-react";
import Button from "./Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";

function Sidebar() {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);

  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/${newUser.type}/logout`,
        {
          headers: {
            token: token,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("messages");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
      navigate("/");
    } catch (error) {
      Console.log("Error getting logged out", error);
    }
  };
  return (
    <>
      <div
        className="m-3 mt-4 absolute right-0 top-0 z-20 cursor-pointer bg-white p-1 rounded"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        {showSidebar ? <X /> : <Menu />}
      </div>

      {/* Sidebar Component */}
      <div
        className={`${showSidebar ? " left-0 " : " -left-[100%] "
          } z-10 duration-300 absolute w-full h-dvh bottom-0 bg-white p-4 pt-5 flex flex-col justify-between`}
      >
        <div className="select-none">
          <h1 className="relative text-2xl font-semibold ">Profile</h1>

          <div className="leading-3 mt-8 mb-4">
            <div className="my-2 rounded-full w-24 h-24 bg-blue-400 mx-auto flex items-center justify-center">
              <h1 className="text-5xl text-white">
                {newUser?.data?.fullname?.firstname[0]}
                {newUser?.data?.fullname?.lastname[0]}
              </h1>
            </div>
            <h1 className=" text-center font-semibold text-2xl">
              {newUser?.data?.fullname?.firstname}{" "}
              {newUser?.data?.fullname?.lastname}
            </h1>
            <h1 className="mt-1 text-center text-zinc-400 ">
              {newUser?.data?.email}
            </h1>
          </div>

          <Link
            to={`/${newUser?.type}/edit-profile`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <CircleUserRound /> <h1>Edit Profile</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/rides`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <History /> <h1>Ride History</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>

          <Link
            to={`/${newUser?.type}/reset-password?token=${token}`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-zinc-100 rounded-xl px-3"
          >
            <div className="flex gap-3">
              <KeyRound /> <h1>Change Password</h1>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Link>
        </div>

        <Button title={"Logout"} classes={"bg-red-600"} fun={logout} />
      </div>
    </>
  );
}

export default Sidebar;
