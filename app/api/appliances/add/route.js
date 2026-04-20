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

    
}
};