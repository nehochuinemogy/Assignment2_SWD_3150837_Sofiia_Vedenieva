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

  
}