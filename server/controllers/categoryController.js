const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  { name: "Food", color: "#f97316" },
  { name: "Transport", color: "#3b82f6" },
  { name: "Shopping", color: "#ec4899" },
  { name: "Entertainment", color: "#8b5cf6" },
  { name: "Health", color: "#ef4444" },
  { name: "Utilities", color: "#eab308" },
  { name: "Education", color: "#22c55e" },
  { name: "Other", color: "#6b7280" },
];

// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ createdAt: 1 });
    // Seed defaults for new users
    if (categories.length === 0) {
      categories = await Category.insertMany(
        DEFAULT_CATEGORIES.map((c) => ({ ...c, user: req.user._id }))
      );
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const exists = await Category.findOne({ user: req.user._id, name: name.trim() });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ user: req.user._id, name: name.trim(), color: color || "#6366f1" });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    const { name, color } = req.body;
    if (name) category.name = name.trim();
    if (color) category.color = color;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
