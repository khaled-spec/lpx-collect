// Load environment variables first before any imports
require('dotenv').config({ path: '.env.local' });

import connectDB from '../src/lib/mongodb/client';
import { ProductModel, CategoryModel, VendorModel } from '../src/lib/mongodb/schemas';

// Pokemon TCG seed data based on popular and valuable cards
const pokemonProducts = [
  {
    name: 'Charizard Holo 1st Edition Base Set',
    slug: 'charizard-holo-1st-edition-base-set',
    description: 'The legendary Charizard from the original Base Set. This holographic card is one of the most sought-after Pokemon cards ever produced. Perfect PSA 10 condition with pristine corners and centering.',
    price: 12000,
    originalPrice: 15000,
    image: 'https://images.pokemontcg.io/base1/4_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/4_hires.png',
      'https://images.pokemontcg.io/base1/4.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'elite-card-emporium',
    condition: 'Mint',
    rarity: 'Holo Rare',
    featured: true,
    inStock: true,
    stockCount: 1,
    tags: ['charizard', 'base-set', '1st-edition', 'holo', 'graded', 'psa-10'],
    specifications: {
      'Card Number': '4/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Fire',
      'HP': '120',
      'Edition': '1st Edition',
      'Condition': 'PSA 10 Gem Mint'
    }
  },
  {
    name: 'Blastoise Holo Base Set',
    slug: 'blastoise-holo-base-set',
    description: 'Powerful Water-type Pokemon from the original Base Set. Features beautiful holographic artwork and excellent card condition. A cornerstone card for any serious collection.',
    price: 3500,
    originalPrice: 4000,
    image: 'https://images.pokemontcg.io/base1/2_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/2_hires.png',
      'https://images.pokemontcg.io/base1/2.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'elite-card-emporium',
    condition: 'Near Mint',
    rarity: 'Holo Rare',
    featured: true,
    inStock: true,
    stockCount: 2,
    tags: ['blastoise', 'base-set', 'holo', 'water-type', 'starter'],
    specifications: {
      'Card Number': '2/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Water',
      'HP': '100',
      'Condition': 'Near Mint'
    }
  },
  {
    name: 'Venusaur Holo Base Set',
    slug: 'venusaur-holo-base-set',
    description: 'Classic Grass-type starter Pokemon in pristine condition. From the iconic 1998 Base Set collection. Complete your starter trio with this beautiful holographic card.',
    price: 2800,
    originalPrice: 3200,
    image: 'https://images.pokemontcg.io/base1/15_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/15_hires.png',
      'https://images.pokemontcg.io/base1/15.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'pokemon-palace',
    condition: 'Excellent',
    rarity: 'Holo Rare',
    featured: true,
    inStock: true,
    stockCount: 1,
    tags: ['venusaur', 'base-set', 'holo', 'grass-type', 'starter'],
    specifications: {
      'Card Number': '15/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Grass',
      'HP': '100',
      'Condition': 'Excellent'
    }
  },
  {
    name: 'Pikachu Illustrator Promo',
    slug: 'pikachu-illustrator-promo',
    description: 'Extremely rare Pikachu Illustrator promotional card from 1998. Only given to winners of a Pokemon illustration contest. One of the rarest Pokemon cards in existence.',
    price: 250000,
    originalPrice: 300000,
    image: 'https://images.pokemontcg.io/basep/PROMO_hires.png',
    images: [
      'https://images.pokemontcg.io/basep/PROMO_hires.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'legendary-collectibles',
    condition: 'Near Mint',
    rarity: 'Promo',
    featured: true,
    inStock: true,
    stockCount: 1,
    tags: ['pikachu', 'illustrator', 'promo', 'ultra-rare', 'japanese', '1998'],
    specifications: {
      'Card Number': 'Promo',
      'Set': 'Promotional',
      'Rarity': 'Promo',
      'Type': 'Electric',
      'Language': 'Japanese',
      'Year': '1998',
      'Condition': 'PSA 9 Mint'
    }
  },
  {
    name: 'Machamp 1st Edition Shadowless',
    slug: 'machamp-1st-edition-shadowless',
    description: 'First edition shadowless Machamp from Base Set. This powerful Fighting-type Pokemon card is a classic collectible with perfect centering.',
    price: 450,
    originalPrice: 550,
    image: 'https://images.pokemontcg.io/base1/8_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/8_hires.png',
      'https://images.pokemontcg.io/base1/8.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'pokemon-palace',
    condition: 'Near Mint',
    rarity: 'Holo Rare',
    featured: false,
    inStock: true,
    stockCount: 3,
    tags: ['machamp', 'base-set', '1st-edition', 'shadowless', 'fighting-type'],
    specifications: {
      'Card Number': '8/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Fighting',
      'HP': '100',
      'Edition': '1st Edition Shadowless',
      'Condition': 'Near Mint'
    }
  },
  {
    name: 'Alakazam Holo Base Set',
    slug: 'alakazam-holo-base-set',
    description: 'Psychic-type Pokemon with stunning holographic artwork. Excellent condition from the original 1998 release. Features beautiful swirl patterns in the holo.',
    price: 1200,
    originalPrice: 1400,
    image: 'https://images.pokemontcg.io/base1/1_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/1_hires.png',
      'https://images.pokemontcg.io/base1/1.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'card-kingdom',
    condition: 'Near Mint',
    rarity: 'Holo Rare',
    featured: false,
    inStock: true,
    stockCount: 2,
    tags: ['alakazam', 'base-set', 'holo', 'psychic-type', 'evolution'],
    specifications: {
      'Card Number': '1/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Psychic',
      'HP': '80',
      'Condition': 'Near Mint'
    }
  },
  {
    name: 'Gyarados Holo Base Set',
    slug: 'gyarados-holo-base-set',
    description: 'Fierce Water/Flying-type Pokemon card with beautiful holo pattern. A centerpiece for any collection with its intimidating artwork.',
    price: 800,
    originalPrice: 950,
    image: 'https://images.pokemontcg.io/base1/6_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/6_hires.png',
      'https://images.pokemontcg.io/base1/6.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'card-kingdom',
    condition: 'Excellent',
    rarity: 'Holo Rare',
    featured: false,
    inStock: true,
    stockCount: 1,
    tags: ['gyarados', 'base-set', 'holo', 'water-type', 'evolution'],
    specifications: {
      'Card Number': '6/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Water',
      'HP': '100',
      'Condition': 'Excellent'
    }
  },
  {
    name: 'Mewtwo Holo Base Set',
    slug: 'mewtwo-holo-base-set',
    description: 'Legendary Psychic-type Pokemon from the original Base Set. Incredibly powerful and highly sought after by collectors worldwide.',
    price: 1800,
    originalPrice: 2100,
    image: 'https://images.pokemontcg.io/base1/10_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/10_hires.png',
      'https://images.pokemontcg.io/base1/10.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'legendary-collectibles',
    condition: 'Mint',
    rarity: 'Holo Rare',
    featured: true,
    inStock: true,
    stockCount: 1,
    tags: ['mewtwo', 'base-set', 'holo', 'psychic-type', 'legendary'],
    specifications: {
      'Card Number': '10/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Psychic',
      'HP': '60',
      'Condition': 'Mint'
    }
  },
  {
    name: 'Raichu Holo Base Set',
    slug: 'raichu-holo-base-set',
    description: 'Evolution of Pikachu featuring stunning holographic artwork. From the classic 1998 Base Set with excellent color saturation.',
    price: 650,
    originalPrice: 750,
    image: 'https://images.pokemontcg.io/base1/14_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/14_hires.png',
      'https://images.pokemontcg.io/base1/14.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'pokemon-palace',
    condition: 'Near Mint',
    rarity: 'Holo Rare',
    featured: false,
    inStock: true,
    stockCount: 2,
    tags: ['raichu', 'base-set', 'holo', 'electric-type', 'evolution'],
    specifications: {
      'Card Number': '14/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Electric',
      'HP': '90',
      'Condition': 'Near Mint'
    }
  },
  {
    name: 'Clefairy Holo Base Set',
    slug: 'clefairy-holo-base-set',
    description: 'Adorable Normal-type Pokemon with beautiful holo pattern. Originally intended as the Pokemon mascot before Pikachu took over.',
    price: 420,
    originalPrice: 500,
    image: 'https://images.pokemontcg.io/base1/5_hires.png',
    images: [
      'https://images.pokemontcg.io/base1/5_hires.png',
      'https://images.pokemontcg.io/base1/5.png'
    ],
    categorySlug: 'pokemon-cards',
    vendorSlug: 'card-kingdom',
    condition: 'Near Mint',
    rarity: 'Holo Rare',
    featured: false,
    inStock: true,
    stockCount: 3,
    tags: ['clefairy', 'base-set', 'holo', 'normal-type', 'mascot'],
    specifications: {
      'Card Number': '5/102',
      'Set': 'Base Set',
      'Rarity': 'Holo Rare',
      'Type': 'Colorless',
      'HP': '40',
      'Condition': 'Near Mint'
    }
  }
];

// Categories
const categories = [
  {
    name: 'Pokemon Cards',
    slug: 'pokemon-cards',
    description: 'Authentic Pokemon Trading Cards from various sets and rarities',
    image: 'https://images.pokemontcg.io/base1/logo.png'
  },
  {
    name: 'Trading Cards',
    slug: 'trading-cards',
    description: 'Collectible trading cards from various franchises',
    image: 'https://via.placeholder.com/300x200/4f46e5/white?text=Trading+Cards'
  }
];

// Vendors
const vendors = [
  {
    name: 'Elite Card Emporium',
    slug: 'elite-card-emporium',
    description: 'Specializing in high-grade Pokemon cards and rare collectibles since 2010. PSA and BGS certified dealer.',
    logo: 'https://via.placeholder.com/150x150/059669/white?text=ECE',
    coverImage: 'https://via.placeholder.com/800x400/059669/white?text=Elite+Card+Emporium',
    verified: true,
    rating: 4.9,
    totalSales: 2847,
    location: 'Los Angeles, CA',
    specialties: ['Pokemon Cards', 'Graded Cards', 'Vintage Cards'],
    established: '2010',
    policies: {
      returns: '30-day return policy',
      shipping: 'Free shipping on orders over $100',
      authenticity: '100% authenticity guarantee'
    }
  },
  {
    name: 'Pokemon Palace',
    slug: 'pokemon-palace',
    description: 'Your premier destination for Pokemon TCG singles, booster packs, and accessories. Trusted by collectors nationwide.',
    logo: 'https://via.placeholder.com/150x150/7c3aed/white?text=PP',
    coverImage: 'https://via.placeholder.com/800x400/7c3aed/white?text=Pokemon+Palace',
    verified: true,
    rating: 4.8,
    totalSales: 1923,
    location: 'New York, NY',
    specialties: ['Pokemon TCG', 'Japanese Cards', 'Sealed Products'],
    established: '2015',
    policies: {
      returns: '14-day return policy',
      shipping: 'Same day shipping available',
      authenticity: 'Authentication service available'
    }
  },
  {
    name: 'Legendary Collectibles',
    slug: 'legendary-collectibles',
    description: 'Dealing in the rarest and most valuable Pokemon cards. Expert authentication and premium customer service.',
    logo: 'https://via.placeholder.com/150x150/dc2626/white?text=LC',
    coverImage: 'https://via.placeholder.com/800x400/dc2626/white?text=Legendary+Collectibles',
    verified: true,
    rating: 4.95,
    totalSales: 567,
    location: 'Miami, FL',
    specialties: ['Ultra Rare Cards', 'Investment Grade', 'Promotional Cards'],
    established: '2018',
    policies: {
      returns: '7-day return policy',
      shipping: 'Insured priority shipping',
      authenticity: 'Certificate of authenticity included'
    }
  },
  {
    name: 'Card Kingdom',
    slug: 'card-kingdom',
    description: 'Comprehensive trading card store with competitive prices and excellent customer service. Wide selection available.',
    logo: 'https://via.placeholder.com/150x150/2563eb/white?text=CK',
    coverImage: 'https://via.placeholder.com/800x400/2563eb/white?text=Card+Kingdom',
    verified: true,
    rating: 4.7,
    totalSales: 3421,
    location: 'Seattle, WA',
    specialties: ['Pokemon Cards', 'Magic Cards', 'Sports Cards'],
    established: '2005',
    policies: {
      returns: '30-day return policy',
      shipping: 'Free shipping on orders over $50',
      authenticity: 'Buy-back guarantee'
    }
  }
];

async function seedPokemonData() {
  try {
    console.log('🚀 Starting Pokemon TCG database seeding...');

    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await VendorModel.deleteMany({});

    // Insert categories
    console.log('📂 Inserting categories...');
    await CategoryModel.insertMany(categories);

    // Insert vendors
    console.log('🏪 Inserting vendors...');
    await VendorModel.insertMany(vendors);

    // Get inserted category and vendor IDs
    const insertedCategories = await CategoryModel.find({});
    const insertedVendors = await VendorModel.find({});

    // Create category and vendor lookup maps
    const categoryMap = insertedCategories.reduce((map, cat) => {
      map[cat.slug] = cat._id;
      return map;
    }, {} as any);

    const vendorMap = insertedVendors.reduce((map, vendor) => {
      map[vendor.slug] = vendor._id;
      return map;
    }, {} as any);

    // Insert products
    console.log('🎯 Inserting Pokemon products...');
    const productsWithReferences = pokemonProducts.map(product => ({
      ...product,
      // Fix condition and rarity to match enum values
      condition: product.condition === 'Near Mint' ? 'mint' :
                 product.condition === 'Excellent' ? 'excellent' :
                 product.condition === 'Mint' ? 'mint' : 'excellent',
      rarity: product.rarity === 'Holo Rare' ? 'very-rare' :
              product.rarity === 'Promo' ? 'legendary' : 'rare',
      // Add ObjectId references
      category: categoryMap[product.categorySlug],
      vendor: vendorMap[product.vendorSlug],
      // Fix field names to match schema
      stock: product.stockCount || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await ProductModel.insertMany(productsWithReferences);

    console.log(`✅ Successfully seeded database with:`);
    console.log(`   📂 ${categories.length} categories`);
    console.log(`   🏪 ${vendors.length} vendors`);
    console.log(`   🎯 ${pokemonProducts.length} Pokemon products`);
    console.log('🎉 Pokemon TCG seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding Pokemon data:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedPokemonData()
    .then(() => {
      console.log('Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedPokemonData;