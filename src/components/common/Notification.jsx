import moment from 'moment';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import makeRequest from '../../common/axios';
import { markAsRead, markAllAsRead, allNotifications } from '../../redux/features/notificationSlice';
import { useNavigate } from 'react-router-dom';

const Notification = ({ close }) => {
  // Access notifications from Redux store
  const notifications = useSelector((state) => state.notifications.notifications);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle on click mark as read
  const handleOnClick = async (notification) => {
    try {
      const response = await makeRequest.patch(`/mark-as-read/${notification._id}`);
      if (response.data.success) {
        dispatch(markAsRead(notification._id));
        close();
        navigate(`${notification.link}`);
      }
    } catch (error) {
      console.error('Mark as read error', error)
    }
  }

  // Handle on click mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await makeRequest.patch(`/mark-all-as-read`);
      if (response.data.success) {
        dispatch(markAllAsRead());
      }
    } catch (error) {
      console.error('Mark as read error', error)
    }
  }

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
  }, []);

  return (
    <div className='fixed right-0 bottom-0 duration-300 w-[300px] h-h-calc-notification rounded-md shadow-notificationBar my-4 z-40 bg-white p-4'>
      <div className='h-full scrollbar-none overflow-y-auto'>

        {
          notifications.length > 0 ? <div>
            <div className='flex justify-between'>
              <h1 className='font-semibold py-3'>Notifications</h1>
              <button onClick={close}>
                <IoMdClose />
              </button>
            </div>
            <div className='flex justify-end'>
              <span
                onClick={handleMarkAllAsRead}
                className='text-xs text-blue-700 cursor-pointer'>Mark all as read</span>
            </div>
            {
              notifications.map(notification => (
                <div
                  onClick={() => handleOnClick(notification)}
                  key={notification._id}
                  className={`cursor-pointer flex items-center border-b p-2 gap-4 rounded-md my-2 ${!notification.read ? 'bg-slate-200' : ''}`}>
                  {!notification.read && <div className='bg-blue-800 w-1.5 h-1.5 rounded-full flex-shrink-0'></div>}
                  <div className='text-sm'>
                    <p className=''>{notification.message}</p>
                    <div className='text-xs text-gray-400'>{moment(notification.createdAt).fromNow()}</div>
                  </div>
                </div>
              ))
            }
          </div>
            : <div>
              <div className='flex justify-between'>
                <h1 className='font-semibold py-3'>Notifications</h1>
                <button onClick={close}>
                  <IoMdClose />
                </button>
              </div>
              <div className='p-5 text-gray-400'>
              No notifications available
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Notification;