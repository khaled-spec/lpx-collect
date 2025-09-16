#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import connectDB from '../src/lib/mongodb/client';
import { ProductModel, CategoryModel, VendorModel } from '../src/lib/mongodb/schemas';

// Sample categories data
const categories = [
  {
    name: 'Pokémon Cards',
    slug: 'pokemon-cards',
    description: 'Trading cards from the Pokémon universe',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    icon: '⚡',
    featured: true,
    productCount: 0,
    order: 1,
  },
  {
    name: 'Magic: The Gathering',
    slug: 'magic-the-gathering',
    description: 'MTG trading cards and accessories',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    icon: '🔮',
    featured: true,
    productCount: 0,
    order: 2,
  },
  {
    name: 'Yu-Gi-Oh!',
    slug: 'yugioh',
    description: 'Yu-Gi-Oh! trading cards and collectibles',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    icon: '🎴',
    featured: true,
    productCount: 0,
    order: 3,
  },
  {
    name: 'Sports Cards',
    slug: 'sports-cards',
    description: 'Baseball, basketball, football, and other sports cards',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    icon: '⚾',
    featured: false,
    productCount: 0,
    order: 4,
  }
];

// Sample vendors data
const vendors = [
  {
    name: 'Elite Card Emporium',
    slug: 'elite-card-emporium',
    description: 'Premium trading cards and collectibles from certified sellers',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    rating: 4.8,
    reviewCount: 245,
    totalSales: 1250,
    totalProducts: 89,
    responseTime: '2 hours',
    shippingInfo: 'Ships within 1-2 business days',
    returnPolicy: '30-day return policy',
    verified: true,
    featured: true,
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    contact: {
      email: 'info@elitecardemporium.com',
      phone: '(555) 123-4567'
    },
    specialties: ['Pokémon', 'Magic: The Gathering', 'Vintage Cards']
  },
  {
    name: 'Card Collector\'s Haven',
    slug: 'card-collectors-haven',
    description: 'Your one-stop shop for rare and collectible trading cards',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    rating: 4.6,
    reviewCount: 189,
    totalSales: 980,
    totalProducts: 156,
    responseTime: '4 hours',
    shippingInfo: 'Ships within 2-3 business days',
    returnPolicy: '14-day return policy',
    verified: true,
    featured: false,
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    contact: {
      email: 'sales@cardcollectorshaven.com',
      phone: '(555) 987-6543'
    },
    specialties: ['Sports Cards', 'Yu-Gi-Oh!', 'Graded Cards']
  }
];

// Sample products data
const products = [
  {
    name: 'Charizard Holo 1st Edition Base Set',
    slug: 'charizard-holo-1st-edition-base-set',
    description: 'Mint condition Charizard holographic card from the original 1999 Base Set. This iconic card is a must-have for any serious Pokémon collector.',
    price: 8999.99,
    originalPrice: 9999.99,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    category: 'pokemon-cards',
    categorySlug: 'pokemon-cards',
    vendor: 'elite-card-emporium',
    vendorId: 'elite-card-emporium',
    stock: 1,
    condition: 'mint',
    rarity: 'legendary',
    cardNumber: '4/102',
    views: 1247,
    rating: 5.0,
    reviewCount: 12,
    year: 1999,
    manufacturer: 'Wizards of the Coast',
    authenticity: {
      verified: true,
      certificate: 'PSA-10',
      verifiedBy: 'PSA',
      verificationDate: '2023-01-15'
    },
    specifications: new Map([
      ['Card Type', 'Holographic'],
      ['Set', 'Base Set'],
      ['Edition', '1st Edition'],
      ['Language', 'English']
    ]),
    tags: ['charizard', 'holo', '1st-edition', 'base-set', 'psa-10'],
    featured: true
  },
  {
    name: 'Black Lotus Alpha',
    slug: 'black-lotus-alpha',
    description: 'Near mint Black Lotus from Magic: The Gathering Alpha set. One of the most powerful and sought-after cards in the game.',
    price: 45000.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    category: 'magic-the-gathering',
    categorySlug: 'magic-the-gathering',
    vendor: 'card-collectors-haven',
    vendorId: 'card-collectors-haven',
    stock: 1,
    condition: 'excellent',
    rarity: 'legendary',
    views: 892,
    rating: 5.0,
    reviewCount: 8,
    year: 1993,
    manufacturer: 'Wizards of the Coast',
    authenticity: {
      verified: true,
      certificate: 'BGS-9',
      verifiedBy: 'Beckett',
      verificationDate: '2023-03-22'
    },
    specifications: new Map([
      ['Card Type', 'Artifact'],
      ['Set', 'Alpha'],
      ['Mana Cost', '0'],
      ['Rarity', 'Rare']
    ]),
    tags: ['black-lotus', 'alpha', 'power-nine', 'artifact'],
    featured: true
  },
  {
    name: 'Pikachu Illustrator Promo',
    slug: 'pikachu-illustrator-promo',
    description: 'Extremely rare Pikachu Illustrator promotional card from 1998. Only awarded to winners of a Pokémon illustration contest in Japan.',
    price: 120000.00,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    category: 'pokemon-cards',
    categorySlug: 'pokemon-cards',
    vendor: 'elite-card-emporium',
    vendorId: 'elite-card-emporium',
    stock: 1,
    condition: 'mint',
    rarity: 'legendary',
    views: 2341,
    rating: 5.0,
    reviewCount: 5,
    year: 1998,
    manufacturer: 'Media Factory',
    authenticity: {
      verified: true,
      certificate: 'PSA-9',
      verifiedBy: 'PSA',
      verificationDate: '2023-02-10'
    },
    specifications: new Map([
      ['Card Type', 'Promotional'],
      ['Set', 'Promo'],
      ['Language', 'Japanese']
    ]),
    tags: ['pikachu', 'illustrator', 'promo', 'japanese', 'rare'],
    featured: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      ProductModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      VendorModel.deleteMany({})
    ]);

    console.log('🏷️  Seeding categories...');
    const createdCategories = await CategoryModel.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('🏪 Seeding vendors...');
    const createdVendors = await VendorModel.insertMany(vendors);
    console.log(`✅ Created ${createdVendors.length} vendors`);

    console.log('📦 Seeding products...');
    const createdProducts = await ProductModel.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Update product counts in categories
    console.log('🔢 Updating category product counts...');
    for (const category of createdCategories) {
      const productCount = await ProductModel.countDocuments({ categorySlug: category.slug });
      await CategoryModel.findByIdAndUpdate(category._id, { productCount });
    }

    // Update product counts in vendors
    console.log('🔢 Updating vendor product counts...');
    for (const vendor of createdVendors) {
      const productCount = await ProductModel.countDocuments({ vendorId: vendor.slug });
      await VendorModel.findByIdAndUpdate(vendor._id, { totalProducts: productCount });
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • Categories: ${createdCategories.length}`);
    console.log(`   • Vendors: ${createdVendors.length}`);
    console.log(`   • Products: ${createdProducts.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;