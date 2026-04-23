import { NextResponse } from 'next/server';
import pool from '../lib/db';
import { serialNumberRegex, sanitise } from './lib/validation';

export async function GET(request) {
  try {
    // getting queryy url
    const { searchParams } = new URL(request.url);
    // extracting serial number 
    const serial = sanitise(searchParams.get('serial') || '');

    // validating serial number format before hitting database
    if (!serialNumberRegex.test(serial)) {
      return NextResponse.json({ message: 'invalid serial number' }, { status: 400 });
    }
  // JOIN querry to joijn appliance and user
    //using ? avoiding sql injection
    const [rows] = await pool.execute(
      `SELECT a.*, u.FirstName, u.LastName, u.Address, u.Mobile, u.Email, u.Eircode
       FROM Appliances a
       JOIN Users u ON a.UserID = u.UserID
       WHERE a.SerialNumber = ?`,
      [serial]
    );

    // if no rows returned, appliance does not exist
    if (rows.length === 0) {
      return NextResponse.json({ 
        message: 'Appliance not found' 
    }, { 
        status: 404 
    });
    }

    // returning matching appliance
    return NextResponse.json({ appliance: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }

}