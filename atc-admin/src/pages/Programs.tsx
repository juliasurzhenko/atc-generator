import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Upload, Modal, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const Programs = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Загрузка даних з сервера
  const fetchPrograms = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/programs');
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  // Додавання або оновлення програми
  const handleAddOrUpdateProgram = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('program_name', values.name);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (editingProgram) {
        // Оновлення програми
        await axios.put(`http://localhost:3000/api/programs/${editingProgram.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Програма оновлена');
      } else {
        // Додавання нової програми
        await axios.post('http://localhost:3000/api/programs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Програма додана');
      }

      setShowModal(false);
      setSelectedFile(null);
      fetchPrograms(); // Оновлення списку програм
    } catch (error) {
      console.error('Error adding/updating program:', error);
      message.error('Помилка при додаванні/оновленні програми');
    }
  };

  // Видалення програми
  const handleDeleteProgram = async (programId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/programs/${programId}`);
      message.success('Програма видалена');
      fetchPrograms(); // Оновлення списку
    } catch (error) {
      console.error('Error deleting program:', error);
      message.error('Помилка при видаленні програми');
    }
  };

  // Редагування програми
  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Колонки для таблиці
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Назва', dataIndex: 'program_name', key: 'program_name' },
    {
      title: 'Файл',
      dataIndex: 'filename',
      key: 'filename',
      render: (filename: string) => (
        <a href={`http://localhost:3000/api/programs/${filename}`} target="_blank" rel="noopener noreferrer">
          {filename}
        </a>
      ),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (text: string, record: any) => (
        <div>
          <Button onClick={() => handleEditProgram(record)} style={{ marginRight: '8px' }}>Редагувати</Button>
          <Button danger onClick={() => handleDeleteProgram(record.id)}>Видалити</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setShowModal(true)}>Додати програму</Button>
      <Table
        columns={columns}
        dataSource={programs}
        rowKey="id"
        pagination={false}
      />

      {/* Модальне вікно для додавання/редагування програми */}
      <Modal
        title={editingProgram ? 'Редагувати програму' : 'Додати програму'}
        visible={showModal}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form
          initialValues={{ name: editingProgram?.program_name }}
          onFinish={handleAddOrUpdateProgram}
        >
          <Form.Item
            label="Назва"
            name="name"
            rules={[{ required: true, message: 'Введіть назву програми' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Файл" name="file">
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Завантажити файл</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProgram ? 'Зберегти зміни' : 'Додати програму'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Programs;
