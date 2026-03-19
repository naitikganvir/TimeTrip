import { useState, useRef, useCallback, useEffect } from 'react';

const useCooldownTimer = (cooldownDuration = 60000, storageKey = 'cooldown-timer') => { // 60 seconds default
    const [timeLeft, setTimeLeft] = useState(0);
    const intervalRef = useRef(null);

    // Initialize timer from localStorage on mount
    useEffect(() => {
        const savedEndTime = localStorage.getItem(storageKey);
        if (savedEndTime) {
            const endTime = parseInt(savedEndTime);
            const currentTime = Date.now();
            const remaining = Math.max(0, Math.ceil((endTime - currentTime) / 1000));
            
            if (remaining > 0) {
                setTimeLeft(remaining);
                startInterval();
            } else {
                // Timer expired, clean up
                localStorage.removeItem(storageKey);
            }
        }
    }, [storageKey]);

    const startInterval = useCallback(() => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    localStorage.removeItem(storageKey);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [storageKey]);

    const startCooldown = useCallback(() => {
        if (intervalRef.current) return; // Prevent multiple timers

        const endTime = Date.now() + cooldownDuration;
        localStorage.setItem(storageKey, endTime.toString());
        
        setTimeLeft(Math.ceil(cooldownDuration / 1000));
        startInterval();
    }, [cooldownDuration, storageKey, startInterval]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const isActive = timeLeft > 0;

    return {
        timeLeft,
        isActive,
        startCooldown
    };
};

export default useCooldownTimer;