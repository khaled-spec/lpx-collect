import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { CategoryModel } from '@/lib/mongodb/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const category = await CategoryModel.findOne({
      $or: [
        { slug: slug },
        { _id: slug }
      ]
    }).lean();

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Category not found',
            code: 'CATEGORY_NOT_FOUND',
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}