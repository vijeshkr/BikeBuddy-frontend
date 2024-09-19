import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMechanicDetails } from '../../redux/features/mechanicSlice';

const MechanicTargetPopup = ({ close }) => {
    const [baseSalary, setBaseSalary] = useState('');
    const [labourTarget, setLabourTarget] = useState('');
    const [spareTarget, setSpareTarget] = useState('');
    const [incentivePercentage, setIncentivePercentage] = useState('');
    const [loading, setLoading] = useState(false);

    // State to manage selected mechanic
    const [selectedMechanic, setSelectedMechanic] = useState('');
    // Access mechanics data from the Redux store
    const mechanics = useSelector((state) => state.mechanic.mechanic);
    const dispatch = useDispatch();

    // Handle select change
    const handleOnChange = (event) => {
        setSelectedMechanic(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTargetData = {
            mechanicId: selectedMechanic,
            baseSalary,
            labourTarget,
            spareTarget,
            incentivePercentage,
        };

        setLoading(true);
        try {
            const response = await makeRequest.post('/add-new-mechanic-targets', newTargetData);
            if (response.data.success) {
                toast.success('Mechanic target added successfully');
                console.log(response.data.data)
                close();
            }
        } catch (error) {
            console.error('Error while adding mechanic target: ',error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const role = 'mechanic';

    // Function for fetch mechanic data
    const fetchMechanics = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get(`/get-users/${role}`);
            if (response.data.success) {
                // Update Redux store with fetched data
                dispatch(setMechanicDetails({ mechanic: response.data.data }));
            }
        } catch (error) {
            console.error('Error while fetching mechanic details: ', error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch mechanics
    useEffect(() => {
        fetchMechanics();
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    onClick={close}
                >
                    &times;
                </button>

                <h2 className="text-xl sm:text-2xl text-center font-semibold mb-6">Add Mechanic Target</h2>

                <form onSubmit={handleSubmit}>
                    {/* Mechanic ID Input */}
                    <div className="mb-6">
                        <label className="font-semibold text-text-sm sm:text-base  block mb-2">Mechanic:</label>
                        <select
                            onChange={handleOnChange}
                            value={selectedMechanic}
                            className="w-full p-2 border rounded-lg text-gray-700 outline-none transition">
                            <option value="">Select mechanic</option>
                            {
                                mechanics.map((mechanic) => (
                                    <option
                                        key={mechanic._id} value={mechanic._id}>{mechanic.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Base Salary Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baseSalary">
                            Base Salary
                        </label>
                        <input
                            type="number"
                            id="baseSalary"
                            value={baseSalary}
                            onChange={(e) => setBaseSalary(e.target.value)}
                            className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Labour Target Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="labourTarget">
                            Labour Target
                        </label>
                        <input
                            type="number"
                            id="labourTarget"
                            value={labourTarget}
                            onChange={(e) => setLabourTarget(e.target.value)}
                            className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Spare Target Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="spareTarget">
                            Spare Target
                        </label>
                        <input
                            type="number"
                            id="spareTarget"
                            value={spareTarget}
                            onChange={(e) => setSpareTarget(e.target.value)}
                            className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Incentive Percentage Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="incentivePercentage">
                            Incentive Percentage
                        </label>
                        <input
                            type="number"
                            id="incentivePercentage"
                            value={incentivePercentage}
                            onChange={(e) => setIncentivePercentage(e.target.value)}
                            className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full text-sm bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 text-white tracking-wider py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Add Target'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MechanicTargetPopup;
