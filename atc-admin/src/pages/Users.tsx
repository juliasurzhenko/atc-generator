import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService'; // Імпортуємо функцію для отримання користувачів
import axios from 'axios';
import { Table, Button, Input, Form, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  // Функція для додавання нового користувача
  const handleAddUser = async (values: { username: string; password: string; email: string }) => {
    const newUser = {
      username: values.username,
      password: values.password,
      email: values.email,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, newUser);  // API запит на додавання користувача
      await fetchUsers();  // Оновлення списку користувачів після додавання
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Функція для видалення користувача
  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);  // API запит на видалення користувача
      await fetchUsers();  // Оновлення списку користувачів після видалення
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'text-center',
    },
    {
      title: 'Логін',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_text: string, record: any) => (
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteUser(record.id)}
        >
          Видалити
        </Button>
      ),
    },
  ];

  return (
    <div className=''>
      <h2 className="text-2xl mb-4">Сторінка адміністраторів</h2>
      <Divider />
      {/* Форма для додавання нового користувача */}
      <Form onFinish={handleAddUser} className="flex mb-6 gap-4 w-full">
          <Form.Item label="Логін" name="username" rules={[{ required: true, message: 'Будь ласка, введіть логін!' }]}>
            <Input
              type="text"
              placeholder="Логін"
            />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}>
            <Input.Password
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Будь ласка, введіть email!' }]}>
            <Input
              type="email"
              placeholder="Email"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">Додати адміністратора</Button>
      </Form>
      <Divider />
      
      {/* Таблиця для відображення користувачів */}
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={false}
        className="mt-6"
      />
    </div>
  );
};

export default Users;
