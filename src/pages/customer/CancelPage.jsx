import React from 'react'

const CancelPage = () => {
    return (
        <div className='container mx-auto flex justify-center items-center h-96'>
            <div className="p-5 bg-red-200">
                <h1 className='text-center text-2xl my-5'>Payment Cancelled</h1>
                <p className='text-center'>Your payment was cancelled. Please try again.</p>
            </div>
        </div>
    )
}

export default CancelPage;