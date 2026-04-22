import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const orderData = location.state || {
        orderId: 'ORD-' + Date.now(),
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        pickupTime: 'ASAP'
    };

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        setErrors({});
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            const formatted = value
                .replace(/\s/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim()
                .substring(0, 19);
            setCardDetails({ ...cardDetails, [name]: formatted });
        } else {
            setCardDetails({ ...cardDetails, [name]: value });
        }
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateCard = () => {
        const newErrors = {};
        
        if (!cardDetails.cardNumber.replace(/\s/g, '')) {
            newErrors.cardNumber = 'Card number required';
        } else if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }
        
        if (!cardDetails.cardHolder) {
            newErrors.cardHolder = 'Card holder name required';
        }
        
        if (!cardDetails.expiry) {
            newErrors.expiry = 'Expiry date required';
        } else if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            newErrors.expiry = 'Use MM/YY format';
        }
        
        if (!cardDetails.cvv) {
            newErrors.cvv = 'CVV required';
        } else if (cardDetails.cvv.length < 3) {
            newErrors.cvv = 'CVV must be 3 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (isProcessing) {
            alert('Payment is already processing...');
            return;
        }
        
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }
        
        setIsProcessing(true);
        
        const paymentStatus = paymentMethod === 'card' ? 'Complete' : 'Pending';
        
        const itemsData = orderData.items?.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category || 'General'
        })) || [];
        
        const paymentData = {
            orderId: orderData.orderId,
            customerName: 'Guest',  // ✅ Fixed - customerName defined
            items: itemsData,
            amount: orderData.total,
            method: paymentMethod === 'card' ? 'Card' : paymentMethod === 'cash' ? 'Cash' : 'Online',
            receipt: paymentMethod === 'card',
            status: paymentStatus,
            pickupTime: orderData.pickupTime
        };
        
        try {
            const token = localStorage.getItem("mm_token");
            const response = await axios.post(`${apiBaseUrl}/payments`, paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const result = response.data;
            
            if (!result.success) {
                alert(result.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }
            
            console.log('✅ Payment saved to database:', result);
            
            if (paymentMethod === 'card') {
                if (validateCard()) {
                    navigate('/payment-success', {
                        state: {
                            orderId: orderData.orderId,
                            paymentId: result.payment?.paymentId,
                            date: new Date().toLocaleString(),
                            items: orderData.items,
                            subtotal: orderData.subtotal,
                            tax: orderData.tax,
                            total: orderData.total,
                            pickupTime: orderData.pickupTime,
                            paymentMethod: 'card'
                        }
                    });
                }
            } else {
                navigate('/payment-success', {
                    state: {
                        orderId: orderData.orderId,
                        paymentId: result.payment?.paymentId,
                        date: new Date().toLocaleString(),
                        customerName: 'Guest',
                        items: orderData.items,
                        subtotal: orderData.subtotal,
                        tax: orderData.tax,
                        total: orderData.total,
                        pickupTime: orderData.pickupTime,
                        paymentMethod: paymentMethod
                    }
                });
            }
        } catch (err) {
            console.error('❌ Error saving payment:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem("mm_token");
                localStorage.removeItem("mm_user");
                navigate("/login");
                return;
            }
            const errorMsg = err.response?.data?.message || 'Payment failed. Please try again.';
            alert(errorMsg);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fef9ed] flex justify-center items-center p-4">
            <div className="max-w-md w-full bg-[#f8f3e7] rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-[#1d1c15] mb-6">Payment</h1>
                
                {/* Order Summary */}
                <div className="bg-[#ece8dc] rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-[#1d1c15] mb-3">Order Summary</h3>
                    <p className="text-sm text-[#58423a] pb-2 border-b border-[#dfc0b5]">Order ID: {orderData.orderId}</p>
                    
                    <div className="py-3 space-y-2">
                        {orderData.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-[#58423a]">{item.name} x {item.quantity}</span>
                                <span className="font-medium text-[#1d1c15]">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-[#dfc0b5] pt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#58423a]">Subtotal:</span>
                            <span className="text-[#1d1c15]">Rs. {orderData.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#58423a]">Tax (8%):</span>
                            <span className="text-[#1d1c15]">Rs. {orderData.tax?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#dfc0b5] mt-2">
                            <span className="text-[#1d1c15]">Total:</span>
                            <span className="text-[#7c2800]">Rs. {orderData.total?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h3 className="font-semibold text-[#1d1c15] mb-3">Select Payment Method</h3>
                    
                    <div 
                        className={`flex items-center p-4 border-2 rounded-xl mb-3 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[#7c2800] bg-[#ffdbcf]' : 'border-[#dfc0b5] bg-[#f2eee2] hover:border-[#7c2800]'}`}
                        onClick={() => handlePaymentMethodChange('cash')}
                    >
                        <input type="radio" checked={paymentMethod === 'cash'} readOnly className="mr-3 w-4 h-4 accent-[#7c2800]" />
                        <div className="flex-1">
                            <strong className="block text-[#1d1c15]">Cash at Counter</strong>
                            <small className="text-[#58423a]">Pay when you pick up your order</small>
                        </div>
                    </div>

                    <div 
                        className={`flex items-center p-4 border-2 rounded-xl mb-3 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#7c2800] bg-[#ffdbcf]' : 'border-[#dfc0b5] bg-[#f2eee2] hover:border-[#7c2800]'}`}
                        onClick={() => handlePaymentMethodChange('card')}
                    >
                        <input type="radio" checked={paymentMethod === 'card'} readOnly className="mr-3 w-4 h-4 accent-[#7c2800]" />
                        <div className="flex-1">
                            <strong className="block text-[#1d1c15]">Credit / Debit Card</strong>
                            <small className="text-[#58423a]">Visa, Mastercard, RuPay</small>
                        </div>
                    </div>

                    <div 
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[#7c2800] bg-[#ffdbcf]' : 'border-[#dfc0b5] bg-[#f2eee2] hover:border-[#7c2800]'}`}
                        onClick={() => handlePaymentMethodChange('online')}
                    >
                        <input type="radio" checked={paymentMethod === 'online'} readOnly className="mr-3 w-4 h-4 accent-[#7c2800]" />
                        <div className="flex-1">
                            <strong className="block text-[#1d1c15]">Online Payment</strong>
                            <small className="text-[#58423a]">Digital wallet, UPI, Net Banking</small>
                        </div>
                    </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                    <div className="bg-[#ece8dc] rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-[#1d1c15] mb-3">Card Details</h3>
                        
                        <div className="mb-3">
                            <label className="block text-sm text-[#58423a] mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="0000 0000 0000 0000"
                                value={cardDetails.cardNumber}
                                onChange={handleCardChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${errors.cardNumber ? 'border-red-500' : 'border-[#dfc0b5]'}`}
                            />
                            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm text-[#58423a] mb-1">Card Holder Name</label>
                            <input
                                type="text"
                                name="cardHolder"
                                placeholder="John Doe"
                                value={cardDetails.cardHolder}
                                onChange={handleCardChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${errors.cardHolder ? 'border-red-500' : 'border-[#dfc0b5]'}`}
                            />
                            {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm text-[#58423a] mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={handleCardChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${errors.expiry ? 'border-red-500' : 'border-[#dfc0b5]'}`}
                                />
                                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-[#58423a] mb-1">CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    placeholder="***"
                                    maxLength={3}
                                    value={cardDetails.cvv}
                                    onChange={handleCardChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${errors.cvv ? 'border-red-500' : 'border-[#dfc0b5]'}`}
                                />
                                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/cart')}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-[#ece8dc] text-[#58423a] rounded-lg font-semibold hover:bg-[#dfc0b5] transition disabled:opacity-50"
                    >
                        ← Back to Cart
                    </button>
                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-gradient-to-br from-[#a43700] to-[#cd4700] text-white rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : `Pay Rs. ${orderData.total?.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;