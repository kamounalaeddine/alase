import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const connection = await createConnection();

    console.log('Login attempt for email:', email);

    const [users]: any = await connection.execute(
      'SELECT id, firstName, lastName, email, phoneNumber, password FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    console.log('Database response:', users);

    await connection.end();

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const userData = {
      id: users[0].id,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      email: users[0].email,
      phoneNumber: users[0].phoneNumber,
      password: users[0].password
    };

    console.log('Sending user data:', userData);

    return NextResponse.json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}