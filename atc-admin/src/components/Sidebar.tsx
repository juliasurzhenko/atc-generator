// src/components/Sidebar.tsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col'>
      <h2 className='text-2xl mb-4'>Адмін-панель</h2>
      
      <ul className='flex-1'>
        {/* Інші пункти меню */}
        <li>
          <Link to="/dashboard/programs" className='block py-2 hover:bg-gray-700 rounded'>
            Програми
          </Link>
        </li>
      </ul>

      {/* Переміщаємо "Користувачі" та кнопку "Логаут" вниз */}
      <div className='mt-auto'>
        <ul>
          <li>
            <Link to="/dashboard/users" className='block py-2 hover:bg-gray-700 rounded'>
              Користувачі
            </Link>
          </li>
        </ul>

        {/* Кнопка логаут */}
        <div className='mt-4'>
          <button className='w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white'>
            Логаут
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
