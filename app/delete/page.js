'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serialNumberRegex } from './../lib/validation';

export default function DeletePage() {
  const [step, setStep] = useState(1);
  const [searchSerial, setSearchSerial] = useState('');
  const [searchError, setSearchError] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [appliance, setAppliance] = useState(null);
  const [status, setStatus] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Step 1: Lookup handler
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
  };

  // Step 2: Delete handler
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

  // Helper component for table rows
  const Row = ({ label, value }) => (
    <tr>
      <th className="table-label">{label}</th>
      <td className="table-value">{value}</td>
    </tr>
  );

  return (
    <div className="card">
      <h1>🗑️ Delete Appliance</h1>
      <p>Enter serial number to permanently remove an appliance</p>

      {/* STEP 1: Lookup form */}
      {step === 1 && (
        <form onSubmit={handleLookup} className="search-form">
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="searchSerial">Serial Number</label>
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

      {/* STEP 2: Confirm deletion */}
      {step === 2 && appliance && (
        <>
          <div className="alert alert-warning">
            <strong>⚠️ Confirm Deletion</strong>
            <p>You are about to permanently delete this appliance. This action cannot be undone.</p>
          </div>

          <table className="data-table">
            <tbody>
              <Row label="Serial Number" value={appliance.SerialNumber} />
              <Row label="Type" value={appliance.ApplianceType} />
              <Row label="Brand" value={appliance.Brand} />
              <Row label="Model" value={appliance.ModelNumber} />
              <Row label="Registered To" value={`${appliance.FirstName} ${appliance.LastName}`} />
              <Row label="Email" value={appliance.Email} />
              <Row label="Purchase Date" value={new Date(appliance.PurchaseDate).toLocaleDateString()} />
              <Row label="Cost" value={`€${parseFloat(appliance.Cost).toFixed(2)}`} />
            </tbody>
          </table>

          {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

          <div className="flex gap-3" style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleDelete} className="btn btn-danger" disabled={loadingDelete}>
              {loadingDelete ? 'Deleting...' : '🗑️ Confirm Delete'}
            </button>
            <button onClick={() => { setStep(1); setAppliance(null); setSearchSerial(''); }} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </>
      )}

      {/* STEP 3: Success */}
      {step === 3 && (
        <div className="alert alert-success">
          ✅ Appliance successfully deleted. <Link href="/" className="back-link">Return to Home</Link>
        </div>
      )}

      <Link href="/" className="home-link">← Back to Home</Link>
    </div>
  );
}