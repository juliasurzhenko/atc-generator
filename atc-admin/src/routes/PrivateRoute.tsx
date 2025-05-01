import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? 
  // <Outlet /> 
  <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-6'>
        {/* <h1 className='text-3xl mb-6'>Добрий день, адмін!</h1> */}
        <Outlet /> {/* Тут відображатимуться вкладені сторінки */}
      </div>
    </div>
  : <Navigate to="/login" />;
};

export default PrivateRoute;