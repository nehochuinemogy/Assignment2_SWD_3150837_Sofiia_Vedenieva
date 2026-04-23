import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateUser, validateAppliance, sanitise } from '@/lib/validation';

export async function PUT(request) {
  try {
const body = await request.json();
//sanitizing all input fields
const clean = {
  applianceID: parseInt(body.applianceID),
  userID: parseInt(body.userID),
  applianceType: sanitise(body.applianceType),
  brand: sanitise(body.brand),
  modelNumber: sanitise(body.modelNumber),
  purchaseDate: sanitise(body.purchaseDate),
  warrantyExpirationDate: sanitise(body.warrantyExpirationDate),
  cost: body.cost,
  firstName: sanitise(body.firstName),
  lastName: sanitise(body.lastName),
  address: sanitise(body.address),
  mobile: sanitise(body.mobile),
  email: sanitise(body.email),
  eircode: sanitise(body.eircode),
};
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
  //validation
  if (isNaN(clean.applianceID) || isNaN(clean.userID)) {
  return NextResponse.json({ message: 'Invalid record identifiers' }, { status: 400 });
}

const userCheck = validateUser(clean);
if (!userCheck.valid) {
  return NextResponse.json({ message: userCheck.message }, { status: 400 });
}

const appCheck = validateAppliance(clean);
if (!appCheck.valid) {
  return NextResponse.json({ message: appCheck.message }, { status: 400 });
}

const conn = await pool.getConnection();
try {
  // updating table id and num
  await conn.execute(
    `UPDATE Appliances
     SET ApplianceType = ?, Brand = ?, ModelNumber = ?,
         PurchaseDate = ?, WarrantyExpirationDate = ?, Cost = ?
     WHERE ApplianceID = ?`,
    [
      clean.applianceType, clean.brand, clean.modelNumber,
      clean.purchaseDate, clean.warrantyExpirationDate,
      parseFloat(clean.cost), clean.applianceID
    ]
  );

  // updating user table
  await conn.execute(
    `UPDATE Users
     SET FirstName = ?, LastName = ?, Address = ?,
         Mobile = ?, Email = ?, Eircode = ?
     WHERE UserID = ?`,
    [
      clean.firstName, clean.lastName, clean.address,
      clean.mobile, clean.email, clean.eircode, clean.userID
    ]
  );

  conn.release();
  return NextResponse.json({ message: 'Appliance has been updated' }, { status: 200 });
} catch (dbErr) {
  conn.release();
  throw dbErr;
}
}