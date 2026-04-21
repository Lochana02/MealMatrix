import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders.reverse());
        
        const savedFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        setFeedbacks(savedFeedbacks);
    }, []);

    const hasFeedback = (orderId) => {
        return feedbacks.some(fb => fb.orderId === orderId);
    };

    const handleGiveFeedback = (order) => {
        navigate('/feedback', {
            state: {
                orderId: order.orderId,
                orderItems: order.items,
                orderTotal: order.total
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-6">
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-5">
                <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 m-0">My Orders</h1>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition shadow-md"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="max-w-md mx-auto mt-20 text-center bg-white rounded-2xl p-10 shadow-xl">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-500 mb-5">No orders yet</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
                    >
                        Start Ordering
                    </button>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white rounded-xl p-5 mb-5 shadow-md hover:shadow-lg transition">
                            {/* Order Header - Clickable */}
                            <div className="cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg text-gray-800">{order.orderId}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status?.toLowerCase() === 'completed' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400">{formatDate(order.date)}</div>
                            </div>
                            
                            {/* Items List */}
                            <div className="flex flex-wrap gap-2 my-3 py-2 border-t border-b border-gray-100">
                                {order.items?.map((item, i) => (
                                    <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span className="text-gray-400 text-xs ml-1">x{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-gray-400 text-sm">Total:</span>
                                    <strong className="text-green-600 text-lg">Rs. {order.total?.toFixed(2)}</strong>
                                </div>
                                {order.status === 'Pending' && (
                                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                                        Awaiting Payment
                                    </div>
                                )}
                                {order.status === 'Completed' && !hasFeedback(order.orderId) && (
                                    <button 
                                        className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-600 transition"
                                        onClick={() => handleGiveFeedback(order)}
                                    >
                                        Give Feedback
                                    </button>
                                )}
                                {order.status === 'Completed' && hasFeedback(order.orderId) && (
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                        ✅ Feedback Given
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b">
                            <h2 className="text-xl font-bold text-gray-800 m-0">Order Details</h2>
                            <button className="bg-none border-none text-2xl text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>
                        
                        <div className="p-5">
                            {/* Order Info */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Order ID:</span>
                                    <strong className="text-gray-800">{selectedOrder.orderId}</strong>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="text-gray-700">{formatDate(selectedOrder.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        selectedOrder.status?.toLowerCase() === 'completed' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {selectedOrder.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Items */}
                            <h3 className="font-semibold text-gray-800 mb-3">Items Ordered</h3>
                            <div className="mb-5 space-y-2">
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <div>
                                            <span className="font-medium text-gray-700">{item.name}</span>
                                            <span className="text-gray-400 text-sm ml-2">x{item.quantity}</span>
                                        </div>
                                        <span className="text-gray-600">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Totals */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Subtotal:</span>
                                    <span>Rs. {selectedOrder.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Tax (8%):</span>
                                    <span>Rs. {selectedOrder.tax?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t-2 border-gray-200 font-bold text-green-600">
                                    <span>Total:</span>
                                    <span>Rs. {selectedOrder.total?.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {/* Pickup Info */}
                            <div className="bg-blue-50 p-4 rounded-xl mb-5">
                                <div className="flex gap-3">
                                    <span className="text-2xl">📍</span>
                                    <div>
                                        <p className="font-bold text-gray-800">Pickup Counter</p>
                                        <p className="text-sm text-gray-600">Counter 3 (North Wing)</p>
                                        <p className="text-sm text-gray-600">Ready in 12 minutes</p>
                                        {selectedOrder.paymentMethod === 'Cash' && (
                                            <p className="text-sm text-orange-600 font-semibold mt-1">Please pay at counter</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Button in Modal */}
                            {!hasFeedback(selectedOrder.orderId) && selectedOrder.status === 'Completed' && (
                                <button 
                                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition mt-2"
                                    onClick={() => {
                                        setSelectedOrder(null);
                                        handleGiveFeedback(selectedOrder);
                                    }}
                                >
                                    Give Feedback
                                </button>
                            )}
                            {hasFeedback(selectedOrder.orderId) && (
                                <div className="bg-green-100 text-green-700 text-center py-3 rounded-xl text-sm">
                                    ✅ You have already given feedback for this order
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t text-right">
                            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600" onClick={() => setSelectedOrder(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;