import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import makeRequest from "./common/axios";
import { useEffect } from "react";
import { logout, userDetails } from "./redux/features/userSlice";
import LoadingIndicator from "./components/LoadingIndicator";
import { setLoading } from "./redux/features/loadingSlice";
import { allNotifications } from "./redux/features/notificationSlice";
import useSocketNotification from "./hooks/useSocketNotification";

function App() {
  // Initialize the socket connection and listen for notifications
  useSocketNotification();

  const dispatch = useDispatch();

  // Function for fetch current user details from server
  const fetchUserDetails = async () => {
    try {
      const response = await makeRequest.get('/user-details');
      return response.data.data;
    } catch (error) {
      console.error('Error while fetching user details', error);
    }
  }

  useEffect(() => {
    // Initialize user state in redux
    const initializeUserSlice = async () => {
      dispatch(setLoading(true));
      try {
        const apiResponse = await fetchUserDetails();
        dispatch(userDetails({ user: apiResponse }));
      } catch (error) {
        console.error('Failed to initialize user slice: ', error);
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    }

    initializeUserSlice();

  }, [dispatch]);

  const loading = useSelector((state) => state.loading);

  // Fetching all notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await makeRequest.get('/get-notifications');
        dispatch(allNotifications(response.data.data));
      } catch (error) {
        console.error('Failed to fetch notifications', error)
      }
    }

    fetchNotifications();
  },[]);

  return (
    <>
      {loading && <LoadingIndicator />}
      <RouterProvider router={router} />
      <ToastContainer position="top-center" toastStyle={{ backgroundColor: "white", color: "black", fontSize: "14px" }} />
    </>
  )
}

export default App;
