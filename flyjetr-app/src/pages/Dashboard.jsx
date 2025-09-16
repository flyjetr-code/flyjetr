import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { getAllTrips, createTrip, updateTrip, deleteTrip as deleteTripFromFirestore } from '../services/firestoreService';

const Dashboard = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  // State for trips from Firestore
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load trips from Firestore on component mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);
        const tripsData = await getAllTrips();
        setTrips(tripsData);
        setError(null);
      } catch (err) {
        console.error('Error loading trips:', err);
        setError('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  // Simple status text formatting
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const copyClientLink = (tripId) => {
    const clientUrl = `${window.location.origin}/client/trip/${tripId}`;
    navigator.clipboard.writeText(clientUrl);
    alert('Client link copied to clipboard!');
  };

  const editTrip = (trip) => {
    setSelectedTrip({...trip});
  };

  const updateTripData = async (tripId, updates) => {
    try {
      await updateTrip(tripId, updates);
      // Refresh trips from Firestore
      const tripsData = await getAllTrips();
      setTrips(tripsData);
      setSelectedTrip(null);
    } catch (err) {
      console.error('Error updating trip:', err);
      // Fallback: update locally
      setTrips(prev => prev.map(t => (t.id === tripId ? { ...t, ...updates } : t)));
      setSelectedTrip(null);
      setError(null);
    }
  };

  const deleteTripData = async (tripId) => {
    try {
      await deleteTripFromFirestore(tripId);
      // Refresh trips from Firestore
      const tripsData = await getAllTrips();
      setTrips(tripsData);
      setSelectedTrip(null);
    } catch (err) {
      console.error('Error deleting trip:', err);
      // Fallback: delete locally
      setTrips(prev => prev.filter(t => t.id !== tripId));
      setSelectedTrip(null);
      setError(null);
    }
  };

  const addNewTrip = async () => {
    // Create immediately in UI
    const tempId = `trip-${Date.now()}`;
    const newTripBase = {
      clientName: 'New Client',
      clientEmail: 'client@example.com',
      route: 'TBD',
      departureDate: '',
      departureTime: '',
      aircraftType: 'TBD',
      numLegs: 1,
      status: 'pending client info',
      clientLink: `/client/trip/${tempId}`,
      flights: [
        {
          id: `flight-${Date.now()}-1`,
          departure: '',
          arrival: '',
          date: '',
          time: '',
          aircraftType: 'TBD',
          guests: [],
          luggage: {
            carryOn: 0,
            checked: 0,
            misc: 0,
            totalWeight: 0,
            pets: false,
            firearms: false,
            hazardous: false,
            miscItems: [],
            petItems: [],
            hazardousItems: [],
            firearmItems: []
          }
        }
      ]
    };

    const localTrip = { id: tempId, ...newTripBase };
    setTrips(prev => [...prev, localTrip]);
    setSelectedTrip(localTrip);

    // Try to persist to Firestore in background
    try {
      const tripId = await createTrip(newTripBase);
      // Replace temp with persisted version
      setTrips(prev => prev.map(t => (t.id === tempId ? { ...t, id: tripId } : t)));
      setSelectedTrip(prev => (prev && prev.id === tempId ? { ...prev, id: tripId } : prev));
      setError(null);
    } catch (err) {
      console.error('Error creating trip (using local only):', err);
      // Keep local; no further action needed
    }
  };

  // Flight management functions
  const addFlight = () => {
    const newFlight = {
      id: `flight-${Date.now()}-${selectedTrip.flights.length + 1}`,
      departure: '',
      arrival: '',
      date: '',
      time: '',
      aircraftType: 'TBD',
      guests: [],
      luggage: {
        carryOn: 0,
        checked: 0,
        misc: 0,
        totalWeight: 0,
        pets: false,
        firearms: false,
        hazardous: false
      }
    };
    const updatedFlights = [...selectedTrip.flights, newFlight];
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights,
      numLegs: updatedFlights.length
    });
  };

  const removeFlight = (flightIndex) => {
    const updatedFlights = selectedTrip.flights.filter((_, index) => index !== flightIndex);
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights,
      numLegs: updatedFlights.length
    });
  };

  const updateFlight = (flightIndex, field, value) => {
    const updatedFlights = [...selectedTrip.flights];
    updatedFlights[flightIndex] = {
      ...updatedFlights[flightIndex],
      [field]: value
    };
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights
    });
  };

  // Guest management functions
  const addGuest = (flightIndex) => {
    const newGuest = {
      name: '',
      passportFile: null,
    };
    const updatedFlights = [...selectedTrip.flights];
    updatedFlights[flightIndex].guests = [...updatedFlights[flightIndex].guests, newGuest];
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights
    });
  };

  const removeGuest = (flightIndex, guestIndex) => {
    const updatedFlights = [...selectedTrip.flights];
    updatedFlights[flightIndex].guests = updatedFlights[flightIndex].guests.filter((_, index) => index !== guestIndex);
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights
    });
  };

  const updateGuest = (flightIndex, guestIndex, field, value) => {
    const updatedFlights = [...selectedTrip.flights];
    updatedFlights[flightIndex].guests[guestIndex] = {
      ...updatedFlights[flightIndex].guests[guestIndex],
      [field]: value
    };
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights
    });
  };

  // Luggage management functions
  const updateLuggage = (flightIndex, field, value) => {
    const updatedFlights = [...selectedTrip.flights];
    updatedFlights[flightIndex].luggage = {
      ...updatedFlights[flightIndex].luggage,
      [field]: value
    };
    setSelectedTrip({
      ...selectedTrip,
      flights: updatedFlights
    });
  };

  const addDeclarationItem = (flightIndex, key, value) => {
    const updatedFlights = [...selectedTrip.flights];
    const arr = [...(updatedFlights[flightIndex].luggage[key] || [])];
    arr.push(value);
    updatedFlights[flightIndex].luggage[key] = arr;
    setSelectedTrip({ ...selectedTrip, flights: updatedFlights });
  };

  const updateDeclarationItem = (flightIndex, key, idx, value) => {
    const updatedFlights = [...selectedTrip.flights];
    const arr = [...(updatedFlights[flightIndex].luggage[key] || [])];
    arr[idx] = value;
    updatedFlights[flightIndex].luggage[key] = arr;
    setSelectedTrip({ ...selectedTrip, flights: updatedFlights });
  };

  const removeDeclarationItem = (flightIndex, key, idx) => {
    const updatedFlights = [...selectedTrip.flights];
    const arr = [...(updatedFlights[flightIndex].luggage[key] || [])];
    updatedFlights[flightIndex].luggage[key] = arr.filter((_, i) => i !== idx);
    setSelectedTrip({ ...selectedTrip, flights: updatedFlights });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <img src="/dark-logo.png" alt="FlyJetr Logo" className="dashboard-logo" />
        </div>
        <div className="header-bottom">
          <h1 className="page-title">Trip Management</h1>
          <div className="header-actions">
            <button 
              className="primary-button"
              onClick={addNewTrip}
            >
              + Create Trip
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="trips-section">
          <div className="section-header">
            <h2>Active Trips</h2>
            <div className="trip-filters">
              <select className="filter-select">
                <option value="all">All Trips</option>
                <option value="pending_client">Pending Client</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="table-loading">Loading trips…</div>
          )}
          {error && !loading && (
            <div className="table-error">{error}</div>
          )}
          {!loading && !error && trips.length === 0 && (
            <div className="table-empty">No trips yet. Click “Create Trip” to start.</div>
          )}

          <div className="trips-table">
            <div className="table-header">
              <div className="col-client">Client</div>
              <div className="col-route">Route</div>
              <div className="col-flights">Flights</div>
              <div className="col-date">Departure</div>
              <div className="col-aircraft">Aircraft</div>
              <div className="col-status">Status</div>
              <div className="col-actions">Actions</div>
            </div>
            
            {trips.map((trip) => (
              <div key={trip.id} className="table-row">
                <div className="col-client">
                  <div className="client-info">
                    <div className="client-name">{trip.clientName}</div>
                    <div className="client-email">{trip.clientEmail}</div>
                  </div>
                </div>
                <div className="col-route">
                  <div className="route-text">{trip.route}</div>
                </div>
                <div className="col-flights">
                  <div className="flights-text">{trip.numLegs} {trip.numLegs === 1 ? 'Flight' : 'Flights'}</div>
                </div>
                <div className="col-date">
                  <div className="date-text">{trip.departureDate}</div>
                  <div className="time-text">{trip.departureTime}</div>
                </div>
                <div className="col-aircraft">
                  <div className="aircraft-text">{trip.aircraftType}</div>
                </div>
                <div className="col-status">
                  <div className="status-text">
                    {formatStatus(trip.status)}
                  </div>
                </div>
                <div className="col-actions">
                  <div className="action-buttons">
                    <button 
                      className="action-button open-button"
                      onClick={() => editTrip(trip)}
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {selectedTrip && (
          <div className="trip-edit-modal">
            <div className="modal-content large-modal">
              <div className="modal-header">
                <h3>Trip Details: {selectedTrip.id}</h3>
                <button 
                  className="close-button"
                  onClick={() => setSelectedTrip(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                {/* Client Information */}
                <div className="section">
                  <h4>Client Information</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Client Name</label>
                      <input 
                        type="text" 
                        value={selectedTrip.clientName}
                        onChange={(e) => setSelectedTrip({...selectedTrip, clientName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Client Email</label>
                      <input 
                        type="email" 
                        value={selectedTrip.clientEmail}
                        onChange={(e) => setSelectedTrip({...selectedTrip, clientEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select 
                        value={selectedTrip.status}
                        onChange={(e) => setSelectedTrip({...selectedTrip, status: e.target.value})}
                      >
                        <option value="pending client info">Pending Client Info</option>
                        <option value="in progress">In Progress</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Flights Management */}
                <div className="section">
                  <div className="section-header">
                    <h4>Flights ({selectedTrip.flights.length})</h4>
                    <button 
                      className="add-flight-button"
                      onClick={() => addFlight()}
                    >
                      + Add Flight
                    </button>
                  </div>
                  
                  {selectedTrip.flights.map((flight, flightIndex) => (
                    <div key={flight.id} className="flight-card">
                      <div className="flight-header">
                        <h5>Flight {flightIndex + 1}</h5>
                        {selectedTrip.flights.length > 1 && (
                          <button 
                            className="remove-flight-button"
                            onClick={() => removeFlight(flightIndex)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Departure Airport</label>
                          <input 
                            type="text" 
                            value={flight.departure}
                            onChange={(e) => updateFlight(flightIndex, 'departure', e.target.value)}
                            placeholder="e.g., LAX"
                          />
                        </div>
                        <div className="form-group">
                          <label>Arrival Airport</label>
                          <input 
                            type="text" 
                            value={flight.arrival}
                            onChange={(e) => updateFlight(flightIndex, 'arrival', e.target.value)}
                            placeholder="e.g., JFK"
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Date</label>
                          <input 
                            type="date" 
                            value={flight.date}
                            onChange={(e) => updateFlight(flightIndex, 'date', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Time</label>
                          <input 
                            type="time" 
                            value={flight.time}
                            onChange={(e) => updateFlight(flightIndex, 'time', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Aircraft Type</label>
                          <select 
                            value={flight.aircraftType}
                            onChange={(e) => updateFlight(flightIndex, 'aircraftType', e.target.value)}
                          >
                            <option value="Light Jet">Light Jet</option>
                            <option value="Midsize Jet">Midsize Jet</option>
                            <option value="Heavy Jet">Heavy Jet</option>
                            <option value="Ultra Long Range">Ultra Long Range</option>
                          </select>
                        </div>
                      </div>

                      {/* Passengers for this flight */}
                      <div className="guests-section">
                        <div className="guests-header">
                          <h6>Passengers ({flight.guests.length})</h6>
                          <button 
                            className="add-guest-button"
                            onClick={() => addGuest(flightIndex)}
                          >
                            + Add Passenger
                          </button>
                        </div>
                        
                        {flight.guests.map((guest, guestIndex) => (
                          <div key={guestIndex} className="guest-card">
                            <div className="form-row">
                              <div className="form-group">
                                <label>Name</label>
                                <input 
                                  type="text" 
                                  value={guest.name}
                                  onChange={(e) => updateGuest(flightIndex, guestIndex, 'name', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Passport</label>
                                <div className="file-input-row">
                                  <label className="file-button">
                                    <svg className="icon-upload" viewBox="0 0 24 24" aria-hidden="true">
                                      <path fill="currentColor" d="M12 3c.41 0 .75.34.75.75V14l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06L11.25 14V3.75c0-.41.34-.75.75-.75zM4 15.5c.41 0 .75.34.75.75v2.5c0 .14.11.25.25.25h14c .14 0 .25-.11 .25-.25v-2.5c0-.41 .34-.75 .75-.75s.75 .34 .75 .75v2.5A1.75 1.75 0 0 1 19 20.5H5A1.75 1.75 0 0 1 3.25 18.75v-2.5c0-.41 .34-.75 .75-.75z"/>
                                    </svg>
                                    <span>Upload</span>
                                    <input 
                                      type="file" 
                                      accept="image/*,application/pdf"
                                      onChange={(e) => updateGuest(flightIndex, guestIndex, 'passportFile', e.target.files && e.target.files[0])}
                                      hidden
                                    />
                                  </label>
                                  <span className="file-name">{guest.passportFile ? guest.passportFile.name : 'No file selected'}</span>
                                </div>
                              </div>
                              <div className="form-group">
                                <button 
                                  className="remove-guest-button"
                                  onClick={() => removeGuest(flightIndex, guestIndex)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Luggage for this flight */}
                      <div className="luggage-section">
                        <h6>Luggage Information</h6>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Traditional Carry-On Bags</label>
                            <input 
                              type="number" 
                              min="0"
                              value={flight.luggage.carryOn}
                              onChange={(e) => updateLuggage(flightIndex, 'carryOn', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Traditional Checked Bags</label>
                            <input 
                              type="number" 
                              min="0"
                              value={flight.luggage.checked}
                              onChange={(e) => updateLuggage(flightIndex, 'checked', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Miscellaneous Bags (e.g., Golf bag, Guitar)</label>
                            <input 
                              type="number" 
                              min="0"
                              value={flight.luggage.misc}
                              onChange={(e) => updateLuggage(flightIndex, 'misc', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Total Weight (lbs)</label>
                            <input 
                              type="number" 
                              min="0"
                              value={flight.luggage.totalWeight}
                              onChange={(e) => updateLuggage(flightIndex, 'totalWeight', parseInt(e.target.value))}
                            />
                          </div>
                        </div>

                        {/* Declarations with yes/no and add lists */}
                        <div className="form-row">
                          <div className="form-group">
                            <label>Declare Miscellaneous Items?</label>
                            <div className="toggle-row">
                              <button type="button" className={flight.luggage.miscItems.length > 0 ? 'toggle on' : 'toggle'} onClick={() => updateLuggage(flightIndex, 'misc', Math.max(0, flight.luggage.misc))}>Yes</button>
                              <button type="button" className={flight.luggage.miscItems.length === 0 ? 'toggle on' : 'toggle'} onClick={() => updateLuggage(flightIndex, 'miscItems', [])}>No</button>
                            </div>
                            <div className="inline-actions">
                              <button type="button" className="add-guest-button" onClick={() => addDeclarationItem(flightIndex, 'miscItems', 'Golf bag')}>+ Add Item</button>
                              <span className="hint">Examples: Golf bag, Guitar</span>
                            </div>
                            {flight.luggage.miscItems.length > 0 && (
                              <ul className="declaration-list">
                                {flight.luggage.miscItems.map((it, i) => (
                                  <li key={i}>
                                    <input type="text" value={it} onChange={(e) => updateDeclarationItem(flightIndex, 'miscItems', i, e.target.value)} />
                                    <button type="button" className="remove-guest-button" onClick={() => removeDeclarationItem(flightIndex, 'miscItems', i)}>Remove</button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Bringing Pets?</label>
                            <div className="toggle-row">
                              <button type="button" className={flight.luggage.petItems.length > 0 ? 'toggle on' : 'toggle'} onClick={() => updateLuggage(flightIndex, 'pets', true)}>Yes</button>
                              <button type="button" className={flight.luggage.petItems.length === 0 ? 'toggle on' : 'toggle'} onClick={() => { updateLuggage(flightIndex, 'pets', false); updateLuggage(flightIndex, 'petItems', []); }}>No</button>
                            </div>
                            <div className="inline-actions">
                              <button type="button" className="add-guest-button" onClick={() => addDeclarationItem(flightIndex, 'petItems', `Pet #${flight.luggage.petItems.length + 1}`)}>+ Add Pet</button>
                            </div>
                            {flight.luggage.petItems.length > 0 && (
                              <ul className="declaration-list">
                                {flight.luggage.petItems.map((it, i) => (
                                  <li key={i}>
                                    <input type="text" value={it} onChange={(e) => updateDeclarationItem(flightIndex, 'petItems', i, e.target.value)} />
                                    <button type="button" className="remove-guest-button" onClick={() => removeDeclarationItem(flightIndex, 'petItems', i)}>Remove</button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Hazardous Materials?</label>
                            <div className="toggle-row">
                              <button type="button" className={flight.luggage.hazardousItems.length > 0 ? 'toggle on' : 'toggle'} onClick={() => updateLuggage(flightIndex, 'hazardous', true)}>Yes</button>
                              <button type="button" className={flight.luggage.hazardousItems.length === 0 ? 'toggle on' : 'toggle'} onClick={() => { updateLuggage(flightIndex, 'hazardous', false); updateLuggage(flightIndex, 'hazardousItems', []); }}>No</button>
                            </div>
                            <div className="inline-actions">
                              <button type="button" className="add-guest-button" onClick={() => addDeclarationItem(flightIndex, 'hazardousItems', 'Lithium battery')}>+ Add Item</button>
                              <span className="hint">Examples: Lithium battery</span>
                            </div>
                            {flight.luggage.hazardousItems.length > 0 && (
                              <ul className="declaration-list">
                                {flight.luggage.hazardousItems.map((it, i) => (
                                  <li key={i}>
                                    <input type="text" value={it} onChange={(e) => updateDeclarationItem(flightIndex, 'hazardousItems', i, e.target.value)} />
                                    <button type="button" className="remove-guest-button" onClick={() => removeDeclarationItem(flightIndex, 'hazardousItems', i)}>Remove</button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Firearms?</label>
                            <div className="toggle-row">
                              <button type="button" className={flight.luggage.firearmItems.length > 0 ? 'toggle on' : 'toggle'} onClick={() => updateLuggage(flightIndex, 'firearms', true)}>Yes</button>
                              <button type="button" className={flight.luggage.firearmItems.length === 0 ? 'toggle on' : 'toggle'} onClick={() => { updateLuggage(flightIndex, 'firearms', false); updateLuggage(flightIndex, 'firearmItems', []); }}>No</button>
                            </div>
                            <div className="inline-actions">
                              <button type="button" className="add-guest-button" onClick={() => addDeclarationItem(flightIndex, 'firearmItems', 'Small firearm')}>+ Add Firearm</button>
                              <span className="hint">Examples: Small firearm</span>
                            </div>
                            {flight.luggage.firearmItems.length > 0 && (
                              <ul className="declaration-list">
                                {flight.luggage.firearmItems.map((it, i) => (
                                  <li key={i}>
                                    <input type="text" value={it} onChange={(e) => updateDeclarationItem(flightIndex, 'firearmItems', i, e.target.value)} />
                                    <button type="button" className="remove-guest-button" onClick={() => removeDeclarationItem(flightIndex, 'firearmItems', i)}>Remove</button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="secondary-button"
                  onClick={() => setSelectedTrip(null)}
                >
                  Cancel
                </button>
                {selectedTrip.status === 'pending client info' && (
                  <button 
                    className="secondary-button"
                    onClick={() => copyClientLink(selectedTrip.id)}
                  >
                    Copy Client Form Link
                  </button>
                )}
                <button 
                  className="danger-button"
                  onClick={() => deleteTripData(selectedTrip.id)}
                >
                  Delete Trip
                </button>
                <button 
                  className="primary-button"
                  onClick={() => updateTripData(selectedTrip.id, selectedTrip)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
