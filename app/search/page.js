'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serialNumberRegex } from '../lib/validation';

export default function SearchPage() {
  // state for the serial number 
  const [serial, setSerial] = useState('');
  // state for validation
  const [error, setError] = useState('');
  // state for the result object (appliance + user data)
  const [result, setResult] = useState(null);
  // state for not found
  const [notFound, setNotFound] = useState(false);
  // state for loading spinner 
  const [loading, setLoading] = useState(false);

}