import { useDispatch } from "react-redux";
import { addNotification } from "../redux/features/notificationSlice";
import socket from '../common/socket';
import { useEffect } from "react";


const useSocketNotification = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('newNotification', (notification) => {
            dispatch(addNotification(notification));
        });

        return () => {
            socket.off('newNotification');
        };
    }, [dispatch, socket]);
};

export default useSocketNotification;