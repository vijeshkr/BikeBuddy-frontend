import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { IoSearch } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import CreateWorkPopup from '../../components/admin/CreateWorkPopup';
import UpdateWorkPopup from '../../components/admin/UpdateWorkPopup';

const AdminIndividualWorksPage = () => {
    // State to manage individual works 
    const [works, setWorks] = useState([]);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');
    // Add work open close
    const [openAdd, setOpenAdd] = useState(false);
    // Update work open close
    const [openUpdate, setOpenUpdate] = useState(false);
    // State to manage current package
    const [currentWork, setCurrentWork] = useState({});

    // Handle current work and open update popup
    const handleUpdateOpen = (wrk) => {
        setOpenUpdate(!openUpdate);
        setCurrentWork(wrk);
    }

    // Handle close function for set open update false 
    const handleCloseUpdate = () => {
        setOpenUpdate(prevOpenUpdate => !prevOpenUpdate);
    }

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Handle close function for set open add false 
    const handleClose = () => {
        setOpenAdd(prevOpenAdd => !prevOpenAdd);
    }

    // Function for fetch all work details from the api
    const fetchAllWorks = async () => {
        try {
            const response = await makeRequest.get('/get-individual-works');
            if (response.data.success) {
                setWorks(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        }
    };

    // Search data
    const searchData = works.filter(wrk => wrk.workName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        fetchAllWorks();
    }, []);

    // Delete work
    const handleDelete = async (workId) => {
        try {
            // Show confirmation alert
            const confirm = await swal({
                title: 'Are you sure?',
                text: 'Do you want to delete this item?',
                icon: 'warning',
                buttons: ['Cancel', 'Yes, delete it!'],
                dangerMode: true,
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });

            if (!confirm) return; // Exit if user cancels

            // Show a loading alert
            const loadingAlert = swal({
                title: 'Deleting...',
                text: 'Please wait while we delete your item.',
                icon: 'info',
                buttons: false, // Disables buttons
                closeOnClickOutside: false,
                closeOnEsc: false,
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                },
            });

            // API call
            const response = await makeRequest.delete('/delete-individual-work', {
                data: { workId }
            });

            if (response.data.success) {
                fetchAllWorks();
            }

            // Close the loading alert
            swal.close();

            // Show success message
            await swal({
                title: 'Deleted!',
                text: 'Your item has been deleted.',
                icon: 'success',
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });

        } catch (error) {
            // Close the loading alert if an error occurs
            swal.close();

            // Show error message
            await swal({
                title: 'Error!',
                text: 'There was an error deleting your item.',
                icon: 'error',
                className: 'swal-modal',
                didOpen: () => {
                    // Add custom classes to the elements
                    const swalTitle = document.querySelector('.swal-title');
                    const swalText = document.querySelector('.swal-text');
                    const swalButtonConfirm = document.querySelector('.swal-button--confirm');
                    const swalButtonCancel = document.querySelector('.swal-button--cancel');

                    if (swalTitle) swalTitle.classList.add('swal-title');
                    if (swalText) swalText.classList.add('swal-text');
                    if (swalButtonConfirm) swalButtonConfirm.classList.add('swal-button');
                    if (swalButtonCancel) swalButtonCancel.classList.add('swal-button');
                },
            });
        }
    };

    // Create new package section
    // State for manage form data
    const [data, setData] = useState({
        workName: '',
        suitable: '',
        price: 0,
    });

    // Handle change in the form
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await makeRequest.post('/add-individual-work', data);
            if (response.data.success) {
                toast.success('Work added successfully');
                fetchAllWorks();
                setData({
                    workName: '',
                    suitable: '',
                    price: 0,
                });
            }
        } catch (error) {
            console.error('Error while creating new work: ', error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <div className='flex py-2 gap-2 flex-wrap'>
                {/* All works section */}
                <div className='flex-1'>
                    {/* Showing all works in a table */}
                    {
                        works.length === 0 ? 'No packages available' :
                            <div>
                                <div className='py-2 flex justify-between flex-wrap'>
                                    <div className='border rounded-md px-2 flex items-center justify-between max-w-[250px]'>
                                        <input
                                            onChange={handleSearch}
                                            value={searchTerm}
                                            className='outline-none p-1 text-sm'
                                            type="text"
                                            placeholder='Search' />
                                        <div className='px-2 text-gray-400'>
                                            <IoSearch />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpenAdd(!openAdd)}
                                        className='xl:hidden text-xs xs:text-sm bg-primaryColor text-white px-2 rounded-md'>Create Work</button>
                                </div>
                                {/* Table section */}
                                <div className='xl:overflow-y-auto xl:scrollbar-none xl:max-h-[505px] xl:border-b'>
                                    <table className='hidden sm:table w-full shadow-custom min-w-[455px]'>
                                        <thead>
                                            <tr className='bg-primaryColor text-white text-sm text-left'>
                                                <th className='font-normal px-2'>Name</th>
                                                <th className='font-normal px-2'>Suitable</th>
                                                <th className='font-normal px-2'>Price</th>
                                                <th className='font-normal px-2'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                searchData.map((wrk, index) => (
                                                    <tr key={index} className='border text-sm text-start '>
                                                        <td className='border p-2'>{wrk.workName}</td>
                                                        <td className='border p-2'>{wrk.suitable}</td>
                                                        <td className='border p-2'><span>&#8377; </span>{wrk.price}</td>
                                                        <td className='border p-2'>
                                                            <div className='flex justify-evenly'>
                                                                <button
                                                                    onClick={() => handleUpdateOpen(wrk)}
                                                                    className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit /></button>
                                                                <button
                                                                    onClick={() => handleDelete(wrk._id)}
                                                                    className='bg-red-100 p-1.5 rounded-full text-red-600'><MdDeleteOutline /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {/* Small screen device card */}
                                <div className='sm:hidden'>
                                    {
                                        searchData.map((wrk, index) => (
                                            <div key={index} className='min-w-[320px] text-sm flex flex-col gap-3 p-2 shadow-custom'>
                                                <h1 className='font-semibold'>{wrk.workName}</h1>
                                                <h3 className='text-gray-500'>Suitable for {wrk.suitable}</h3>
                                                <div className='flex justify-between'>
                                                    <h3 className='font-medium'>Price : <span>&#8377; </span>{wrk.price}</h3>
                                                    <div className='flex justify-evenly'>
                                                        <button
                                                            onClick={() => handleUpdateOpen(wrk)}
                                                            className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit /></button>
                                                        <button
                                                            onClick={() => handleDelete(wrk._id)}
                                                            className='bg-red-100 p-1.5 rounded-full text-red-600'><MdDeleteOutline /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                    }
                </div>
                {/* Create new work section */}

                <form
                    onSubmit={handleSubmit}
                    className='hidden xl:flex flex-col gap-2 bg-gray-10 px-2 rounded-sm min-w-[320px]'>
                    <h1 className='p-3 font-semibold text-lg'>Create New Work</h1>
                    <input
                        value={data.workName}
                        onChange={handleOnChange}
                        name='workName'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Work name' type="text" />
                    <input
                        value={data.price}
                        onChange={handleOnChange}
                        name='price'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Price' type="number" />
                    <select
                        value={data.suitable}
                        onChange={handleOnChange}
                        name='suitable'
                        className='text-sm outline-none bg-gray-100 p-2 rounded-md'>
                        <option value="">Select an option</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Bike">Bike</option>
                        <option value="Both">Both</option>
                    </select>
                    <button className='text-sm bg-primaryColor btext-sm g-primaryColor p-2 rounded-sm text-white'>Create</button>
                </form>

                {openAdd && <CreateWorkPopup close={handleClose} fetchWorks={fetchAllWorks} />}
                {openUpdate && <UpdateWorkPopup close={handleCloseUpdate} wrk={currentWork} fetchWorks={fetchAllWorks} />}
            </div>
        </div>
    )
}

export default AdminIndividualWorksPage;