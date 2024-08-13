import React, { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { handleImageUpload } from '../../common/utils';
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';

const CreateSparePopup = ({ close, fetchSpare, allVehicles }) => {
    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage spare image
    const [spareImage, setSpareImage] = useState(null);
    // State to manage spare data
    const [data, setData] = useState({
        itemName: '',
        price: '',
        stock: '',
        suitable: ''
    });

    // For spare image input field
    const fileInputRefSparePopup = useRef(null);

    // Handle change in the form
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    // Handle spare image
    const handleSpareImage = (e) => {
        if (e.target.files.length > 0) {
            setSpareImage(e.target.files[0]);
        } else {
            setSpareImage(null);
        }
    }

    // Handle submit spare form
    const handleSubmitSpareForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Upload image and get the URL
            const imageUrl = await handleImageUpload(spareImage);
            const updatedData = { ...data, image: imageUrl }

            const response = await makeRequest.post('/add-new-spare', updatedData);
            if (response.data.success) {
                toast.success(response.data.message);
                // Clear the form and reset the state
                setData({
                    itemName: '',
                    price: '',
                    stock: '',
                    suitable: ''
                });
                setSpareImage(null);
                fetchSpare();
                close();
            }
        } catch (error) {
            console.error('Failed to create new spare:', error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    // Spare img clear
    const clearSpareImage = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setSpareImage(null);
        // Reset the file input value
        if (fileInputRefSparePopup.current) {
            fileInputRefSparePopup.current.value = ''
        }
    }
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
            <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
                <div className='flex items-center justify-between'>
                    <h1 className='py-3 font-semibold text-lg'>Create New Spare</h1>
                    <button
                        onClick={close}
                        className='pt-2'>
                        <IoMdClose />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmitSpareForm}
                    className='flex flex-col gap-2 bg-gray-10 px-2 rounded-sm min-w-[320px]'>
                    {/* Sapre image upload section */}
                    <div className='relative w-36'>
                        <label htmlFor="uploadSpareImg" className='w-36'>
                            <div className='p-2 bg-slate-100 border rounded-md h-20 w-36 flex justify-center items-center cursor-pointer'>
                                <div className={`${spareImage && 'hidden'} text-slate-500 flex justify-center items-center flex-col gap-2`}>
                                    <span className='text-3xl'><FaCloudUploadAlt /></span>
                                    <p className='text-xs'>Upload spare image</p>
                                    <input
                                        ref={fileInputRefSparePopup}
                                        onChange={handleSpareImage}
                                        className='hidden'
                                        id='uploadSpareImg'
                                        type="file"
                                        name="image" />
                                </div>
                            </div>
                        </label>
                        <div className={`${!spareImage && 'hidden'} absolute w-36 h-20 top-0 bottom-0 left-0 right-0`}>
                            <div className='relative'>
                                <img src={`${spareImage && URL.createObjectURL(spareImage)}`}
                                    className='object-contain w-36 h-20'
                                    alt="" />
                                <span
                                    className='absolute top-0 right-0 rounded-full bg-red-200 text-red-600 text-sm p-0.5 cursor-pointer'
                                    onClick={clearSpareImage}
                                ><IoMdClose /></span>
                            </div>
                        </div>
                    </div>
                    {/* Form fields */}
                    <input
                        onChange={handleOnChange}
                        value={data.itemName}
                        name='itemName'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Spare name' type="text" />

                    <select
                        onChange={handleOnChange}
                        value={data.suitable}
                        name='suitable'
                        className='text-sm outline-none bg-gray-100 p-2 rounded-md'>
                        <option value="">Select an option</option>
                        {allVehicles.map((vehicle, index) => (
                            <option
                                key={index}
                                value={vehicle._id}>{vehicle.name}</option>
                        ))}
                    </select>

                    <input
                        onChange={handleOnChange}
                        value={data.stock}
                        name='stock'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Stock' type="number" />

                    <input
                        onChange={handleOnChange}
                        value={data.price}
                        name='price'
                        className='text-sm outline-none border p-2 rounded-md' placeholder='Price' type="number" />
                    <button className='text-sm bg-primaryColor btext-sm g-primaryColor p-2 rounded-sm text-white'>Create</button>
                </form>
            </div>
        </div>
    )
}

export default CreateSparePopup