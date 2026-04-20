'use client';

import { useState } from 'react';

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
    if (form.purchaseDate && form.warrantyExpirationDate &&
        new Date(form.warrantyExpirationDate) <= new Date(form.purchaseDate))
      e.warrantyExpirationDate = 'Warranty date must be after purchase date.';
    if (!costRegex.test(form.cost)) e.cost = 'Please, enter valid cost 000.00';

    setErrors(e);
    return Object.keys(e).length === 0;
  };
};
