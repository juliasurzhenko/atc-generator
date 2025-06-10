import React, { useEffect, useState } from 'react';
import { Upload, Button, Table, message } from 'antd';
import { UploadOutlined, DeleteOutlined, FileZipOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Divider } from "antd";
import { RcFile } from 'antd/es/upload';

const GenerationPage: React.FC = () => {
  const [files, setFiles] = useState<{ id: number; participants_filename: string; template_filename: string }[]>([]);
  const [participantsFile, setParticipantsFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {        
    fetchFiles();
  }, []);

  useEffect(() => {    
    console.log(downloadCertificatesZip);
  });

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/generaldata`);
      console.log(response.data);
      
      setFiles(response.data);
  
      const certPromises = response.data.map(async (file: { id: number }) => {
        try {
          const certResponse = await axios.get(`${import.meta.env.VITE_API_URL}/certificates/generaldata/${file.id}`);
          return { id: file.id, hasCertificates: certResponse.data.length > 0 };
        } catch (err) {
          console.error(`Помилка отримання сертифікатів для файлу ${file.id}:`, err);
          return { id: file.id, hasCertificates: false }; // Якщо запит провалився, вважаємо, що сертифікати відсутні
        }
      });
  
      const certResults = await Promise.all(certPromises);
  
      const certStatus = certResults.reduce((acc, { id, hasCertificates }) => {
        acc[id] = hasCertificates;
        return acc;
      }, {} as { [key: number]: boolean });
  
      setGeneratedCertificates(certStatus);
  
    } catch (error) {
      console.error('Помилка отримання файлів:', error);
    }
  };
  

  const handleUpload = async () => {
    if (!participantsFile || !templateFile) {
      message.error('Будь ласка, виберіть обидва файли!');
      return;
    }

    const formData = new FormData();
    formData.append('participantsFile', participantsFile);
    formData.append('templateFile', templateFile);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/generaldata/upload`, formData);
      message.success('Файли успішно завантажені');
      fetchFiles();
    } catch (error) {
      console.error('Помилка завантаження файлів:', error);
      message.error('Не вдалося завантажити файли.');
    }
  };

  const deleteFile = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/generaldata/${id}`);
      message.success('Файл видалено');
      fetchFiles();
    } catch (error) {
      console.error('Помилка видалення файлу:', error);
      message.error('Не вдалося видалити файл.');
    }
  };

  const generateCertificates = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generation/generate/${id}`);
      message.success('✅ Сертифікати згенеровані!');
      console.log(response.data);

      // ✅ Оновлюємо дані після генерації
      await fetchFiles();
    } catch (error) {
      message.error('❌ Помилка генерації сертифікатів');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificatesZip = async (id: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/certificates/generaldata/${id}`, {
            responseType: 'blob', // 🔹 Важливо! Вказуємо, що отримуємо файл
        });

        // 🔹 Створюємо посилання для скачування ZIP-файлу
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificates_${id}.zip`); // 🔹 Назва файлу
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('❌ Помилка завантаження ZIP-файлу:', error);
        message.error('Не вдалося завантажити ZIP-файл.');
    }
  };


  return (
    <div>
      <h2 className="text-2xl mb-4">Сторінка генерації сертифікатів</h2>
      <Divider />

      <div className='flex gap-4 items-center my-6'>
        <Upload 
          accept=".xlsx"
          beforeUpload={(file: RcFile) => {
            const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isXLSX) {
              message.error('Потрібно завантажити файл формату .xlsx');
              return Upload.LIST_IGNORE;
            }
      
            setParticipantsFile(file);
            return false; // Запобігає автоматичному завантаженню
          }}
          showUploadList={{ showRemoveIcon: true }}
          maxCount={1}      
        >
          <Button icon={<UploadOutlined />}>Завантажити файл із учасниками</Button>
        </Upload>
        <Upload 
          accept=".docx"
          beforeUpload={(file: RcFile) => {
            const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            if (!isDOCX) {
              message.error('Потрібно завантажити файл формату .docx');
              return Upload.LIST_IGNORE;
            }
      
            setTemplateFile(file);
            return false;
          }}
          showUploadList={{ showRemoveIcon: true }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            Завантажити шаблон сертифікату
          </Button>
        </Upload>
        <Button type="primary" onClick={handleUpload} className='shadow-xl'>
          Підвантажити файли для генерації
        </Button>        
      </div>
      <Divider />


      <Table 
        dataSource={files.map((file, index) => ({ ...file, key: file.id || index }))}
        rowKey="key" 
        pagination={false} 
        style={{ marginTop: 20 }}>
        <Table.Column
          title="Файл учасників"
          dataIndex="participants_filename"
          key="participants_filename"
        />
        <Table.Column
          title="Файл шаблону"
          dataIndex="template_filename"
          key="template_filename"
        />
        <Table.Column
          title="Сертифікати"
          key="certificates"
          render={(_, record) => (
            generatedCertificates[record.id] ? (
              <Button icon={<FileZipOutlined />} loading={loading} onClick={() => downloadCertificatesZip(record.id)} style={{ marginTop: 8 }} >
                Завантажити ZIP
              </Button>
            ) : (
              <Button type="primary" loading={loading} onClick={() => generateCertificates(record.id)} style={{ marginTop: 8 }}>
                Генерувати сертифікати
              </Button>
            )
          )}
        />
        <Table.Column
          title="Дії"
          key="actions"
          render={(_, record) => (
            <div className='grid gap-3 place-content-center '>
              <Button danger loading={loading} icon={<DeleteOutlined />} onClick={() => deleteFile(record.id)} style={{ marginLeft: 8 }}>
                Видалити
              </Button>
            </div>
          )}
        />
      </Table>


    </div>
  );
};

export default GenerationPage;
