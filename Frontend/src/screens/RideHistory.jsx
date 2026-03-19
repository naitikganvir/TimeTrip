import  { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronUp,
  Clock,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function RideHistory() {
  const navigation = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [user, setUser] = useState(userData.data);

  function classifyAndSortRides(rides) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Helper function to check if a date is today
    const isToday = (date) =>
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    // Helper function to check if a date is yesterday
    const isYesterday = (date) =>
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    // Helper function to sort rides by date (recent to oldest)
    const sortByDate = (rides) =>
      rides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Arrays to hold classified rides
    const todayRides = [];
    const yesterdayRides = [];
    const earlierRides = [];

    // Classify rides
    rides.forEach((ride) => {
      const createdDate = new Date(ride.createdAt);
      if (isToday(createdDate)) {
        todayRides.push(ride);
      } else if (isYesterday(createdDate)) {
        yesterdayRides.push(ride);
      } else {
        earlierRides.push(ride);
      }
    });

    // Return sorted arrays
    return {
      today: sortByDate(todayRides),
      yesterday: sortByDate(yesterdayRides),
      earlier: sortByDate(earlierRides),
    };
  }

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <ArrowLeft
          strokeWidth={3}
          className="mt-[4px] cursor-pointer"
          onClick={() => navigation(-1)}
        />
        {/* <Heading title={"Edit Profile"} /> */}
        <h1 className="text-2xl font-semibold mb-4">History</h1>
      </div>

      <div className="h-[90vh] overflow-scroll ">
        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-gray-800 font-semibold mb-2 select-none">
            <span>Today</span>
            <ChevronUp className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-gray-600" />
          </summary>
          {classifyAndSortRides(user.rides).today.length > 0 ? (
            classifyAndSortRides(user.rides).today.map((ride) => {
              return <Ride ride={ride} key={ride._id} />;
            })
          ) : (
            <h1 className="text-sm text-center text-zinc-600">
              No rides found
            </h1>
          )}
        </details>

        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-gray-800 font-semibold mb-2 select-none">
            <span>Yesterday</span>
            <ChevronUp className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-gray-600" />
          </summary>
          {classifyAndSortRides(user.rides).yesterday.length > 0 ? (
            classifyAndSortRides(user.rides).yesterday.map((ride) => {
              return <Ride ride={ride} key={ride._id} />;
            })
          ) : (
            <h1 className="text-sm text-center text-zinc-600">
              No rides found
            </h1>
          )}
        </details>

        <details open className="group">
          <summary className="flex items-center justify-between cursor-pointer text-gray-800 font-semibold mb-2 select-none">
            <span>Earlier</span>
            <ChevronUp className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-gray-600" />
          </summary>
          {classifyAndSortRides(user.rides).earlier.length > 0 ? (
            classifyAndSortRides(user.rides).earlier.map((ride) => {
              return <Ride ride={ride} key={ride._id} />;
            })
          ) : (
            <h1 className="text-sm text-center text-zinc-600">
              No rides found
            </h1>
          )}
        </details>
      </div>
    </div>
  );
}

export const Ride = ({ ride }) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  }

  function formatTime(inputDate) {
    const date = new Date(inputDate);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format minutes to always show two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return the formatted time
    return `${hours}:${formattedMinutes} ${period}`;
  }

  return (
    <div className="w-full px-3 py-2 border-2 mb-2 rounded-lg  cursor-pointer relative">
      <div className="flex flex-wrap gap-2 justify-around">
        <h1 className="text-sm flex gap-1 items-center font-semibold">
          <Calendar size={13} className="-mt-[1px]" />{" "}
          {formatDate(ride.createdAt)}
        </h1>

        <h1 className="text-sm flex gap-1 items-center font-semibold">
          <Clock size={13} className="-mt-[1px]" /> {formatTime(ride.createdAt)}
        </h1>
        <h1 className="text-sm flex gap-1 items-center font-semibold ">
          <CreditCard size={13} className="-mt-[1px] text-black" />₹ {ride.fare}
        </h1>
        {/* </div>
        <div className="flex flex-wrap gap-2 justify-around">
          <h1 className="text-xs flex gap-1 items-center font-semibold">
            <Route size={13} className="-mt-[1px]" />{" "}
            {Math.round(ride.distance / 1000)} KM
          </h1>
          <h1 className="text-xs flex gap-1 items-center font-semibold">
            <Timer size={13} className="-mt-[1px]" />{" "}
            {Math.round(ride.duration / 60)} minutes
          </h1> */}
      </div>

      <div className="bg-zinc-200 w-full h-[1px] my-2"></div>

      <div className="w-full  items-center truncate">
        <div className="flex items-center relative w-full h-fit">
          <div className="h-4/5 w-[3px] flex flex-col items-center justify-between border-dashed border-2  border-black rounded-full absolute mx-2">
            <div className="w-3 h-3 rounded-full border-[3px] -mt-1 bg-green-500 border-black"></div>
            <div className="w-3 h-3 rounded-sm border-[3px] -mb-1 bg-red-400 border-black"></div>
          </div>
          <div className="ml-7 truncate w-full">
            <h1 className=" text-xs truncate text-zinc-600 " title={ride.pickup}>{ride.pickup}</h1>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-200 w-full h-[2px]"></div>
              <h1 className="text-xs text-zinc-500 ">TO</h1>
              <div className="bg-zinc-200 w-full h-[2px]"></div>
            </div>
            <h1 className=" text-xs truncate text-zinc-600 " title={ride.destination}>
              {ride.destination}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RideHistory;
