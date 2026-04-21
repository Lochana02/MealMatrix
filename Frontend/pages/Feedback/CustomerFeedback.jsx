import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClientFeedback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 0,
        comment: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (formData.rating === 0) {
            newErrors.rating = 'Please select a rating';
        }
        if (!formData.comment.trim()) {
            newErrors.comment = 'Comment is required';
        } else if (formData.comment.length < 5) {
            newErrors.comment = 'Comment must be at least 5 characters';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleRating = (rating) => {
        setFormData({ ...formData, rating });
        if (errors.rating) {
            setErrors({ ...errors, rating: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setLoading(true);
        
        try {
            const token = localStorage.getItem('mm_token');
            
            const payload = {
                name: formData.name,
                email: formData.email,
                rating: formData.rating,
                comment: formData.comment
            };
            
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', rating: 0, comment: '' });
                setTimeout(() => setSubmitted(false), 3000);
            } else if (response.status === 401) {
                alert('Your session has expired. Please login again.');
                navigate('/login');
            } else {
                alert(result.message || 'Failed to submit feedback');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fef9ed] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1d1c15]">Customer Feedback</h1>
                    <p className="text-[#58423a] mt-2">Share your experience with us</p>
                </div>

                {/* Success Message */}
                {submitted && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
                        ✅ Thank you for your feedback!
                    </div>
                )}

                {/* Feedback Form */}
                <div className="bg-[#f8f3e7] rounded-2xl shadow-md p-6 border border-[#dfc0b5]">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-[#1d1c15] font-medium mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${
                                    errors.name ? 'border-red-500' : 'border-[#dfc0b5]'
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-[#1d1c15] font-medium mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${
                                    errors.email ? 'border-red-500' : 'border-[#dfc0b5]'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Rating */}
                        <div className="mb-4">
                            <label className="block text-[#1d1c15] font-medium mb-2">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className={`text-3xl transition ${
                                            star <= formData.rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-[#1d1c15] font-medium mb-2">
                                Comment <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Tell us about your experience..."
                                rows="4"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c2800] bg-white ${
                                    errors.comment ? 'border-red-500' : 'border-[#dfc0b5]'
                                }`}
                            />
                            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/my-orders')}
                                className="flex-1 py-2 bg-[#ece8dc] text-[#58423a] rounded-lg font-semibold hover:bg-[#dfc0b5] transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-gradient-to-br from-[#a43700] to-[#cd4700] text-white rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientFeedback;