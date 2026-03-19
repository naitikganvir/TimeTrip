import { useEffect, useState } from "react";
import Button from "./Button";

export const Alert = ({ heading, text, isVisible, onClose, type }) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const status = {
        success: "bg-green-500",
        failure: "bg-red-600"
    }

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <div className={`absolute text-center left-0 top-0 w-full bg-black min-h-dvh flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300 ${isAnimating ? 'bg-opacity-60' : 'bg-opacity-0'}`}>
            <div className={`w-4/5 p-5 pt-7 bg-white rounded-xl transition-all duration-300 transform ${isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                <h1 className='font-semibold text-base'>{heading}</h1>
                <p className='text-sm font-normal text-zinc-600 mt-4 mb-6 text-pretty'>{text}</p>
                <Button
                    title={"Okay"}
                    fun={onClose}
                    classes={type && status[type]}
                />
            </div>
        </div>
    );
};