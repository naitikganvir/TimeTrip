import {
  CreditCard,
  MapPinMinus,
  MapPinPlus,
  PhoneCall,
  SendHorizontal,
} from "lucide-react";
import Button from "./Button";

function NewRide({
  rideData,
  otp,
  setOtp,
  showBtn,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  loading,
  acceptRide,
  endRide,
  verifyOTP,
  error,
}) {
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  return (
    <>
      <div
        className={`${
          showPanel ? "bottom-0" : "-bottom-[60%]"
        } transition-all duration-500 absolute bg-white w-full rounded-t-xl p-4 pt-0`}
      >
        {/* <div
          onClick={() => {
            setShowPanel(false);
            showPreviousPanel(true);
          }}
          className="flex justify-center  py-2 pb-4 cursor-pointer"
        >
          <ChevronDown strokeWidth={2.5} className="text-zinc-300" />
        </div> */}
        <div>
          <div className="flex justify-between items-center pb-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="my-2 select-none rounded-full w-10 h-10 bg-green-500 mx-auto flex items-center justify-center">
                <h1 className="text-lg text-white">
                  {rideData?.user?.fullname?.firstname[0]}
                  {rideData?.user?.fullname?.lastname[0]}
                </h1>
              </div>

              <div>
                <h1 className="text-lg font-semibold leading-6">
                  {rideData?.user?.fullname?.firstname}{" "}
                  {rideData?.user?.fullname?.lastname}
                </h1>
                <p className="text-xs text-gray-500 ">
                  {rideData?.user?.phone || rideData?.user?.email}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h1 className="font-semibold text-lg">₹ {rideData?.fare}</h1>
              <p className="text-xs text-gray-500 ">
                {(Number(rideData?.distance?.toFixed(2)) / 1000)?.toFixed(1)} Km
              </p>
            </div>
          </div>

          {/* Message and call */}
          {showBtn != "accept" && (
            <div className="flex gap-2 mb-2">
              <Button
                type={"link"}
                path={`/captain/chat/${rideData?._id}`}
                title={"Send a message..."}
                icon={<SendHorizontal strokeWidth={1.5} size={18} />}
                classes={"bg-zinc-100 font-medium text-sm text-zinc-950"}
              />
              <div className="flex items-center justify-center w-14 rounded-md bg-zinc-100">
                <a href={"tel:" + rideData?.user?.phone}>
                  <PhoneCall size={18} strokeWidth={2} color="black" />
                </a>
              </div>
            </div>
          )}

          <div>
            {/* Pickup Location */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <MapPinMinus size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-5">
                  {rideData.pickup.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {rideData.pickup.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index < rideData.pickup.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Destination Location */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <MapPinPlus size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-5">
                  {rideData.destination.split(", ")[0]}
                </h1>
                <div className="flex">
                  <p className="text-xs text-gray-800 inline">
                    {rideData.destination.split(", ").map((location, index) => {
                      if (index > 0) {
                        return (
                          <span key={index}>
                            {location}
                            {index <
                              rideData.destination.split(", ").length - 1 &&
                              ", "}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center gap-3 border-t-2 py-2 px-2">
              <CreditCard size={18} />
              <div>
                <h1 className="text-lg font-semibold leading-6">
                  ₹ {rideData.fare}
                </h1>
                <p className="text-xs text-gray-800 ">Cash</p>
              </div>
            </div>
          </div>

          {showBtn == "accept" ? (
            <div className="flex gap-2">
              <Button
                title={"Ignore"}
                loading={loading}
                fun={ignoreRide}
                classes={"bg-white text-zinc-900 border-2 border-black"}
              />
              <Button title={"Accept"} fun={acceptRide} loading={loading} />
            </div>
          ) : showBtn == "otp" ? (
            <>
              <input
                type="number"
                minLength={6}
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={"Enter OTP"}
                className="w-full bg-zinc-100 px-4 py-3 rounded-lg outline-none text-sm mb-2"
              />
              {error && (
                <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
              )}
              <Button title={"Verify OTP"} loading={loading} fun={verifyOTP} />{" "}
            </>
          ) : (
            <Button
              title={"End Ride"}
              fun={endRide}
              loading={loading}
              classes={"bg-green-600 "}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NewRide;
