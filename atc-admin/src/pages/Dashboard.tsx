// src/pages/Dashboard.tsx
import Sidebar from '../components/Sidebar';
import { Navigate, Outlet } from 'react-router-dom'; // Для відображення вкладених компонентів
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? 
  // <Outlet /> 
  <div className='flex p-4 bg-gray-200'>
      <Sidebar />
      <div className='flex-1 m-8'>
        {/* <Navigate to="/dashboard/users" /> */}
        <Outlet />
      </div>
    </div>
  : <Navigate to="/login" />;
};

export default Dashboard;
