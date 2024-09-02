import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../../components/LoadingIndicator';
import { updateAllocationStatus } from '../../redux/features/allocationsSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const BillingPage = () => {
    // Extract the allocation id from the URL parameters
    const { allocationId } = useParams();

    // State variables for managing different parts of the component's state
    const [loading, setLoading] = useState(false);
    const [allocation, setAllocation] = useState({});
    // Store additional works list
    const [extraWorks, setExtraWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState('');
    // Store all works details from the server
    const [works, setWorks] = useState([]);
    const [pickUpCharge, setPickUpCharge] = useState(0);
    const [breakdownCharge, setBreakdownCharge] = useState(0);
    // State for manage spare parts popup visibility
    const [sparePartsVisible, setSparePartsVisible] = useState(false);
    const [totalLabourCharge, setTotalLabourCharge] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    // GST in %
    const [selectedGST, setSelectedGST] = useState(0);
    // GST in amount
    const [gstAmount, setGstAmount] = useState(0);

    const breakdownpRef = useRef(null);
    const pickUpRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle changes to the pickup charge input
    const handleChangePickUpCharge = () => {
        const newCharge = pickUpRef.current.value;
        setPickUpCharge(Number(newCharge));
        pickUpRef.current.value = '';
    };

    // Handle changes to the breakdown charge input
    const handleChangeBreakdownCharge = () => {
        const newCharge = breakdownpRef.current.value;
        setBreakdownCharge(Number(newCharge));
        breakdownpRef.current.value = '';
    };

    // Calculate the total price of the extra works
    const calculateTotalPrice = () => {
        return extraWorks.reduce((total, work) => total + work.price, 0);
    };

    // Add a selected work to the list of extra works
    const handleAddWork = () => {
        if (selectedWork) {
            const work = works.find(w => w._id === selectedWork);
            if (work) {
                setExtraWorks(prevWorks => [
                    ...prevWorks,
                    { workId: selectedWork, workName: work.workName, price: work.price }
                ]);
                setSelectedWork('');
            }
        }
    };

    // Remove a work from the list of extra works
    const handleRemoveWork = (index) => {
        const newWorks = extraWorks.filter((_, i) => i !== index);
        setExtraWorks(newWorks);
    };

    // Fetch the list of all available works from the server
    const fetchAllWorks = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-individual-works');
            if (response.data.success) {
                setWorks(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching individual works: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the allocation details by ID from the server
    const fetchAllocationById = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get(`/get-allocation-by/${allocationId}`);
            if (response.data.success) {
                setAllocation(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching allocation by ID:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate the total labour charge whenever extra works changes
    useEffect(() => {
        const total = calculateTotalPrice();
        setTotalLabourCharge(total);
    }, [extraWorks]);

    // Fetch the works and allocation data when the component mounts
    useEffect(() => {
        fetchAllWorks();
        fetchAllocationById();
    }, []);

    // Calculate the grand total, including service charge, breakdown charge, pickup charge, labour and GST
    useEffect(() => {
        const calculateGrandTotal = () => {
            const serviceCharge = allocation.bookingId?.serviceType?.price || 0;
            const breakdown = breakdownCharge || 0;
            const pickup = pickUpCharge || 0;
            const spareTotal = allocation.totalPartsPrice || 0;
            const labourTotal = totalLabourCharge || 0;
            const gst = (selectedGST / 100) * (serviceCharge + breakdown + pickup + spareTotal + labourTotal);

            setGstAmount(gst);

            return serviceCharge + breakdown + pickup + spareTotal + labourTotal + gst;
        };

        setGrandTotal(calculateGrandTotal());
    }, [allocation.bookingId?.serviceType?.price, breakdownCharge, pickUpCharge, allocation.totalPartsPrice, totalLabourCharge, selectedGST]);

    // Handle submit function to complete the work and send data to the server
    const handleSubmit = async () => {

        setLoading(true);
        try {
            const data = {
                allocation: allocationId,
                pickUpCharge,
                breakdownCharge,
                GST: selectedGST,
                serviceName: allocation.bookingId?.serviceType?.packageName,
                serviceCharge: allocation.bookingId?.serviceType?.price || 0,
                extraWorks
            };

            // Send the data to the backend API
            const response = await makeRequest.post('/add-service-history', data);

            // Redux store data
            const reduxData = {
                bookingId: allocation.bookingId,
                status: 'Unpaid'
            }

            if (response.data.success) {
                toast.success('Bill generated successfully');
                dispatch(updateAllocationStatus(reduxData));
                navigate('/admin/admin-booking')
            }
        } catch (error) {
            console.error('Error bill generation:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-4 bg-white rounded-md">
            {loading && <LoadingIndicator />}
            <h1 className="text-xl lg:text-2xl font-semibold mb-4">Billing</h1>
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Left Section */}
                <div className="flex-1 p-4 rounded-md">
                    {/* Breakdown charge section */}
                    {allocation.bookingId?.breakdown &&
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-600">Breakdown Charge</h3>
                                <p className="font-semibold text-gray-800">&#8377; {breakdownCharge}</p>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    ref={breakdownpRef}
                                    className="border-gray-300 border rounded-md px-2 py-1.5 w-full outline-none"
                                    placeholder="Enter breakdown charge"
                                    type="number"
                                />
                                <button
                                    onClick={handleChangeBreakdownCharge}
                                    className="ml-2 bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>}
                    {/* Pickup charge section */}
                    {allocation.bookingId?.pickUp &&
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-600">Pickup Charge</h3>
                                <p className="font-semibold text-gray-800">&#8377; {pickUpCharge}</p>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    ref={pickUpRef}
                                    className="border-gray-300 border rounded-md px-2 py-1.5 w-full outline-none"
                                    placeholder="Enter pickup charge"
                                    type="number"
                                />
                                <button
                                    onClick={handleChangePickUpCharge}
                                    className="ml-2 bg-purple-600 text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>}

                    {/* GST selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Add GST</label>
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedGST}
                                onChange={(e) => setSelectedGST(Number(e.target.value))}
                                className=" text-gray-600 border-gray-300 rounded-md px-2 py-1.5 border outline-none w-full"
                            >
                                <option value="">Select GST %</option>
                                <option value="1">1 %</option>
                                <option value="2">2 %</option>
                                <option value="3">3 %</option>
                                <option value="4">4 %</option>
                                <option value="5">5 %</option>
                            </select>
                        </div>
                    </div>

                    {/* Additional work charges */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Additional Work Charges</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedWork}
                                    onChange={(e) => setSelectedWork(e.target.value)}
                                    className=" text-gray-600 border-gray-300 rounded-md px-2 py-1.5 border outline-none w-full"
                                >
                                    <option value="">Select Work</option>
                                    {works.map(work => (
                                        <option key={work._id} value={work._id}>
                                            {work.workName} - &#8377; {work.price}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddWork}
                                    className="bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors flex-shrink-0"
                                >
                                    Add Work
                                </button>
                            </div>
                        </div>
                        <ul className="space-y-1 mb-4">
                            {extraWorks.map((work, index) => (
                                <li
                                    key={index}
                                    className="bg-white py-2 px-4 rounded-md shadow-custom flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-gray-700 font-medium">{work.workName}</p>
                                        <p className="text-gray-500">&#8377; {work.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveWork(index)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
                {/* Right Section */}
                <div className="w-full xl:w-1/3 bg-white rounded-md">
                    <div className="sticky top-0 shadow-custom p-4 rounded-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
                        <div className="mb-4">
                            {/* Service charge */}
                            {allocation.bookingId?.serviceType &&
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500">Service Charge</p>
                                    <p className="font-semibold text-gray-800">&#8377; {allocation.bookingId?.serviceType?.price || 0}</p>
                                </div>}
                            {/* Spare parts total */}
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">Spare Parts Total</p>
                                <p className="font-semibold text-gray-800">&#8377; {allocation.totalPartsPrice || 0}</p>
                            </div>
                            {/* Labour total */}
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">Labour Total</p>
                                <p className="font-semibold text-gray-800">&#8377; {totalLabourCharge || 0}</p>
                            </div>
                            {/* GST */}
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500">GST ({selectedGST}%)</p>
                                <p className="font-semibold text-gray-800">&#8377; {gstAmount.toFixed(2)}</p>
                            </div>
                        </div>
                        {/* Grand total */}
                        <div className="border-t-2 border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">Grand Total</p>
                                <p className="text-lg font-semibold text-green-700">&#8377; {grandTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSparePartsVisible(true)}
                            className="mt-4 w-full bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors mb-3"
                        >
                            View Spare Parts
                        </button>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Complete Work
                        </button>
                    </div>

                </div>
            </div>

            {/* Spare Parts Changed Modal */}
            {sparePartsVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-custom max-w-lg w-full">
                        <h3 className="text-xl lg:text-2xl font-semibold mb-4">Spare Parts Changed</h3>
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left bg-gray-50 text-gray-400">
                                    <th className="pb-2 font-medium text-sm tracking-wider uppercase">Part Name</th>
                                    <th className="pb-2 font-medium text-sm tracking-wider uppercase">Quantity</th>
                                    <th className="pb-2 font-medium text-sm tracking-wider uppercase">Price/Unit</th>
                                    <th className="pb-2 font-medium text-sm tracking-wider uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allocation.partsUsed?.map((part, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 px-1 text-gray-700">{part.partName}</td>
                                        <td className="py-2 px-1 text-gray-500">{part.quantity}</td>
                                        <td className="py-2 px-1 text-gray-500">&#8377; {part.partId.price}</td>
                                        <td className="py-2 px-1 text-gray-700 font-medium">
                                            &#8377; {part.totalPartCost}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end items-center px-6 gap-6">
                            <p className="text-gray-500 font-semibold">Total: </p>
                            <p className="font-semibold text-gray-800">&#8377; {allocation.totalPartsPrice || 0}</p>
                        </div>
                        <button
                            onClick={() => setSparePartsVisible(false)}
                            className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BillingPage;
