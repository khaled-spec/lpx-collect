import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { VendorModel } from '@/lib/mongodb/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get('featured');
  const verified = searchParams.get('verified');

  // Validate query parameters
  if (featured && !['true', 'false'].includes(featured)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Invalid featured parameter. Must be "true" or "false"',
          code: 'INVALID_PARAMETER',
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  if (verified && !['true', 'false'].includes(verified)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Invalid verified parameter. Must be "true" or "false"',
          code: 'INVALID_PARAMETER',
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const query: any = {};

    // Filter by featured if requested
    if (featured === 'true') {
      query.featured = true;
    }

    // Filter by verified if requested
    if (verified === 'true') {
      query.verified = true;
    }

    const vendors = await VendorModel.find(query)
      .sort({ featured: -1, rating: -1, totalSales: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch vendors',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}