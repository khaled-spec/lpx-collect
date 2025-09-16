import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { ProductModel } from '@/lib/mongodb/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    // Transform MongoDB document to match API types
    const transformedProduct = {
      ...product,
      id: product._id.toString(),
      _id: undefined // Remove _id to avoid confusion
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch product',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}