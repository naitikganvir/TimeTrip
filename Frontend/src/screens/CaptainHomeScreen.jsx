import { useContext, useEffect, useState } from "react";
import map from "/map.png";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { Phone, User } from "lucide-react";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar } from "../components";
import Console from "../utils/console";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

const defaultRideData = {
  user: {
    fullname: {
      firstname: "No",
      lastname: "User",
    },
    _id: "",
    email: "example@gmail.com",
    rides: [],
  },
  pickup: "Place, City, State, Country",
  destination: "Place, City, State, Country",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

function CaptainHomeScreen() {
  const token = localStorage.getItem("token");

  const { captain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [riderLocation, setRiderLocation] = useState({
    ltd: null,
    lng: null,
  });
  const [mapLocation, setMapLocation] = useState(
    `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng}&output=embed`
  );
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
  });

  const [rides, setRides] = useState({
    accepted: 0,
    cancelled: 0,
    distanceTravelled: 0,
  });
  const [newRide, setNewRide] = useState(
    JSON.parse(localStorage.getItem("rideDetails")) || defaultRideData
  );

  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [error, setError] = useState("");

  // Panels
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );

  const acceptRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/confirm`,
          { rideId: newRide._id },
          {
            headers: {
              token: token,
            },
          }
        );
        setLoading(false);
        setShowBtn("otp");
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${newRide.pickup}&output=embed`
        );
        Console.log(response);
      }
    } catch (error) {
      setLoading(false);
      showAlert('Some error occured', error.response.data.message, 'failure');
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id != "" && otp.length == 6) {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${newRide._id}&otp=${otp}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${newRide.destination}&output=embed`
        );
        setShowBtn("end-ride");
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError("Invalid OTP");
      Console.log(err);
    }
  };

  const endRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng}&output=embed`
        );
        setShowBtn("accept");
        setLoading(false);
        setShowCaptainDetailsPanel(true);
        setShowNewRidePanel(false);
        setNewRide(defaultRideData);
        localStorage.removeItem("rideDetails");
        localStorage.removeItem("showPanel");
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Console.log(position);
          setRiderLocation({
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapLocation(
            `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&output=embed`
          );
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error("Error fetching position:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
          }
        }
      );
    }
  };

  const clearRideData = () => {
    setShowBtn("accept");
    setLoading(false);
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  }

  useEffect(() => {
    if (captain._id) {
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });

      // const locationInterval = setInterval(updateLocation, 10000);
      updateLocation(); // IMP: Call this function to update location
    }

    socket.on("new-ride", (data) => {
      Console.log("New Ride available:", data);
      setShowBtn("accept");
      setNewRide(data);
      setShowNewRidePanel(true);
    });

    socket.on("ride-cancelled", (data) => {
      Console.log("Ride cancelled", data);
      updateLocation();
      clearRideData();
    });
  }, [captain]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", newRide._id);

    socket.on("receiveMessage", async (msg) => {
      // Console.log("Received message: ", msg);
      setMessages((prev) => [...prev, { msg, by: "other" }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("rideDetails", JSON.stringify(newRide));
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("showPanel", JSON.stringify(showNewRidePanel));
    localStorage.setItem("showBtn", JSON.stringify(showBtn));
  }, [showNewRidePanel, showBtn]);

  const calculateEarnings = () => {
    let Totalearnings = 0;
    let Todaysearning = 0;

    let acceptedRides = 0;
    let cancelledRides = 0;

    let distanceTravelled = 0;

    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    captain.rides.forEach((ride) => {
      if (ride.status == "completed") {
        acceptedRides++;
        distanceTravelled += ride.distance;
      }
      if (ride.status == "cancelled") cancelledRides++;

      Totalearnings += ride.fare;
      const rideDate = new Date(ride.updatedAt);

      const rideDateWithoutTime = new Date(
        rideDate.getFullYear(),
        rideDate.getMonth(),
        rideDate.getDate()
      );

      if (
        rideDateWithoutTime.getTime() === todayWithoutTime.getTime() &&
        ride.status === "completed"
      ) {
        Todaysearning += ride.fare;
      }
    });

    setEarnings({ total: Totalearnings, today: Todaysearning });
    setRides({
      accepted: acceptedRides,
      cancelled: cancelledRides,
      distanceTravelled: Math.round(distanceTravelled / 1000),
    });
  };

  useEffect(() => {
    calculateEarnings();
  }, [captain]);

  useEffect(() => {
    if (mapLocation.ltd && mapLocation.lng) {
      Console.log(mapLocation);
    }
  }, [mapLocation]);

  useEffect(() => {
    if (socket.id) Console.log("socket id:", socket.id);
  }, [socket.id]);

  return (
    <div
      className="relative w-full h-dvh bg-contain"
      style={{ backgroundImage: `url(${map})` }}
    >
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar />
      <iframe
        src={mapLocation}
        className="map w-full h-[80vh]"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {showCaptainDetailsPanel && (
        <div className="absolute bottom-0 flex flex-col justify-start p-4 gap-2 rounded-t-lg bg-white h-fit w-full">
          {/* Driver details */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="my-2 select-none rounded-full w-10 h-10 bg-blue-400 mx-auto flex items-center justify-center">
                <h1 className="text-lg text-white">
                  {captain?.fullname?.firstname[0]}
                  {captain?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <h1 className="text-lg font-semibold leading-6">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </h1>
                <p className="text-xs flex items-center gap-1 text-gray-500 ">
                  <Phone size={12} />
                  {captain?.phone}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 ">Earnings</p>
              <h1 className="font-semibold">₹ {earnings.today}</h1>
            </div>
          </div>

          {/* Ride details */}
          <div className="flex justify-around items-center mt-2 py-4 rounded-lg bg-zinc-800">
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.accepted}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Rides
                <br />
                Accepted
              </p>
            </div>
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.distanceTravelled}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Km
                <br />
                Travelled
              </p>
            </div>
            <div className="flex flex-col items-center text-white">
              <h1 className="mb-1 text-xl">{rides?.cancelled}</h1>
              <p className="text-xs text-gray-400 text-center leading-3">
                Rides
                <br />
                Cancelled
              </p>
            </div>
          </div>

          {/* Car details */}
          <div className="flex justify-between border-2 items-center pl-3 py-2 rounded-lg">
            <div>
              <h1 className="text-lg font-semibold leading-6 tracking-tighter ">
                {captain?.vehicle?.number}
              </h1>
              <p className="text-xs text-gray-500 flex items-center">
                {captain?.vehicle?.color} |
                <User size={12} strokeWidth={2.5} /> {captain?.vehicle?.capacity}
              </p>
            </div>

            <img
              className="rounded-full h-16 scale-x-[-1]"
              src={
                captain?.vehicle?.type == "car"
                  ? "/car.png"
                  : `/${captain.vehicle.type}.webp`
              }
              alt="Driver picture"
            />
          </div>
        </div>
      )}

      <NewRide
        rideData={newRide}
        otp={otp}
        setOtp={setOtp}
        showBtn={showBtn}
        showPanel={showNewRidePanel}
        setShowPanel={setShowNewRidePanel}
        showPreviousPanel={setShowCaptainDetailsPanel}
        loading={loading}
        acceptRide={acceptRide}
        verifyOTP={verifyOTP}
        endRide={endRide}
        error={error}
      />
    </div>
  );
}

export default CaptainHomeScreen;
