import React, { useEffect, useState } from 'react';
import MechanicTargetForm from '../../components/admin/MechanicTargetForm';
import makeRequest from '../../common/axios';
import { CiEdit } from "react-icons/ci";
import { displayINRCurrency } from '../../common/utils';
import UpdateMechanicTargets from '../../components/admin/UpdateMechanicTargets';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';

const MechanicTargets = () => {
    // State for loading
    const [loading, setLoading] = useState(false);
    // State for the visibility of add new mechanic targets form
    const [openAddNewTargets, setOpenAddNewTargets] = useState(false);
    // State for the visibility of update mechanic targets form
    const [openUpdateTargets, setOpenUpdateTargets] = useState(false);
    // State for the filter options
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    // State to manage mechanic targets data
    const [targets, setTargets] = useState([]);
    // State to manage selected target
    const [selectedTarget, setSelectedTarget] = useState(null);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [targetsPerPage] = useState(10);

    // Search logic
    const searchData = targets.filter(target => target?.mechanicId?.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()));

    // Pagination logic
    const indexOfLastTarget = currentPage * targetsPerPage;
    const indexOfFirstTarget = indexOfLastTarget - targetsPerPage;
    const currentPageTargets = searchData.slice(indexOfFirstTarget, indexOfLastTarget);

    const totalPages = Math.ceil(searchData.length / targetsPerPage);

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Toggle visibility of the add new mechanic targets popup
    const handleOpenNewTargetPopup = () => {
        setOpenAddNewTargets(!openAddNewTargets);
    }

    // Close the service add new mechanic targets popup
    const handleCloseNewTargetPopup = () => {
        setOpenAddNewTargets(prev => !prev);
    }
    // Toggle visibility of the update mechanic targets popup
    const handleOpenUpdateTargetPopup = () => {
        setOpenUpdateTargets(!openUpdateTargets);
    }

    // Close the service update mechanic targets popup
    const handleCloseUpdateTargetPopup = () => {
        setOpenUpdateTargets(prev => !prev);
    }

    // Handle selected target
    const handleSelectedTarget = (targetId) => {
        const target = targets.find(target => target._id === targetId);
        setSelectedTarget(target);
    };

    // Function for fetch mechanic targets based on filter
    const fetchTargets = async () => {
        setLoading(true);
        try {
            const response = await makeRequest.get('/get-all-mechanic-targets', {
                params: { month: selectedMonth, year: selectedYear }
            });
            setTargets(response.data.data);
        } catch (error) {
            console.error('Error fetching mechanic targets:', error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch targets whenever the selected month or year changes
    useEffect(() => {
        fetchTargets();
    }, [selectedMonth, selectedYear]);

    return (
        <div className='p-4 mt-4 rounded-lg bg-white'>
            <div className='flex justify-between items-center'>
                {/* Title */}
                <h1 className='font-semibold text-xl xs:text-2xl pb-4'>Targets</h1>
                <div className='pb-2 flex gap-1 xs:gap-4'>
                    {/* Dropdown to select the month */}
                    <div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className='bg-bb-theme-500 cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-md'
                        >
                            <option value=''>Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Dropdown to select the year */}
                    <div>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className='bg-bb-theme-500 cursor-pointer outline-none text-xs xs:text-sm text-white p-1 rounded-md'
                        >
                            <option value=''>Year</option>
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i + 2023} value={i + 2023}>
                                    {i + 2023}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Button to open add new mechanic targets popup */}
                    <button
                        onClick={handleOpenNewTargetPopup}
                        className='py-1 px-2 bg-bb-theme-500 hover:bg-bb-theme-600 active:bg-bb-theme-700 text-xs xs:text-sm text-white rounded-md'
                    >
                        Add New
                    </button>
                </div>
            </div>

            {/* Search box */}
            <div>
                <SearchBox value={searchTerm} onChange={handleSearch} />
            </div>

            {/* Table for large screens */}
            <div className='items-start hidden lg:flex'>
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-bb-theme-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Labour Target</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Achievements</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Spare Target</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider w-40">Achievements</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-bb-theme-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Show loading while fetching the data */}
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-center">Loading...</td>
                            </tr>
                        ) : currentPageTargets.length > 0 ? (
                            currentPageTargets.map((target) => (
                                target.achievement.map((ach) => (
                                    <tr key={ach.month} className='hover:bg-bb-theme-50 even:bg-gray-50'>
                                        <td className="px-4 py-3 whitespace-nowrap">{target.mechanicId?.name || 'Unknown'}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(ach.labourTarget)}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(ach.labourAchievement)}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(ach.spareTarget)}</td>
                                        <td className="px-4 py-3">{displayINRCurrency(ach.spareAchievement)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    handleSelectedTarget(target._id);
                                                    handleOpenUpdateTargetPopup();
                                                }}
                                                className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ))
                        ) : (
                            // If no data is available, show the message
                            <tr>
                                <td colSpan="6" className="px-4 py-3 text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Small screens */}
            <div className='flex flex-wrap gap-4 lg:hidden w-full'>
                {loading ? (
                    <p>Loading...</p>
                ) : searchData.length > 0 ? (
                    // Display mechanic targets in cards for small screens
                    searchData.map((target) =>
                        target.achievement.map((ach) => (
                            <div key={ach.month} className="border p-4 rounded-md w-full xs:w-[300px] min-w-[300px]">
                                <h1 className="text-lg font-semibold">{target.mechanicId?.name}</h1>
                                <div><span className='font-medium text-gray-500 text-sm'>Labour Target:</span> {displayINRCurrency(ach.labourTarget)}</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Labour Achievements:</span> {displayINRCurrency(ach.labourAchievement)}</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Spare Target:</span> {displayINRCurrency(ach.spareTarget)}</div>
                                <div><span className='font-medium text-gray-500 text-sm'>Spare Achievements:</span> {displayINRCurrency(ach.spareAchievement)}</div>
                                <div><span className='font-medium text-gray-500 text-sm mr-6'>Action</span>
                                    <button
                                        onClick={() => {
                                            handleSelectedTarget(target._id);
                                            handleOpenUpdateTargetPopup();
                                        }}
                                        className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit />
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    // Show message if no data is available
                    <p>No data available</p>
                )}
            </div>

            {/* Pagination component */}
            <div className='p-4 hidden lg:block'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {openAddNewTargets && <MechanicTargetForm close={handleCloseNewTargetPopup} />}
            {openUpdateTargets && <UpdateMechanicTargets close={handleCloseUpdateTargetPopup} target={selectedTarget} />}
        </div>
    );
};

export default MechanicTargets;
