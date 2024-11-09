import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, cin, email, phoneNumber, password } = body;

    // Log the received data
    console.log('Received data:', { firstName, lastName, cin, email, phoneNumber });

    let connection;
    try {
      connection = await createConnection();
      console.log('Database connection established');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed: ' + (dbError as Error).message },
        { status: 500 }
      );
    }

    try {
      // Check if user already exists
      const [existingUsers]: any = await connection.execute(
        'SELECT * FROM users WHERE email = ? OR cin = ?',
        [email, cin]
      );

      if (existingUsers.length > 0) {
        console.log('User already exists');
        return NextResponse.json(
          { error: 'User with this email or CIN already exists' },
          { status: 400 }
        );
      }

      // Insert new user
      const [result]: any = await connection.execute(
        'INSERT INTO users (firstName, lastName, cin, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, cin, email, phoneNumber, password]
      );

      console.log('User created successfully:', result);

      return NextResponse.json({
        message: 'User created successfully',
        userId: result.insertId
      });

    } catch (queryError) {
      console.error('Database query error:', queryError);
      return NextResponse.json(
        { error: 'Database query failed: ' + (queryError as Error).message },
        { status: 500 }
      );
    } finally {
      if (connection) {
        await connection.end();
        console.log('Database connection closed');
      }
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Error creating user: ' + (error as Error).message },
      { status: 500 }
    );
  }
}