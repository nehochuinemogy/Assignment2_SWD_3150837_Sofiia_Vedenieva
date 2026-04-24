import { NextResponse } from 'next/server';
import pool from '../lib/db';
import { serialNumberRegex, sanitise } from '@/lib/validation';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const serial = sanitise(body.serialNumber || '');

    //serial number validation
    if (!serialNumberRegex.test(serial)) {
      return NextResponse.json({
         message: 'Invalid serial number' 
        },
         { 
            status: 400 
        });
    }

    // if appliance exists- deleting
    const [rows] = await pool.execute(
      'SELECT ApplianceID FROM Appliances WHERE SerialNumber = ?',
      [serial]
    );
    if (rows.length === 0) {
      return NextResponse.json({ 
        message: 'Not found' }, {
             status: 404
             });
    }

    // deleteing 
    await pool.execute('DELETE FROM Appliances WHERE SerialNumber = ?', [serial]);

    return NextResponse.json({ message: 'Operation was successfull' }, {
         status: 200
        });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'error' }, { 
        status: 500
     });
  }
}