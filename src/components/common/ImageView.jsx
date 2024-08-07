import React from 'react';
import { IoMdClose } from "react-icons/io";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ImageView = ({ close, imgUrl }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
            <div className='relative w-3/4 h-3/4 bg-slate-100 p-4 rounded-md'>
                <button
                    onClick={close}
                    className='pt-2 absolute top-3 right-3'>
                    <IoMdClose />
                </button>
                <img
                    className='w-full h-full object-contain'
                    src={`${backendUrl}/images/${imgUrl}`} alt="" />
            </div>
        </div>
    )
}

export default ImageView;