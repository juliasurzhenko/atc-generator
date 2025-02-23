import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/userService'; // Імпортуємо функцію для отримання користувачів
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const fetchUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  // Функція для додавання нового користувача
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
    };

    try {
      await axios.post('http://localhost:3000/api/users', newUser);  // API запит на додавання користувача
      setNewUsername('');
      setNewPassword('');
      setNewEmail('');
      await fetchUsers();  // Оновлення списку користувачів після додавання
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Функція для видалення користувача
  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);  // API запит на видалення користувача
      await fetchUsers();  // Оновлення списку користувачів після видалення
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Only runs once when the component is mounted

  return (
    <div>
      <h2 className="text-2xl mb-4">Користувачі</h2>

      {/* Форма для додавання нового користувача */}
      <form onSubmit={handleAddUser} className="mb-6">
        <input
          type="text"
          placeholder="Логін"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button type="submit">Додати користувача</button>
      </form>

      {/* Таблиця для відображення користувачів */}
      <table className="min-w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2 px-4">ID</th>
            <th className="border-b py-2 px-4">Логін</th>
            <th className="border-b py-2 px-4">Email</th>
            <th className="border-b py-2 px-4">Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">Немає користувачів</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border-b py-2 px-4">{user.id}</td>
                <td className="border-b py-2 px-4">{user.username}</td>
                <td className="border-b py-2 px-4">{user.email}</td>
                <td className="border-b py-2 px-4">
                  <button onClick={() => handleDeleteUser(user.id)}>Видалити</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
