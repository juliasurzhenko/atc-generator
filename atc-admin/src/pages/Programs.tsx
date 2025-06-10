import { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, message, Divider } from "antd";
import axios from "axios";

const Programs = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [form] = Form.useForm(); // Додаємо форму для керування станом

  // Завантаження списку програм
  const fetchPrograms = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/programs`);
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
        await axios.put(`${import.meta.env.VITE_API_URL}/programs/${editingProgram.id}`, payload);
        message.success("Програма оновлена");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/programs`, payload);
        message.success("Програма додана");
      }

      setShowModal(false);
      setEditingProgram(null);
      form.resetFields(); // Очищаємо форму
      fetchPrograms(); // Оновлення списку програм
    } catch (error) {
      console.error("Помилка при додаванні/оновленні програми:", error);
      message.error("Не вдалося додати/оновити програму");
    }
  };

  // Видалення програми
  const handleDeleteProgram = async (programId: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/programs/${programId}`);
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
    form.setFieldsValue({
      name: program.program_name,
      results: program.results,
    }); // Заповнюємо поля форми
    setShowModal(true);
  };

  // Відкриття модального вікна для додавання
  const handleOpenAddModal = () => {
    setEditingProgram(null);
    form.resetFields(); // Очищаємо форму перед створенням нової програми
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    form.resetFields();
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Колонки для таблиці
  const columns = [
    {
      title: "№",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1, // Додаємо індекс
    },
    { title: "Назва", dataIndex: "program_name", key: "program_name" },
    { title: "Опис", 
      dataIndex: "results", 
      key: "results",
      render: (text: string) => (
        <ul style={{ paddingLeft: '1em', margin: 0 }}>
          {text.split('\n').slice(0, 3).map((line, index) => (
            <li key={index}>{line}</li>
          ))}
          {text.split('\n').length > 3 && <li>...</li>}
        </ul>
      )
    },
    {
      title: "Дії",
      key: "actions",
      render: (_text: string, record: any) => (
        <div className='grid gap-3 place-content-center '>
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
      <h2 className="text-2xl mb-4">Сторінка програм підвищення кваліфікації</h2>

      <Divider />
        <Button type="primary" onClick={handleOpenAddModal} size="large" className="w-full my-2">Додати програму</Button>
      <Divider />
      
      <Table columns={columns} dataSource={programs} rowKey="id" pagination={false} />

      {/* Модальне вікно */}
      <Modal
        title={editingProgram ? "Редагувати програму" : "Додати програму"}
        visible={showModal}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form form={form} onFinish={handleAddOrUpdateProgram}>
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
