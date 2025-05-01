const express = require('express');
const { generateCertificatesHandler } = require('../../services/generationService');
// const {getCertificatesByGeneralDataId} = require("../controllers/certificatesController");

const router = express.Router();

router.post('/generate/:id', generateCertificatesHandler);
// router.post('/generaldata/:id', getCertificatesByGeneralDataId);

module.exports = router;
