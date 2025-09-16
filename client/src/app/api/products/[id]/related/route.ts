import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { ProductModel } from '@/lib/mongodb/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get('limit')) || 4;

  try {
    await connectDB();
    const { id } = await params;

    // First get the current product to find related products
    const currentProduct = await ProductModel.findById(id).lean();

    if (!currentProduct) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Find related products from same category, excluding current product
    const relatedProducts = await ProductModel.find({
      _id: { $ne: id },
      categorySlug: currentProduct.categorySlug,
    })
    .limit(limit)
    .sort({ featured: -1, views: -1 })
    .lean();

    return NextResponse.json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch related products',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}