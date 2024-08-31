import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateAllocationStatus } from '../../redux/features/allocationsSlice';

const WorkCompletionPopup = ({ close, allocation }) => {
    // State to manage loading
    const[loading,setLoading] = useState(false);
    // State to track the list of parts used in the job
    const [partsUsed, setPartsUsed] = useState([]);
    // State to handle service advice
    const [serviceAdvice, setServiceAdvice] = useState('');
    // State to store fetched spare data
    const [availableParts,setAvailableParts] = useState([]);

    // State to track the selected part ID and its quantity
    const [selectedPartId, setSelectedPartId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const dispatch = useDispatch();

    // Function to handle adding parts
    const handleAddPart = () => {
        if (selectedPartId && quantity > 0) {
            const part = availableParts.find(p => p._id === selectedPartId);
            setPartsUsed([...partsUsed, { partId: selectedPartId, partName: part.itemName, price: part.price, quantity }]);
            setSelectedPartId(''); // Reset the selected part after adding
            setQuantity(1); // Reset the quantity after adding
        }
    };

    // Function to handle remove parts
    const handleRemovePart = (index) => {
        const newParts = partsUsed.filter((_, i) => i !== index);
        setPartsUsed(newParts);
    };

 // Function to handle form submission
 const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        // Prepare the data to be sent to the backend
        const data = {
            partsUsed,
            serviceAdvice
        };

        // Send the data to the backend API
        const response = await makeRequest.put(`/work-completion/${allocation._id}`, data);

        // Redux store data
        const reduxData = {
            bookingId: allocation.bookingId,
            status: 'Completed'
        }

        if (response.data.success) {
            toast.success(response.data.message);
            setPartsUsed([]);
            setServiceAdvice('');
            setIsOpen(false);
            setTimeout(close, 300);
            dispatch(updateAllocationStatus(reduxData));
        }
    } catch (error) {
        console.error('Error completing work:', error);
        toast.error(error.response.data.message)
    } finally {
        setLoading(false);
    }
};

    // State to manage opening animation of the popup
    const [isOpen, setIsOpen] = useState(false);

    // Function for fetch all spare parts details from the api
    const fetchSpare = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-all-spare');
            if (response.data.success) {
                setAvailableParts(response.data.data);
            }
        } catch (error) {
            console.error('Error while fetching spare parts: ', error);
        } finally {
            setLoading(false);
        }
    }

    // Trigger the opening animation when the component mounts
    useEffect(() => {
        setIsOpen(true);
    }, []);

    // Fetch spare data
    useEffect(() => {
        fetchSpare();
    },[])

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-2 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`flex justify-center items-center sm:block p-2 md:p-10 rounded-md w-full h-full transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                {/* Popup constent container */}
                <div className="p-4 xs:p-6 bg-white rounded-md shadow-custom mx-auto max-w-[450px] lg:max-w-[870px] min-w-[320px]">
                    {/* Title and close button */}
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl text-center lg:text-2xl font-semibold mb-2">Complete work</h2>
                        <span
                            className='text-black text-2xl pb-2 cursor-pointer'
                            onClick={() => {
                                setIsOpen(false);
                                setTimeout(close, 300); // Close after animation
                            }}
                        >&times;</span>
                    </div>
                    {/* Main form and parts list container */}
                    <div className='flex gap-4 flex-wrap-reverse justify-evenly items-end'>
                        {/* Form for adding parts and service advice */}
                        <form onSubmit={handleSubmit}
                            className="min-w-[320px] lg:min-w-[400px] space-y-4">
                            {/* Parts used section */}
                            <div>
                                <label className="block mb-2 text-md font-medium">Parts Used:</label>
                                {/* Part selection dropdown and quantity input */}
                                <div className="flex items-center mb-2">
                                    <select
                                        value={selectedPartId}
                                        onChange={(e) => setSelectedPartId(e.target.value)}
                                        className="shadow-sm mr-2 text-sm outline-none bg-purple-100 p-2 rounded-md w-full"
                                    >
                                        <option value="">Select Part</option>
                                        {availableParts.map(part => (
                                            <option key={part._id} value={part._id}>{part.itemName}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-20 p-2 border rounded-md shadow-sm bg-purple-100 text-sm"
                                        placeholder="Qty"
                                        min="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddPart}
                                        className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Service Advice Section */}
                            <div>
                                <label className="block mb-2 text-md font-medium">Service Advice:</label>
                                <textarea
                                    value={serviceAdvice}
                                    onChange={(e) => setServiceAdvice(e.target.value)}
                                    className="w-full h-20 p-2 border rounded-md shadow-sm text-sm resize-none outline-none"
                                    placeholder="Enter any suggestions or advice for the next service "
                                    rows="4"
                                />
                            </div>
                            {/* Submit button */}
                            <button
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 text-sm"
                            >
                                Submit
                            </button>
                        </form>
                        <div className='min-w-[320px] lg:min-w-[400px] '>
                            {/* List of parts added */}
                            <h3 className="text-md font-medium mb-2">Selected Parts:</h3>
                            {partsUsed.length > 0 ? (
                                <div className="mb-4 h-36 lg:h-52 overflow-y-auto scrollbar-none">
                                    <ul>
                                        {partsUsed.map((part, index) => (
                                            <li key={index} className="flex items-center justify-between p-2 border-b text-sm text-gray-500">
                                                <span>{part.partName} (Qty: {part.quantity})</span>
                                                <button
                                                    onClick={() => handleRemovePart(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : <div className='text-gray-400 p-2 text-sm h-40'>No parts selected</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkCompletionPopup;
