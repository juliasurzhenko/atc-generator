import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Перенаправлення на адмін панель
    } else {
      navigate('/login'); // Перенаправлення на сторінку входу
    }
  }, [isAuthenticated, navigate]);

  return <div>Loading...</div>;
};

export default Home;
