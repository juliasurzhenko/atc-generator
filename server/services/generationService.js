// const mysql = require('mysql2/promise');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { PDFDocument } = require('pdf-lib');
const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');
const mammoth = require("mammoth");

async function getAllProgramResults() {
    try {
        // 🔹 Отримуємо всі програми з таблиці `programs`
        const [programs] = await pool.query("SELECT program_name, filedata FROM programs");

        if (programs.length === 0) {
            throw new Error("❌ Програми не знайдено у базі!");
        }
        
        // 🔹 Масив для збереження результатів
        const programResults = [];

        // 🔹 Обробляємо кожен DOCX-файл
        for (const program of programs) {
            const { program_name, filedata } = program;

            if (!filedata) {
                console.warn(`⚠️ Файл програми "${program_name}" порожній або не збережений!`);
                programResults.push({ programName: program_name, expectedResults: "Дані відсутні" });
                continue;
            }

            // 🔹 Витягуємо текст із DOCX
            const { value: text } = await mammoth.extractRawText({ buffer: filedata });
            const lines = text.split("\n");

            let expectedResults = "";
            let foundResultsSection = false;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line.startsWith("Очікувані результати навчання")) {
                    foundResultsSection = true;
                    expectedResults = "";
                }

                if (foundResultsSection && line.length > 0 && !line.startsWith("Рекомендована література")) {
                    expectedResults += line + " ";
                }

                if (line.startsWith("Рекомендована література")) {
                    break;
                }
            }

            programResults.push({
                programName: program_name,
                expectedResults: expectedResults.trim() || "Результати не знайдено",
            });
        }
        console.log(`programResults - ${JSON.stringify(programResults, null, 2)}`);
        
        return programResults;
    } catch (error) {
        console.error("❌ Помилка отримання результатів програм:", error);
        throw error;
    }
}

// Використання функції
// getProgramResults().then(data => {
//     console.log("📌 Програма:", data.programName);
//     console.log("📌 Очікувані результати:", data.expectedResults);
// }).catch(err => console.error(err));

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
        subject: row["Предмет"],
        program: row["Найменування програми"]
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

    return rows[0].template_filedata;
}

/**
 * 📌 Генерація PDF-сертифіката для кожного учасника
 */
async function generateCertificates() {
    try {
        const participants = await getParticipantsData();
        // const programs = await getProgramResults();
        // const templateBuffer = await getTemplateFile();
        if (!fs.existsSync("certificates")) {
            fs.mkdirSync("certificates");
        }

        const generatedFiles = [];

        for (const participant of participants) {
            console.log(
                `Participant name ${participant.name} 
                Participant surname ${participant.surname} 
                Participant third_name ${participant.third_name} 
                Participant program ${participant.program}`
            );
            
            // const pdfDoc = await PDFDocument.load(templateBuffer);
            // const page = pdfDoc.getPage(0);
            // const { name, program } = participant;

            // // 📌 Додати текст на сертифікат
            // page.drawText(name, { x: 150, y: 500, size: 24 });
            // page.drawText(program, { x: 150, y: 450, size: 18 });

            // // 📌 Зберегти PDF
            // const pdfBytes = await pdfDoc.save();
            // const fileName = `certificates/${uuidv4()}.pdf`;
            // fs.writeFileSync(fileName, pdfBytes);

            // generatedFiles.push({ name, program, fileName });
        }

        getAllProgramResults().then(data => {
            // Iterate over the array and log each program's results
            data.forEach(program => {
                console.log("📌 Програма:", program.programName);
                console.log("📌 Очікувані результати:", program.expectedResults);
            });
        }).catch(err => console.error(err));        

        // console.log(`✅ Сертифікати успішно згенеровано: ${generatedFiles.length}`);

        // return generatedFiles;
    } catch (error) {
        console.error("❌ Помилка генерації сертифікатів:", error);
        throw error;
    }
}

/**
 * 📌 Ендпоінт для виклику генерації
 */
const generateCertificatesHandler = async (req, res) => {
    try {
        const generatedFiles = await generateCertificates();
        res.json({ message: "✅ Сертифікати успішно згенеровані", files: generatedFiles });
    } catch (error) {
        res.status(500).json({ error: "❌ Помилка генерації сертифікатів" });
    }
};

module.exports = { generateCertificatesHandler };


//---------------------------------------------------------------------------
// const express = require("express");
// const fileUpload = require("express-fileupload");
// const fs = require("fs");
// const path = require("path");
// const mammoth = require("mammoth"); // For extracting text from DOCX
// const excel = require("xlsx"); // For reading Excel
// const archiver = require("archiver");

// const app = express();
// app.use(express.json());
// app.use(fileUpload());

// // Paths
// const TEMPLATE_FILE = path.join(__dirname, "template_test.docx");
// const OUTPUT_DIR = path.join(__dirname, "certificates");
// if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// // Extract text from Word file
// async function extractExpectedResults(docPath, targetHeading = "Очікувані результати навчання") {
//     const buffer = fs.readFileSync(docPath);
//     const result = await mammoth.extractRawText({ buffer });
//     const lines = result.value.split("\n");
    
//     for (let i = 0; i < lines.length; i++) {
//         if (lines[i].includes(targetHeading)) return lines[i + 1] || "No data found.";
//     }
//     return "No data found.";
// }

// // Generate certificates
// async function generateCertificates(excelPath, expectedResults) {
//     const workbook = excel.readFile(excelPath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = excel.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     for (let row of sheet) {
//         const name = `${row["Прізвище"]} ${row["Ім'я"]} ${row["По батькові"]}`;
//         const date = row["Дата завершення"] || "Дата не вказана";
//         const award = row["Бал"] || "Бал не вказаний";

//         let docText = fs.readFileSync(TEMPLATE_FILE, "utf8");
//         docText = docText.replace("{name}", name)
//                          .replace("{date}", date)
//                          .replace("{award}", award)
//                          .replace("{results}", expectedResults);

//         const outputFilename = path.join(OUTPUT_DIR, `certificate_${name.replace(/ /g, "_")}.docx`);
//         fs.writeFileSync(outputFilename, docText);
//         console.log(`Certificate saved for ${name}`);
//     }

//     // Create a zip archive
//     const zipPath = path.join(__dirname, "certificates.zip");
//     const output = fs.createWriteStream(zipPath);
//     const archive = archiver("zip", { zlib: { level: 9 } });

//     archive.pipe(output);
//     archive.directory(OUTPUT_DIR, false);
//     await archive.finalize();

//     console.log(`Certificates archived at ${zipPath}`);
//     return zipPath;
// }

// // API to upload Excel and generate certificates
// app.post("/generate-certificates", async (req, res) => {
//     if (!req.files || !req.files.excelFile) return res.status(400).send("No file uploaded.");

//     const excelPath = path.join(__dirname, req.files.excelFile.name);
//     await req.files.excelFile.mv(excelPath);

//     const expectedResults = await extractExpectedResults(TEMPLATE_FILE);
//     const zipPath = await generateCertificates(excelPath, expectedResults);

//     res.download(zipPath);
// });

// app.listen(5000, () => console.log("Server running on port 5000"));
