// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const xlsx = require('xlsx');
// const mammoth = require('mammoth');
// const { Document, Packer, Paragraph, TextRun } = require('docx');

// // Отримання списку учасників та шаблону сертифікату
// async function getGeneralData() {
//     const [rows] = await db.query("SELECT template_filedata, participants_filedata FROM generaldata ORDER BY uploaded_at DESC LIMIT 1");
//     return rows.length ? rows[0] : null;
// }

// // Отримання даних програми за її назвою
// async function getProgramData(programName) {
//     const [rows] = await db.query("SELECT filedata FROM program_files WHERE filename LIKE ?", [`%${programName}%`]);
//     return rows.length ? rows[0].filedata : null;
// }

// // Конвертація Word-файлу в текст
// async function extractTextFromWord(buffer) {
//     return await mammoth.extractRawText({ buffer }).then(result => result.value);
// }

// // Генерація сертифіката
// async function generateCertificate(participant, programText, templateBuffer) {
//     const doc = new Document({
//         sections: [{
//             children: [
//                 new Paragraph({
//                     children: [
//                         new TextRun({
//                             text: `Сертифікат учасника: ${participant.name}\nПрограма: ${participant.program}\n${programText}`,
//                             bold: true
//                         })
//                     ]
//                 })
//             ]
//         }]
//     });
//     return await Packer.toBuffer(doc);
// }

// // Головний ендпоінт генерації сертифікатів
// router.post('/generate', async (req, res) => {
//     try {
//         const generalData = await getGeneralData();
//         if (!generalData) return res.status(404).json({ error: "General data not found" });

//         const workbook = xlsx.read(generalData.participants_filedata, { type: "buffer" });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const participants = xlsx.utils.sheet_to_json(sheet);

//         const generatedCertificates = [];

//         for (const participant of participants) {
//             const programData = await getProgramData(participant.program);
//             if (!programData) continue;
//             const programText = await extractTextFromWord(programData);
//             const certificateBuffer = await generateCertificate(participant, programText, generalData.template_filedata);
            
//             await db.query("INSERT INTO certificates (filename, filedata) VALUES (?, ?)",
//                 [`certificate_${participant.name}.docx`, certificateBuffer]);
//             generatedCertificates.push({ name: participant.name, file: `certificate_${participant.name}.docx` });
//         }
        
//         res.json({ message: "Certificates generated", certificates: generatedCertificates });
//     } catch (error) {
//         console.error("Помилка генерації сертифікатів:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// module.exports = router;
