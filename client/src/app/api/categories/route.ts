import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { CategoryModel } from '@/lib/mongodb/schemas';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get('featured');

  try {
    await connectDB();

    const query: any = {};

    // Filter by featured if requested
    if (featured === 'true') {
      query.featured = true;
    }

    const categories = await CategoryModel.find(query)
      .sort({ featured: -1, order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}