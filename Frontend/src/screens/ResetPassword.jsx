import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Input } from '../components';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import Console from '../utils/console';
import axios from 'axios';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../components';
import password_image from '/password.svg'

const allowedParams = ["user", "captain"];

function ResetPassword() {
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { userType } = useParams();
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const { alert, showAlert, hideAlert } = useAlert();

    if (!allowedParams.includes(userType)) {
        return <Navigate to={'/not-found'} replace />
    }

    const resetPassword = async (data) => {
        if(data.password.length < 8 || data.confirmPassword.length < 8 ){
            showAlert("Incorrect Password Length", "Password must be at least 8 characters long", 'failure')
            return;
        }
        if (data.password !== data.confirmPassword) {
            showAlert("Passwords Mismatch", "The password and confirm password fields must be identical. Please re-enter them", 'failure')
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/${userType}/reset-password`,
                {
                    token: token,
                    password: data.password
                }
            );
            showAlert('Password reset successfully!', response.data.message, 'success');
            Console.log(response);
            setTimeout(() => {
                navigate('/')
            }, 5000)
        } catch (error) {
            showAlert('Some error occured!', error.response.data.message, 'failure');
            setTimeout(() => {
                navigate('/' + userType + '/forgot-password')
            }, 5000);
            Console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-dvh flex flex-col p-4 pt-6">
            <Alert
                heading={alert.heading}
                text={alert.text}
                isVisible={alert.isVisible}
                onClose={hideAlert}
                type={alert.type}
            />
            <h1 className="text-2xl font-bold">Create new password</h1>
            <img className='w-60 mx-auto' src={password_image} alt="Password Image" />
            <form onSubmit={handleSubmit(resetPassword)}>
                <Input
                    label={"New Password"}
                    type={"password"}
                    name={"password"}
                    register={register}
                    error={errors.password}
                />
                <Input
                    label={"Confirm Password"}
                    type={"password"}
                    name={"confirmPassword"}
                    register={register}
                    error={errors.confirmPassword}
                />
                <Button title={"Reset Password"} loading={loading} type="submit" />
            </form>
        </div>
    )
}

export default ResetPassword