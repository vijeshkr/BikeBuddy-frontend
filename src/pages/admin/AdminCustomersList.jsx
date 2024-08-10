import React, { useEffect, useState } from 'react';
import CreateNewUser from '../../components/admin/CreateCustomer';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';

const AdminCustomersList = () => {
  // State to manage customers data
  const [customers,setCustomers] = useState([]);
  // State to manage loading
  const [loading,setLoading] = useState(false);

  const role = 'customer';

  // Function for fetch customer data
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await makeRequest.get(`/get-users/${role}`);
      if (response.data.success) {
        setCustomers(response.data.data);
        console.log(response.data.data)
      }
    } catch (error) {
      console.error('Error while fetching customer details: ', error);
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  },[])
  return (
    <div className='flex gap-4 flex-wrap'>
      {loading && <LoadingIndicator/>}
      <div className='flex-1 min-w-[340px] shadow-custom p-4 rounded-md'>
        Customer list
      </div>
      <div className='min-w-[340px] xs:min-w-[400px] p-4 rounded-md'>
        <CreateNewUser role={'customer'} />
      </div>
    </div>
  )
}

export default AdminCustomersList;