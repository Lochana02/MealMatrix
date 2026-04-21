import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    paymentId: {
        type: String,
        unique: true,
        sparse: true
    },
    orderId: {
    type: String,
    required: true,
    default: () => 'ORD-' + Date.now()  // default value
},
    customerName: {
        type: String,
        default: 'Guest'
    },
    items: {
        type: Array,
        default: [],
        required: true
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0.01 
    },
    method: { 
        type: String, 
        enum: ["Cash", "Card", "Online"], 
        required: true 
    },
    receipt: { 
        type: Boolean, 
        default: false 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Complete"], 
        default: "Pending"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("Payment", paymentSchema);