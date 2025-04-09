import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
// import Dashboard from './pages/Users'; // Переконайтеся, що цей компонент є наявним
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Programs from './pages/Programs';
import GenerationPage from './pages/GenerationPage';
import PrivateRoute from './routes/PrivateRoute';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route element={<PrivateRoute />}>
            <Route path="/dashboard/users" element={<Dashboard />} />
          </Route> */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="users" element={<Users />} />
            <Route path="programs" element={<Programs />} />
            <Route path="generation" element={<GenerationPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
