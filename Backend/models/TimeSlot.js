import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Other Categories"],
    required: true
  },
  pickupStartTime: String,
  pickupEndTime: String,
  maxOrders: Number,
  currentOrders: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Available", "Full", "Inactive"],
    default: "Available"
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("TimeSlot", timeSlotSchema);