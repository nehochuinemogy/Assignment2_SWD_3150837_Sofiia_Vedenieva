'use client';

import { useState } from 'react';
import Link from 'next/link';
import {nameRegex, addressRegex, mobileRegex, emailRegex, eircodeRegex,
  applianceTypeRegex, brandRegex, modelNumberRegex, serialNumberRegex, costRegex
} from '../../lib/validation';

const APPLIANCE_TYPES = [
  'Washing Machine', 'Dishwasher', 'Refrigerator', 'Freezer',
  'Oven', 'Microwave', 'Tumble Dryer', 'Vacuum Cleaner',
  'Air Conditioner', 'Water Heater', 'Other'
];

export default function AddPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', mobile: '', email: '', eircode: '',
    applianceType: '', brand: '', modelNumber: '', serialNumber: '',
    purchaseDate: '', warrantyExpirationDate: '', cost: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const validate = () => {
    //creating object to store errors 
  const e = {};
}

};
