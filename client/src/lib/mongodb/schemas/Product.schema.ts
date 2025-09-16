import mongoose from 'mongoose';
import { Product } from '@/lib/api/types';

const productSchema = new mongoose.Schema<Product>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  image: {
    type: String,
  },
  images: [{
    type: String,
  }],
  category: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  categorySlug: {
    type: String,
  },
  vendor: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  vendorId: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  condition: {
    type: String,
    enum: ['new', 'mint', 'excellent', 'good', 'fair', 'poor'],
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'very-rare', 'legendary'],
  },
  cardNumber: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  year: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear() + 10,
  },
  manufacturer: {
    type: String,
  },
  authenticity: {
    verified: {
      type: Boolean,
      default: false,
    },
    certificate: String,
    verifiedBy: String,
    verificationDate: String,
  },
  specifications: {
    type: Map,
    of: String,
  },
  tags: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      if (ret.specifications && ret.specifications instanceof Map) {
        ret.specifications = Object.fromEntries(ret.specifications.entries());
      }
      return ret;
    }
  }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ categorySlug: 1, price: 1 });
productSchema.index({ vendorId: 1, featured: -1 });
productSchema.index({ featured: 1, views: -1 });
productSchema.index({ condition: 1, rarity: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.models.Product || mongoose.model<Product>('Product', productSchema);