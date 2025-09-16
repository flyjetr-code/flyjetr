// Firestore Data Models
// Based on the ERD from design-doc-v1.md

// Collection names
export const COLLECTIONS = {
  CONTACTS: 'contacts',
  REPRESENTATIVES: 'representatives',
  OPPORTUNITIES: 'opportunities',
  TRIPS: 'trips',
  FLIGHTS: 'flights',
  PASSENGERS: 'passengers',
  OPERATORS: 'operators',
  OPERATOR_ORDERS: 'operator_orders',
  VENDORS: 'vendors',
  VENDOR_ORDERS: 'vendor_orders',
  PAYMENTS: 'payments',
  LOGS: 'logs'
};

// Data model schemas for validation
export const CONTACT_SCHEMA = {
  name: 'string',
  email: 'string',
  phone: 'string',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

export const TRIP_SCHEMA = {
  clientName: 'string',
  clientEmail: 'string',
  route: 'string',
  departureDate: 'string',
  departureTime: 'string',
  aircraftType: 'string',
  numLegs: 'number',
  status: 'string', // 'pending client info', 'in progress', 'complete'
  clientLink: 'string',
  flights: 'array', // Array of flight objects
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

export const FLIGHT_SCHEMA = {
  id: 'string',
  departure: 'string',
  arrival: 'string',
  date: 'string',
  time: 'string',
  aircraftType: 'string',
  guests: 'array', // Array of guest objects
  luggage: 'object' // Luggage object
};

export const GUEST_SCHEMA = {
  name: 'string',
  relationship: 'string', // 'Primary', 'Spouse', 'Family', 'Business', 'Other'
  dob: 'string',
  weight: 'number'
};

export const LUGGAGE_SCHEMA = {
  carryOn: 'number',
  checked: 'number',
  misc: 'number',
  totalWeight: 'number',
  pets: 'boolean',
  firearms: 'boolean',
  hazardous: 'boolean'
};

export const PASSENGER_SCHEMA = {
  contactId: 'string',
  name: 'string',
  relationship: 'string', // 'self', 'spouse', 'child', 'guest'
  dob: 'timestamp',
  weight: 'number',
  passportId: 'string',
  passportUrl: 'string', // Google Cloud Storage URL
  allergies: 'string',
  preferences: 'string',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

export const OPERATOR_SCHEMA = {
  name: 'string',
  contactName: 'string',
  contactEmail: 'string',
  contactPhone: 'string',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

export const VENDOR_SCHEMA = {
  name: 'string',
  type: 'string', // 'catering', 'transportation', 'other'
  contactInfo: 'string',
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Trip status workflow
export const TRIP_STATUS = {
  PENDING_CLIENT_INFO: 'pending client info',
  IN_PROGRESS: 'in progress',
  COMPLETE: 'complete'
};

// Flight status workflow
export const FLIGHT_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed'
};

// Trip types
export const TRIP_TYPES = {
  ONE_WAY: 'one_way',
  ROUND_TRIP: 'round_trip',
  MULTI_LEG: 'multi_leg'
};
