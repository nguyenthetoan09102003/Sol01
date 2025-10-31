const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrderController');
const upload = require('../middleware/upload');

router.get('/', workOrderController.getAll);
router.get('/new', workOrderController.getNew);
router.post('/', upload.single('image'), workOrderController.create);
router.get('/:id/pdf-preview', workOrderController.previewPDF); // ← MỚI
router.get('/:id', workOrderController.getDetail);
router.get('/:id/pdf', workOrderController.exportPDF);

module.exports = router;