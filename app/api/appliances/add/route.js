import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { validateUser, validateAppliance, sanitise } from '../../../../lib/validation';

export async function POST(request) {
  try {
    //Parsing JSON body from form
    const body = await request.json();

    //Sanitizing all fields
    const clean = {
      firstName: sanitise(body.firstName),
      lastName: sanitise(body.lastName),
      address: sanitise(body.address),
      mobile: sanitise(body.mobile),
      email: sanitise(body.email),
      eircode: sanitise(body.eircode),
      applianceType: sanitise(body.applianceType),
      brand: sanitise(body.brand),
      modelNumber: sanitise(body.modelNumber),
      serialNumber: sanitise(body.serialNumber),
      purchaseDate: sanitise(body.purchaseDate),
      warrantyExpirationDate: sanitise(body.warrantyExpirationDate),
      cost: body.cost,
    };

    //server-side validation
const userCheck = validateUser(clean);
    if (!userCheck.valid) {
      return NextResponse.json({ message: userCheck.message }, { status: 400 });
    }

    const appCheck = validateAppliance(clean);
    if (!appCheck.valid) {
      return NextResponse.json({ message: appCheck.message }, { status: 400 });
    }

    //database operations
    const conn = await pool.getConnection();

        try {
      // checking if serial number already exists
      //and if in code is no duplicates
      const [existing] = await conn.execute(
        'SELECT ApplianceID FROM Appliances WHERE SerialNumber = ?',
        [clean.serialNumber]
      );

      //if duplicate exists
      if (existing.length > 0) {
        conn.release();
        return NextResponse.json({ message: 'You entered extsting appliance' }, { status: 409 });
      }

}
};