# Design Document

[Design Logs](https://www.notion.so/Design-Logs-270b60a291ed80eb86a1ff98c2d80970?pvs=21)

# 1. Current Status (Completed)

---

The following functionality is already built and live:

- **Lead acquisition** from marketing channels into GHL
- **Opportunity tracking** in GHL pipelines
- **Quote generation process**
- **Contracting & payment handling**:
    - Invoice generation
    - CC authorization
    - Wire transfer support
    - 

This design doc focuses on what happens **after payment** and the optimization of upstream workflows.

---

## 2. Areas Needing Optimization

Before extending into logistics and operations, several existing workflows should be optimized:

- **Lead Qualification Workflows**
    - Automate trip vs. jet card qualification
    - Standardize qualification criteria and store in Airtable

---

## 3. New Concepts to Initialize

To extend the workflow beyond payment, we need new **data objects** linked to GHL Contacts.

### 3.1 Passenger Profiles

- Independent records from Contact (since the contact isn’t always a flyer)
- Includes:
    - Name
    - Relationship to booking contact
    - DOB, weight
    - ID/passport (file upload)
    - Allergies, preferences
- **One contact may have multiple passenger profiles**

### 3.2 Flights

- Represents a **single aircraft booking** with operator
- Includes:
    - Operator details
    - Aircraft type, tail #
    - Departure/arrival airport
    - Departure date/time
    - Duration
    - Status (requested, confirmed, completed)
- **A Trip can include one or multiple Flights**

### 3.3 Trips

- The “master” operational object
- Links together:
    - Contact (primary client)
    - Passenger profiles (one-to-many)
    - Flight(s)
    - Vendor_Orders (catering, transport, other services)
    - Payments (already secured)

### 3.4 Vendors

- Categories: Catering, Transportation, Other
- Standard flow: Quote → Confirm → Pay → Reconcile

---

## 4. System Design

### 4.1 GHL Role

- **Front-end CRM** for lead capture, nurturing, and communications
- Primary place for Sales Reps to manage opportunities
- Stores:
    - Contacts (clients & prospects)
    - Pipelines (sales & operations)
    - Automations (marketing, reminders, notifications)

### 4.2 Airtable Role

- **Operational Database** & Single Source of Truth for trips
- Stores structured data objects:
    - Trips
    - Flights
    - Passengers
    - Vendors
    - Payments
- Used by Operations team for logistics, reconciliation, and reporting

### 4.3 System Flow

[Sign up | Miro | Online Whiteboard for Visual Collaboration](https://miro.com/welcomeonboard/NWYwZGc2bi8yL2lQNE83Z1ZxUzhLM1R3Q0VVallBalY5MzJFVEl2RFN0bERLRTFLaFdBTzJSSzd0ZVVaMUxYTXdsV3JXWDZWdmV3T29lcnNVb2htK2pGMDFVTEpCWEZuVEc1d3B6bFZxUXowaUhiUkJUY2tXL0t6R054Z1FoSVdzVXVvMm53MW9OWFg5bkJoVXZxdFhRPT0hdjE=?share_link_id=258649230893)

---

## 5. Tech Decisions

### 5.1 Official Stack

- Cursor: IDE
    - Reason: decided to stay away from firebase studio to sharpen my skills and have more control via a proper git process. Even though it’s great. I want more control and better learning with Cursor.
- Firebase: Hosting
    - *Reason*: want to stay full google.
- FireStore: Integrated Database
    - Easily Maintainable google solution and in Firebase stack
    - Firebase v.s. Airtable Notes: (moving away from airtable because I will not build any interfaces anyway.)
    
    **Yes, Firestore is the recommendation.**
    
    Key reasons:
    
    - **Custom forms need a proper database** (not Airtable's API)
    - **Stays Google ecosystem** (your requirement)
    - **Real-time + scalable** (no rate limits)
    - **Firebase + Admin SDK** for ops team superpowers
        
        [**Firebase vs Vercel**](https://www.notion.so/Firebase-vs-Vercel-270b60a291ed80788e72d230ce23c238?pvs=21)
        
    - **Firestore**
        
        [FireStore v.s. BigQuery](https://www.notion.so/FireStore-v-s-BigQuery-270b60a291ed8023ab0eed4c28bfcc6f?pvs=21)
        
- Google API Storage: File Storage (passports)
    - Google Solution

### 5.2 TBDs and Discussions

Dont want to delete these want to keep my notes on I why I made decisions and what I researched.

1. Determined Passport Storage
    1. Firestore or Google API storage?
        1. Google API is the correct solution. FireStore is meant for structured data.
    2. URL organization determined in 6.5
2. N8n for workflows? Or maybe just functions in the app as much in ghl as pssoible is dieal
    1. most likely going to stick with GHL and any cloud functions

### 5.3 Vibe Coding Approach

I will keep notes on this and how effective it was in a separate doc but I will create a markdown version of this and then use it cursor I will keep version of these docs. I will then periodically update this with anything relevant from there manually this way I don’t get distracted using MCP etc. 

See more in:

[DevelopMent RoadMap](https://www.notion.so/DevelopMent-RoadMap-270b60a291ed80268966fd8a19874fad?pvs=21)

---

# 6. Data:

### 6.1 Relationships

Below needs final review

```mermaid
erDiagram
    CONTACTS ||--o{ OPPORTUNITIES : "have"
    CONTACTS ||--o{ PASSENGERS : "has"
    CONTACTS ||--o{ TRIPS : "books"
    OPPORTUNITIES ||--o{ TRIPS : "can lead to"
    TRIPS ||--o{ FLIGHTS : "includes"
    TRIPS ||--o{ PASSENGERS : "includes"
    FLIGHTS ||--o{ VENDOR_ORDERS : "can include"
    TRIPS ||--o{ PAYMENTS : "settles"
    FLIGHTS }o--|| OPERATOR_ORDERS : "secured through"
    OPERATOR_ORDERS }o--|| OPERATORS : "operated by"
    VENDOR_ORDERS }o--|| VENDORS : "fulfilled by"
    OPERATOR_ORDERS ||--o{ PAYMENTS : "settles"
    VENDOR_ORDERS ||--o{ PAYMENTS : "settles"
    REPRESENTATIVES ||--o{ OPPORTUNITIES : "own or follow"
    REPRESENTATIVES ||--o{ CONTACTS : "own or follow"
    REPRESENTATIVES ||--o{ TRIPS : "own"

    CONTACTS {
        int id
        string name
        string email
        string phone
    }
    
    REPRESENTATIVES {
        int id
        string name
        string email
        string phone
    }
    
    OPPORTUNITIES {
        int id
        string name
				string status
    }

    PASSENGERS {
        int id
        string name
        file passport
    }

    TRIPS {
        int id
        int contact_id
        int representative_id
        status 'draft' | 'pending_client' | 'client_completed' | 'in_progress' | 'complete'
        string trip_type
        int num_legs
        date start_date
        date end_date
        string status
    }

    FLIGHTS {
        int id
        trip_id
        string status
        string tail_number
        string aircraft_type
        string aircraft_model
        string operator_id
        string dep_airport
        string arr_airport
        json passengers_json
        json luggage_json
        datetime dep_time
        datetime arr_time 
    }

    OPERATORS {
        int id
        string name
        string contact_name
        string contact_email
        string contact_phone
    }
    
    OPERATOR_ORDERS {
		    int id
		    int operator_id
        string operator_name
        string status
        float cost
        string description
    }

    VENDOR_ORDERS {
        int id
        int vendor_id
        string name
        string status
        float cost
        string description
    }

    VENDORS {
        int id
        string contact_info
        string type_name
    }

    PAYMENTS {
        int id
        string type 
        float amount
        string status
        datetime date
    }

```

<aside>
🧻

**Database Design Approach**

For v1.0 we will rely on normalized relationships rather than duplicating data across tables. This avoids ***data drift***

*(where two copies of the same information fall out of sync) and keeps the system easier to maintain. In Airtable, linked records, lookups, and rollups provide the same benefits as foreign keys and joins in a relational database. Given the system’s expected size, Airtable can handle these relationships efficiently without needing denormalization or redundant fields.*

</aside>

### **6.2. Centralized Logs Table**

**Advantages:**

- Easier to manage than dozens of tiny log tables.
- Centralized reporting — you can filter by table, record, user, or action.
- Reduces schema complexity in Airtable.

**Structure (recommended):**

| Field Name | Type | Notes |
| --- | --- | --- |
| `Timestamp` | Created time | When change occurred |
| `User` | Collaborator / text | Who made the change |
| `Action` | Single select | Created / Updated / Deleted |
| `Table Name` | Single select | E.g., Trips, Passengers, Vendors |
| `Record ID` | Single line text | UUID |
| `Record Name` | Single line text | Primary field from the record |
| `Changed Fields` | Long text / JSON | Optional: list of fields changed |
| `Previous Values` | Long text / JSON | Optional: old values |
| `New Values` | Long text / JSON | Optional: new values |

### 6.3 Other Data Relationship Note

Opportunities and Flights:

there will be relation between them but a 1:1 relationship. Optional Opportunity ID field (implemented later)

Representatives and Contacts live in Firestore and GHL

most of the representative’s data will live in firestore for the purpose of adding more fields

a bit of tbd later for changes with this.

### 6.5 Passport File Storage

![Screenshot 2025-09-13 at 3.23.52 PM.png](Design%20Document%2026ab60a291ed8067b39ac6f826fa85b9/Screenshot_2025-09-13_at_3.23.52_PM.png)

```python
Firestore (your main database)
├── Passenger Profiles table
│   ├── passport_url (link to Cloud Storage)
│   └── passport_uploaded_date
│
Google Cloud Storage
├── Bucket: passenger-documents
│   └── Structure: /contacts/{contact_id}/passengers/{passenger_id}/passport.jpg
```

# 7 Interface Design

## 7.1 Interface #1: Internal - Trip Creation

**Trip Manager URL**:`ops.flyjetr.com/trips/new`

**New Trip URL**: `ops.flyjetr.com/trips/new`

**Trip Editor URL:** `ops.flyjetr.com/trips/{tripId}`

### **Fields Entered by Broker:**

**Trip Overview**

- Client Name
- Client Email
- Client Phone
- Trip Type
- Number of Legs (if Multi Leg)

### Flight Information (Repeatable)

- **Core Flight Data**
    - Departure Airport (ICAO code)
    - Arrival Airport (ICAO code)
    - Departure Date & Time
    - Aircraft Type
    - Aircraft Model
- **Initial Setup**
    - Estimated Passenger Count
    - VIP/Special Passenger Notes
    - Luggage counts with arrays to track declaration items (`miscItems`, `petItems`, `hazardousItems`, `firearmItems`).
- **Service Pre-Planning**
    - Catering Requirements (pre-filled options)
    - Ground Transportation Needs
    - Special Requests/Notes

### Internal Operations

- Assigned Broker/Representative
- Internal Notes
- Expected Completion Date

**Data Notes**: This form will **create** Trip and Flight objects.

**Process Notes**: This is the same interface that will be used to finalize the creation of the trip and send off to create the trip sheet. This should then be sent to the client to complete with the initialized Trip (will likely be automated in the future to add more of a connection between the quote and flight but for now this should be handled by the broker).

**Actions**:

- Save Draft
- Generate Client Form Link

this should then be sent to the client to complete with the initialized Trip

(will likely be automated in the future to add more of a connection between the original quote and flight but for now this can should be handled by the broker)

**Future Optimization Notes:**

Entering the contact info will allow for linking of an opportunity or this should be done automatically via some validation. 

### Process Notes:

This is the same interface that will be used in order to finalize the creation of the trip and send off to create the trip sheet.

## 7.2 Interface #2: Client - Trip Form

This is the final input the client will have into the system the rest will be handled by the rep.

Client will input:

1. Guest info
2. Luggage Info
3. Any requests for Catering etc.

The structure is:

Trip 

Flight 1

Luggage Info

Number of Checked Bags <50lbs

Number of Carry Ons 

Number Misc Bags (describe each)

Passenger Profiles

Number of Guests

Guest 1 Info

Name

Passport

Guest 2 Info

Catering and Transport? per flight.

add Details if yes

…

Flight 2

….

Wording

Aircraft Luggage Manifest

**1. Total Number of Small / Traditional Carry-on Bags**

**2. Total Number of Large / Traditional Checked Bags**

**3. Special or Oversized Items**

1. Are you bringing any pets?

**4. Estimated Total Weight of All Luggage**

Safety Declarations

**5. Will you be transporting any firearms?**

**6. Are you carrying any hazardous materials?**

ability to use saved guest profiles

I believe that the repeatable guest info feature is very important and will drive me to build a custom solution

[Saved Guest Profile Implementation](https://www.notion.so/Saved-Guest-Profile-Implementation-270b60a291ed80919bd2d1e421b98140?pvs=21)

### Data Notes:

This form will 

update

Trip

Flight

create/update

Guest Profiles

### 7.2 Interface #2: Client Booking Portal - Trip Form

**URL**: `travel.flyjetr.com/trip/{tripId}`

This is the final input the client will have into the system; the rest will be handled by the rep.

Client will input:

1. Guest info
2. Luggage Info
3. Any requests for Catering etc.

Structure Per Flight:

**Passenger Manifest**

- Passenger Count Confirmation
- Passenger Details (repeatable rows)
    - Name (as on passport)
    - Passport Upload (classic upload icon button + filename display)

**Aircraft Luggage Manifest**

Traditional Luggage:

- 1. Total Number of Small / Traditional Carry-on Bags
- 2. Total Number of Large / Traditional Checked Bags
- 3. Miscellaneous Bags (e.g., Golf bag, Guitar) - explicit count inputs with descriptions

Safety Declarations (Yes/No toggles with add-one-by-one lists):

- Are you bringing any pets? → Add pet details one-by-one
- 4. Estimated Total Weight of All Luggage
- 5. Will you be transporting any firearms? → (e.g., Small firearm)
- 6. Are you carrying any hazardous materials? → (e.g., Lithium battery)

**Service Requests (Per Flight)**

- **Catering and Transport?**
    - Add details if yes
    - Catering preferences & dietary restrictions
    - Ground transportation (pickup/dropoff details)

**Ability to use saved guest profiles** - I believe that the repeatable guest info feature is very important and will drive me to build a custom solution.

**Data Notes**: This form will **update** Trip and Flight objects, and **create/update** Guest Profiles.

**Progress Indicator**:

- Step 1: Trip Created ✓
- Step 2: Client Information (current)
- Step 3: Trip Finalization (pending)

### 7.3 Interface #3: Operations Portal - Trip Review & Finalization

**URL**: `ops.flyjetr.com/trips/{tripId}/review`

Can be accessed via a **Submit** button through the normal trip editor interface

**Client Submission Review**

- All client-entered information displayed
- Edit capabilities for corrections
- Approval checkboxes per section

**Vendor Coordination**

- Catering orders (create/assign)
- Transportation bookings
- Special service arrangements

**Final Operations**

- Flight manifest generation
- Documentation package
- Client confirmation sending
- Trip status update to "Complete"

### 7.4 Future Interfaces.

**Vendor Service Entry (least important of the three)**

Purpose: Create Entries for Vendor Services

simple form. should be able to use airtable

may be a bit complex when looking at how we want to manage payments and link them to the vendor services

**Payment Logging Integrations**

What i am doing is creating a secondary operating system to manage finance which may be a bit overkill. There should be the option to link a quickbooks entry or something via optional link.

For now i dont need to worry about the payments objects

## 7.5 Styling and UI/UX Notes

**Font:** 'Plus Jakarta Sans',Helvetica,Arial,Lucida,sans-serif

**Font Color:** Grey ****#6d5e5e 

**Primary Color:** White

Secondary Color: Black

**Accent Color: Red #e02b20**

**Button Style:**

/* Primary Button Style */
.primary-button {
/* Appearance */
background-color: #111111;
color: #FFFFFF;
border-radius: 100px;
box-shadow: 0px 5px 5px 0px rgba(17, 17, 17, 0.15);

/* Typography */
font-family: 'Plus Jakarta Sans', Helvetica, Arial, Lucida, sans-serif;
font-size: 15px;
font-weight: 600;

/* Spacing */
padding: 14px 60px 17px 60px;

/* Interaction */
transition: all 300ms ease 0ms;
cursor: pointer;
text-decoration: none;

## 9 Workflow Design

**Trip Creation Flow**

This is the first thing I want to develop - how the interfaces 1, 2, and 3 play together.

**Step 1: Trip Initiation (Broker Portal)**

- **Portal**: `ops.flyjetr.com` (Operations Portal)
- **Actor**: Broker/Operations Team
- **Action**: Broker initiates the trip by creating it where they can add as much info as they need including flight profiles, contact details, etc.
- **Completion**: Upon completion, a webhook with the unique form link for this contact is pushed to CRM so broker can communicate the link with the contact via text

**Step 2: Client Information Collection**

- **Portal**: `travel.flyjetr.com/trip/{tripId}` (Client Booking Portal)
- **Actor**: Client/Guest
- **Action**: Guest completes their version of the same flight object with their guest profiles, luggage info, catering details, etc.

**Step 3: Trip Finalization**

- **Portal**: `ops.flyjetr.com` (Operations Portal)
- **Actor**: Broker/Operations Team
- **Completion**: Broker is notified of completion via webhook that fires to the CRM again for an internal notification to be sent. Then they can complete it showing that guest completed their part. A step 2/3 progress bar is complete at the bottom of the interface showing: Step 1 (Trip Creation), Step 2 (Client Information Entered), Step 3 (Trip Finalization). Then this is complete and stored with an updated status.

## 10. Future Enhancements (not to be developed)

- Operator API integration (real-time aircraft availability)
- Jet card management module
- Automated client trip portal
- Payment Triggered Workflows (QB/Auth.net integration)

---

## Messy Notes: