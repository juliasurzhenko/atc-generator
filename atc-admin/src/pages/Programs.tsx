import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message } from "antd";
import axios from "axios";

const Programs = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);

  // Завантаження списку програм
  const fetchPrograms = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/programs");
      setPrograms(data);
    } catch (error) {
      console.error("Помилка отримання програм:", error);
    }
  };

  // Додавання або оновлення програми
  const handleAddOrUpdateProgram = async (values: any) => {
    try {
      const payload = { program_name: values.name, results: values.results };

      if (editingProgram) {
        // Оновлення програми
        await axios.put(`http://localhost:3000/api/programs/${editingProgram.id}`, payload);
        message.success("Програма оновлена");
      } else {
        // Додавання нової програми
        await axios.post("http://localhost:3000/api/programs", payload);
        message.success("Програма додана");
      }

      setShowModal(false);
      fetchPrograms(); // Оновлення списку програм
    } catch (error) {
      console.error("Помилка при додаванні/оновленні програми:", error);
      message.error("Не вдалося додати/оновити програму");
    }
  };

  // Видалення програми
  const handleDeleteProgram = async (programId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/programs/${programId}`);
      message.success("Програма видалена");
      fetchPrograms();
    } catch (error) {
      console.error("Помилка видалення програми:", error);
      message.error("Не вдалося видалити програму");
    }
  };

  // Відкриття модального вікна для редагування
  const handleEditProgram = (program: any) => {
    setEditingProgram(program);
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingProgram(null);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Колонки для таблиці
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Назва", dataIndex: "program_name", key: "program_name" },
    { title: "Опис", dataIndex: "results", key: "results" },
    {
      title: "Дії",
      key: "actions",
      render: (text: string, record: any) => (
        <div>
          <Button onClick={() => handleEditProgram(record)} style={{ marginRight: "8px" }}>
            Редагувати
          </Button>
          <Button danger onClick={() => handleDeleteProgram(record.id)}>Видалити</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setShowModal(true)}>Додати програму</Button>
      <Table columns={columns} dataSource={programs} rowKey="id" pagination={false} />

      {/* Модальне вікно */}
      <Modal
        title={editingProgram ? "Редагувати програму" : "Додати програму"}
        visible={showModal}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form initialValues={editingProgram} onFinish={handleAddOrUpdateProgram}>
          <Form.Item
            label="Назва"
            name="name"
            rules={[{ required: true, message: "Введіть назву програми" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Опис програми"
            name="results"
            rules={[{ required: true, message: "Введіть опис програми" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingProgram ? "Зберегти зміни" : "Додати програму"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Programs;
