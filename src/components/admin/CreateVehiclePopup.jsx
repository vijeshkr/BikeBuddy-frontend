import React, { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { handleImageUpload } from '../../common/utils';
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';

const CreateVehiclePopup = ({ close, fetchVehicle }) => {

    // State to manage vehicle image
    const [vehicleImg, setVehicleImg] = useState(null);
    // State to manage vehicle name
    const [vehicleName, setVehicleName] = useState('');
    // State to manage loading
    const [loading, setLoading] = useState(false);

    // For vehicle image input field
    const fileInputRef = useRef(null);

    // Handle vehicle image
    const handleVehicleImage = (e) => {
        if (e.target.files.length > 0) {
            setVehicleImg(e.target.files[0]);
        } else {
            setVehicleImg(null);
        }
    }

    // Handle vehicle name
    const handleVehicleName = (e) => {
        setVehicleName(e.target.value);
    }

    // Vehicle img clear
    const clearVehicleImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setVehicleImg(null);
        // Reset the file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    // Handle submit vehicle form
    const handleSubmitVehicleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Upload image and gets it's URL
            const imageUrl = await handleImageUpload(vehicleImg);
            const vehicleData = { name: vehicleName, image: imageUrl }

            // Api call for add new vehicle
            const response = await makeRequest.post('/add-new-vehicle', vehicleData);
            if (response.data.success) {
                toast.success(response.data.message);
                // Clear the form and reset the state
                setVehicleName('');
                setVehicleImg(null);
                fetchVehicle();
                close();
            }
        } catch (error) {
            console.error('Failed to create new vehicle:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
            <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
                <div className='flex items-center justify-between'>
                    <h1 className='py-3 font-semibold text-lg'>Create New Vehicle</h1>
                    <button
                        onClick={close}
                        className='pt-2'>
                        <IoMdClose />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmitVehicleForm}
                    className='flex flex-col gap-2 bg-gray-10 px-2 rounded-sm min-w-[320px]'>
                    <div className='relative w-36'>
                        <label htmlFor="uploadVehicleImg" className='w-36'>
                            <div className='p-2 bg-slate-100 border rounded-md h-20 w-36 flex justify-center items-center cursor-pointer'>
                                {/* Display upload icon if no image is selected */}
                                <div className={`${vehicleImg && 'hidden'} text-slate-500 flex justify-center items-center flex-col gap-2`}>
                                    <span className='text-3xl'><FaCloudUploadAlt /></span>
                                    <p className='text-xs'>Upload vehicle image</p>
                                    <input
                                        ref={fileInputRef}
                                        onChange={handleVehicleImage}
                                        className='hidden'
                                        id='uploadVehicleImg'
                                        type="file"
                                        name="image" />
                                </div>
                            </div>
                        </label>
                        {/* Display selected image and clear button */}
                        <div className={`${!vehicleImg && 'hidden'} absolute w-36 h-20 top-0 bottom-0 left-0 right-0`}>
                            <div className='relative'>
                                <img src={`${vehicleImg && URL.createObjectURL(vehicleImg)}`}
                                    className='object-contain w-36 h-20'
                                    alt="" />
                                <span
                                    className='absolute top-0 right-0 rounded-full bg-red-200 text-red-600 text-sm p-0.5 cursor-pointer'
                                    onClick={clearVehicleImage}
                                ><IoMdClose /></span>
                            </div>
                        </div>
                    </div>

                    <input
                        onChange={handleVehicleName}
                        value={vehicleName}
                        name='name'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Vehicle name' type="text" />
                    <button className='text-sm bg-primaryColor btext-sm g-primaryColor p-2 rounded-sm text-white'>
                    {loading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateVehiclePopup;