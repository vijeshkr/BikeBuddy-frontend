import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" toastStyle={{ backgroundColor: "white" , color: "black" , fontSize: "14px"}} />
    </>
  )
}

export default App
