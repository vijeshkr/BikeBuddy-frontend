import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const roleCheck = () => {
    if(user.role === 'customer'){
      navigate('/');
    }else if(user.role === 'mechanic'){
      navigate('/mechanic');
    }else if(user.role === 'admin'){
      navigate('/admin');
    }
  }

  useEffect(()=>{
    roleCheck();
  },[user]);

  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default Home