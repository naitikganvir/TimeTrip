import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { ArrowLeft } from "lucide-react";
import Heading from "./Heading";
import Button from "./Button";
import mailImg from "/mail.png";
import useCooldownTimer from "../hooks/useCooldownTimer";
import { Alert } from "../components";
import { useAlert } from "../hooks/useAlert";

function VerifyEmail({ user, role }) {
    const navigation = useNavigate();
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const { alert, showAlert, hideAlert } = useAlert();
    const { timeLeft, isActive, startCooldown } = useCooldownTimer(60000, 'forgot-password-cooldown');

    const sendVerificationEmail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/mail/verify-${role}-email`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            if (response.status === 200) {
                showAlert('Verification email sent successfully!', 'Please check your inbox and click on the received link to verify your account', 'success');
                startCooldown();
            }
        } catch (error) {
            showAlert('Some error occured', error.response.data.message, 'failure');
            Console.error("Error sending verification email:", error);
        } finally {
            setLoading(false);
        }
    };

    const getButtonTitle = () => {
        if (isActive) {
            return `Wait ${timeLeft}s`;
        }
        return "Send Verification Email";
    };
    return (
        <div className="w-full h-dvh flex flex-col text-center p-4 pt-6 gap-24">
            <Alert
                heading={alert.heading}
                text={alert.text}
                isVisible={alert.isVisible}
                onClose={hideAlert}
                type={alert.type}
            />
            <div className="flex gap-3">
                <ArrowLeft
                    strokeWidth={3}
                    className="mt-[5px] cursor-pointer"
                    onClick={() => navigation(-1)}
                />
                <Heading title={"Go Back"} />
            </div>
            <div className="px-2">
                <p className="">Hi{` ${user?.fullname?.firstname}`}</p>
                <h1 className="text-2xl font-bold">Verify Your Email</h1>

                <img src={mailImg} alt="Verify Email" className="h-24 mx-auto mb-4" />
                <span className="inline-block font-semibold bg-green-200 rounded-lg px-4 py-2 my-3">
                    {user.email}
                </span>
                <p className="text-sm mb-6">
                    Click on the Send Verification Email button to send email verification
                    link to activate your account.
                </p>
                <Button
                    title={getButtonTitle()}
                    classes={"bg-orange-500"}
                    loading={loading}
                    loadingMessage={"Sending Email..."}
                    fun={sendVerificationEmail}
                    disabled={loading || isActive}
                />
            </div>
        </div>
    );
};

export default VerifyEmail