import { useState } from "react";

export const useAlert = () => {
    const [alert, setAlert] = useState({
        isVisible: false,
        heading: '',
        text: '',
        type: ''
    });

    const showAlert = (heading, text, type) => {
        setAlert({
            isVisible: true,
            heading,
            text,
            type
        });
    };

    const hideAlert = () => {
        setAlert(prev => ({ ...prev, isVisible: false }));
    };

    return { alert, showAlert, hideAlert };
};