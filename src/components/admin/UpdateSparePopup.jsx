import React, { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import makeRequest from '../../common/axios';

// Get the backend url from the environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateSparePopup = ({ close, spare, fetchSpare }) => {
    // State to manage loading
    const [loading, setLoading] = useState(false);
    // State to manage spare data
    const [data, setData] = useState({
        price: spare.price,
        stock: spare.stock,
    });

    // Handle change in the form
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }


    // Handle submit spare form
    const handleSubmitSpareForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const response = await makeRequest.put(`/update-spare/${spare._id}`, data);
            if (response.data.success) {
                toast.success(response.data.message);
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

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
            <div className='bg-white p-4 rounded-md shadow-lg max-w-[340px]'>
                <div className='flex items-center justify-between'>
                    <h1 className='py-3 font-semibold text-lg'>Update Spare</h1>
                    <button
                        onClick={close}
                        className='pt-2'>
                        <IoMdClose />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmitSpareForm}
                    className='flex flex-col gap-2 bg-gray-10 px-2 rounded-sm min-w-[320px]'>

                    <img src={`${backendUrl}/images/${spare.image}`}
                        className='object-contain w-36 h-20'
                        alt="" />

                    <p className='p-2'>
                        Item : {spare.itemName}
                    </p>

                    <p className='p-2'>
                        Suitable for {spare.suitable.name}
                    </p>

                    <div className='flex items-center gap-2'>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            id="stock"
                            onChange={handleOnChange}
                            value={data.stock}
                            name='stock'
                            className='text-sm outline-none border p-2 rounded-md w-full'
                            placeholder='Stock'
                            type="number"
                        />
                    </div>

                    <div className='flex items-center gap-3'>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            onChange={handleOnChange}
                            value={data.price}
                            name='price'
                            className='text-sm outline-none border p-2 rounded-md w-full'
                            placeholder='Price'
                            type="number"
                        />
                    </div>

                    <button className='p-2 rounded-md text-sm text-white bg-gradient-to-b from-bb-theme-500 to-bb-theme-600 hover:from-bb-theme-600 hover:to-bb-theme-700 active:from-bb-theme-700 active:to-bb-theme-800 shadow-sm'>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UpdateSparePopup;