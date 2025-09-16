// Firestore Service
// Handles all database operations for the FlyJetr application

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { COLLECTIONS } from '../config/firestore-models';

// Trip Operations
export const createTrip = async (tripData) => {
  try {
    const tripRef = await addDoc(collection(db, COLLECTIONS.TRIPS), {
      ...tripData,
      status: 'pending client info',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return tripRef.id;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
};

export const updateTrip = async (tripId, updateData) => {
  try {
    const tripRef = doc(db, COLLECTIONS.TRIPS, tripId);
    await updateDoc(tripRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

export const getTrip = async (tripId) => {
  try {
    const tripRef = doc(db, COLLECTIONS.TRIPS, tripId);
    const tripSnap = await getDoc(tripRef);
    
    if (tripSnap.exists()) {
      return { id: tripSnap.id, ...tripSnap.data() };
    } else {
      throw new Error('Trip not found');
    }
  } catch (error) {
    console.error('Error getting trip:', error);
    throw error;
  }
};

export const getAllTrips = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TRIPS),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting trips:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const tripRef = doc(db, COLLECTIONS.TRIPS, tripId);
    await deleteDoc(tripRef);
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

// Flight Operations
export const createFlight = async (flightData) => {
  try {
    const flightRef = await addDoc(collection(db, COLLECTIONS.FLIGHTS), {
      ...flightData,
      status: 'requested',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return flightRef.id;
  } catch (error) {
    console.error('Error creating flight:', error);
    throw error;
  }
};

// Passenger Operations
export const createPassenger = async (passengerData) => {
  try {
    const passengerRef = await addDoc(collection(db, COLLECTIONS.PASSENGERS), {
      ...passengerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return passengerRef.id;
  } catch (error) {
    console.error('Error creating passenger:', error);
    throw error;
  }
};

export const getPassengersByContact = async (contactId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PASSENGERS),
      where('contactId', '==', contactId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting passengers:', error);
    throw error;
  }
};

// Contact Operations
export const createContact = async (contactData) => {
  try {
    const contactRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
      ...contactData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return contactRef.id;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const getContact = async (contactId) => {
  try {
    const contactRef = doc(db, COLLECTIONS.CONTACTS, contactId);
    const contactSnap = await getDoc(contactRef);
    
    if (contactSnap.exists()) {
      return { id: contactSnap.id, ...contactSnap.data() };
    } else {
      throw new Error('Contact not found');
    }
  } catch (error) {
    console.error('Error getting contact:', error);
    throw error;
  }
};

// Logging Operations
export const logAction = async (actionData) => {
  try {
    await addDoc(collection(db, COLLECTIONS.LOGS), {
      ...actionData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging action:', error);
    // Don't throw error for logging failures
  }
};

// Utility Functions
export const generateClientFormUrl = (tripId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/client/trip/${tripId}`;
};

export const sendWebhookNotification = async (webhookUrl, data) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error sending webhook:', error);
    throw error;
  }
};
