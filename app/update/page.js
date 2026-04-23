// app/update/page.js
// 2-step update flow: 1) Lookup by serial, 2) Edit and save
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  nameRegex, addressRegex, mobileRegex, emailRegex, eircodeRegex,
  applianceTypeRegex, brandRegex, modelNumberRegex, serialNumberRegex, costRegex
} from './../lib/validation';

//dropdown for appliancxe
const APPLIANCE_TYPES = [
  ' Washing Machine', 
    'Dishwasher',
    'Refrigerator', 
    'Freezer',
    'Oven',
    'Microwave',
    'Tumble Dryer',
    'Vacuum Cleaner',
    'Air Conditioner', 
    'Water Heater', 
    'Other'
];

//implementing states
export default function UpdatePage() {
  const [step, setStep] = useState(1);
  const [searchSerial, setSearchSerial] = useState('');
  const [searchError, setSearchError] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // searching appliance
  const handleLookup = async (e) => {
    e.preventDefault();
    // validationn
    if (!serialNumberRegex.test(searchSerial)) {
      setSearchError('Invalid serial number format');
      return;
    }
    setSearchError('');
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/appliances/search?serial=${encodeURIComponent(searchSerial)}`);
      const data = await res.json();
      if (res.ok && data.appliance) {
        const a = data.appliance;
        // when form appears, previous data appears too
        setForm({
          applianceID: a.ApplianceID,
          userID: a.UserID,
          serialNumber: a.SerialNumber, // read-only, cannot change
          applianceType: a.ApplianceType,
          brand: a.Brand,
          modelNumber: a.ModelNumber,
          purchaseDate: a.PurchaseDate?.split('T')[0] || '',
          warrantyExpirationDate: a.WarrantyExpirationDate?.split('T')[0] || '',
          cost: a.Cost,
          firstName: a.FirstName,
          lastName: a.LastName,
          address: a.Address,
          mobile: a.Mobile,
          email: a.Email,
          eircode: a.Eircode,
        });
        setStep(2); // editing 
      } else {
        setSearchError('appliance not found');
      }
    } catch {
      setSearchError('error.please try again.');
    } finally {
      setLoadingSearch(false);
    }
  };
// handle changes in editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // validation for form
  const validate = () => {
    const e = {};
    if (!nameRegex.test(form.firstName)) e.firstName = 'Invalid first name';
    if (!nameRegex.test(form.lastName)) e.lastName = 'Invalid last name';
    if (!addressRegex.test(form.address)) e.address = 'Invalid address';
    if (!mobileRegex.test(form.mobile)) e.mobile = 'Invalid Irish mobile number';
    if (!emailRegex.test(form.email)) e.email = 'Invalid email address';
    if (!eircodeRegex.test(form.eircode)) e.eircode = 'Invalid Eircode (e.g. D02 AB12)';
    if (!applianceTypeRegex.test(form.applianceType)) e.applianceType = 'Invalid appliance type';
    if (!brandRegex.test(form.brand)) e.brand = 'Invalid brand';
    if (!modelNumberRegex.test(form.modelNumber)) e.modelNumber = 'Invalid model number';
    if (!form.purchaseDate) e.purchaseDate = 'Purchase date required';
    if (!form.warrantyExpirationDate) e.warrantyExpirationDate = 'Warranty date required';
    if (form.purchaseDate && form.warrantyExpirationDate &&
        new Date(form.warrantyExpirationDate) <= new Date(form.purchaseDate))
      e.warrantyExpirationDate = 'Warranty must be after purchase date';
    if (!costRegex.test(String(form.cost))) e.cost = 'Valid cost required (e.g. 599.99)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
// updating API
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/appliances/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error' });
    } finally {
      setLoading(false);
    }
  };
  
  // implrmrting reusable input field component
  const Field = ({ id, label, type = 'text', placeholder = '', maxLength = 100 }) => (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id} name={id} type={type}
        className={`form-control ${errors[id] ? 'error' : ''}`}
        value={form?.[id] ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required
      />
      {errors[id] && <span className="field-error">{errors[id]}</span>}
    </div>
  );

  return (
    <div className="card">
      <h1> Update appliance</h1>
      <p>Enter serial number of the appliance </p>

      {/* Form */}
      {step === 1 && (
        <form onSubmit={handleLookup} className="search-form">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="searchSerial">Serial number</label>
            <input
              id="searchSerial"
              type="text"
              className={`form-control ${searchError ? 'error' : ''}`}
              value={searchSerial}
              onChange={(e) => { setSearchSerial(e.target.value); setSearchError(''); }}
              placeholder="SN-001-BOSCH"
              required
            />
            {searchError && <span className="field-error">{searchError}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loadingSearch}>
            {loadingSearch ? 'Looking up...' : 'Find Appliance'}
          </button>
        </form>
      )}

      {/*Editing form */}
      {step === 2 && form && (
        <>
          {status && (
            <div className={`alert alert-${status.type}`}>
              {status.message}
            </div>
          )}
    
          <div className="alert alert-info">
            Editing appliance: <strong>{form.serialNumber}</strong> —  number cannot be changed.
          </div>

          <form onSubmit={handleUpdate}>
            <div className="app-heading">User </div>
            <div className="form-grid">
              <Field id="firstName" label="First Name" placeholder="John" />
              <Field id="lastName" label="Last Name" placeholder="Murphy" />
              <div className="full-width">
                <Field id="address" label="Address" placeholder="12 Oak Street, Dublin 2" maxLength={150} />
              </div>
              <Field id="mobile" label="Mobile" type="tel" placeholder="0871234567" maxLength={15} />
              <Field id="email" label="Email" type="email" placeholder="john@email.com" maxLength={100} />
              <Field id="eircode" label="Eircode" placeholder="D02 AB12" maxLength={8} />
            </div>

            <hr className="section-divider" />

            <div className="app-heading">Appliance </div>
            <div className="form-grid">
              {/* dropdown */}
              <div className="form-group">
                <label htmlFor="applianceType">Appliance type</label>
                <select
                  id="applianceType" name="applianceType"
                  className={`form-control ${errors.applianceType ? 'error' : ''}`}
                  value={form.applianceType}
                  onChange={handleChange}
                  required
                >
                  {APPLIANCE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.applianceType && <span className="field-error">{errors.applianceType}</span>}
              </div>
              <Field id="brand" label="Brand" placeholder="Bosch" />
              <Field id="modelNumber" label="Model Number" placeholder="WAE28468GB" />
              <Field id="purchaseDate" label="Purchase Date" type="date" />
              <Field id="warrantyExpirationDate" label="Warranty Expiry" type="date" />
              <Field id="cost" label="Cost (€)" type="number" placeholder="599.99" />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Updating...' : ' Update Appliance'}
            </button>
          </form>

          <button className="btn btn-secondary" onClick={() => { setStep(1); setForm(null); setStatus(null); }} style={{ marginTop: '1rem' }}>
            Search Again
          </button>
        </>
      )}

      <Link href="/" className="home-link">Back to Home</Link>
    </div>
  );
}