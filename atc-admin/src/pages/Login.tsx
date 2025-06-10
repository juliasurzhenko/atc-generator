import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            className='p-2 border border-gray-300 rounded text-black'
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-2 border border-gray-300 rounded text-black pr-10'
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
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
