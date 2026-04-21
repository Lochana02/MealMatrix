import Category from "../models/category.js";

// GET ALL
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CREATE
const createCategory = async (req, res) => {
  try {
    const { name, description, items, status } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const newCategory = new Category({
      name,
      description,
      items: Number(items) || 0,
      status: status || "Active",
    });

    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.body.items !== undefined ? { items: Number(req.body.items) || 0 } : {}),
    };

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ EXPORT (IMPORTANT)
export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};