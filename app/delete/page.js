'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serialNumberRegex } from './../lib/validation';

export default function DeletePage() {
  const [step, setStep] = useState(1);         // 1=lookup, 2=confirm, 3=success
  const [searchSerial, setSearchSerial] = useState('');
  const [searchError, setSearchError] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [appliance, setAppliance] = useState(null);
  const [status, setStatus] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
}

 const handleLookup = async (e) => {
    e.preventDefault();
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
        setAppliance(data.appliance);
        setStep(2);
      } else {
        setSearchError('No matching appliance found');
      }
    } catch {
      setSearchError('Network error. Please try again.');
    } finally {
      setLoadingSearch(false);
    }
      const handleDelete = async () => {
    setLoadingDelete(true);
    setStatus(null);
    try {
      const res = await fetch('/api/appliances/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialNumber: appliance.SerialNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error' });
    } finally {
      setLoadingDelete(false);
    }
  };
   const Row = ({ label, value }) => (
    <tr>
      <th className="table-label">{label}</th>
      <td className="table-value">{value}</td>
    </tr>
  );
  };
