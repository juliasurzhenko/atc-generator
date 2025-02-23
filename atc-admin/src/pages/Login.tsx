import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard/users'); 
    } else {
      alert('Невірний логін або пароль');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen min-w-screen'>
      <div className='grid gap-2 p-8 bg-white rounded-2xl shadow-lg'>
        <p className='text-2xl text-center text-black'>Вхід до системи</p>
        <form onSubmit={handleLogin} className='grid gap-4'>
          <input
            type="text"
            placeholder="Логін"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='p-2 border border-gray-300 rounded  text-black'
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-2 border border-gray-300 rounded text-black'
          />
          <button 
            type="submit"
            className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
