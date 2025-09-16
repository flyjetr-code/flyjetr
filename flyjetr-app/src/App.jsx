import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import TripCreation from './pages/TripCreation';
import ClientTripForm from './pages/ClientTripForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trip-creation" element={<TripCreation />} />
          <Route path="/client/trip/:tripId" element={<ClientTripForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;