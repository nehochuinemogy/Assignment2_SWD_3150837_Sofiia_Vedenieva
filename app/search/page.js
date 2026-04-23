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

  // handling form submission
  const handleSearch = async (e) => {
    e.preventDefault();                 
    // validating serial number
    if (!serialNumberRegex.test(serial)) {
      setError('Invalid serial number format , from 3-50 ');
      return;
    }
    setError(''); // clear previous error
    setLoading(true);// show  spinner
    setResult(null); // clear previous result
    setNotFound(false); // clear not found

    try {
      // serial querry is send to GET
      const res = await fetch(`/api/appliances/search?serial=${encodeURIComponent(serial)}`);
      const data = await res.json();

      if (res.ok && data.appliance) {
        // success
        setResult(data.appliance);
      } else if (res.status === 404) {
        // not found
        setNotFound(true);
      } else {
        // error 
        setError(data.message || 'error');
      }
    } catch (err) {
      //error 
      setError('error. Please try again');
    }
  };

  // showing label and value 
  const Row = ({ label, value }) => (
    <tr>
      <th className="table-label">{label}</th>
      <td className="table-value">{value}</td>
    </tr>
  );


}