const pool = require("../models/db");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

/**
 * 📌 Отримати всі сертифікати для `generaldata_id` та повернути ZIP-архів
 */
const getCertificatesByGeneralDataId = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req);

        // Отримуємо всі сертифікати для `generaldata_id`
        const [certificates] = await pool.query(
            "SELECT certificate_filename, certificate_filedata FROM certificates WHERE generaldata_id = ?", [id]
        );

        if (certificates.length === 0) {
            return res.status(404).json({ error: "Сертифікати не знайдено" });
        }

        // 🔹 Створюємо архів
        const zipPath = path.join(__dirname, "../temp_certificates", `certificates_${id}.zip`);
        const output = res; // Направляємо архів безпосередньо в потік відповіді
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);

        // Додаємо кожен сертифікат в архів без збереження на диск
        for (const cert of certificates) {
            archive.append(cert.certificate_filedata, { name: cert.certificate_filename });
        }

        await archive.finalize();

    } catch (error) {
        console.error("❌ Помилка отримання сертифікатів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
};


module.exports = { getCertificatesByGeneralDataId };
