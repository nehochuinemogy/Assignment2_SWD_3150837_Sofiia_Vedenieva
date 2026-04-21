import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { serialNumberRegex, sanitise } from '../../../../lib/validation'

