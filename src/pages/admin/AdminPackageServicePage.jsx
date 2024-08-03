import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import { IoSearch } from "react-icons/io5";
import CreatePackagePopup from '../../components/admin/CreatePackagePopup';
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import swal from 'sweetalert';

const AdminPackageServicePage = () => {
    // State to manage service packages 
    const [servicePackages, setServicePackages] = useState([]);
    // State to manage search
    const [searchTerm, setSearchTerm] = useState('');
    // Add package open close
    const [openAdd, setOpenAdd] = useState(false);

    // Handle search term
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    // Handle close function for set open add false 
    const handleClose = () => {
        setOpenAdd(prevOpenAdd => !prevOpenAdd);
    }

    // Function for fetch service packages from the api
    const fetchServicePackages = async () => {
        try {
            const response = await makeRequest.get('/get-packages');
            if (response.data.success) {
                setServicePackages(response.data.data.reverse());
            }
        } catch (error) {
            console.error('Error fetching service packages: ', error);
        }
    };

    // Search data
    const searchData = servicePackages.filter(pkg => pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        fetchServicePackages();
    }, []);

    // Delete package
    const handleDelete = async (packageId) => {
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
            const response = await makeRequest.delete('/delete-package', {
                data: { packageId }
            });

            if (response.data.success) {
                fetchServicePackages();
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
    return (
        <div>
            <div className='flex py-2 gap-2 flex-wrap'>
                {/* All packages section */}
                <div className='flex-1'>
                    {/* Showing all service packages in a table */}
                    {
                        servicePackages.length === 0 ? 'No packages available' :
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
                                        className='xl:hidden text-sm bg-primaryColor text-white px-2 rounded-md'>Create Package</button>
                                </div>
                                <table className='hidden sm:table w-full shadow-custom min-w-[455px]'>
                                    <thead>
                                        <tr className='bg-primaryColor text-white text-sm'>
                                            <th className='font-normal'>Name</th>
                                            <th className='font-normal'>Description</th>
                                            <th className='font-normal'>Suitable</th>
                                            <th className='font-normal'>Price</th>
                                            <th className='font-normal'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            searchData.map((pkg, index) => (
                                                <tr key={index} className='border text-sm text-start '>
                                                    <td className='border p-2'>{pkg.packageName}</td>
                                                    <td className='border p-2 max-w-[350px]'>{pkg.description}</td>
                                                    <td className='border p-2'>{pkg.suitable}</td>
                                                    <td className='border p-2'>{pkg.price}</td>
                                                    <td className='border p-2'>
                                                        <div className='flex justify-evenly'>
                                                            <button className='bg-blue-100 p-1.5 rounded-full text-blue-600'><CiEdit /></button>
                                                            <button
                                                                onClick={() => handleDelete(pkg._id)}
                                                                className='bg-red-100 p-1.5 rounded-full text-red-600'><MdDeleteOutline /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {/* Small screen device card */}
                                <div className='sm:hidden'>
                                    {
                                        servicePackages.map((pkg, index) => (
                                            <div key={index} className='min-w-[320px] text-sm flex flex-col gap-3 p-2 shadow-custom'>
                                                <h1 className='font-semibold'>{pkg.packageName}</h1>
                                                <p className='text-gray-500'>{pkg.description}</p>
                                                <h3>Suitable for {pkg.suitable}</h3>
                                                <h3 className='font-medium'>Price : <span>&#8377; </span>{pkg.price}</h3>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                    }
                </div>
                {/* Create new package section */}
                <div className='hidden xl:flex flex-col gap-2 bg-gray-10 px-2 rounded-sm min-w-[320px]'>
                    <h1 className='p-3 font-semibold text-lg'>Create New Package</h1>
                    <input className='text-sm outline-none border p-2 rounded-md' placeholder='Package name' type="text" />
                    <textarea className='text-sm outline-none border p-2 rounded-md' placeholder='Description' type="text" />
                    <input className='text-sm outline-none border p-2 rounded-md' placeholder='Price' type="number" />
                    <select className='text-sm outline-none bg-gray-100 p-2 rounded-md' name="" id="">
                        <option value="Scooter">Scooter</option>
                        <option value="Bike">Bike</option>
                        <option value="Both">Both</option>
                    </select>
                    <button className='text-sm bg-primaryColor btext-sm g-primaryColor p-2 rounded-sm text-white'>Create</button>
                </div>
                {openAdd && <CreatePackagePopup close={handleClose} />}
            </div>
        </div>
    )
}

export default AdminPackageServicePage