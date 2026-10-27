const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// GET: Lay danh sach va tim kiem nhan vien
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Loi lay danh sach nhan vien', error: error.message });
  }
});

// GET: Lay chi tiet nhan vien
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Khong tim thay nhan vien' });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'ID nhan vien khong hop le', error: error.message });
  }
});

// POST: Them nhan vien
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Khong the them nhan vien', error: error.message });
  }
});

// PUT: Cap nhat nhan vien
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Khong tim thay nhan vien' });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Khong the cap nhat nhan vien', error: error.message });
  }
});

// DELETE: Xoa nhan vien
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Khong tim thay nhan vien' });
    }

    res.json({ message: 'Xoa nhan vien thanh cong', employee });
  } catch (error) {
    res.status(400).json({ message: 'Khong the xoa nhan vien', error: error.message });
  }
});

module.exports = router;
