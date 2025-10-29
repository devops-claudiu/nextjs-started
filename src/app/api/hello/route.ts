import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

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

    const result = await db.collection('users').insertOne({
      username,
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User added successfully', 
      id: result.insertedId 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add user' },
      { status: 500 }
    );
  }
}