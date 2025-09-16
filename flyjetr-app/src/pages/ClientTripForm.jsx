import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import './ClientTripForm.css';

const ClientTripForm = () => {
  const { tripId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedGuests, setSavedGuests] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  // Mock data for demo
  useEffect(() => {
    // Simulate loading saved guests for this contact
    setSavedGuests([
      { id: 'guest1', name: 'John Doe', relationship: 'self', dob: '1985-03-15', weight: 180 },
      { id: 'guest2', name: 'Jane Doe', relationship: 'spouse', dob: '1987-07-22', weight: 140 }
    ]);
  }, []);

  const onSubmit = (data) => {
    console.log('Client Trip Form Data:', data);
    // TODO: Save to Firestore
    // TODO: Send webhook to CRM
    alert('Trip details completed successfully! (Demo mode)');
  };

  const nextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addGuest = () => {
    const newGuest = {
      id: `guest_${Date.now()}`,
      name: '',
      relationship: 'guest',
      dob: '',
      weight: 0,
      passportId: '',
      allergies: '',
      preferences: ''
    };
    setSelectedGuests([...selectedGuests, newGuest]);
  };

  const removeGuest = (guestId) => {
    setSelectedGuests(selectedGuests.filter(guest => guest.id !== guestId));
  };

  const selectSavedGuest = (guest) => {
    const newGuest = { ...guest, id: `guest_${Date.now()}` };
    setSelectedGuests([...selectedGuests, newGuest]);
  };

  return (
    <div className="client-trip-form">
      <header className="page-header">
        <h1>Aircraft Luggage Manifest</h1>
        <p>Trip ID: {tripId}</p>
      </header>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentPage / 3) * 100}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          <span className={currentPage >= 1 ? 'active' : ''}>Flight 1</span>
          <span className={currentPage >= 2 ? 'active' : ''}>Flight 2</span>
          <span className={currentPage >= 3 ? 'active' : ''}>Trip Summary</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        {/* Page 1: Flight 1 Details */}
        {currentPage === 1 && (
          <div className="form-section">
            <h2>Flight 1 - Luggage & Guest Information</h2>
            
            <div className="luggage-grid">
              <div className="form-group">
                <label htmlFor="carryOnBags">Total Number of Small / Traditional Carry-on Bags *</label>
                <input
                  type="number"
                  id="carryOnBags"
                  min="0"
                  {...register('carryOnBags', { 
                    required: 'Number of carry-on bags is required',
                    min: { value: 0, message: 'Must be 0 or greater' }
                  })}
                  placeholder="0"
                />
                {errors.carryOnBags && (
                  <span className="error-message">{errors.carryOnBags.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="checkedBags">Total Number of Large / Traditional Checked Bags *</label>
                <input
                  type="number"
                  id="checkedBags"
                  min="0"
                  {...register('checkedBags', { 
                    required: 'Number of checked bags is required',
                    min: { value: 0, message: 'Must be 0 or greater' }
                  })}
                  placeholder="0"
                />
                {errors.checkedBags && (
                  <span className="error-message">{errors.checkedBags.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="specialItems">Special or Oversized Items</label>
                <textarea
                  id="specialItems"
                  rows="3"
                  {...register('specialItems')}
                  placeholder="Describe any special items (golf clubs, skis, etc.)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pets">Are you bringing any pets?</label>
                <select id="pets" {...register('pets')}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="totalWeight">Estimated Total Weight of All Luggage (lbs) *</label>
                <input
                  type="number"
                  id="totalWeight"
                  min="0"
                  {...register('totalWeight', { 
                    required: 'Total weight is required',
                    min: { value: 0, message: 'Must be 0 or greater' }
                  })}
                  placeholder="0"
                />
                {errors.totalWeight && (
                  <span className="error-message">{errors.totalWeight.message}</span>
                )}
              </div>
            </div>

            <div className="safety-section">
              <h3>Safety Declarations</h3>
              <div className="form-group">
                <label htmlFor="firearms">Will you be transporting any firearms?</label>
                <select id="firearms" {...register('firearms')}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hazardous">Are you carrying any hazardous materials?</label>
                <select id="hazardous" {...register('hazardous')}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Page 2: Flight 2 Details */}
        {currentPage === 2 && (
          <div className="form-section">
            <h2>Flight 2 - Luggage & Guest Information</h2>
            
            {savedGuests.length > 0 && (
              <div className="saved-guests">
                <h3>Saved Guests</h3>
                <div className="saved-guests-grid">
                  {savedGuests.map(guest => (
                    <div key={guest.id} className="saved-guest-card">
                      <div className="guest-info">
                        <strong>{guest.name}</strong>
                        <span className="relationship">{guest.relationship}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => selectSavedGuest(guest)}
                        className="select-guest-btn"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="selected-guests">
              <h3>Selected Guests</h3>
              {selectedGuests.map((guest, index) => (
                <div key={guest.id} className="guest-form">
                  <div className="guest-header">
                    <h4>Guest {index + 1}</h4>
                    <button 
                      type="button" 
                      onClick={() => removeGuest(guest.id)}
                      className="remove-guest-btn"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_name`}>Full Name *</label>
                      <input
                        type="text"
                        id={`guest_${index}_name`}
                        {...register(`guests.${index}.name`, { required: 'Name is required' })}
                        placeholder="John Doe"
                        defaultValue={guest.name}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_relationship`}>Relationship *</label>
                      <select 
                        id={`guest_${index}_relationship`}
                        {...register(`guests.${index}.relationship`, { required: 'Relationship is required' })}
                        defaultValue={guest.relationship}
                      >
                        <option value="self">Self</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="guest">Guest</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_dob`}>Date of Birth *</label>
                      <input
                        type="date"
                        id={`guest_${index}_dob`}
                        {...register(`guests.${index}.dob`, { required: 'Date of birth is required' })}
                        defaultValue={guest.dob}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_weight`}>Weight (lbs) *</label>
                      <input
                        type="number"
                        id={`guest_${index}_weight`}
                        min="0"
                        {...register(`guests.${index}.weight`, { 
                          required: 'Weight is required',
                          min: { value: 0, message: 'Must be 0 or greater' }
                        })}
                        defaultValue={guest.weight}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_passport`}>Passport ID</label>
                      <input
                        type="text"
                        id={`guest_${index}_passport`}
                        {...register(`guests.${index}.passportId`)}
                        placeholder="A1234567"
                        defaultValue={guest.passportId}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`guest_${index}_allergies`}>Allergies</label>
                      <input
                        type="text"
                        id={`guest_${index}_allergies`}
                        {...register(`guests.${index}.allergies`)}
                        placeholder="None"
                        defaultValue={guest.allergies}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`guest_${index}_preferences`}>Special Preferences</label>
                    <textarea
                      id={`guest_${index}_preferences`}
                      rows="2"
                      {...register(`guests.${index}.preferences`)}
                      placeholder="Dietary restrictions, seating preferences, etc."
                      defaultValue={guest.preferences}
                    />
                  </div>
                </div>
              ))}
              
              <button type="button" onClick={addGuest} className="add-guest-btn">
                + Add Guest
              </button>
            </div>
          </div>
        )}

        {/* Page 3: Trip Summary & Preferences */}
        {currentPage === 3 && (
          <div className="form-section">
            <h2>Trip Summary & Additional Preferences</h2>
            
            <div className="form-group">
              <label htmlFor="catering">Would you like catering services?</label>
              <select id="catering" {...register('catering')}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            
            {watch('catering') === 'yes' && (
              <div className="form-group">
                <label htmlFor="cateringDetails">Catering Details</label>
                <textarea
                  id="cateringDetails"
                  rows="4"
                  {...register('cateringDetails')}
                  placeholder="Please specify your catering preferences, dietary restrictions, and any special requests..."
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="transportation">Would you like ground transportation?</label>
              <select id="transportation" {...register('transportation')}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            
            {watch('transportation') === 'yes' && (
              <div className="form-group">
                <label htmlFor="transportationDetails">Transportation Details</label>
                <textarea
                  id="transportationDetails"
                  rows="4"
                  {...register('transportationDetails')}
                  placeholder="Please specify pickup/dropoff locations, vehicle preferences, and any special requirements..."
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="additionalRequests">Additional Requests</label>
              <textarea
                id="additionalRequests"
                rows="4"
                {...register('additionalRequests')}
                placeholder="Any other special requests or requirements for your trip..."
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          {currentPage > 1 && (
            <button type="button" onClick={prevPage} className="secondary-button">
              Previous
            </button>
          )}
          {currentPage < 3 ? (
            <button type="button" onClick={nextPage} className="primary-button">
              Next
            </button>
          ) : (
            <button type="submit" className="primary-button">
              Complete Trip Details
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClientTripForm;
