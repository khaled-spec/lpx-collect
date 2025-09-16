import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, filterProducts, paginateData } from '@/lib/api/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  try {
    const { id } = await params;
    // Filter products by vendor
    const vendorProducts = filterProducts(mockProducts, {
      vendorId: id,
    });

    // Paginate results
    const paginatedResult = paginateData(vendorProducts, page, limit);

    return NextResponse.json({
      success: true,
      data: paginatedResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch vendor products',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}