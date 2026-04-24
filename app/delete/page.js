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