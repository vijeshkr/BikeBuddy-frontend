import React, { useEffect, useState } from 'react';
import makeRequest from '../../common/axios';
import LoadingIndicator from '../LoadingIndicator';
import { displayINRCurrency } from '../../common/utils';
import { loadStripe } from '@stripe/stripe-js';

const PaymentPopup = ({ close, allocation }) => {
  // State to manage popup visibility and loading
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // State to store service history
  const [serviceHistory, setServiceHistory] = useState(null);

  // Function to fetch service history based on allocation ID
  const fetchServiceHistory = async () => {
    setLoading(true);
    try {
      // API call
      const response = await makeRequest.get(`/get-service-history-by-allocation/${allocation._id}`);
      if (response.data.success) {
        setServiceHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payment details: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service history when the component mouts or allocation ID changes
  useEffect(() => {
    fetchServiceHistory();
  }, [allocation._id]);

  // Open the popup when the component mounts
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Calculate total amount including spare parts, extra works and service charges
  const calculateTotal = () => {
    const sparePartsTotal = serviceHistory?.allocation?.partsUsed?.reduce((total, part) => total + part.totalPartCost, 0) || 0;
    const extraWorksTotal = serviceHistory?.extraWorks?.reduce((total, work) => total + work.price, 0) || 0;
    const otherChargesTotal = (serviceHistory?.pickUpCharge || 0) +
      (serviceHistory?.breakdownCharge || 0) +
      (serviceHistory?.serviceCharge || 0) +
      (serviceHistory?.GST || 0);

    return sparePartsTotal + extraWorksTotal + otherChargesTotal;
  };

  // Compute total amount and store in a variable
  const totalAmount = calculateTotal();

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Load stripe using public key from environment variable.
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const stripe = await stripePromise;

      // Send a post request to the backend to create a stripe payment session
      const response = await makeRequest.post('/create-payment-session', {
        allocationId: allocation._id,
        totalAmount,
      });

      // Redirect the user to stripe checkout page using the session ID returned by the backend.
      await stripe.redirectToCheckout({ sessionId: response.data.id });

    } catch (error) {
      console.error('Error creating payment session:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {loading ? <LoadingIndicator /> :
        <div className={`p-4 sm:p-8 rounded-md w-full max-w-lg bg-white transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'} max-h-full overflow-hidden`}>
          {/* Title and close button */}
          <div className="flex justify-between">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Billing Summary</h2>
            <span
              className="cursor-pointer text-xl xs:text-2xl"
              onClick={() => {
                setIsOpen(false);
                setTimeout(close, 300); // Close after animation
              }}
            >&times;</span>
          </div>

          {/* Billing section (scrollable) */}
          <div className="p-2 overflow-y-auto scrollbar-none" style={{ maxHeight: '70vh' }}>
            <div>
              {/* Spare parts */}
              {serviceHistory?.allocation?.partsUsed?.length > 0 && (
                <div className='mb-2'>
                  <h3 className="font-semibold border-b pb-2 mb-2">Spare Parts</h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-left py-2">Part Name</th>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-right py-2">Price/Unit</th>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-right py-2">Quantity</th>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-right py-2">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceHistory.allocation.partsUsed.map((part, index) => (
                        <tr key={part._id}>
                          <td className="text-sm xs:text-base text-gray-500 py-1">{part.partName}</td>
                          <td className="text-sm xs:text-base text-gray-500 text-right py-1">{displayINRCurrency(part.partId.price)}</td>
                          <td className="text-sm xs:text-base text-gray-500 text-right py-1">{part.quantity}</td>
                          <td className="text-sm xs:text-base text-gray-500 text-right py-1">{displayINRCurrency(part.totalPartCost)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-right font-semibold py-2" colSpan="3">Total:</td>
                        <td className="text-right font-semibold py-2">
                          {displayINRCurrency(
                            serviceHistory.allocation.partsUsed.reduce((total, part) => total + part.totalPartCost, 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Extra works */}
              {serviceHistory?.extraWorks?.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold border-b pb-2 mb-2">Extra Works</h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-left py-2">Work Name</th>
                        <th className="text-sm xs:text-base font-semibold whitespace-nowrap text-right py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceHistory.extraWorks.map((work, index) => (
                        <tr key={work._id}>
                          <td className="text-sm xs:text-base text-gray-500 py-1">{work.workName}</td>
                          <td className="text-sm xs:text-base text-gray-500 text-right py-1">{displayINRCurrency(work.price)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-right font-semibold py-2">Total:</td>
                        <td className="text-right font-semibold py-2">
                          {displayINRCurrency(
                            serviceHistory.extraWorks.reduce((total, work) => total + work.price, 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Service charges and total */}
            <div>
              {/* Pickup charge */}
              {serviceHistory?.pickUpCharge > 0 &&
                <div className="flex justify-between pb-1 border-b">
                  <span className="font-semibold">Pick Up Charge:</span>
                  <span>{displayINRCurrency(serviceHistory?.pickUpCharge)}</span>
                </div>}
              {/* Breakdown charge */}
              {serviceHistory?.breakdownCharge > 0 &&
                <div className="flex justify-between pb-2 border-b">
                  <span className="font-semibold">Breakdown Charge:</span>
                  <span className='font-semibold'>{displayINRCurrency(serviceHistory?.breakdownCharge)}</span>
                </div>}
              {/* Service charge */}
              {serviceHistory?.serviceCharge > 0 &&
                <div className="flex justify-between pb-2 border-b">
                  <span className="font-semibold">Service Charge:</span>
                  <span>{displayINRCurrency(serviceHistory?.serviceCharge)}</span>
                </div>}
              {/* GST */}
              {serviceHistory?.GST > 0 &&
                <div className="flex justify-between pb-1">
                  <span className="font-semibold">GST: {serviceHistory.GST}% </span>
                  <span className='font-semibold'>{displayINRCurrency(serviceHistory?.GST)}</span>
                </div>}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between py-2 border-t mt-4">
              <span className="font-semibold text-lg">Grand Total:</span>
              <span className="font-semibold text-lg">{displayINRCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Pay button */}
          <div className="w-full bg-white p-4 border-t">
            <button
              onClick={handlePayment}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Pay {displayINRCurrency(totalAmount)}
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default PaymentPopup;
