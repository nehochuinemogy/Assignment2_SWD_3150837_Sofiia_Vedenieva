
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
  


  //JSX
  return (
    <div className="card">
      <h1>Search Appliance</h1>
      <p>Enter serial number to look up appliance details</p>

      {/* searching form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group" style={{ flex: 1 }}>
          <input
            type="text"
            className={`form-control ${error ? 'error' : ''}`}
            value={serial}
            onChange={(e) => {
              setSerial(e.target.value);
              setError('');        
            }}
            placeholder="SN-001-BOSCH"
            required
          />
          {error && <span className="field-error">{error}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Search'}
        </button>
      </form>

      {/* message not found */}
      {notFound && (
        <div className="alert alert-error">
          appliance not found 
        </div>
      )}

      {/*result table if exists*/}
      {result && (
        <div className="result-section">
          <div className="alert alert-success">Appliance found</div>
          <div className="app-heading">Details</div>
          <table className="data-table">
            <tbody>
              <Row label="Type" value={result.ApplianceType} />
              <Row label="Brand" value={result.Brand} />
              <Row label="Model" value={result.ModelNumber} />
              <Row label="Serial" value={result.SerialNumber} />
              <Row label="Purchase Date" value={new Date(result.PurchaseDate).toLocaleDateString()} />
              <Row label="Warranty Expiry" value={new Date(result.WarrantyExpirationDate).toLocaleDateString()} />
              <Row label="Cost" value={`€${parseFloat(result.Cost).toFixed(2)}`} />
            </tbody>
          </table>

          {/* User details */}
          <div className="app-heading">Registered Owner</div>
          <table className="data-table">
            <tbody>
              <Row label="Name" value={`${result.FirstName} ${result.LastName}`} />
              <Row label="Address" value={result.Address} />
              <Row label="Mobile" value={result.Mobile} />
              <Row label="Email" value={result.Email} />
              <Row label="Eircode" value={result.Eircode} />
            </tbody>
          </table>
        </div>
      )}

      {/* Back to home link */}
      <Link href="/" className="home-link">← Back to Home</Link>
    </div>
  );

}