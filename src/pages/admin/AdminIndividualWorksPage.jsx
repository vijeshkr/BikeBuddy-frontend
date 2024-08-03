import React from 'react'

const AdminIndividualWorksPage = () => {
    return (
        <div>
            <div className='flex flex-wrap p-2'>
                <div className='flex-1'>Show</div>
                <div className='flex flex-col gap-2 bg-gray-100 py-4 px-2 rounded-sm min-w-[320px]'>
                    <h1 className='p-3 font-semibold text-lg'>Create New Individual Work</h1>
                    <input className='outline-none border p-2 rounded-md' placeholder='Work' type="text" />
                    <input className='outline-none border p-2 rounded-md' placeholder='Price' type="number" />
                    <select className='outline-none bg-gray-200 p-2 rounded-md' name="" id="">
                        <option value="Scooter">Scooter</option>
                        <option value="Bike">Bike</option>
                        <option value="Both">Both</option>
                    </select>
                    <button className='bg-primaryColor p-2 rounded-sm text-white'>Create</button>
                </div>
            </div>
        </div>
    )
}

export default AdminIndividualWorksPage