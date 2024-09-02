import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import makeRequest from '../../common/axios';

const BillingPage = () => {
    const { allocationId } = useParams();
    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage allocation
    const [allocation, setAllocation] = useState({});

    // Works
    const [extraWorks, setExtraWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState('');
    const [works, setWorks] = useState([]);

    // State to manage pickup charge
    const [pickUpCharge, setPickUpCharge] = useState(0);
    // State to manage breakdown charge
    const [breakdownCharge, setBreakdownCharge] = useState(0);
    // Pickup charge ref
    const pickUpRef = useRef(null);
    // Breakdown charge ref
    const breakdownpRef = useRef(null);
    // State to manage total labour charge
    const [totalLabourCharge, setTotalLabourCharge] = useState(0);

    const handleChangePickUpCharge = () => {
        const newCharge = pickUpRef.current.value;
        setPickUpCharge(Number(newCharge));
        pickUpRef.current.value = ''; // Correct ref used here
    };

    const handleChangeBreakdownCharge = () => {
        const newCharge = breakdownpRef.current.value;
        setBreakdownCharge(Number(newCharge));
        breakdownpRef.current.value = ''; // Correct ref used here
    };


    // Function to calculate total labour charge
    const calculateTotalPrice = () => {
        return extraWorks.reduce((total, work) => total + work.price, 0);
    };

    // Function to handle adding extra work
    const handleAddWork = () => {
        if (selectedWork) {
            const work = works.find(w => w._id === selectedWork);
            if (work) {
                setExtraWorks(prevWorks => [
                    ...prevWorks,
                    { workId: selectedWork, workName: work.workName, price: work.price }
                ]);
                setSelectedWork(''); // Reset selected work after adding
            }
        }
    };

    // Function to handle removing extra work
    const handleRemoveWork = (index) => {
        const newWorks = extraWorks.filter((_, i) => i !== index);
        setExtraWorks(newWorks);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            // Prepare the data to be sent to the backend
            const data = {
                extraWorks,
            };

            // Send the data to the backend API

            // Redux store data
            const reduxData = {
                bookingId: allocation.bookingId,
                status: 'Unpaid'
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setExtraWorks([]);
                setIsOpen(false);
                setTimeout(close, 300);
                // dispatch(updateAllocationStatus(reduxData));
            }
        } catch (error) {
            console.error('Error completing work:', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch all individual works (extra charges) from the API
    const fetchAllWorks = async () => {
        try {
            const response = await makeRequest.get('/get-individual-works');
            if (response.data.success) {
                setWorks(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching individual works: ', error);
        }
    };

    // Fetch function for allocation details
    const fetchAllocationById = async () => {
        try {
            const response = await makeRequest.get(`/get-allocation-by/${allocationId}`);
            if (response.data.success) {
                setAllocation(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching allocation by ID:', error);
        }
    };

    // Effect to update total labour charge whenever extraWorks changes
    useEffect(() => {
        const total = calculateTotalPrice();
        setTotalLabourCharge(total);
    }, [extraWorks]);

    useEffect(() => {
        fetchAllWorks();
        fetchAllocationById();
    }, []);

    // State to manage grand total
    const [grandTotal,setGrandTotal] = useState(0);
    useEffect(() => {
        const calculateGrandTotal = () => {
            const serviceCharge = allocation.bookingId?.serviceType?.price || 0;
            const breakdown = breakdownCharge || 0;
            const pickup = pickUpCharge || 0;
            const spareTotal = allocation.totalPartsPrice || 0;
            const labourTotal = totalLabourCharge || 0;
    
            return serviceCharge + breakdown + pickup + spareTotal + labourTotal;
        };
    
        setGrandTotal(calculateGrandTotal());
    }, [allocation.bookingId?.serviceType?.price, breakdownCharge, pickUpCharge, allocation.totalPartsPrice, totalLabourCharge]);
    

    return (
        <div className="px-4 rounded-md min-w-[320px]">
            {/* Title */}
            <h1 className="text-xl text-left lg:text-2xl font-semibold mb-2">Billing</h1>
            {/* Main form and parts list container */}
            <div className='flex gap-4 flex-wrap xl:flex-nowrap'>
                {/* Left section */}
                <div className='min-w-[320px] xs:w-[500px] py-4 '>
                    {/* Breakdown charge */}
                    {allocation.bookingId?.breakdown &&
                        <div>
                            <div className='text-sm font-medium mb-2 text-gray-500 p-2 flex justify-between'>
                                <h3 className='tracking-wider'>Breakdown Charge</h3>
                                <p>&#8377; {breakdownCharge}</p>
                            </div>
                            <div className='flex gap-4 mx-2'>
                                <input
                                    ref={breakdownpRef}
                                    className='border outline-none p-2 w-full rounded-md text-sm'
                                    placeholder='Enter breakdown charge'
                                    type="number" />
                                <button
                                    onClick={() => handleChangeBreakdownCharge()}
                                    className='ml-2 bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 text-sm'>
                                    Add
                                </button>
                            </div>
                        </div>}
                    {/* Pickup charge */}
                    {allocation.bookingId?.pickUp &&
                        <div>
                            <div className='text-sm font-medium mb-2 text-gray-500 p-2 flex justify-between'>
                                <h3>Pickup Charge</h3>
                                <p>&#8377; {pickUpCharge}</p>
                            </div>
                            <div className='flex gap-2 m-2'>
                                <input
                                    ref={pickUpRef}
                                    className='border outline-none p-2 w-full rounded-md text-sm'
                                    placeholder='Enter pickup charge'
                                    type="number" />
                                <button
                                    onClick={() => handleChangePickUpCharge()}
                                    className=' bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 text-sm'>
                                    Add
                                </button>
                            </div>
                        </div>}

                    {/* Form for adding parts */}
                    <form
                        onSubmit={handleSubmit}
                        className="min-w-[320px] space-y-4">
                        {/* Extra Work Charges Section */}
                        <div className='mx-2'>
                            <p className="my-2 text-sm font-medium tracking-wider text-gray-500">Extra Work Charges:</p>
                            <div className="flex items-center mb-2">
                                <select
                                    value={selectedWork}
                                    onChange={(e) => setSelectedWork(e.target.value)}
                                    className="shadow-sm mr-2 text-sm outline-none text-gray-500 border p-2 rounded-md w-full"
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
                                    className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 text-sm"
                                >
                                    Add
                                </button>
                            </div>
                            {/* Submit button */}
                            <button
                                className="bg-purple-600 w-full text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 text-sm"
                            >
                                Submit
                            </button>
                        </div>



                    </form>

                </div>
                {/* Right section */}
                <div className='min-w-[320px] w-full lg:overflow-y-auto lg:scrollbar-none lg:h-[500px]'>
                    {/* Changed parts */}
                    <div className='min-w-[320px]'>
                        {/* List of selected parts */}
                        <h3 className="text-md font-medium mb-2">Changed Parts:</h3>
                        {allocation.partsUsed?.length > 0 ? (
                            <div className="mb-4">
                                <table className="w-full text-sm text-gray-500 border-collapse">
                                    <thead>
                                        <tr className='bg-gray-50'>
                                            <th className="p-2 border-b text-left tracking-wider uppercase font-medium">Spare</th>
                                            <th className="p-2 border-b text-left tracking-wider uppercase font-medium">Quantity</th>
                                            <th className="p-2 border-b text-left tracking-wider uppercase font-medium">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allocation.partsUsed.map((part, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{part.partName}</td>
                                                <td className="p-2">{part.quantity}</td>
                                                <td className="p-2">&#8377; {part.totalPartCost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className='text-gray-400 p-2 text-sm h-40'>No parts selected</div>
                        )}
                    </div>
                    {/* List of selected extra works */}
                    <h3 className="text-md font-medium mb-2">Additional Works:</h3>
                    {extraWorks.length > 0 ? (
                        <div className="mb-4">
                            <table className='w-full text-gray-500'>
                                <thead className='bg-gray-50'>
                                    <td className="p-2 text-sm border-b tracking-wider uppercase font-medium">Work</td>
                                    <td className="p-2 text-sm border-b tracking-wider uppercase font-medium">Price</td>
                                    <td className="p-2 text-sm border-b tracking-wider uppercase font-medium">Action</td>
                                </thead>
                                {extraWorks.map((work, index) => (
                                    <tbody>
                                        <tr key={index} className=" w-full p-2 border-b text-sm text-gray-500">
                                            <td className='p-2'>{work.workName}</td>
                                            <td className='p-2'>&#8377; {work.price}</td>
                                            <td className='p-2'>
                                                <button
                                                    onClick={() => handleRemoveWork(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    ) : <div className='text-gray-400 p-2 text-sm'>No additional works selected</div>}
                    {/* Total amount section */}
                    <div >
                        {allocation.bookingId?.serviceType &&
                            <div className='flex justify-evenly gap-6'>
                                <div className='flex-1 p-2'>Service Charge</div>
                                <div className='flex-1 p-2'>&#8377; {allocation.bookingId?.serviceType?.price || 0}</div>
                            </div>}
                        {allocation.bookingId?.breakdown &&
                            <div className='flex gap-6'>
                                <div className='flex-1 p-2'>Breakdown Charge</div>
                                <div className='flex-1 p-2'>&#8377; {breakdownCharge}</div>
                            </div>}
                        {allocation.bookingId?.pickUp &&
                            <div className='flex justify-evenly gap-6'>
                                <div className='flex-1 p-2'>Pickup Charge</div>
                                <div className='flex-1 p-2'>&#8377; {pickUpCharge}</div>
                            </div>}
                        <div className='flex justify-evenly gap-6'>
                            <div className='flex-1 p-2'>Spare Total</div>
                            <div className='flex-1 p-2'>&#8377; {allocation.totalPartsPrice}</div>
                        </div>
                        <div className='flex justify-evenly gap-6'>
                            <div className='flex-1 p-2'>Labour Total</div>
                            <div className='flex-1 p-2'>&#8377; {totalLabourCharge}</div>
                        </div>
                        <div className='flex justify-evenly gap-6'>
                            <div className='flex-1 p-2'>Grand Total</div>
                            <div className='flex-1 p-2'>&#8377; {grandTotal}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;