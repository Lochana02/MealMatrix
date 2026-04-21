import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPayment = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Helper function to get auth headers using 'mm_token'
    const getAuthHeaders = () => {
        const token = localStorage.getItem('mm_token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        const token = localStorage.getItem('mm_token');
        if (!token) {
            console.error('No token found. Please login.');
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/payments', {
                headers: getAuthHeaders()
            });

            if (response.status === 401) {
                localStorage.removeItem('mm_token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            console.log('Payments from backend:', data);
            
            const payments = data.payments || [];
            const formattedOrders = payments.map(payment => ({
                id: payment._id,
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                date: new Date(payment.createdAt).toLocaleDateString(),
                items: payment.items || [],
                amount: payment.amount,
                method: payment.method,
                status: payment.status === 'Complete' || payment.status === 'completed' ? 'Completed' : 'Pending'
                // customerName removed
            }));
            
            setOrders(formattedOrders);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setLoading(false);
        }
    };

    const updateStatus = async (orderId) => {
        const token = localStorage.getItem('mm_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/payments', {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            const payment = data.payments?.find(p => p.orderId === orderId);
            
            if (!payment) {
                alert('Payment not found!');
                return;
            }
            
            const updateResponse = await fetch(`http://localhost:5000/api/payments/${payment._id}/status`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: 'Complete' })
            });
            
            if (updateResponse.ok) {
                await fetchPayments();
                alert('Order status updated to Completed!');
            } else if (updateResponse.status === 401) {
                localStorage.removeItem('mm_token');
                navigate('/login');
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('⚠️ Are you sure you want to delete this order?')) return;

        const token = localStorage.getItem('mm_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/payments', {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            const payment = data.payments?.find(p => p.orderId === orderId);
            
            if (!payment) {
                alert('Payment not found!');
                return;
            }
            
            const deleteResponse = await fetch(`http://localhost:5000/api/payments/${payment._id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            if (deleteResponse.ok) {
                await fetchPayments();
                alert('✅ Order deleted successfully!');
                if (selectedOrder && selectedOrder.orderId === orderId) {
                    setSelectedOrder(null);
                }
            } else if (deleteResponse.status === 401) {
                localStorage.removeItem('mm_token');
                navigate('/login');
            } else {
                alert('❌ Failed to delete order');
            }
        } catch (err) {
            console.error('Error deleting order:', err);
            alert('❌ Failed to delete order');
        }
    };

    const downloadPDFReport = () => {
        const totalSales = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const completedOrders = orders.filter(o => o.status === 'Completed').length;
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head><title>Payment Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .company-header { margin-bottom: 30px; border-bottom: 2px solid #333; }
                .company-name { font-size: 20px; font-weight: bold; }
                .company-address, .company-phone { font-size: 12px; color: #666; }
                h1 { text-align: center; }
                .summary { background: #f5f5f5; padding: 15px; margin-bottom: 30px; }
                .summary-row { display: flex; justify-content: space-between; margin: 8px 0; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f0f0f0; }
                .footer { text-align: center; margin-top: 40px; color: #888; }
                button { padding: 10px 20px; background: #667eea; color: white; border: none; cursor: pointer; }
            </style>
            </head>
            <body>
                <div class="company-header">
                    <div class="company-name">MEALMATRIX CANTEEN</div>
                    <div class="company-address">123 Main Street, Colombo 01, Sri Lanka</div>
                    <div class="company-phone">+94 11 234 5678 | info@mealmatrix.lk</div>
                </div>
                <h1>PAYMENT REPORT</h1>
                <div class="date">Generated: ${new Date().toLocaleString()}</div>
                <div class="summary">
                    <h3>SUMMARY</h3>
                    <div class="summary-row"><strong>Total Orders:</strong> ${orders.length}</div>
                    <div class="summary-row"><strong>Total Sales:</strong> Rs. ${totalSales.toFixed(2)}</div>
                    <div class="summary-row"><strong>Completed:</strong> ${completedOrders}</div>
                    <div class="summary-row"><strong>Pending:</strong> ${pendingOrders}</div>
                </div>
                <h3>ORDER DETAILS</h3>
                <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr><th>Payment ID</th><th>Order ID</th><th>Items</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>${order.paymentId || '-'}</td>
                                <td>${order.orderId}</td>
                                <td>${order.items?.map(i => i.name).join(', ') || '-'}</td>
                                <td>Rs. ${order.amount?.toFixed(2)}</td>
                                <td>${order.method}</td>
                                <td>${order.status}</td>
                                <td>${order.date}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">Generated by MealMatrix System</div>
                <div style="text-align:center; margin-top:20px;"><button onclick="window.print();">Save as PDF</button></div>
                <script>setTimeout(() => window.print(), 500);</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Removed customerName from search filter
    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchTerm === '' || 
            order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filter === 'all' || 
            order.status?.toLowerCase() === filter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    const totalSales = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    if (loading) {
        return <div className="min-h-screen bg-[#f2eee4] flex items-center justify-center text-stone-600">Loading payments...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f2eee4] text-[#2f2f2f] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#f7f5ef] border-r border-stone-200 px-6 py-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#7d290f] italic mb-8">The MealMatrix Canteen</h2>
                    <div className="mb-8 bg-[#f3ede1] rounded-xl p-3">
                        <div className="font-semibold leading-tight text-[#8f2f12]">Finance</div>
                        <div className="font-semibold leading-tight text-[#8f2f12]">Ledger</div>
                        <div className="text-xs text-stone-500">Payment Hub</div>
                    </div>
                    <nav className="space-y-1 text-sm">
                        <div className="px-3 py-2 rounded-lg text-stone-500">Dashboard</div>
                        <div className="px-3 py-2 rounded-lg bg-[#efe4d4] text-[#8f2f12] font-semibold">Payments</div>
                        <div className="px-3 py-2 rounded-lg text-stone-500">Orders</div>
                    </nav>
                    <button
                        onClick={downloadPDFReport}
                        className="mt-8 w-full bg-[#c44d0f] hover:bg-[#ad430c] text-white py-3 rounded-lg font-semibold"
                    >
                        Generate Report
                    </button>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('mm_token');
                        navigate('/login');
                    }}
                    className="text-left text-sm text-stone-500 px-2"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-5xl font-extrabold text-stone-900">Payment Ledger</h1>
                        <p className="text-stone-600 mt-2 text-xl max-w-3xl">
                            Track all financial transactions and order payments.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin-dashboard')}
                        className="bg-[#0b3155] hover:bg-[#0a2a49] text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        ← Back to Dashboard
                    </button>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Total Orders</p>
                        <p className="text-4xl font-extrabold text-[#8f2f12] mt-1">{orders.length}</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Total Sales</p>
                        <p className="text-4xl font-extrabold text-[#154d9b] mt-1">LKR {totalSales.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Completed</p>
                        <p className="text-4xl font-extrabold text-green-700 mt-1">{completedOrders}</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Pending</p>
                        <p className="text-4xl font-extrabold text-yellow-600 mt-1">{pendingOrders}</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-[420px]">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Payment ID or Order ID..."
                            className="w-full bg-[#f7f3e8] border border-stone-200 rounded-xl px-4 py-2.5 outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm transition ${filter === 'all' ? 'bg-[#c44d0f] text-white' : 'bg-[#f7f3e8] border border-stone-200'}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm transition ${filter === 'pending' ? 'bg-[#c44d0f] text-white' : 'bg-[#f7f3e8] border border-stone-200'}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm transition ${filter === 'completed' ? 'bg-[#c44d0f] text-white' : 'bg-[#f7f3e8] border border-stone-200'}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Payments Table - Customer column removed */}
                <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="text-stone-600 uppercase text-xs bg-[#f2ecdf]">
                            <tr>
                                <th className="text-left px-5 py-4">Payment ID</th>
                                <th className="text-left px-5 py-4">Order ID</th>
                                <th className="text-left px-5 py-4">Items</th>
                                <th className="text-left px-5 py-4">Amount</th>
                                <th className="text-left px-5 py-4">Method</th>
                                <th className="text-left px-5 py-4">Status</th>
                                <th className="text-left px-5 py-4">Date</th>
                                <th className="text-right px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-5 py-8 text-center text-stone-500">
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                            {filteredOrders.map((order, idx) => (
                                <tr key={idx} className="border-t border-stone-200">
                                    <td className="px-5 py-4 font-mono text-xs text-stone-500">{order.paymentId || '-'}</td>
                                    <td className="px-5 py-4 text-[#1f5ca9] font-semibold">{order.orderId}</td>
                                    <td className="px-5 py-4 text-stone-600 italic leading-5">
                                        {order.items?.slice(0, 2).map(i => i.name).join(', ') || '-'}
                                        {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-green-700">LKR {order.amount?.toFixed(2)}</td>
                                    <td className="px-5 py-4">{order.method}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-stone-500">{order.date}</td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[#1f5ca9] font-semibold mr-4"
                                        >
                                            View
                                        </button>
                                        {order.status === 'Pending' && (
                                            <button
                                                onClick={() => updateStatus(order.orderId)}
                                                className="text-green-600 font-semibold mr-4"
                                            >
                                                Complete
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteOrder(order.orderId)}
                                            className="text-red-600 font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Extra Info Cards */}
                <div className="grid grid-cols-3 gap-5 mt-8">
                    <div className="col-span-2 bg-[#f7f3e8] border border-stone-200 rounded-2xl p-6">
                        <h3 className="text-3xl font-bold text-stone-900 mb-3">Payment Insights</h3>
                        <p className="text-stone-600 text-lg max-w-2xl">
                            Most orders are paid via Card (65%). Cash payments are mostly completed on pickup.
                        </p>
                        <button className="mt-6 border border-[#c44d0f] text-[#c44d0f] px-5 py-2 rounded-full font-semibold">
                            Analyze Revenue
                        </button>
                    </div>
                    <div className="bg-[#145fb5] rounded-2xl p-6 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pending Revenue</h3>
                            <p className="text-base text-blue-100">
                                LKR {orders.filter(o => o.status === 'Pending').reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)} awaiting completion.
                            </p>
                        </div>
                        <button className="mt-6 bg-white text-[#145fb5] py-2.5 rounded-lg font-semibold">
                            Review Pending
                        </button>
                    </div>
                </div>
            </main>

            {/* Order Details Modal - customer name removed */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-3xl font-bold mb-4">Order Details</h2>
                        <div className="bg-gray-50 rounded-xl p-4 mb-5">
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Payment ID</span><span className="font-mono text-sm">{selectedOrder.paymentId || '-'}</span></div>
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Order ID</span><span className="font-semibold">{selectedOrder.orderId}</span></div>
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Date</span><span className="text-gray-700 text-sm">{selectedOrder.date}</span></div>
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Payment Method</span><span className="text-gray-700">{selectedOrder.method}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedOrder.status}</span></div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-3 border-l-3 border-orange-500 pl-2">Items Ordered</h3>
                        <div className="bg-gray-50 rounded-xl mb-4 overflow-hidden">
                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0">
                                        <div><span className="text-orange-500 mr-2">•</span><span className="font-medium text-gray-700">{item.name}</span><span className="text-gray-400 text-xs ml-2">Qty: {item.quantity}</span></div>
                                        <span className="font-medium text-green-600">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))
                            ) : <div className="p-3 text-gray-500 text-center">No items found</div>}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex justify-between"><span className="text-gray-600">Total Amount</span><span className="font-bold text-green-600">Rs. {selectedOrder.amount?.toFixed(2)}</span></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-stone-200 rounded-lg font-semibold">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayment;