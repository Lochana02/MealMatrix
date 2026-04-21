import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const orderData = location.state || {
        orderId: 'ORD-001',
        customerName: 'Nimal',
        items: [{ name: 'Rice & Curry', quantity: 1, price: 500 }],
        total: 500,
        paymentMethod: 'Cash'
    };

    return (
        // Background: from purple-500 to-indigo-600 -> changed to #fef9ed
        <div className="min-h-screen bg-[#fef9ed] flex justify-center items-center p-4">
            {/* Card background: from white -> #f8f3e7 */}
            <div className="bg-[#f8f3e7] rounded-2xl max-w-md w-full p-8 shadow-2xl text-center">
                {/* Title: from green-600 -> #7c2800 */}
                <h1 className="text-3xl font-bold text-[#7c2800] mb-5">✅ Payment Confirmed!</h1>
                
                {/* Info box: from bg-gray-50 -> #ece8dc */}
                <div className="bg-[#ece8dc] p-4 rounded-xl mb-5 text-left">
                    <p className="mb-2"><strong className="text-[#1d1c15]">Order ID:</strong> <span className="text-[#58423a]">{orderData.orderId}</span></p>
                    <p className="mb-2"><strong className="text-[#1d1c15]">Customer:</strong> <span className="text-[#58423a]">{orderData.customerName}</span></p>
                    <p className="mb-2"><strong className="text-[#1d1c15]">Items:</strong> <span className="text-[#58423a]">{orderData.items.map(i => i.name).join(', ')}</span></p>
                    <p className="mb-2"><strong className="text-[#1d1c15]">Total:</strong> <span className="text-[#7c2800] font-bold">Rs. {orderData.total?.toFixed(2)}</span></p>
                    <p className="mb-2"><strong className="text-[#1d1c15]">Payment Method:</strong> <span className="text-[#58423a]">{orderData.paymentMethod}</span></p>
                    <p><strong className="text-[#1d1c15]">Status:</strong> <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm inline-block">Pending</span></p>
                </div>

                {/* Pickup box: from bg-blue-50 -> #e8f4f8 (kept similar) */}
                <div className="bg-[#e8f4f8] p-4 rounded-xl mb-5 text-left">
                    <p className="font-bold text-[#1d1c15] mb-1">📦 Pickup: Canteen Counter</p>
                    <p className="text-sm text-[#58423a]">Please pay at the counter</p>
                    <p className="text-sm text-[#58423a] mt-2">Counter 3</p>
                </div>

                <button 
                    onClick={() => navigate('/')}
                    // Button: from purple-500 to-indigo-600 -> Heirloom gradient
                    className="w-full bg-gradient-to-br from-[#a43700] to-[#cd4700] text-white py-3 rounded-xl font-semibold hover:brightness-110 transition"
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default OrderConfirm;