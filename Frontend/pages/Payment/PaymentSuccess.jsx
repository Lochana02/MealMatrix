import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const orderData = location.state || {
        orderId: 'ORD-123456',
        date: new Date().toLocaleString(),
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        pickupTime: 'ASAP'
    };

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        // Clear the cart on the backend after successful payment
        const clearCart = async () => {
            try {
                const token = localStorage.getItem("mm_token");
                await fetch(`${apiBaseUrl}/cart`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items: [] })
                });
            } catch (err) {
                console.error('Failed to clear cart:', err);
            }
        };
        clearCart();
    }, []);

    const downloadReceipt = () => {
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>Receipt - ${orderData.orderId}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body { 
                    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
                    background: #fef9ed;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .receipt { 
                    max-width: 450px;
                    width: 100%;
                    background: #f8f3e7;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 20px 35px -10px rgba(0,0,0,0.1);
                    border: 1px solid #dfc0b5;
                }
                .header { 
                    text-align: center;
                    margin-bottom: 24px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #7c2800;
                }
                .header h2 { 
                    font-size: 24px;
                    font-weight: 700;
                    color: #1d1c15;
                    margin-bottom: 4px;
                    letter-spacing: -0.3px;
                }
                .header p { 
                    font-size: 12px;
                    color: #58423a;
                    letter-spacing: 0.5px;
                }
                .success { 
                    text-align: center;
                    margin-bottom: 24px;
                }
                .success h3 { 
                    font-size: 24px;
                    font-weight: 700;
                    color: #7c2800;
                }
                .info { 
                    background: #ece8dc;
                    padding: 16px;
                    border-radius: 16px;
                    margin-bottom: 24px;
                    border: 1px solid #dfc0b5;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .info-row:last-child {
                    margin-bottom: 0;
                }
                .info-label { 
                    color: #58423a;
                    font-weight: 500;
                }
                .info-value { 
                    color: #1d1c15;
                    font-weight: 600;
                }
                .status-completed {
                    color: #7c2800;
                    font-weight: 700;
                }
                .section-title { 
                    font-size: 16px;
                    font-weight: 700;
                    color: #1d1c15;
                    margin-bottom: 12px;
                }
                .items-table { 
                    width: 100%;
                    margin-bottom: 20px;
                }
                .items-table th { 
                    text-align: left;
                    padding: 8px 0;
                    font-size: 12px;
                    font-weight: 600;
                    color: #58423a;
                    border-bottom: 1px solid #dfc0b5;
                }
                .items-table td { 
                    padding: 10px 0;
                    font-size: 14px;
                    color: #1d1c15;
                    border-bottom: 1px solid #dfc0b5;
                }
                .items-table td:last-child,
                .items-table th:last-child {
                    text-align: right;
                }
                .totals {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 2px solid #7c2800;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .total-label {
                    color: #58423a;
                }
                .total-value {
                    color: #1d1c15;
                    font-weight: 500;
                }
                .grand-total {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid #dfc0b5;
                    font-size: 18px;
                    font-weight: 700;
                }
                .grand-total .total-label {
                    color: #1d1c15;
                }
                .grand-total .total-value {
                    color: #7c2800;
                    font-size: 18px;
                }
                .pickup-box { 
                    background: #e8f4f8;
                    padding: 16px;
                    border-radius: 16px;
                    margin: 24px 0;
                    text-align: center;
                    border: 1px solid #dfc0b5;
                }
                .pickup-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #1d1c15;
                    margin-bottom: 8px;
                }
                .pickup-text {
                    font-size: 13px;
                    color: #58423a;
                    margin-bottom: 8px;
                }
                .ready-time {
                    font-size: 14px;
                    font-weight: 700;
                    color: #7c2800;
                    margin-top: 8px;
                }
                .footer { 
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid #dfc0b5;
                    font-size: 11px;
                    color: #8c7168;
                }
                button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #a43700, #cd4700);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 20px;
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                @media (max-width: 500px) {
                    .receipt { padding: 20px; }
                    .header h2 { font-size: 20px; }
                    .success h3 { font-size: 20px; }
                }
            </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <h2>MEALMATRIX</h2>
                        <p>CANTEEN PRE-ORDER SYSTEM</p>
                    </div>
                    
                    <div class="success">
                        <h3>✅ Payment Successful!</h3>
                    </div>
                    
                    <div class="info">
                        <div class="info-row">
                            <span class="info-label">Order ID</span>
                            <span class="info-value">${orderData.orderId}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Date & Time</span>
                            <span class="info-value">${orderData.date || new Date().toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Payment Method</span>
                            <span class="info-value">Card</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Status</span>
                            <span class="info-value status-completed">COMPLETED</span>
                        </div>
                    </div>

                    <div class="section-title">Order Items</div>
                    <table class="items-table">
                        <thead>
                            <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            ${orderData.items?.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>Rs. ${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="total-row">
                            <span class="total-label">Subtotal</span>
                            <span class="total-value">Rs. ${orderData.subtotal?.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Tax (8%)</span>
                            <span class="total-value">Rs. ${orderData.tax?.toFixed(2)}</span>
                        </div>
                        <div class="total-row grand-total">
                            <span class="total-label">Total</span>
                            <span class="total-value">Rs. ${orderData.total?.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="pickup-box">
                        <div class="pickup-title">📦 Pickup Instructions</div>
                        <div class="pickup-text">Please have your Order ID or receipt ready to show at the counter.</div>
                        <div class="pickup-text">Before leaving, kindly check your order to ensure all items are correct.</div>
                        <div class="ready-time">Scheduled Pickup: ${orderData.pickupTime || 'ASAP'}</div>
                    </div>

                    <div class="footer">
                        Thank you for ordering with MealMatrix!<br/>
                        Please check your order before leaving
                    </div>

                    <button onclick="window.print()">Save as PDF</button>
                </div>
            </body>
            </html>
        `;
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${orderData.orderId}.html`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#fef9ed] flex justify-center items-center p-4">
            <div className="max-w-md w-full bg-[#f8f3e7] rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-[#7c2800] mb-4">✅ Payment Successful!</h1>
                
                <div className="bg-[#ece8dc] rounded-xl p-4 mb-6">
                    <p className="mb-2 text-[#1d1c15]"><strong>Order ID:</strong> {orderData.orderId}</p>
                    <p className="mb-2 text-[#1d1c15]"><strong>Date:</strong> {orderData.date || new Date().toLocaleString()}</p>
                    <p className="mb-2 text-[#1d1c15]"><strong>Total:</strong> <span className="text-[#7c2800] font-bold">Rs. {orderData.total?.toFixed(2)}</span></p>
                    <p className="text-[#1d1c15]"><strong>Status:</strong> <span className="text-[#7c2800] font-semibold">Completed</span></p>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-[#1d1c15] mb-3">Order Items</h3>
                    <div className="space-y-2">
                        {orderData.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-[#58423a]">{item.name} x {item.quantity}</span>
                                <span className="text-[#1d1c15]">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#dfc0b5] mt-3 pt-3 space-y-1">
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

                <div className="bg-[#e8f4f8] rounded-xl p-4 mb-6 text-center">
                    <h3 className="font-bold text-[#1d1c15] mb-2">Pickup Instructions</h3>
                    <p className="text-sm text-[#58423a] mb-2">Please have your Order ID or receipt ready to show at the counter.</p>
                    <p className="text-sm text-[#58423a] mb-2">Before leaving, kindly check your order to ensure all items are correct.</p>
                    <p className="text-sm text-[#58423a] mb-2">If anything is missing, please inform our staff immediately.</p>
                    <p className="font-semibold text-[#7c2800] mt-3 underline decoration-orange-300">Pickup Time: {orderData.pickupTime || 'ASAP'}</p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={downloadReceipt}
                        className="flex-1 py-3 bg-[#ece8dc] text-[#58423a] rounded-lg font-semibold hover:bg-[#dfc0b5] transition"
                    >
                        Download Receipt
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex-1 py-3 bg-gradient-to-br from-[#a43700] to-[#cd4700] text-white rounded-lg font-semibold hover:brightness-110 transition"
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;