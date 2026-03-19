import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import Loading from "./Loading";

function ChatScreen() {
  const { rideId, userType } = useParams();
  const navigation = useNavigate();
  const scrollableDivRef = useRef(null);

  const { socket } = useContext(SocketDataContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [socketID, setSocketID] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("userData"))?.data?._id || null;

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/chat-details/${rideId}`
      );

      //  Protecting unauthorised users to read the chats
      if (currentUser !== response.data.user._id && currentUser !== response.data.captain._id) {
        Console.log("You are not authorized to view this chat.");
        navigation(-1);
        return;
      }
      setMessages(response.data.messages);

      socket.emit("join-room", rideId);
      if (userType == "user") {
        setUserData(response.data.captain);
      }
      if (userType == "captain") {
        setUserData(response.data.user);
      }
      const socketIds = {
        user: response.data.user.socketId,
        captain: response.data.captain.socketId,
      };
      setSocketID(socketIds);
    } catch (error) {
      Console.log("No such ride exists.");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    socket.emit("message", { rideId: rideId, msg: message, userType: userType, time });
    setMessages((prev) => [...prev, { msg: message, by: userType, time }]);

    setMessage("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userData) {
      scrollToBottom();
    }
  }, [userData]);

  useEffect(() => {
    setTimeout(() => {

      getUserDetails();
    }, 3000);

    socket.on("receiveMessage", ({ msg, by, time }) => {
      setMessages((prev) => [...prev, { msg, by, time }]);
    });


    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  if (userData) {
    return (
      <div className="flex flex-col h-dvh">
        {/* header */}
        <div className="flex h-fit items-center p-3 bg-white border-b-2 border-b-blue-600 gap-2">
          <ArrowLeft
            strokeWidth={3}
            className="cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <div className="select-none rounded-full w-10 h-10 bg-blue-600 flex items-center justify-center">
            <h1 className="text-lg font-semibold text-white">
              {userData?.fullname?.firstname[0]}
              {userData?.fullname?.lastname[0]}
            </h1>
          </div>

          <div>
            <h1 className="text-lg font-semibold text-black leading-6">
              {userData?.fullname?.firstname} {userData?.fullname?.lastname}
            </h1>
          </div>
        </div>
        <div className="overflow-scroll h-full bg-blue-100" ref={scrollableDivRef}>
          <div className="flex flex-col justify-end  w-full p-3">
            {messages.length > 0 &&
              messages.map((message, i) => {
                return (
                  <span
                    key={i}
                    className={`${message.by == userType
                      ? "ml-auto rounded-br-none bg-blue-600 text-white"
                      : "mr-auto rounded-bl-none bg-white"
                      } rounded-xl mb-1 px-3 pt-2 pb-[3px] text-sm max-w-64 leading-4`}
                  >
                    {message.msg}
                    <div className="text-[10px] font-normal text-right opacity-60 mt-[1px]">{message.time}</div>
                  </span>
                );
              })}
          </div>
        </div>

        {/* Message */}
        <form
          className="flex items-center p-3 h-fit gap-2"
          onSubmit={sendMessage}
        >
          <input
            placeholder="Enter message..."
            className="w-full border-2 border-black outline-none rounded-md p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
            spellCheck="false"
          />
          <button className="cursor-pointer px-1 bg-blue-600 hover:bg-blue-700 h-full aspect-square rounded-md flex items-center justify-center text-white">
            <Send />
          </button>
        </form>
      </div>
    )
  } else {
    return <Loading />;
  }


}

export default ChatScreen;
