import mongoose from 'mongoose';
import { Vendor } from '@/lib/api/types';

const vendorSchema = new mongoose.Schema<Vendor>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  banner: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalProducts: {
    type: Number,
    default: 0,
    min: 0,
  },
  responseTime: {
    type: String,
    default: '24 hours',
  },
  shippingInfo: {
    type: String,
    default: 'Ships within 1-3 business days',
  },
  returnPolicy: {
    type: String,
    default: '30-day return policy',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  location: {
    city: String,
    state: String,
    country: String,
  },
  contact: {
    email: String,
    phone: String,
    website: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  specialties: [{
    type: String,
  }],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Remove duplicate slug index since it's already unique in schema
vendorSchema.index({ verified: 1, rating: -1 });
vendorSchema.index({ featured: 1, rating: -1 });
vendorSchema.index({ 'location.city': 1, 'location.state': 1 });

export default mongoose.models.Vendor || mongoose.model<Vendor>('Vendor', vendorSchema);