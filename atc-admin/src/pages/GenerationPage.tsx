import React, { useEffect, useState } from 'react';
import { Upload, Button, Table, message } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const GenerationPage: React.FC = () => {
  const [files, setFiles] = useState<{ id: number; participants_filename: string; template_filename: string }[]>([]);
  const [participantsFile, setParticipantsFile] = useState<File | null>(null);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {    
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/generaldata');
      setFiles(response.data);
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
      await axios.post('http://localhost:3000/api/generaldata/upload', formData);
      message.success('Файли успішно завантажені');
      fetchFiles();
    } catch (error) {
      console.error('Помилка завантаження файлів:', error);
      message.error('Не вдалося завантажити файли.');
    }
  };

  const downloadFile = async (id: number, filename: string, type: 'participants' | 'template') => {
    try {
      const response = await axios.get(`http://localhost:3000/api/generaldata/${id}/download?type=${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      message.error('Не вдалося завантажити файл.');
    }
  };

  const deleteFile = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/generaldata/${id}`);
      message.success('Файл видалено');
      fetchFiles();
    } catch (error) {
      console.error('Помилка видалення файлу:', error);
      message.error('Не вдалося видалити файл.');
    }
  };

  const generateCertificates = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/certificates/generate');
      message.success('✅ Сертифікати згенеровані!');
      console.log(response.data);
    } catch (error) {
      message.error('❌ Помилка генерації сертифікатів');
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Генерація сертифікатів</h2>

      <Upload beforeUpload={(file) => { setParticipantsFile(file as File); return false; }} showUploadList={true}>
        <Button icon={<UploadOutlined />}>Завантажити Excel-файл</Button>
      </Upload>
      <Upload beforeUpload={(file) => { setTemplateFile(file as File); return false; }} showUploadList={true}>
        <Button icon={<UploadOutlined />}>Завантажити шаблон (.docx)</Button>
      </Upload>
      <Button type="primary" onClick={handleUpload} style={{ marginTop: 16 }}>
        Завантажити файли
      </Button>

      <Table dataSource={files} rowKey="id" pagination={false} style={{ marginTop: 20 }}>
        <Table.Column
          title="Файл учасників"
          dataIndex="participants_filename"
          key="participants_filename"
          render={(_, record) => (
            <div>
              <p>{record.participants_filename}</p>
              <Upload beforeUpload={(file) => { setParticipantsFile(file); return false; }} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Завантажити</Button>
              </Upload>
            </div>
          )}
        />
        <Table.Column
          title="Файл шаблону"
          dataIndex="template_filename"
          key="template_filename"
          render={(_, record) => (
            <div>
              <p>{record.template_filename}</p>
              <Upload beforeUpload={(file) => { setTemplateFile(file); return false; }} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Завантажити</Button>
              </Upload>
            </div>
          )}
        />
        <Table.Column
          title="Дії"
          key="actions"
          render={(_, record) => (
            <>
              <Button icon={<DownloadOutlined />} onClick={() => downloadFile(record.id, record.participants_filename, 'participants')}>
                Завантажити учасників
              </Button>
              <Button icon={<DownloadOutlined />} onClick={() => downloadFile(record.id, record.template_filename, 'template')} style={{ marginLeft: 8 }}>
                Завантажити шаблон
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => deleteFile(record.id)} style={{ marginLeft: 8 }}>
                Видалити
              </Button>
            </>
          )}
        />
        {/* Додатковий стовпець для генерації сертифікатів */}
        <Table.Column
          title="Дії"
          key="generate"
          render={(_, record) => (
            <Button 
              type="primary" 
              onClick={() => generateCertificates()} 
              style={{ marginTop: 8 }}>
              Генерувати сертифікати
            </Button>
          )}
        />
      </Table>


    </div>
  );
};

export default GenerationPage;
