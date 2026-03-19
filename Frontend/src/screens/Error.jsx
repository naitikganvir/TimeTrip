import { Button } from "../components";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-dvh flex items-center text-center p-4">
      <div className="">
        <h1 className="text-6xl font-bold">404</h1>

        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600 my-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button
          title="Go Back Home"
          classes="bg-orange-500"
          fun={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default Error;
