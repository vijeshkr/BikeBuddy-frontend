import React, { useState } from 'react';
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';

const UpdateMechanicTargets = ({ close, target }) => {
    const [baseSalary, setBaseSalary] = useState(target.baseSalary);
    const [labourTarget, setLabourTarget] = useState(target.achievement[0].labourTarget);
    const [spareTarget, setSpareTarget] = useState(target.achievement[0].spareTarget);
    const [incentivePercentage, setIncentivePercentage] = useState(target.achievement[0].incentivePercentage);
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTargetData = {
            baseSalary,
            labourTarget,
            spareTarget,
            incentivePercentage
        };

        // Function to check if there any changes
      const hasChanges = (
        target.baseSalary !== updatedTargetData.baseSalary ||
        target.achievement[0].labourTarget !== updatedTargetData.labourTarget ||
        target.achievement[0].spareTarget !== updatedTargetData.spareTarget ||
        target.achievement[0].incentivePercentage !== updatedTargetData.incentivePercentage 
      );

      if (!hasChanges) {
        toast.info('No changes detected.');
        return;
      }

        setLoading(true);
        try {
            const response = await makeRequest.put(`/update-mechanic-target/${target.mechanicId._id}`, updatedTargetData);
            if (response.data.success) {
                toast.success('Mechanic targets updated successfully');
                close();
            }
        } catch (error) {
            console.error('Error while updating mechanic target: ', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    onClick={close}
                >
                    &times;
                </button>
                <h2 className="text-xl sm:text-2xl text-center font-semibold mb-6">Update Mechanic Target</h2>

                <form onSubmit={handleSubmit}>
                    {/* Mechanic ID Input */}
                    <div className="mb-6">
                        <label className="font-semibold text-text-sm sm:text-base block mb-2">Mechanic:</label>
                        <h1>{target.mechanicId.name}</h1>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="incentive">
                            Incentive Percentage
                        </label>
                        <input
                            type="number"
                            id="incentive"
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
                        {loading ? 'Updating...' : 'Update Target'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateMechanicTargets;
