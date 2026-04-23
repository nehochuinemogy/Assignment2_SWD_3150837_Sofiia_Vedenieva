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

}