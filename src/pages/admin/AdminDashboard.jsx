import React, { useEffect, useState } from 'react'
import MechanicLabourChart from '../../components/charts/MechanicLabourChart';
import StatusCountChart from '../../components/charts/StatusCountChart';
import RevenueChart from '../../components/charts/RevenueChart';
import MechanicSpareChart from '../../components/charts/MechanicSpareChart';
import DataCard from '../../components/admin/DataCard';
import makeRequest from '../../common/axios';

const AdminDashboard = () => {
  // State to manage loading
  const [loading, setLoading] = useState(false);
  // State to manage count
  const [userCount, setUserCount] = useState({
    mechanic: 0,
    customer: 0,
  });

  // State to manage vehicles count
  const [vehiclesCount, setVehiclesCount] = useState(0);


  const mechanic = 'mechanic';
  const customer = 'customer';

  // Get user count by role
  const getUserCountByRole = async (role) => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-user-count/${role}`);
      if (response.data.success) {
        setUserCount((prev) => ({
          ...prev,
          [role]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user count:', error);
    } finally {
      setLoading(false);
    }
  }
  // Get vehicles count by role
  const getVehiclesCount = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/all-customer-vehicles-count`);
      if (response.data.success) {
        setVehiclesCount(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles count:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserCountByRole(mechanic);
    getUserCountByRole(customer);
    getVehiclesCount();
  }, []);
  return (
    <div className='flex flex-col xl:flex-row gap-8'>
      <div className='flex flex-col gap-6 xl:w-3/4 '>
        {/* Display cards */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <DataCard status={'Customers'} count={userCount.customer} />
          <DataCard status={'Mechanics'} count={userCount.mechanic} />
          <DataCard status={'Vehicles'} count={vehiclesCount} />
        </div>
        {/* Display mechanic labour chart */}
        <div className='max-w-4xl h-96 shadow-custom rounded-lg'>
          <MechanicLabourChart />
        </div>
        {/* Display mechanic spare chart */}
        <div className='max-w-4xl h-96 shadow-custom rounded-lg'>
          <MechanicSpareChart />
        </div>
      </div>
      {/* Right sidebar with charts */}
      <div className='xl:w-1/4 flex justify-center xs:justify-normal flex-wrap xl:flex-col gap-4'>
        {/* Display revenue chart */}
        <div className='h-70 min-w-[305px] shadow-custom rounded-lg'>
          <RevenueChart />
        </div>
        {/* Display status chart */}
        <div className='h-70 min-w-[305px] shadow-custom rounded-lg'>
            <StatusCountChart />
          </div>
      </div>

    </div>
  )
}

export default AdminDashboard;