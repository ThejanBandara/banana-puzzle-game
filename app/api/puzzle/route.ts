import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://marcconrad.com/uob/banana/api.php?out=json', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('Banana API Error Body:', errorText.substring(0, 200));
      throw new Error(`Banana API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Puzzle data received successfully');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching puzzle from Banana API:', error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch puzzle from the jungle spirits.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
