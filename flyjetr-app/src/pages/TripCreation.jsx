import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './TripCreation.css';

const TripCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({});
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const [tripId, setTripId] = useState(null);
  const [showClientLink, setShowClientLink] = useState(false);

  const onSubmit = (data) => {
    console.log('Trip Creation Data:', data);
    // TODO: Save to Firestore
    // Generate demo trip ID
    const newTripId = `trip-${Date.now()}`;
    setTripId(newTripId);
    setShowClientLink(true);
  };

  const copyClientLink = () => {
    const clientUrl = `${window.location.origin}/client/trip/${tripId}`;
    navigator.clipboard.writeText(clientUrl);
    alert('Client link copied to clipboard!');
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="trip-creation">
      <header className="page-header">
        <h1>Trip Creation</h1>
        <p>Create a new trip and generate client form link</p>
      </header>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          <span className={currentStep >= 1 ? 'active' : ''}>Contact Info</span>
          <span className={currentStep >= 2 ? 'active' : ''}>Flight Details</span>
          <span className={currentStep >= 3 ? 'active' : ''}>Trip Summary</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  {...register('contactName', { required: 'Contact name is required' })}
                  placeholder="John Doe"
                />
                {errors.contactName && (
                  <span className="error-message">{errors.contactName.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  {...register('contactEmail', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="john@example.com"
                />
                {errors.contactEmail && (
                  <span className="error-message">{errors.contactEmail.message}</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPhone">Phone *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  {...register('contactPhone', { required: 'Phone is required' })}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.contactPhone && (
                  <span className="error-message">{errors.contactPhone.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="repId">Sales Rep</label>
                <select id="repId" {...register('repId')}>
                  <option value="">Select Sales Rep</option>
                  <option value="rep1">Sarah Johnson</option>
                  <option value="rep2">Mike Chen</option>
                  <option value="rep3">Lisa Rodriguez</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Flight Details */}
        {currentStep === 2 && (
          <div className="form-section">
            <h2>Flight Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tripType">Trip Type *</label>
                <select 
                  id="tripType" 
                  {...register('tripType', { required: 'Trip type is required' })}
                >
                  <option value="">Select Trip Type</option>
                  <option value="one_way">One Way</option>
                  <option value="round_trip">Round Trip</option>
                  <option value="multi_leg">Multi-Leg</option>
                </select>
                {errors.tripType && (
                  <span className="error-message">{errors.tripType.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="numLegs">Number of Legs *</label>
                <input
                  type="number"
                  id="numLegs"
                  min="1"
                  max="10"
                  {...register('numLegs', { 
                    required: 'Number of legs is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  placeholder="1"
                />
                {errors.numLegs && (
                  <span className="error-message">{errors.numLegs.message}</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="depAirport">Departure Airport *</label>
                <input
                  type="text"
                  id="depAirport"
                  {...register('depAirport', { required: 'Departure airport is required' })}
                  placeholder="LAX"
                />
                {errors.depAirport && (
                  <span className="error-message">{errors.depAirport.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="arrAirport">Arrival Airport *</label>
                <input
                  type="text"
                  id="arrAirport"
                  {...register('arrAirport', { required: 'Arrival airport is required' })}
                  placeholder="JFK"
                />
                {errors.arrAirport && (
                  <span className="error-message">{errors.arrAirport.message}</span>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="depDate">Departure Date *</label>
                <input
                  type="date"
                  id="depDate"
                  {...register('depDate', { required: 'Departure date is required' })}
                />
                {errors.depDate && (
                  <span className="error-message">{errors.depDate.message}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="depTime">Departure Time *</label>
                <input
                  type="time"
                  id="depTime"
                  {...register('depTime', { required: 'Departure time is required' })}
                />
                {errors.depTime && (
                  <span className="error-message">{errors.depTime.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="aircraftType">Aircraft Type</label>
              <select id="aircraftType" {...register('aircraftType')}>
                <option value="">Select Aircraft</option>
                <option value="light_jet">Light Jet (4-6 passengers)</option>
                <option value="midsize_jet">Midsize Jet (6-8 passengers)</option>
                <option value="super_midsize">Super Midsize Jet (8-10 passengers)</option>
                <option value="heavy_jet">Heavy Jet (10-16 passengers)</option>
                <option value="ultra_long_range">Ultra Long Range (12-16 passengers)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Trip Summary */}
        {currentStep === 3 && (
          <div className="form-section">
            <h2>Trip Summary</h2>
            <div className="summary-content">
              <div className="summary-item">
                <strong>Contact:</strong> {watch('contactName')} ({watch('contactEmail')})
              </div>
              <div className="summary-item">
                <strong>Trip Type:</strong> {watch('tripType')?.replace('_', ' ').toUpperCase()}
              </div>
              <div className="summary-item">
                <strong>Route:</strong> {watch('depAirport')} → {watch('arrAirport')}
              </div>
              <div className="summary-item">
                <strong>Departure:</strong> {watch('depDate')} at {watch('depTime')}
              </div>
              <div className="summary-item">
                <strong>Aircraft:</strong> {watch('aircraftType')?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                rows="4"
                {...register('notes')}
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>
        )}

        {!showClientLink ? (
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="secondary-button">
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="primary-button">
                Next
              </button>
            ) : (
              <button type="submit" className="primary-button">
                Create Trip & Generate Client Link
              </button>
            )}
          </div>
        ) : (
          <div className="success-section">
            <h2>✅ Trip Created Successfully!</h2>
            <p>Your trip has been created. Share this link with your client to complete their details:</p>
            <div className="client-link-container">
              <code className="client-link">{window.location.origin}/client/trip/{tripId}</code>
              <button onClick={copyClientLink} className="primary-button">
                Copy Client Link
              </button>
            </div>
            <div className="success-actions">
              <button onClick={() => navigate('/')} className="secondary-button">
                Back to Dashboard
              </button>
              <button onClick={() => setShowClientLink(false)} className="primary-button">
                Create Another Trip
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TripCreation;
