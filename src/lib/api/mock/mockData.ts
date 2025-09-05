// Mock data for categories and products
import { Category, Product, Vendor } from "../types";

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Trading Cards",
    slug: "trading-cards",
    description: "Discover rare and valuable trading cards from Pokemon, Magic, Yu-Gi-Oh!, and more",
    image: "/images/categories/trading-cards.jpg",
    icon: "🎴",
    productCount: 1543,
    featured: true,
    order: 1,
    subcategories: [
      {
        id: "cat-1-1",
        name: "Pokemon Cards",
        slug: "pokemon-cards",
        description: "Gotta catch 'em all! Find rare Pokemon cards and complete your collection",
        image: "/images/categories/pokemon.jpg",
        productCount: 678,
        featured: true,
        order: 1
      },
      {
        id: "cat-1-2",
        name: "Magic: The Gathering",
        slug: "magic-cards",
        description: "Powerful spells and legendary creatures await",
        image: "/images/categories/mtg.jpg",
        productCount: 432,
        featured: false,
        order: 2
      },
      {
        id: "cat-1-3",
        name: "Yu-Gi-Oh!",
        slug: "yugioh-cards",
        description: "Duel with the best cards from the Yu-Gi-Oh! universe",
        image: "/images/categories/yugioh.jpg",
        productCount: 289,
        featured: false,
        order: 3
      },
      {
        id: "cat-1-4",
        name: "Sports Cards",
        slug: "sports-cards",
        description: "Baseball, basketball, football, and hockey cards",
        image: "/images/categories/sports-cards.jpg",
        productCount: 144,
        featured: false,
        order: 4
      }
    ]
  },
  {
    id: "cat-2",
    name: "Comics",
    slug: "comics",
    description: "Vintage and modern comic books from Marvel, DC, and independent publishers",
    image: "/images/categories/comics.jpg",
    icon: "📚",
    productCount: 892,
    featured: true,
    order: 2,
    subcategories: [
      {
        id: "cat-2-1",
        name: "Marvel Comics",
        slug: "marvel-comics",
        description: "Spider-Man, X-Men, Avengers, and more Marvel heroes",
        image: "/images/categories/marvel.jpg",
        productCount: 412,
        featured: true,
        order: 1
      },
      {
        id: "cat-2-2",
        name: "DC Comics",
        slug: "dc-comics",
        description: "Batman, Superman, Wonder Woman, and the Justice League",
        image: "/images/categories/dc.jpg",
        productCount: 356,
        featured: true,
        order: 2
      },
      {
        id: "cat-2-3",
        name: "Manga",
        slug: "manga",
        description: "Japanese manga and graphic novels",
        image: "/images/categories/manga.jpg",
        productCount: 124,
        featured: false,
        order: 3
      }
    ]
  },
  {
    id: "cat-3",
    name: "Coins",
    slug: "coins",
    description: "Rare coins, ancient currency, and numismatic treasures from around the world",
    image: "/images/categories/coins.jpg",
    icon: "🪙",
    productCount: 456,
    featured: true,
    order: 3,
    subcategories: [
      {
        id: "cat-3-1",
        name: "Ancient Coins",
        slug: "ancient-coins",
        description: "Roman, Greek, and other ancient civilizations",
        image: "/images/categories/ancient-coins.jpg",
        productCount: 123,
        featured: false,
        order: 1
      },
      {
        id: "cat-3-2",
        name: "US Coins",
        slug: "us-coins",
        description: "Rare American coins and currency",
        image: "/images/categories/us-coins.jpg",
        productCount: 234,
        featured: true,
        order: 2
      },
      {
        id: "cat-3-3",
        name: "World Coins",
        slug: "world-coins",
        description: "International coins from every continent",
        image: "/images/categories/world-coins.jpg",
        productCount: 99,
        featured: false,
        order: 3
      }
    ]
  },
  {
    id: "cat-4",
    name: "Stamps",
    slug: "stamps",
    description: "Philatelic rarities, vintage stamps, and complete collections",
    image: "/images/categories/stamps.jpg",
    icon: "📮",
    productCount: 234,
    featured: false,
    order: 4,
    subcategories: [
      {
        id: "cat-4-1",
        name: "US Stamps",
        slug: "us-stamps",
        description: "American postal history and rare stamps",
        image: "/images/categories/us-stamps.jpg",
        productCount: 112,
        featured: false,
        order: 1
      },
      {
        id: "cat-4-2",
        name: "World Stamps",
        slug: "world-stamps",
        description: "International stamps and collections",
        image: "/images/categories/world-stamps.jpg",
        productCount: 122,
        featured: false,
        order: 2
      }
    ]
  },
  {
    id: "cat-5",
    name: "Vintage Toys",
    slug: "vintage-toys",
    description: "Nostalgic toys, action figures, and collectible playsets from yesteryear",
    image: "/images/categories/vintage-toys.jpg",
    icon: "🧸",
    productCount: 567,
    featured: false,
    order: 5,
    subcategories: [
      {
        id: "cat-5-1",
        name: "Action Figures",
        slug: "action-figures",
        description: "Star Wars, GI Joe, Transformers, and more",
        image: "/images/categories/action-figures.jpg",
        productCount: 289,
        featured: true,
        order: 1
      },
      {
        id: "cat-5-2",
        name: "Die-Cast Cars",
        slug: "die-cast-cars",
        description: "Hot Wheels, Matchbox, and collectible model cars",
        image: "/images/categories/die-cast.jpg",
        productCount: 178,
        featured: false,
        order: 2
      },
      {
        id: "cat-5-3",
        name: "Board Games",
        slug: "board-games",
        description: "Vintage board games and puzzles",
        image: "/images/categories/board-games.jpg",
        productCount: 100,
        featured: false,
        order: 3
      }
    ]
  },
  {
    id: "cat-6",
    name: "Sports Memorabilia",
    slug: "sports-memorabilia",
    description: "Autographed items, game-worn jerseys, and championship collectibles",
    image: "/images/categories/sports-memorabilia.jpg",
    icon: "⚽",
    productCount: 345,
    featured: false,
    order: 6,
    subcategories: [
      {
        id: "cat-6-1",
        name: "Autographs",
        slug: "autographs",
        description: "Signed photos, balls, and jerseys",
        image: "/images/categories/autographs.jpg",
        productCount: 156,
        featured: true,
        order: 1
      },
      {
        id: "cat-6-2",
        name: "Game-Worn Items",
        slug: "game-worn",
        description: "Jerseys, equipment, and memorabilia from actual games",
        image: "/images/categories/game-worn.jpg",
        productCount: 89,
        featured: false,
        order: 2
      },
      {
        id: "cat-6-3",
        name: "Championship Items",
        slug: "championship-items",
        description: "Rings, trophies, and championship memorabilia",
        image: "/images/categories/championship.jpg",
        productCount: 100,
        featured: false,
        order: 3
      }
    ]
  }
];

// Generate mock products for each category
function generateMockProduct(
  index: number,
  category: Category,
  subcategory?: Category
): Product {
  const conditions: Product["condition"][] = ["mint", "near-mint", "excellent", "good", "fair", "poor"];
  const rarities: Product["rarity"][] = ["common", "uncommon", "rare", "ultra-rare", "legendary"];
  
  const baseNames: Record<string, string[]> = {
    "trading-cards": [
      "Charizard VMAX Rainbow",
      "Black Lotus Alpha Edition",
      "Blue-Eyes White Dragon 1st Edition",
      "Michael Jordan Rookie Card",
      "Wayne Gretzky Rookie Card"
    ],
    "comics": [
      "Amazing Spider-Man #1",
      "Batman: The Dark Knight Returns",
      "X-Men #1 (1991)",
      "Superman Action Comics #1",
      "The Walking Dead #1"
    ],
    "coins": [
      "1933 Double Eagle",
      "Morgan Silver Dollar 1893-S",
      "Liberty Head Nickel 1913",
      "Roman Aureus",
      "British Sovereign Gold"
    ],
    "stamps": [
      "Inverted Jenny 1918",
      "British Guiana 1856",
      "Penny Black 1840",
      "Treskilling Yellow",
      "Mauritius Post Office"
    ],
    "vintage-toys": [
      "Original Star Wars Figures (Carded)",
      "Transformers G1 Optimus Prime",
      "Hot Wheels Redline Collection",
      "Vintage LEGO Castle Set",
      "GI Joe USS Flagg"
    ],
    "sports-memorabilia": [
      "Babe Ruth Signed Baseball",
      "Michael Jordan Game-Worn Jersey",
      "Muhammad Ali Boxing Gloves",
      "Tom Brady Signed Helmet",
      "Pele World Cup Medal"
    ]
  };

  const vendors = [
    "CardMasters",
    "Vintage Vault",
    "Rare Finds Co",
    "Collector's Paradise",
    "Premium Collectibles",
    "The Treasure Chest"
  ];

  const categorySlug = subcategory?.slug || category.slug;
  const names = baseNames[category.slug] || ["Rare Collectible Item"];
  const name = `${names[index % names.length]} #${1000 + index}`;
  
  const basePrice = Math.floor(Math.random() * 9000) + 100;
  const price = Math.round(basePrice / 10) * 10; // Round to nearest 10

  return {
    id: `prod-${category.slug}-${index}`,
    name,
    description: `Authentic ${name} from the ${subcategory?.name || category.name} collection. This rare piece is in exceptional condition and comes with certificate of authenticity.`,
    price,
    image: `/images/products/${category.slug}-${(index % 5) + 1}.jpg`,
    images: [
      `/images/products/${category.slug}-${(index % 5) + 1}.jpg`,
      `/images/products/${category.slug}-${((index + 1) % 5) + 1}.jpg`,
      `/images/products/${category.slug}-${((index + 2) % 5) + 1}.jpg`
    ],
    category: subcategory?.name || category.name,
    categorySlug: categorySlug,
    vendor: vendors[index % vendors.length],
    vendorId: `vendor-${(index % vendors.length) + 1}`,
    rating: 3.5 + (Math.random() * 1.5),
    reviews: Math.floor(Math.random() * 200) + 5,
    stock: Math.floor(Math.random() * 10) + 1,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    year: 1950 + Math.floor(Math.random() * 74),
    manufacturer: ["Topps", "Wizards", "Hasbro", "Marvel", "DC", "Mattel"][index % 6],
    authenticity: {
      verified: Math.random() > 0.3,
      certificate: Math.random() > 0.5 ? `CERT-${Date.now()}-${index}` : undefined,
      verifiedBy: Math.random() > 0.5 ? "PSA" : "BGS",
      verificationDate: new Date(Date.now() - Math.random() * 31536000000).toISOString()
    },
    specifications: {
      "Dimensions": `${5 + Math.random() * 20}cm x ${5 + Math.random() * 20}cm`,
      "Weight": `${Math.floor(Math.random() * 500) + 10}g`,
      "Material": ["Paper", "Cardboard", "Metal", "Plastic", "Fabric"][index % 5],
      "Edition": ["First", "Limited", "Special", "Anniversary", "Standard"][index % 5]
    },
    tags: [
      category.name.toLowerCase(),
      subcategory?.name.toLowerCase() || "",
      "authentic",
      "certified"
    ].filter(Boolean),
    featured: Math.random() > 0.8,
    createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 2592000000).toISOString()
  };
}

// Generate products for each category
export const mockProducts: Product[] = [];
let productIndex = 0;

mockCategories.forEach(category => {
  // Generate products for main category
  for (let i = 0; i < 20; i++) {
    mockProducts.push(generateMockProduct(productIndex++, category));
  }
  
  // Generate products for subcategories
  if (category.subcategories) {
    category.subcategories.forEach(subcategory => {
      for (let i = 0; i < 15; i++) {
        mockProducts.push(generateMockProduct(productIndex++, category, subcategory));
      }
    });
  }
});

// Mock vendors
export const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "CardMasters",
    slug: "cardmasters",
    description: "Premier dealer in rare trading cards with over 20 years of experience",
    logo: "/images/vendors/cardmasters-logo.jpg",
    banner: "/images/vendors/cardmasters-banner.jpg",
    rating: 4.8,
    reviewCount: 1234,
    productCount: 456,
    verified: true,
    joinedDate: "2020-01-15",
    specialties: ["Trading Cards", "Sports Cards", "Pokemon"],
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA"
    },
    policies: {
      shipping: "Ships worldwide within 24-48 hours",
      returns: "30-day money-back guarantee",
      authenticity: "All items authenticated by PSA/BGS"
    },
    socialLinks: {
      website: "https://cardmasters.example.com",
      instagram: "@cardmasters",
      twitter: "@cardmasters"
    }
  },
  {
    id: "vendor-2",
    name: "Vintage Vault",
    slug: "vintage-vault",
    description: "Specializing in vintage toys and nostalgic collectibles",
    logo: "/images/vendors/vintage-vault-logo.jpg",
    banner: "/images/vendors/vintage-vault-banner.jpg",
    rating: 4.6,
    reviewCount: 892,
    productCount: 678,
    verified: true,
    joinedDate: "2019-06-20",
    specialties: ["Vintage Toys", "Action Figures", "Die-Cast Cars"],
    location: {
      city: "New York",
      state: "NY",
      country: "USA"
    },
    policies: {
      shipping: "Free shipping on orders over $100",
      returns: "14-day return policy",
      authenticity: "Certificate of authenticity included"
    },
    socialLinks: {
      website: "https://vintagevault.example.com",
      facebook: "vintagevault",
      instagram: "@vintagevault"
    }
  },
  {
    id: "vendor-3",
    name: "Rare Finds Co",
    slug: "rare-finds-co",
    description: "Your source for the rarest and most valuable collectibles",
    logo: "/images/vendors/rare-finds-logo.jpg",
    banner: "/images/vendors/rare-finds-banner.jpg",
    rating: 4.9,
    reviewCount: 567,
    productCount: 234,
    verified: true,
    joinedDate: "2018-03-10",
    specialties: ["Comics", "Coins", "Stamps"],
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA"
    },
    policies: {
      shipping: "Express shipping available",
      returns: "No questions asked returns",
      authenticity: "Expert verification on all items"
    },
    socialLinks: {
      website: "https://rarefinds.example.com",
      twitter: "@rarefindsco"
    }
  }
];