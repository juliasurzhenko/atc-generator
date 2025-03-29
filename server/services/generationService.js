const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');
const { Document, Packer, Paragraph, HeadingLevel } = require('docx');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

/**
 * 📌 Отримати список учасників з Excel
 */
async function getParticipantsData() {
    const [rows] = await pool.query("SELECT participants_filedata FROM generaldata ORDER BY id DESC LIMIT 1");

    if (rows.length === 0) {
        throw new Error("❌ Файл учасників не знайдено!");
    }

    const fileBuffer = rows[0].participants_filedata;
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return sheet.map(row => ({
        name: row["Ім'я"],
        surname: row["Прізвище"],
        third_name: row["По батькові"],
        program: row["Найменування програми"]
    }));
}

/**
 * 📌 Отримати всі програми та їх результати
 */
async function getAllProgramResults() {
    const [programs] = await pool.query("SELECT program_name, results FROM programs");

    if (programs.length === 0) {
        throw new Error("❌ Програми не знайдено у базі!");
    }

    return programs.map(({ program_name, results }) => ({
        programName: program_name,
        expectedResults: results || "Результати не знайдено"
    }));
}

/**
 * 📌 Отримати шаблон сертифіката
 */
async function getTemplateFile() {
    const [rows] = await pool.query("SELECT template_filedata FROM generaldata ORDER BY id DESC LIMIT 1");

    if (rows.length === 0) {
        throw new Error("❌ Шаблон сертифіката не знайдено!");
    }

    return rows[0].template_filedata; // Повертаємо Buffer
}

/**
 * 📌 Створення DOCX сертифіката для кожного учасника
 */
const generateCertificates = async (generaldata_id) => {
    try {
        const participants = await getParticipantsData();
        const programs = await getAllProgramResults();
        const templateBuffer = await getTemplateFile(); // Get template data

        if (!fs.existsSync("certificates")) {
            fs.mkdirSync("certificates");
        }

        const generatedFiles = [];

        for (const participant of participants) {
            const programData = programs.find(p => p.programName === participant.program);
            if (!programData) {
                console.warn(`⚠️ Program "${participant.program}" not found!`);
                continue;
            }

            // Load the template using PizZip
            const zip = new PizZip(templateBuffer);
            const doc = new Docxtemplater(zip);

            // Replace placeholders in the template
            doc.render({
                name: `${participant.surname} ${participant.name} ${participant.third_name}`,
                speciality: participant.program,
                grade: "Result: 85 points", // Replace with actual grade if needed
                program: participant.program,
                results: programData.expectedResults,
            });

            // Generate the certificate file
            const buffer = doc.getZip().generate({ type: "nodebuffer" });
            const fileName = `certificates/${participant.surname}_${participant.name}_${participant.third_name}.docx`;
            fs.writeFileSync(fileName, buffer);

            generatedFiles.push({ participant, fileName });

            // Save the certificate to the database
            await pool.query(
                "INSERT INTO certificates (generaldata_id, certificate_filename, certificate_filedata) VALUES (?, ?, ?)",
                [generaldata_id, path.basename(fileName), buffer]
            );
        }

        return generatedFiles;
    } catch (error) {
        console.error("❌ Error generating certificates:", error);
        throw error;
    }
};

/**
 * 📌 Ендпоінт для виклику генерації
 */
const generateCertificatesHandler = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(`📌 Генерація сертифікатів для generaldata_id: ${id}`);
        
        // Ensure id is valid
        if (!id) {
            console.error("❌ Missing id parameter");
            return res.status(400).json({ error: "❌ Missing id parameter" });
        }

        const generatedFiles = await generateCertificates(id);

        // console.log("✅ Certificates generated:", generatedFiles);

        // Respond with success
        res.json({
            message: "✅ Сертифікати успішно згенеровані",
            files: generatedFiles,
        });
    } catch (error) {
        console.error("❌ Error generating certificates:", error);
        res.status(500).json({ error: "❌ Помилка генерації сертифікатів" });
    }
};


module.exports = { generateCertificatesHandler };
