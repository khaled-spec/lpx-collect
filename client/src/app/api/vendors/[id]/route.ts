import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Return vendor not found for now - can be connected to real database later
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Vendor not found',
          code: 'VENDOR_NOT_FOUND',
          status: 404,
        },
      },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch vendor',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}