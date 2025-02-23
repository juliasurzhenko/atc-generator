// src/pages/Dashboard.tsx
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'; // Для відображення вкладених компонентів

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-6'>
        {/* <h1 className='text-3xl mb-6'>Добрий день, адмін!</h1> */}
        <Outlet /> {/* Тут відображатимуться вкладені сторінки */}
      </div>
    </div>
  );
};

export default Dashboard;
