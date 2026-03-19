import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/index";
import background from "/get_started_illustration.jpg";
import { useNavigate } from "react-router-dom";
import logo from '/timetrip.webp'

function GetStarted() {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      if (JSON.parse(userData).type == "user") {
        navigate("/home");
      } else if (JSON.parse(userData).type == "captain") {
        navigate("/captain/home");
      }
    }
  }, []);
  return (
    <div
      className="flex flex-col justify-between w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <img
        className="h-10 object-contain m-4 self-start"
        src={logo}
        alt="TimeTrip"
      />
      
      <div
        className="flex flex-col bg-white p-4 pb-8 gap-8 rounded-t-lg
      "
      >
        <h1 className="text-2xl font-semibold">Get started with TimeTrip</h1>
        <Button
          title={"Continue"}
          path={"/login"}
          type={"link"}
          icon={<ArrowRight />}
        />
      </div>
    </div>
  );
}

export default GetStarted;
