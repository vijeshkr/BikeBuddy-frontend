import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';
import BillPopup from '../../components/common/BillPopup';
import ServiceHistoryPopup from '../../components/common/ServiceHistoryPopup';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';

const ServiceHistory = () => {

    const [loading, setLoading] = useState(false);
    // State to store service history
    const [serviceHistories, setServiceHistories] = useState(null);

    // State to manage bill popup
    const [openBillPopup, setOpenBillPopup] = useState(false);
    // State to manage history popup
    const [openHistoryPopup, setOpenHistoryPopup] = useState(false);
    // State to manage current allocationId
    const [currentAllocation, setCurrentAllocation] = useState('');
    // State to manage current history
    const [currentHistory, setCurrentHistory] = useState(null);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [historyPerPage] = useState(4);

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Handle open bill popup
    const handleOpenBillPopup = (allocation) => {
        setCurrentAllocation(allocation);
        setOpenBillPopup(!openBillPopup);
    }

    // Handle close function for bill popup
    const handleCloseBill = () => {
        setCurrentAllocation({});
        setOpenBillPopup(prev => !prev);
    }
    // Handle open history popup
    const handleOpenHistoryPopup = (history) => {
        setCurrentHistory(history);
        setOpenHistoryPopup(!openHistoryPopup);
    }

    // Handle close function for payment popup
    const handleCloseHistory = () => {
        setCurrentHistory({});
        setOpenHistoryPopup(prev => !prev);
    }

    // Function to fetch all service histories
    const fetchServiceHistory = async () => {
        setLoading(true);
        try {
            // API call
            const response = await makeRequest.get(`/get-all-service-history`);
            if (response.data.success) {
                setServiceHistories(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service histories: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Search logic
    const searchData = serviceHistories?.filter(history => history?.allocation?.bookingId?.vehicleId?.registrationNumber.toLowerCase().includes(searchTerm.toLocaleLowerCase()))
        .filter(history => history?.allocation?.bookingId?.status === 'Paid');

    // Pagination logic
    const indexOfLastHistory = currentPage * historyPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
    const currentPageHistories = searchData?.slice(indexOfFirstHistory, indexOfLastHistory);

    const totalPages = Math.ceil(searchData?.length / historyPerPage);

    // Fetch service history when the component mouts or allocation ID changes
    useEffect(() => {
        fetchServiceHistory();
    }, []);
    return (
        <div className="p-2 lg:shadow-custom rounded-lg">
            {loading && <LoadingIndicator />}
            <h3 className="text-xl sm:text-2xl text-center sm:text-left font-semibold mb-4">Service Histories</h3>
            {/* Search box */}
            <div>
                <SearchBox value={searchTerm} onChange={handleSearch} />
            </div>
            {currentPageHistories?.length === 0 ? (
                <p className="text-gray-500 p-4">No history available.</p>
            ) : (
                <div>
                    {/* Table format for larger screens */}
                    <table className="hidden lg:table w-full divide-y divide-gray-200">
                        <thead className='bg-gray-50'>
                            <tr className="text-left">
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mechanic</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {currentPageHistories?.map((history, index) => (
                                history?.allocation?.bookingId?.status === 'Paid' &&
                                <tr key={history._id} className="hover:bg-gray-50">
                                    <td
                                        className="px-4 py-3 cursor-pointer">{index + 1}</td>
                                    <td
                                        onClick={() => handleOpenHistoryPopup(history)}
                                        className="px-4 py-3 cursor-pointer">{history?.allocation?.bookingId?.vehicleId?.registrationNumber}</td>
                                    <td className={`px-4 py-3 ${history?.allocation?.bookingId?.breakdown && 'text-red-600'}`}>{history?.allocation?.bookingId?.breakdown ? 'Breakdown' : history?.allocation?.bookingId?.serviceType?.packageName}</td>
                                    <td className="px-4 py-3">{new Date(history?.allocation?.bookingId?.bookingDate).toLocaleDateString()}</td>
                                    <td
                                        className={`px-4 py-3 `}>
                                        {history?.allocation?.mechanicId?.name}
                                    </td>
                                    <td
                                        className={`px-4 py-3 `}>
                                        <button
                                            onClick={() => handleOpenBillPopup(history?.allocation?._id)}
                                            className='bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded-md text-white'>View bill</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card format for mobile devices */}
                    <div className="lg:hidden">
                        {searchData?.map((history, index) => (
                            history?.allocation?.bookingId?.status === 'Paid' &&
                            <div key={history._id} className="bg-white text-sm sm:text-base shadow-custom rounded-lg p-4 mb-4 border border-gray-200">
                                {/* Customer name */}
                                <div className="mb-2">
                                    <span className='font-medium'>Customer:</span> {history?.allocation?.bookingId?.customerId?.name}
                                </div>
                                {/* Customer vehicle */}
                                <div className="mb-2">
                                    <span className='font-medium'>Vehicle:</span> {history?.allocation?.bookingId?.vehicleId?.registrationNumber}
                                </div>
                                {/* Service type */}
                                <div className={`mb-2 ${history?.allocation?.bookingId?.breakdown && 'text-red-600'}`}>
                                    <span className='font-medium text-black'>Service Type:</span> {history?.allocation?.bookingId?.breakdown ? 'Breakdown' : history?.allocation?.bookingId?.serviceType?.packageName}
                                </div>
                                {/* Place */}
                                {
                                    history?.allocation?.bookingId?.place &&
                                    <div className="mb-2">
                                        <span className="font-medium">Place:</span> {history?.allocation?.bookingId?.place}
                                    </div>
                                }
                                {/* Phone */}
                                {
                                    history?.allocation?.bookingId?.phone &&
                                    <div className="mb-2">
                                        <span className="font-medium">Phone:</span> {history?.allocation?.bookingId?.phone}
                                    </div>
                                }
                                {/* Booking date */}
                                <div className="mb-2">
                                    <span className='font-medium'>Booking Date:</span> {new Date(history?.allocation?.bookingId?.bookingDate).toLocaleDateString()}
                                </div>
                                {/* Delivered date */}
                                <div className="mb-2">
                                    <span className='font-medium'>Delivered Date:</span> {new Date(history?.updatedAt).toLocaleDateString()}
                                </div>
                                {/* Job description */}
                                <div className="mb-2">
                                    <span className="font-medium">Job Description:</span> {history?.allocation?.bookingId?.description}
                                </div>
                                {/* Mechanic */}
                                <div className="mb-2">
                                    <span className='font-medium'>Mechanic:</span> {history?.allocation?.mechanicId?.name}
                                </div>
                                {/* Next service advice */}
                                <div className="mb-2">
                                    <span className="font-medium">Service Advice:</span> {history?.allocation?.serviceAdvice}
                                </div>
                                <div className="mb-2">
                                    <button
                                        onClick={() => handleOpenBillPopup(history?.allocation?._id)}
                                        className='bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded-md text-white'>
                                        View Bill
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* Pagination component */}
            {currentPageHistories?.length > 0 &&
                <div className='p-4 hidden sm:block'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>}

            {openBillPopup && <BillPopup close={handleCloseBill} allocationId={currentAllocation} />}
            {openHistoryPopup && <ServiceHistoryPopup close={handleCloseHistory} history={currentHistory} />}
        </div>
    )
}

export default ServiceHistory;

/**
 * No need to show
 * 
 * GST ---
 * breakdown charge ---
 * pickUpCharge ---
 * serviceCharge ---
 * totalPartsPrice ---
 * extraWorks - price, workId, workName ---
 * partsUsed - partId, partName, quantity, totalPartCost ---
 * extraWorkDescription ---
 * extraWorkEstimationAmount ---
 * customerApproval ---
 * allocation.bookingId.phone ---
 * allocation.bookingId.status ---
 * allocation.bookingId.vehicleId.freeServiceEligibility ---
 * allocation.bookingId.vehicleId.freeServiceCount ---
 * allocation.bookingId.vehicleId.registrationDate ---
 * 
 * 
 * Show
 * 
 * allocation.mechanicId.name ///
 * allocation.bookingId.bookingDate ///
 * allocation.bookingId.breakdown ///
 * allocation.bookingId.vehicleId.registrationNumber ///

 * allocation.serviceAdvice
 * allocation.bookingId.place  if breakdown true
 * allocation.bookingId.customerId
 * allocation.bookingId.description
 * allocation.bookingId.vehicleId.modelName
 */