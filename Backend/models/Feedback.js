import mongoose from "mongoose";
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    feedbackId: {
        type: String,
        unique: true
    },
    //orderId: {
        //type: String,
        //required: true,
        //trim: true
    //},
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    reply: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["Pending", "Replied"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Feedback", feedbackSchema);