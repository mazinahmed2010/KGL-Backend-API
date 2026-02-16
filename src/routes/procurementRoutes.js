/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Produce procurement management
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Procurement = require('../models/Procurement');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /procurement:
 *   post:
 *     summary: Record new produce procurement (Manager only)
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - produceName
 *               - produceType
 *               - time
 *               - tonnage
 *               - cost
 *               - dealerName
 *               - branch
 *               - contact
 *               - sellingPrice
 *             properties:
 *               produceName:
 *                 type: string
 *               produceType:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               tonnage:
 *                 type: number
 *                 minimum: 100
 *               cost:
 *                 type: number
 *                 minimum: 10000
 *               dealerName:
 *                 type: string
 *               branch:
 *                 type: string
 *                 enum: [Maganjo, Matugga]
 *               contact:
 *                 type: string
 *               sellingPrice:
 *                 type: number
 *                 minimum: 1000
 *     responses:
 *       201:
 *         description: Procurement recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Managers only
 */
router.post('/',
  protect,
  authorize('Manager'),
  [
    body('produceName').matches(/^[a-zA-Z0-9\s]+$/).withMessage('Produce name must be alphanumeric'),
    body('produceType').isLength({ min: 2 }).withMessage('Produce type must be at least 2 characters')
      .matches(/^[a-zA-Z\s]+$/).withMessage('Produce type must contain only letters'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter valid time (HH:MM)'),
    body('tonnage').isInt({ min: 100 }).withMessage('Tonnage must be at least 100 kg'),
    body('cost').isFloat({ min: 10000 }).withMessage('Cost must be at least 10,000 UgX'),
    body('dealerName').isLength({ min: 2 }).withMessage('Dealer name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Dealer name must be alphanumeric'),
    body('branch').isIn(['Maganjo', 'Matugga']).withMessage('Branch must be Maganjo or Matugga'),
    body('contact').matches(/^[0-9]{10,12}$/).withMessage('Please enter a valid phone number'),
    body('sellingPrice').isFloat({ min: 1000 }).withMessage('Selling price must be at least 1,000 UgX'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const procurementData = {
        ...req.body,
        recordedBy: req.user._id,
        date: req.body.date || new Date()
      };

      const procurement = await Procurement.create(procurementData);

      res.status(201).json({
        success: true,
        data: procurement
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /procurement:
 *   get:
 *     summary: Get all procurement records
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of procurement records
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: procurements.length,
      data: procurements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /procurement/{id}:
 *   get:
 *     summary: Get single procurement record
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Procurement record
 *       404:
 *         description: Record not found
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id)
      .populate('recordedBy', 'name email');
    
    if (!procurement) {
      return res.status(404).json({ error: 'Procurement record not found' });
    }

    res.status(200).json({
      success: true,
      data: procurement
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;