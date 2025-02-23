// src/components/Sidebar.tsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 text-white min-h-screen p-4'>
      <h2 className='text-2xl mb-4'>Адмін-панель</h2>
      <ul>
        <li>
          <Link to="/dashboard" className='block py-2 hover:bg-gray-700 rounded'>
            Головна
          </Link>
        </li>
        <li>
          <Link to="/dashboard/users" className='block py-2 hover:bg-gray-700 rounded'>
            Користувачі
          </Link>
        </li>
        <li>
          <Link to="/dashboard/programs" className='block py-2 hover:bg-gray-700 rounded'>
            Програми
          </Link>
        </li>
        {/* <li>
          <Link to="/dashboard/participants" className='block py-2 hover:bg-gray-700 rounded'>
            Дані учасників
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
