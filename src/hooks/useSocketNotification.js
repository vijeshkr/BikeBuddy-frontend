import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../redux/features/notificationSlice";
import socket from '../common/socket';
import { useEffect } from "react";
import notificationSound from '../assets/sounds/notificationSound.mp3';


const useSocketNotification = () => {
    // Access the current user details from the Redux store
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
         // Define the audio element
         const notificSound = new Audio(notificationSound);

        socket.on('newNotification', (notification) => {
            dispatch(addNotification(notification));
            notificSound.play().catch((error) => console.error('Error playing sound:', error));
        });

        // Emit addConnection only if user ID is available
        if (user?._id) {
            socket.emit('addConnection', user._id);
        }

        return () => {
            socket.off('newNotification');
        };
    }, [dispatch, user?._id]);
};

export default useSocketNotification;