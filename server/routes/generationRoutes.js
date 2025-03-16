const express = require('express');
const { generateCertificatesHandler } = require('../services/generationService');

const router = express.Router();

router.post('/generate', generateCertificatesHandler);

module.exports = router;
