import { Routes, Route } from 'react-router-dom';
import Mantenimiento from './pages/Mantenimiento';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Mantenimiento />} />
    </Routes>
  );
}

export default App;
