/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management (Cash and Credit)
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { CashSale, CreditSale } = require('../models/Sale');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /sales/cash:
 *   post:
 *     summary: Record a cash sale (Sales Agent only)
 *     tags: [Sales]
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
 *               - tonnage
 *               - amountPaid
 *               - buyerName
 *               - salesAgentName
 *               - time
 *             properties:
 *               produceName:
 *                 type: string
 *               tonnage:
 *                 type: number
 *                 minimum: 1
 *               amountPaid:
 *                 type: number
 *                 minimum: 10000
 *               buyerName:
 *                 type: string
 *                 minLength: 2
 *               salesAgentName:
 *                 type: string
 *                 minLength: 2
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *     responses:
 *       201:
 *         description: Cash sale recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/cash',
  protect,
  authorize('Sales Agent', 'Manager'),
  [
    body('produceName').notEmpty().withMessage('Produce name is required'),
    body('tonnage').isInt({ min: 1 }).withMessage('Tonnage must be at least 1 kg'),
    body('amountPaid').isFloat({ min: 10000 }).withMessage('Amount paid must be at least 10,000 UgX'),
    body('buyerName').isLength({ min: 2 }).withMessage('Buyer name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Buyer name must be alphanumeric'),
    body('salesAgentName').isLength({ min: 2 }).withMessage('Sales agent name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Sales agent name must be alphanumeric'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please enter valid time (HH:MM)'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const saleData = {
        ...req.body,
        recordedBy: req.user._id,
        date: req.body.date || new Date()
      };

      const sale = await CashSale.create(saleData);

      res.status(201).json({
        success: true,
        data: sale
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /sales/credit:
 *   post:
 *     summary: Record a credit sale (Sales Agent only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyerName
 *               - nationalId
 *               - location
 *               - contacts
 *               - amountDue
 *               - salesAgentName
 *               - dueDate
 *               - produceName
 *               - produceType
 *               - tonnage
 *             properties:
 *               buyerName:
 *                 type: string
 *                 minLength: 2
 *               nationalId:
 *                 type: string
 *               location:
 *                 type: string
 *                 minLength: 2
 *               contacts:
 *                 type: string
 *               amountDue:
 *                 type: number
 *                 minimum: 10000
 *               salesAgentName:
 *                 type: string
 *                 minLength: 2
 *               dueDate:
 *                 type: string
 *                 format: date
 *               produceName:
 *                 type: string
 *               produceType:
 *                 type: string
 *               tonnage:
 *                 type: number
 *                 minimum: 1
 *               dispatchDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Credit sale recorded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/credit',
  protect,
  authorize('Sales Agent', 'Manager'),
  [
    body('buyerName').isLength({ min: 2 }).withMessage('Buyer name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Buyer name must be alphanumeric'),
    body('nationalId').matches(/^[A-Z0-9]{10,15}$/).withMessage('Please enter a valid NIN'),
    body('location').isLength({ min: 2 }).withMessage('Location must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Location must be alphanumeric'),
    body('contacts').matches(/^[0-9]{10,12}$/).withMessage('Please enter a valid phone number'),
    body('amountDue').isFloat({ min: 10000 }).withMessage('Amount due must be at least 10,000 UgX'),
    body('salesAgentName').isLength({ min: 2 }).withMessage('Sales agent name must be at least 2 characters')
      .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Sales agent name must be alphanumeric'),
    body('dueDate').isISO8601().withMessage('Please enter a valid due date'),
    body('produceName').notEmpty().withMessage('Produce name is required'),
    body('produceType').notEmpty().withMessage('Produce type is required'),
    body('tonnage').isInt({ min: 1 }).withMessage('Tonnage must be at least 1 kg'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const saleData = {
        ...req.body,
        recordedBy: req.user._id,
        dispatchDate: req.body.dispatchDate || new Date()
      };

      const sale = await CreditSale.create(saleData);

      res.status(201).json({
        success: true,
        data: sale
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Cash, Credit]
 *         description: Filter by sale type
 *     responses:
 *       200:
 *         description: List of sales
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.query.type) {
      query.saleType = req.query.type;
    }

    const sales = await Sale.find(query)
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /sales/credit/{id}/payment:
 *   patch:
 *     summary: Mark credit sale as paid
 *     tags: [Sales]
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
 *         description: Payment recorded successfully
 *       404:
 *         description: Sale not found
 */
router.patch('/credit/:id/payment', protect, async (req, res) => {
  try {
    const sale = await CreditSale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ error: 'Credit sale not found' });
    }

    sale.isPaid = true;
    sale.paymentDate = new Date();
    await sale.save();

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;