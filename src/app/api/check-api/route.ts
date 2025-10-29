import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mydatabase');
    
    // Test connection
    await db.command({ ping: 1 });
    
    // Get database stats
    const stats = await db.stats();
    
    // Get users count
    const usersCount = await db.collection('users').countDocuments();
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      database: 'mydatabase',
      connection: 'OK',
      stats: stats,
      usersCount: usersCount,
      users: users
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}