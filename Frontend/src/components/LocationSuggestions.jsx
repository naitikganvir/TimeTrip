import { MapPin } from "lucide-react";
import Console from "../utils/console";

const locationSuggestions = [
  { name: "Central Park", location: "New York, NY, USA" },
  { name: "Eiffel Tower", location: "Paris, France" },
  { name: "Marina Bay Sands", location: "Singapore" },
  { name: "Burj Khalifa", location: "Dubai, UAE" },
  { name: "Sydney Opera House", location: "Sydney, Australia" },
  { name: "Golden Gate Bridge", location: "San Francisco, CA, USA" },
  { name: "Taj Mahal", location: "Agra, India" },
  { name: "Great Wall", location: "Beijing, China" },
  { name: "Niagara Falls", location: "Ontario, Canada" },
  { name: "Colosseum", location: "Rome, Italy" },
];
function LocationSuggestions({
  suggestions = [],
  setSuggestions,
  setPickupLocation,
  setDestinationLocation,
  input,
}) {
  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div
          onClick={() => {
            Console.log(suggestion);
            if (input == "pickup") {
              setPickupLocation(suggestion);
              setSuggestions([]);
            }
            if (input == "destination") {
              setDestinationLocation(suggestion);
              setSuggestions([]);
            }
          }}
          key={index}
          className="cursor-pointer flex items-center gap-2 border-b-2 last:border-b-0 py-3 border-gray-200"
        >
          <div className="bg-gray-100 p-2 rounded-full">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{suggestion}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LocationSuggestions;
