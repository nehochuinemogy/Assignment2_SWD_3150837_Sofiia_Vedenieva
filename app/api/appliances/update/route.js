import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateUser, validateAppliance, sanitise } from '@/lib/validation';

export async function PUT(request) {
  try {
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}