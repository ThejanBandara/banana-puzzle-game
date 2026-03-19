import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://marcconrad.com/uob/banana/api.php', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Banana API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching puzzle from Banana API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch puzzle from the jungle spirits.' },
      { status: 500 }
    );
  }
}
