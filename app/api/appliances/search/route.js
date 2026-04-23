import { NextResponse } from 'next/server';
import { serialNumberRegex, sanitise } from '../../../../lib/validation'

export async function GET(request) {
  try {
    // getting queryy url
    const { searchParams } = new URL(request.url);
    // extracting serial number 
    const serial = sanitise(searchParams.get('serial') || '');

    // validating serial number format before hitting database
    if (!serialNumberRegex.test(serial)) {
      return NextResponse.json({ message: 'invalid serial number.please, try again' }, { status: 400 });
    }
  }
}