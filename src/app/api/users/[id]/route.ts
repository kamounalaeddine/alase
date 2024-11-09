import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';

// Update user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, password } = body;
    const userId = params.id;

    const connection = await createConnection();

    // Check if email already exists for another user
    const [existingUsers]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Update query including password
    const updateQuery = password 
      ? 'UPDATE users SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, password = ? WHERE id = ?'
      : 'UPDATE users SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE id = ?';
    
    const updateParams = password 
      ? [firstName, lastName, email, phoneNumber, password, userId]
      : [firstName, lastName, email, phoneNumber, userId];

    await connection.execute(updateQuery, updateParams);
    await connection.end();

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: { id: userId, firstName, lastName, email, phoneNumber }
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const connection = await createConnection();

    await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
    await connection.end();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}