import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Test the connection first
    await db.command({ ping: 1 });
    
    const result = await db.collection('users').insertOne({
      username,
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User added successfully!', 
      id: result.insertedId 
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('MongoDB error:', error);
    
    if (error.code === 13 || error.codeName === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Database authentication failed. Check your credentials.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add user: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    
    // Test the connection first
    await db.command({ ping: 1 });

    // Get all users, sorted by creation date (newest first)
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedUsers = users.map(user => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }));

    return NextResponse.json({ 
      success: true, 
      message: 'Users retrieved successfully!',
      count: serializedUsers.length,
      users: serializedUsers
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('MongoDB error:', error);
    
    if (error.code === 13 || error.codeName === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Database authentication failed. Check your credentials.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve users: ' + error.message },
      { status: 500 }
    );
  }
}