import { ChevronDown } from "lucide-react";

const vehicles = [
  {
    id: 1,
    name: "Car",
    description: "Affordable, compact rides",
    type: "car",
    image: "car.png",
    price: 193.8,
  },
  {
    id: 2,
    name: "Bike",
    description: "Affordable, motorcycle rides",
    type: "bike",
    image: "bike.webp",
    price: 254.7,
  },
  {
    id: 3,
    name: "Auto",
    description: "Affordable, auto rides",
    type: "auto",
    image: "auto.webp",
    price: 200.0,
  },
];

function SelectVehicle({
  selectedVehicle,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  showNextPanel,
  fare,
}) {
  return (
    <>
      <div
        className={`${showPanel ? "bottom-0" : "-bottom-[60%]"} transition-all duration-500 absolute  bg-white w-full rounded-t-xl p-4 pt-0`}
      >
        <div
          onClick={() => {
            setShowPanel(false);
            showPreviousPanel(true);
          }}
          className="flex justify-center  py-2 pb-4 cursor-pointer"
        >
          <ChevronDown strokeWidth={2.5} className="text-zinc-300" />
        </div>
        {vehicles.map((vehicle, index) => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            fare={fare}
            selectedVehicle={selectedVehicle}
            setShowPanel={setShowPanel}
            showNextPanel={showNextPanel}
          />
        ))}
      </div>
    </>
  );
}

const Vehicle = ({
  vehicle,
  selectedVehicle,
  fare,
  setShowPanel,
  showNextPanel,
}) => {
  return (
    <div
      onClick={() => {
        selectedVehicle(vehicle.type);
        setShowPanel(false);
        showNextPanel(true);
      }}
      className="cursor-pointer my-1 flex items-center w-full  rounded-xl border-[3px] transition-all duration-150 border-zinc-100 bg-zinc-50 hover:border-black overflow-hidden"
    >
      <div className="py-4">
        <img
          src={`/${vehicle.image}`}
          className="w-28 scale-75 mix-blend-multiply"
        />
      </div>
      <div className="h-full w-full ">
        <h1 className="text-lg font-semibold leading-6">{vehicle.name}</h1>
        {/* <p className="text-xs leading-3 font-semibold">2 mins away • 15:24</p> */}
        <p className="text-xs text-gray-800 ">{vehicle.description}</p>
      </div>
      <div className="h-12 w-24">
        <h3 className="font-semibold">₹ {fare[vehicle.type]}</h3>
      </div>
    </div>
  );
};
export default SelectVehicle;
