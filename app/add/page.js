'use client';
//hook
import { useState } from 'react';
//link for navigation
import Link from 'next/link';
import {
  nameRegex, addressRegex, mobileRegex, emailRegex, eircodeRegex,
  applianceTypeRegex, brandRegex, modelNumberRegex, serialNumberRegex, costRegex
} from '../lib/validation';

//appliance array for options
const APPLIANCE_TYPES = [
  'Washing Machine',
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
//form state
export default function AddPage() {
  const [form, setForm] = useState({
     firstName: '',
     lastName: '', 
     address: '', 
     mobile: '', 
     email: '', 
     eircode: '',
     applianceType: '', 
     brand: '', 
     modelNumber: '', 
     serialNumber: '',
     purchaseDate: '', 
     warrantyExpirationDate: '', 
     cost: '',
  });
  //storing validation errors
  const [errors, setErrors] = useState({});
  //storing status 
  const [status, setStatus] = useState(null);
  //state for submit button
  const [loading, setLoading] = useState(false);

  //updating form values and clearing errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const validate = () => {

    //creating object to store errors 
   const e = {};

   //user input validation
 if (!nameRegex.test(form.firstName)) 
    e.firstName = 'Please, enter letters only, from 2-50 characters';
    if (!nameRegex.test(form.lastName)) 
        e.lastName = 'Please, enter letters only, from 2-50 characters';
    if (!addressRegex.test(form.address))
         e.address = 'Please, enter valid address from 5-150 chars';
    if (!mobileRegex.test(form.mobile))
         e.mobile = 'Please, enter valid mobile number 0800000000).';
    if (!emailRegex.test(form.email))
         e.email = 'Please, enter valid email address';
    if (!eircodeRegex.test(form.eircode)) 
        e.eircode = 'Please, enter valid eircode format D00 AB00';
   //appliance form validation
    if (!applianceTypeRegex.test(form.applianceType))
         e.applianceType = 'Please select a type.';
    if (!brandRegex.test(form.brand))
         e.brand = 'Please, enter brand from 1-50 chars';
    if (!modelNumberRegex.test(form.modelNumber)) 
        e.modelNumber = 'Please, enter model number';
    if (!serialNumberRegex.test(form.serialNumber))
         e.serialNumber = 'Please, enter serial number required from 3-50 char';
    if (!form.purchaseDate)
         e.purchaseDate = 'Please, enter purchase date';
    if (!form.warrantyExpirationDate)
         e.warrantyExpirationDate = 'Please, enter warranty date ';
    //enshuring that warrantly date is not entered before purchase dateaa
    if (form.purchaseDate && form.warrantyExpirationDate &&
        new Date(form.warrantyExpirationDate) <= new Date(form.purchaseDate))
      e.warrantyExpirationDate = 'Warranty date must be after purchase date.';
    if (!costRegex.test(form.cost)) e.cost = 'Please, enter valid cost 000.00';

    //updating error state
    setErrors(e);
    //if no errors eturnig true
    return Object.keys(e).length === 0;
    };

    //implementing nadling for form sunmission
     const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) return;
      
     setLoading(true);
     setStatus(null);

     try {
      // sending POST request to our API
      const res = await fetch('/api/appliances/add', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // success message and reseting form
        setStatus({ type: 'success', message: data.message });

      setForm({
          firstName: '', lastName: '', address: '', mobile: '', email: '', eircode: '',
          applianceType: '', brand: '', modelNumber: '', serialNumber: '',
          purchaseDate: '', warrantyExpirationDate: '', cost: '',
        });
         } else {
        //if else, returning error
        setStatus({ type: 'error', message: data.message || 'Failed to add appliance.' });
      }
       } catch {
      //implementing catch for errors
      setStatus({ type: 'error', message: 'error, lease try again.' });
     } finally {
      setLoading(false);
    }
};
    return (
    <div className="card"> 
      <h1 className="card-add-name">Add appliance</h1>
      <p className="card-add-desc">Please, enter information below</p>
     {/*
          * status- if not null=display
          * <div className={`alert alert-${status.type}`}- displaying a message with error-red, succes-green>
          * {status.message}- dispplaying message text(success or error)
          * {status.type === 'success' && (
            <> &nbsp;<Link href="/" className="back-link">Return to home</Link></>
          )} - if operation is succesful, return home lik appeared
          * <form onSubmit={handleSubmit}> - from started 
        */}
      {status && (
        <div className={`alert alert-${status.type}`}>
          {status.message}
          {status.type === 'success' && (
            <> &nbsp;<Link href="/" className="back-link">Return to home</Link></>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* user info*/}
        <div className="app-heading">User</div>
        <div className="form-grid">
          <div className = 'form-group'>
                {/*Name form*/}
          <label htmlFor="firstName">First name</label>
            <input
              id="firstName" name="firstName" type="text"
              className={`form-control ${errors.firstName ? 'error' : ''}`}
              value={form.firstName} onChange={handleChange}
              placeholder="Sofiia" maxLength={50} required
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>
           <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName" name="lastName" type="text"
              className={`form-control ${errors.lastName ? 'error' : ''}`} 
              value={form.lastName} onChange={handleChange}
              placeholder="Vedenieva" maxLength={50} required
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>
          {/* Form for address*/}
          <div className="form-address">
            <label htmlFor="address">Home address</label>
            <input
              id="address" name="address" type="text"
              className={`form-control ${errors.address ? 'error' : ''}`}
              value={form.address} onChange={handleChange}
              placeholder="South Circular Road, Dublin 8" maxLength={150} required
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
           {/*Mobile number*/}
            <div className="form-group">
            <label htmlFor="mobile">Mobile</label>
            <input
              id="mobile" name="mobile" type="tel"
              className={`form-control ${errors.mobile ? 'error' : ''}`}
              value={form.mobile} onChange={handleChange}
              placeholder="083 123 4567" maxLength={15} required
            />
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </div>
          {/*FOrm for Eircode */}
           <div className="form-group">
            <label htmlFor="eircode">Eircode</label>
            <input
              id="eircode" name="eircode" type="text"
              className={`form-control ${errors.eircode ? 'error' : ''}`}
              value={form.eircode} onChange={handleChange}
              placeholder="D00 AB00" maxLength={8} required
            />
            {errors.eircode && <span className="field-error">{errors.eircode}</span>}
          </div>
          {/*Form for email */}
          <div className="form-group full-width">
            <label htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={form.email} onChange={handleChange}
              placeholder="sofiiavedenieva@email.com" maxLength={100} required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
     </div>
           <hr className="section-divider" />

           {/* Appliance form */}
        <div className="app-heading">About the appliance</div>
        <div className="form-grid">

          {/*Form for choosing a type */}
          <div className="form-group">
            <label htmlFor="applianceType">Type</label>
            <select
              id="applianceType" name="applianceType"
              className={`form-control ${errors.applianceType ? 'error' : ''}`}
              value={form.applianceType} onChange={handleChange} required
            >
              <option value="">Please, choose a type</option>
              {APPLIANCE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.applianceType && <span className="field-error">{errors.applianceType}</span>}
          </div>
              {/*Form for brand */}
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand" name="brand" type="text"
              className={`form-control ${errors.brand ? 'error' : ''}`}
              value={form.brand} onChange={handleChange}
              placeholder="e.g. Bosch" maxLength={50} required
            />
            {errors.brand && <span className="field-error">{errors.brand}</span>}
          </div>

              {/*Form for model number */}
          <div className="form-group">
            <label htmlFor="modelNumber">Model number</label>
            <input
              id="modelNumber" name="modelNumber" type="text"
              className={`form-control ${errors.modelNumber ? 'error' : ''}`}
              value={form.modelNumber} onChange={handleChange}
              placeholder="e.g. WAE28468GB" maxLength={50} required
            />
            {errors.modelNumber && <span className="field-error">{errors.modelNumber}</span>}
          </div>

              {/*Form for serial number */}
          <div className="form-group">
            <label htmlFor="serialNumber">Serial number</label>
            <input
              id="serialNumber" name="serialNumber" type="text"
              className={`form-control ${errors.serialNumber ? 'error' : ''}`}
              value={form.serialNumber} onChange={handleChange}
              placeholder="e.g. SN-001-BOSCH" maxLength={50} required
            />
            {errors.serialNumber && <span className="field-error">{errors.serialNumber}</span>}
          </div>

              {/*Form for choosing purchase date */}
          <div className="form-group">
            <label htmlFor="purchaseDate">Purchased on:</label>
            <input
              id="purchaseDate" name="purchaseDate" type="date"
              className={`form-control ${errors.purchaseDate ? 'error' : ''}`}
              value={form.purchaseDate} onChange={handleChange} required
            />
            {errors.purchaseDate && <span className="field-error">{errors.purchaseDate}</span>}
          </div>

              {/*Form for warranty date */}
          <div className="form-group">
            <label htmlFor="warrantyExpirationDate">Warranty expires:</label>
            <input
              id="warrantyExpirationDate" name="warrantyExpirationDate" type="date"
              className={`form-control ${errors.warrantyExpirationDate ? 'error' : ''}`}
              value={form.warrantyExpirationDate} onChange={handleChange} required
            />
            {errors.warrantyExpirationDate && <span className="field-error">{errors.warrantyExpirationDate}</span>}
          </div>

              {/*Form for cost */}
          <div className="form-group">
            <label htmlFor="cost">Cost (€)</label>
            <input
              id="cost" name="cost" type="number" step="0.01" min="0"
              className={`form-control ${errors.cost ? 'error' : ''}`}
              value={form.cost} onChange={handleChange}
              placeholder="e.g. 599.99" required
            />
            {errors.cost && <span className="field-error">{errors.cost}</span>}
          </div>

        </div>

     <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? <><span className="spinner"></span> Adding…</> : 'Add appliance'}
        </button>
      </form>

      <Link href="/" className="home-link"> Back to home</Link>

    </div>
    )
}
  

  

