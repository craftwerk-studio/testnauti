import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify secret to prevent unauthorized revalidation
    const secret = request.headers.get('x-revalidate-secret');

    if (!process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Server misconfiguration: REVALIDATE_SECRET not set' },
        { status: 500 }
      );
    }

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate all school-related pages
    revalidatePath('/escuelas');
    revalidatePath('/escuelas/[schoolId]', 'page');
    revalidatePath('/sitemap.xml');

    console.log('✅ Successfully revalidated schools directory pages');

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: ['/escuelas', '/escuelas/[schoolId]', '/sitemap.xml'],
    });
  } catch (error) {
    console.error('❌ Error during revalidation:', error);
    return NextResponse.json(
      {
        error: 'Failed to revalidate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
