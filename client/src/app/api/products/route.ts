import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import { ProductModel } from '@/lib/mongodb/schemas';
import { Product } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get query parameters
  const categoryId = searchParams.get('categoryId') || undefined;
  const vendorId = searchParams.get('vendorId') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const condition = searchParams.get('condition') || undefined;
  const rarity = searchParams.get('rarity') || undefined;
  const search = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const sortBy = searchParams.get('sortBy') || 'featured';
  const order = searchParams.get('order') || 'asc';

  try {
    await connectDB();

    // Build MongoDB query
    const query: any = {};

    if (categoryId) query.categorySlug = categoryId;
    if (vendorId) query.vendorId = vendorId;
    if (condition) query.condition = condition;
    if (rarity) query.rarity = rarity;
    if (featured !== undefined) query.featured = featured;

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    let sort: any = {};
    switch (sortBy) {
      case 'price':
        sort.price = order === 'desc' ? -1 : 1;
        break;
      case 'price-asc':
        sort.price = 1;
        break;
      case 'price-desc':
        sort.price = -1;
        break;
      case 'name':
        sort.name = 1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'featured':
      default:
        sort = { featured: -1, views: -1 };
        break;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    // Transform MongoDB documents to match API types
    const transformedProducts = products.map((product: any) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined // Remove _id to avoid confusion
    }));

    const paginatedResult = {
      data: transformedProducts,
      total: totalCount,
      page,
      pageSize: limit,
      hasNext,
      hasPrevious,
    };

    return NextResponse.json({
      success: true,
      data: paginatedResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch products',
          code: 'FETCH_ERROR',
          status: 500,
        },
      },
      { status: 500 }
    );
  }
}