import TimeSlot from "../models/TimeSlot.js";

export const createSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSlots = async (req, res) => {
  const slots = await TimeSlot.find({ status: { $ne: "Inactive" } });
  res.json(slots);
};

export const getSlotById = async (req, res) => {
  try {
    const slot = await TimeSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSlot = async (req, res) => {
  const slot = await TimeSlot.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(slot);
};

export const deleteSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true }
    );
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deactivated", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};