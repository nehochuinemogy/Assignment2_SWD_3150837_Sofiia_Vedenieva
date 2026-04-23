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

}