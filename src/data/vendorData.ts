import type { Vendor } from "@/types";

// Extended vendor interface for dashboard
export interface VendorDashboard {
  analytics: {
    revenue: {
      total: number;
      thisMonth: number;
      lastMonth: number;
      growth: number;
    };
    orders: {
      total: number;
      pending: number;
      processing: number;
      completed: number;
    };
    products: {
      total: number;
      active: number;
      outOfStock: number;
      draft: number;
    };
    customers: {
      total: number;
      returning: number;
      new: number;
      satisfactionRate: number;
    };
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: "pending" | "processing" | "shipped" | "delivered";
    date: Date;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    stock: number;
  }>;
  messages: Array<{
    id: string;
    from: string;
    subject: string;
    message: string;
    unread: boolean;
    date: Date;
  }>;
}

// Pricing plans for vendor registration
export const vendorPricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    interval: "month",
    features: [
      "Up to 50 product listings",
      "Basic analytics dashboard",
      "Standard customer support",
      "5% transaction fee",
      "Monthly payouts",
    ],
    highlighted: false,
    cta: "Start Free",
  },
  {
    id: "pro",
    name: "Professional",
    price: 29.99,
    interval: "month",
    features: [
      "Up to 500 product listings",
      "Advanced analytics & insights",
      "Priority customer support",
      "3% transaction fee",
      "Weekly payouts",
      "Featured vendor badge",
      "Custom store banner",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    interval: "month",
    features: [
      "Unlimited product listings",
      "Real-time analytics",
      "Dedicated account manager",
      "1% transaction fee",
      "Daily payouts",
      "Premium vendor badge",
      "Custom store design",
      "API access",
      "Bulk import/export",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

// Extended vendor data with more details
export const extendedVendors: (Vendor & {
  specialties: string[];
  badges: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  policies: {
    shipping: string;
    returns: string;
    authenticity: string;
  };
  stats: {
    responseRate: number;
    shipOnTime: number;
    positiveReviews: number;
  };
})[] = [
  {
    id: "1",
    userId: "user1",
    storeName: "Premium Cards Co.",
    description:
      "Specializing in rare and vintage trading cards. We authenticate every card and provide certificates of authenticity. With over 10 years in the business, we are your trusted source for premium collectibles.",
    logo: "/images/vendors/vendor1.jpg",
    coverImage: "/images/vendors/cover1.jpg",
    rating: 4.8,
    totalSales: 1250,
    totalProducts: 156,
    responseTime: "< 1 hour",
    shippingInfo: "Ships within 24 hours",
    returnPolicy: "30-day returns accepted",
    verified: true,
    createdAt: new Date("2023-01-15"),
    specialties: [
      "Pokemon Cards",
      "Magic The Gathering",
      "Sports Cards",
      "Vintage Cards",
    ],
    badges: ["Top Seller", "Fast Shipper", "Verified Authentic"],
    socialLinks: {
      twitter: "@premiumcards",
      instagram: "@premiumcardsco",
      facebook: "premiumcardsco",
    },
    policies: {
      shipping:
        "We ship all orders within 24 hours of payment confirmation. All items are carefully packaged with protective sleeves and bubble wrap. Tracking provided for all orders.",
      returns:
        "We accept returns within 30 days of delivery. Items must be in the same condition as sent. Buyer pays return shipping unless item is not as described.",
      authenticity:
        "Every card over $50 comes with a certificate of authenticity. We use professional grading services and maintain detailed provenance records.",
    },
    stats: {
      responseRate: 98,
      shipOnTime: 99,
      positiveReviews: 96,
    },
  },
  {
    id: "2",
    userId: "user2",
    storeName: "Comic Haven",
    description:
      "Your premier destination for vintage and modern comics. From Golden Age classics to the latest releases, we have it all. Every comic is graded and bagged for protection.",
    logo: "/images/vendors/vendor2.jpg",
    coverImage: "/images/vendors/cover2.jpg",
    rating: 4.9,
    totalSales: 890,
    totalProducts: 234,
    responseTime: "< 2 hours",
    shippingInfo: "Free shipping on orders over $50",
    returnPolicy: "14-day returns",
    verified: true,
    createdAt: new Date("2023-03-20"),
    specialties: [
      "Marvel Comics",
      "DC Comics",
      "Indie Comics",
      "Manga",
      "Graphic Novels",
    ],
    badges: ["Power Seller", "Expert Vendor", "Verified Authentic"],
    socialLinks: {
      twitter: "@comichaven",
      instagram: "@comichavenstore",
    },
    policies: {
      shipping:
        "Free shipping on orders over $50. Comics are shipped in protective bags with boards. Expedited shipping available.",
      returns:
        "14-day return window for all items. Comics must be returned in original packaging. Graded comics are final sale.",
      authenticity:
        "All vintage comics are authenticated. We provide detailed condition reports and high-resolution photos.",
    },
    stats: {
      responseRate: 99,
      shipOnTime: 97,
      positiveReviews: 98,
    },
  },
  {
    id: "3",
    userId: "user3",
    storeName: "Vintage Treasures",
    description:
      "Curated collection of vintage toys, coins, and memorabilia. Each item tells a story. We specialize in hard-to-find collectibles from the 60s, 70s, and 80s.",
    logo: "/images/vendors/vendor3.jpg",
    coverImage: "/images/vendors/cover3.jpg",
    rating: 4.7,
    totalSales: 650,
    totalProducts: 89,
    responseTime: "< 3 hours",
    shippingInfo: "Worldwide shipping available",
    returnPolicy: "No returns on vintage items",
    verified: false,
    createdAt: new Date("2023-06-10"),
    specialties: ["Vintage Toys", "Coins", "Stamps", "Memorabilia"],
    badges: ["Trusted Seller", "Rare Finds"],
    policies: {
      shipping:
        "We ship worldwide with insurance. Vintage items require special packaging which may add 1-2 days to processing.",
      returns:
        "Due to the unique nature of vintage items, all sales are final. We provide detailed photos and descriptions.",
      authenticity:
        "We research and document the history of each item. Provenance provided when available.",
    },
    stats: {
      responseRate: 95,
      shipOnTime: 94,
      positiveReviews: 93,
    },
  },
  {
    id: "4",
    userId: "user4",
    storeName: "Sports Legends Store",
    description:
      "Authentic sports memorabilia from your favorite teams and players. Jerseys, cards, autographs, and game-used equipment.",
    logo: "/images/vendors/vendor4.jpg",
    coverImage: "/images/vendors/cover4.jpg",
    rating: 4.9,
    totalSales: 2100,
    totalProducts: 445,
    responseTime: "< 1 hour",
    shippingInfo: "Same-day processing",
    returnPolicy: "60-day returns",
    verified: true,
    createdAt: new Date("2022-11-05"),
    specialties: ["NBA", "NFL", "MLB", "NHL", "Soccer"],
    badges: ["Elite Seller", "Verified Authentic", "Fast Shipper"],
    socialLinks: {
      twitter: "@sportslegends",
      instagram: "@sportslegendsstore",
      facebook: "sportslegends",
    },
    policies: {
      shipping:
        "Same-day processing for orders before 2 PM. Secure packaging for all memorabilia.",
      returns:
        "60-day satisfaction guarantee. Full refund if not completely satisfied.",
      authenticity:
        "All items come with certificates of authenticity from recognized authorities.",
    },
    stats: {
      responseRate: 100,
      shipOnTime: 99,
      positiveReviews: 97,
    },
  },
  {
    id: "5",
    userId: "user5",
    storeName: "The Coin Vault",
    description:
      "Rare and valuable coins from around the world. Ancient to modern, we have coins for every collector.",
    logo: "/images/vendors/vendor5.jpg",
    coverImage: "/images/vendors/cover5.jpg",
    rating: 4.6,
    totalSales: 450,
    totalProducts: 178,
    responseTime: "< 4 hours",
    shippingInfo: "Insured shipping only",
    returnPolicy: "7-day inspection period",
    verified: true,
    createdAt: new Date("2023-02-28"),
    specialties: ["Ancient Coins", "US Coins", "World Coins", "Gold & Silver"],
    badges: ["Numismatic Expert", "Verified Seller"],
    policies: {
      shipping:
        "All shipments are insured and require signature. Discrete packaging for security.",
      returns:
        "7-day inspection period. Return for any reason within this timeframe.",
      authenticity:
        "PCGS and NGC certified coins. Independent appraisals available.",
    },
    stats: {
      responseRate: 92,
      shipOnTime: 96,
      positiveReviews: 94,
    },
  },
  {
    id: "6",
    userId: "user6",
    storeName: "Pop Culture Paradise",
    description:
      "Modern collectibles, Funko Pops, action figures, and limited editions. Your source for the latest and greatest.",
    logo: "/images/vendors/vendor6.jpg",
    coverImage: "/images/vendors/cover6.jpg",
    rating: 4.8,
    totalSales: 3200,
    totalProducts: 890,
    responseTime: "< 30 minutes",
    shippingInfo: "Free shipping over $35",
    returnPolicy: "30-day returns",
    verified: true,
    createdAt: new Date("2022-09-15"),
    specialties: [
      "Funko Pop",
      "Action Figures",
      "Limited Editions",
      "Exclusives",
    ],
    badges: ["Super Seller", "Fast Response", "Top Rated"],
    socialLinks: {
      twitter: "@popculturepara",
      instagram: "@popcultureparadise",
      facebook: "popcultureparadise",
    },
    policies: {
      shipping:
        "Free shipping on orders over $35. Soft protectors included for all Pops.",
      returns:
        "30-day no questions asked returns. We want you to be happy with your purchase.",
      authenticity:
        "Only authentic products directly from manufacturers or authorized distributors.",
    },
    stats: {
      responseRate: 100,
      shipOnTime: 98,
      positiveReviews: 96,
    },
  },
];

// Mock vendor dashboard data
export const mockVendorDashboard: VendorDashboard = {
  analytics: {
    revenue: {
      total: 125650,
      thisMonth: 15420,
      lastMonth: 12180,
      growth: 26.6,
    },
    orders: {
      total: 1250,
      pending: 8,
      processing: 12,
      completed: 1230,
    },
    products: {
      total: 156,
      active: 142,
      outOfStock: 8,
      draft: 6,
    },
    customers: {
      total: 892,
      returning: 654,
      new: 238,
      satisfactionRate: 96,
    },
  },
  recentOrders: [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Charizard Base Set PSA 10",
      amount: 2499.99,
      status: "processing",
      date: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      product: "Pikachu Illustrator Card",
      amount: 5999.99,
      status: "pending",
      date: new Date("2024-01-15T09:15:00"),
    },
    {
      id: "ORD-003",
      customer: "Mike Williams",
      product: "Michael Jordan Rookie Card",
      amount: 1299.99,
      status: "shipped",
      date: new Date("2024-01-14T16:45:00"),
    },
    {
      id: "ORD-004",
      customer: "Emily Brown",
      product: "Vintage Star Wars Set",
      amount: 899.99,
      status: "delivered",
      date: new Date("2024-01-14T11:20:00"),
    },
    {
      id: "ORD-005",
      customer: "David Lee",
      product: "Magic The Gathering Alpha Pack",
      amount: 3499.99,
      status: "processing",
      date: new Date("2024-01-14T08:00:00"),
    },
  ],
  topProducts: [
    {
      id: "PROD-001",
      name: "Charizard Base Set 1st Edition",
      sales: 45,
      revenue: 112499.55,
      stock: 3,
    },
    {
      id: "PROD-002",
      name: "Pikachu Illustrator Promo",
      sales: 12,
      revenue: 71999.88,
      stock: 1,
    },
    {
      id: "PROD-003",
      name: "Michael Jordan Rookie Card",
      sales: 78,
      revenue: 101399.22,
      stock: 5,
    },
    {
      id: "PROD-004",
      name: "Black Lotus MTG Card",
      sales: 8,
      revenue: 159999.92,
      stock: 0,
    },
    {
      id: "PROD-005",
      name: "Amazing Spider-Man #1",
      sales: 23,
      revenue: 45999.77,
      stock: 2,
    },
  ],
  messages: [
    {
      id: "MSG-001",
      from: "John Smith",
      subject: "Question about authenticity",
      message:
        "Can you provide more details about the authentication process for the Charizard card?",
      unread: true,
      date: new Date("2024-01-15T11:30:00"),
    },
    {
      id: "MSG-002",
      from: "Support Team",
      subject: "Your store has been verified!",
      message:
        "Congratulations! Your store has been verified and you now have the verified badge.",
      unread: false,
      date: new Date("2024-01-14T09:00:00"),
    },
    {
      id: "MSG-003",
      from: "Emily Brown",
      subject: "Bulk order inquiry",
      message:
        "I am interested in purchasing multiple items. Do you offer bulk discounts?",
      unread: true,
      date: new Date("2024-01-13T15:45:00"),
    },
  ],
};

// Success stories for vendor registration page
export const vendorSuccessStories = [
  {
    id: "1",
    vendor: "Premium Cards Co.",
    quote:
      "LPX Collect transformed our business. We've reached customers worldwide and tripled our sales in just 6 months.",
    avatar: "/images/vendors/avatar1.jpg",
    name: "Alex Thompson",
    role: "Founder",
    revenue: "+215% growth",
    rating: 4.8,
  },
  {
    id: "2",
    vendor: "Comic Haven",
    quote:
      "The platform's tools and analytics helped us understand our customers better and optimize our inventory.",
    avatar: "/images/vendors/avatar2.jpg",
    name: "Sarah Martinez",
    role: "Owner",
    revenue: "+180% growth",
    rating: 4.9,
  },
  {
    id: "3",
    vendor: "Sports Legends Store",
    quote:
      "Authentication services and buyer protection gave our customers confidence, leading to higher sales.",
    avatar: "/images/vendors/avatar3.jpg",
    name: "Mike Johnson",
    role: "CEO",
    revenue: "+320% growth",
    rating: 4.9,
  },
];

// FAQ for vendor registration
export const vendorFAQ = [
  {
    question: "How much does it cost to start selling?",
    answer:
      "You can start with our Basic plan which is completely free. You only pay transaction fees when you make sales. Upgrade to Pro or Enterprise plans for lower fees and more features.",
  },
  {
    question: "How do I get verified?",
    answer:
      "Submit your business documentation and complete our verification process. Verified vendors get a badge, higher visibility, and customer trust. The process typically takes 2-3 business days.",
  },
  {
    question: "What types of items can I sell?",
    answer:
      "You can sell authentic collectibles including trading cards, comics, coins, stamps, vintage toys, sports memorabilia, and more. All items must be genuine and accurately described.",
  },
  {
    question: "How and when do I get paid?",
    answer:
      "Payments are processed based on your plan: Monthly for Basic, Weekly for Pro, and Daily for Enterprise. Funds are transferred directly to your bank account after clearing.",
  },
  {
    question: "What support do you provide to vendors?",
    answer:
      "We offer comprehensive support including seller resources, analytics tools, marketing features, and customer service. Pro and Enterprise plans get priority support.",
  },
  {
    question: "Can I import my existing inventory?",
    answer:
      "Yes! Enterprise plan includes bulk import/export features. You can also use our API to integrate with your existing systems.",
  },
];
