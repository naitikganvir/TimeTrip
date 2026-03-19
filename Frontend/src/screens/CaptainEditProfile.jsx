import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Input } from "../components";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { ArrowLeft } from "lucide-react";
import Console from "../utils/console";

function CaptainEditProfile() {
  const token = localStorage.getItem("token");
  const [responseError, setResponseError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { captain } = useCaptain();

  const navigation = useNavigate();

  const updateUserProfile = async (data) => {
    const captainData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      phone: data.phone,
      vehicle: {
        color: data.color,
        number: data.number,
        capacity: data.capacity,
        type: data.type.toLowerCase(),
      },
    };
    Console.log(captainData);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/captain/update`,
        { captainData },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      navigation("/captain/home");
    } catch (error) {
      setResponseError(error.response.data[0].msg);
      Console.log(error.response);
      Console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setResponseError("");
    }, 5000);
  }, [responseError]);
  return (
    <div className="w-full h-dvh flex flex-col justify-between p-4 pt-6">
      <div className="overflow-auto">
        <div className="flex gap-3">
          <ArrowLeft
            strokeWidth={3}
            className="mt-[5px] cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <Heading title={"Edit Profile"} />
        </div>
        <Input
          label={"Email"}
          type={"email"}
          name={"email"}
          register={register}
          error={errors.email}
          defaultValue={captain.email}
          disabled={true}
        />
        <form onSubmit={handleSubmit(updateUserProfile)}>
          <Input
            label={"Phone Number"}
            type={"number"}
            name={"phone"}
            register={register}
            error={errors.phone}
            defaultValue={captain.phone}
          />
          <div className="flex gap-4 -mb-2">
            <Input
              label={"First name"}
              name={"firstname"}
              register={register}
              error={errors.firstname}
              defaultValue={captain.fullname.firstname}
            />
            <Input
              label={"Last name"}
              name={"lastname"}
              register={register}
              error={errors.lastname}
              defaultValue={captain.fullname.lastname}
            />
          </div>
          <div className="flex gap-4 -my-2">
            <Input
              label={"Vehicle colour"}
              name={"color"}
              register={register}
              error={errors.color}
              defaultValue={captain.vehicle.color}
            />
            <Input
              label={"Vehicle capacity"}
              type={"number"}
              name={"capacity"}
              register={register}
              error={errors.capacity}
              defaultValue={captain.vehicle.capacity}
            />
          </div>
          <Input
            label={"Vehicle number"}
            name={"number"}
            register={register}
            error={errors.number}
            defaultValue={captain.vehicle.number}
          />
          <Input
            label={"Vehicle type"}
            type={"select"}
            options={["Car", "Bike", "Auto"]}
            name={"type"}
            register={register}
            error={errors.type}
            defaultValue={captain.vehicle.type}
          />
          {responseError && (
            <p className="text-sm text-center mb-4 text-red-500">
              {responseError}
            </p>
          )}
          <Button
            title={"Update Profile"}
            loading={loading}
            type="submit"
            classes={"mt-4"}
          />
        </form>
      </div>
    </div>
  );
}

export default CaptainEditProfile;
