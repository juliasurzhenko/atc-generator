import { Link, useNavigate } from 'react-router-dom';
import { Divider } from "antd";
import { LogoutOutlined , DatabaseOutlined, FileDoneOutlined, UserOutlined } from '@ant-design/icons';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    console.log('logout');
    
    localStorage.removeItem('token');
    navigate('/login')
  };

  return (
    <div className='rounded-3xl shadow-xl w-64 bg-gray-700 text-white min-w-[200px] xl:min-w-[300px] min-h-screen p-6 flex flex-col '>
      <h2 className='text-3xl '>Адмін-панель</h2>
      <Divider className='bg-white'/>
      <ul className='flex-1'>
        {/* Інші пункти меню */}
        <li className='flex gap-1 items-center text-xl'>
        <FileDoneOutlined />
          <Link to="/dashboard/generation" className='block py-2 hover:bg-gray-700 rounded'>
            Сторінка генерації
          </Link>
        </li>
        <li className='flex gap-1 items-center text-xl'>
        <DatabaseOutlined />
          <Link to="/dashboard/programs" className='block py-2 hover:bg-gray-700 rounded'>
            Програми
          </Link>
        </li>
      </ul>

      {/* Переміщаємо "Користувачі" та кнопку "Логаут" вниз */}
      <div className='mt-auto'>
        <ul>
          <li className='flex gap-1 items-center text-xl'>
            <UserOutlined />
            <Link to="/dashboard/users" className='block py-2 hover:bg-gray-700 rounded'>
              Адміністратори
            </Link>
          </li>
        </ul>

        {/* Кнопка логаут */}
        <div className='mt-4'>
          <button 
            onClick={logout}
            className='w-full py-2 gap-5 flex shadow-xl bg-red-600 hover:bg-red-700 rounded-xl text-2xl text-white justify-center'
          >
            <LogoutOutlined />
            Вихід
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
