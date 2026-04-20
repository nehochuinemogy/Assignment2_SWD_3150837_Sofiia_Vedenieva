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
 
      //chhecking if user email is existing one
       const [users] = await conn.execute(
        'SELECT UserID FROM Users WHERE Email = ?',
        [clean.email]
      );
      //implementing user id 
      let userID;


      if (users.length > 0) {
        // using existing user
        userID = users[0].UserID;
      } else {
        // if not exist, pasting new user
        const [userResult] = await conn.execute(
          `INSERT INTO Users (FirstName, LastName, Address, Mobile, Email, Eircode)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [clean.firstName, clean.lastName, clean.address, clean.mobile, clean.email, clean.eircode]
        );
        userID = userResult.insertId;
      }

      //inserting appliance
      await conn.execute(
        `INSERT INTO Appliances 
         (UserID, ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyExpirationDate, Cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userID,
          clean.applianceType,
          clean.brand,
          clean.modelNumber,
          clean.serialNumber,
          clean.purchaseDate,
          clean.warrantyExpirationDate,
          parseFloat(clean.cost),
        ]
      );

      //releasing the database connection back to the pool
      conn.release();

      //displaying message
      return NextResponse.json(
        { message: 'New appliance added successfully' },
        { status: 201 }
      );

      // making sue connection is released
    } catch (dbErr) {
      conn.release();
      throw dbErr;
    }
      //
    } catch (error) {
    console.error('error', error);
    return NextResponse.json(
      { message: 'error. please try again.' },
      { status: 500 }
    );
  }
}
