import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyModal, setReplyModal] = useState({ open: false, feedback: null, replyText: '' });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Helper to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem("mm_token");
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem("mm_token");
            if (!token) {
                console.error('No token found. Please login.');
                setLoading(false);
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/feedback', {
                headers: getAuthHeaders()
            });

            if (response.status === 401) {
                localStorage.removeItem("mm_token");
                navigate('/login');
                return;
            }

            const data = await response.json();
            console.log('Feedbacks:', data);
            setFeedbacks(data.feedbacks || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setLoading(false);
        }
    };

    const handleReply = async () => {
        const { feedback, replyText } = replyModal;
        if (!replyText.trim()) {
            alert('Please enter a reply');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/feedback/${feedback._id}/reply`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ reply: replyText })
            });

            if (response.ok) {
                await fetchFeedbacks();
                setReplyModal({ open: false, feedback: null, replyText: '' });
                alert('Reply sent successfully!');
            } else if (response.status === 401) {
                localStorage.removeItem("mm_token");
                navigate('/login');
            } else {
                alert('Failed to send reply');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to send reply');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/feedback/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    await fetchFeedbacks();
                    alert('Feedback deleted successfully!');
                } else if (response.status === 401) {
                    localStorage.removeItem("mm_token");
                    navigate('/login');
                } else {
                    alert('Failed to delete feedback');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Failed to delete feedback');
            }
        }
    };

    const generateReport = () => {
        window.print();
    };

    const totalFeedbacks = feedbacks.length;
    const pendingCount = feedbacks.filter(fb => fb.status === 'Pending').length;
    const repliedCount = feedbacks.filter(fb => fb.status === 'Replied').length;
    const avgRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    const filteredFeedbacks = feedbacks.filter(fb => {
        const matchesSearch = searchTerm === '' ||
            fb.feedbackId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fb.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fb.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fb.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filter === 'all' ||
            (filter === 'pending' && fb.status === 'Pending') ||
            (filter === 'replied' && fb.status === 'Replied');

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className="min-h-screen bg-[#f2eee4] flex items-center justify-center text-stone-600">Loading feedbacks...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f2eee4] text-[#2f2f2f] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#f7f5ef] border-r border-stone-200 px-6 py-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#7d290f] italic mb-8">The MealMatrix Canteen</h2>
                    <div className="mb-8 bg-[#f3ede1] rounded-xl p-3">
                        <div className="font-semibold leading-tight text-[#8f2f12]">Feedback</div>
                        <div className="font-semibold leading-tight text-[#8f2f12]">Management</div>
                        <div className="text-xs text-stone-500">Customer Insights</div>
                    </div>
                    <nav className="space-y-1 text-sm">
                        <div className="px-3 py-2 rounded-lg text-stone-500">Dashboard</div>
                        <div className="px-3 py-2 rounded-lg bg-[#efe4d4] text-[#8f2f12] font-semibold">Feedbacks</div>
                    </nav>
                    <button
                        onClick={generateReport}
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
                        <h1 className="text-5xl font-extrabold text-stone-900">Feedback Ledger</h1>
                        <p className="text-stone-600 mt-2 text-xl max-w-3xl">
                            Review and respond to customer feedback.
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
                        <p className="text-xs uppercase tracking-wide text-stone-500">Total Feedbacks</p>
                        <p className="text-4xl font-extrabold text-[#8f2f12] mt-1">{totalFeedbacks}</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Average Rating</p>
                        <p className="text-4xl font-extrabold text-[#154d9b] mt-1">{avgRating} ★</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Pending</p>
                        <p className="text-4xl font-extrabold text-yellow-600 mt-1">{pendingCount}</p>
                    </div>
                    <div className="bg-[#f7f3e8] p-4 rounded-xl border border-stone-200">
                        <p className="text-xs uppercase tracking-wide text-stone-500">Replied</p>
                        <p className="text-4xl font-extrabold text-green-700 mt-1">{repliedCount}</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-[420px]">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Feedback ID, Order ID, Name, or Email..."
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
                            className={`px-4 py-2 rounded-lg text-sm transition ${filter === 'replied' ? 'bg-[#c44d0f] text-white' : 'bg-[#f7f3e8] border border-stone-200'}`}
                            onClick={() => setFilter('replied')}
                        >
                            Replied
                        </button>
                    </div>
                </div>

                {/* Feedback Table */}
                <div className="bg-[#f7f3e8] border border-stone-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="text-stone-600 uppercase text-xs bg-[#f2ecdf]">
                            <tr>
                                <th className="text-left px-5 py-4">Feedback ID</th>
                                <th className="text-left px-5 py-4">Order ID</th>
                                <th className="text-left px-5 py-4">Customer</th>
                                <th className="text-left px-5 py-4">Rating</th>
                                <th className="text-left px-5 py-4">Comment</th>
                                <th className="text-left px-5 py-4">Reply</th>
                                <th className="text-left px-5 py-4">Status</th>
                                <th className="text-left px-5 py-4">Date</th>
                                <th className="text-right px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-5 py-8 text-center text-stone-500">
                                        No feedbacks found.
                                    </td>
                                </tr>
                            ) : (
                                filteredFeedbacks.map((fb) => (
                                    <tr key={fb._id} className="border-t border-stone-200">
                                        <td className="px-5 py-4 font-mono text-xs text-stone-500">{fb.feedbackId || '-'}</td>
                                        <td className="px-5 py-4 text-[#1f5ca9] font-semibold">{fb.orderId}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-stone-200 text-xs font-bold flex items-center justify-center">
                                                    {fb.name?.[0]?.toUpperCase() || 'G'}
                                                </div>
                                                <span className="font-semibold text-stone-800">{fb.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star} className={`text-sm ${star <= fb.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-stone-600 italic leading-5 max-w-xs truncate">{fb.comment}</td>
                                        <td className="px-5 py-4 text-stone-600 italic leading-5 max-w-xs truncate">
                                            {fb.reply ? <span className="text-green-700">{fb.reply}</span> : <span className="text-gray-400">No reply</span>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                fb.status === 'Replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {fb.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-stone-500">{formatDate(fb.createdAt)}</td>
                                        <td className="px-5 py-4 text-right">
                                            {fb.status === 'Pending' && (
                                                <button
                                                    onClick={() => setReplyModal({ open: true, feedback: fb, replyText: '' })}
                                                    className="text-[#1f5ca9] font-semibold mr-4"
                                                >
                                                    Reply
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(fb._id)}
                                                className="text-red-600 font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Extra Info Cards */}
                <div className="grid grid-cols-3 gap-5 mt-8">
                    <div className="col-span-2 bg-[#f7f3e8] border border-stone-200 rounded-2xl p-6">
                        <h3 className="text-3xl font-bold text-stone-900 mb-3">Feedback Insights</h3>
                        <p className="text-stone-600 text-lg max-w-2xl">
                            Customer satisfaction is at {avgRating} out of 5. Keep up the good work!
                        </p>
                        <button className="mt-6 border border-[#c44d0f] text-[#c44d0f] px-5 py-2 rounded-full font-semibold">
                            Analyze Trends
                        </button>
                    </div>
                    <div className="bg-[#145fb5] rounded-2xl p-6 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pending Replies</h3>
                            <p className="text-base text-blue-100">
                                {pendingCount} feedbacks awaiting your response.
                            </p>
                        </div>
                        <button
                            onClick={() => setFilter('pending')}
                            className="mt-6 bg-white text-[#145fb5] py-2.5 rounded-lg font-semibold"
                        >
                            Review Pending
                        </button>
                    </div>
                </div>
            </main>

            {/* Reply Modal (same style as before) */}
            {replyModal.open && (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={() => setReplyModal({ open: false, feedback: null, replyText: '' })}>
                    <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-auto p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-3xl font-bold mb-4">Reply to Feedback</h2>
                        <div className="bg-gray-50 rounded-xl p-4 mb-5">
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Order ID</span><span className="font-semibold">{replyModal.feedback?.orderId}</span></div>
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Customer</span><span className="text-gray-700">{replyModal.feedback?.name}</span></div>
                            <div className="flex justify-between mb-3"><span className="text-gray-500">Rating</span><span className="text-yellow-500">{replyModal.feedback?.rating} ★</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Comment</span><span className="text-gray-700 italic">"{replyModal.feedback?.comment}"</span></div>
                        </div>
                        <textarea
                            value={replyModal.replyText}
                            onChange={(e) => setReplyModal({ ...replyModal, replyText: e.target.value })}
                            placeholder="Type your reply here..."
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setReplyModal({ open: false, feedback: null, replyText: '' })} className="px-4 py-2 bg-stone-200 rounded-lg font-semibold">Cancel</button>
                            <button onClick={handleReply} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Send Reply</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;