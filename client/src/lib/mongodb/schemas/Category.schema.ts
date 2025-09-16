import mongoose from 'mongoose';
import { Category } from '@/lib/api/types';

const categorySchema = new mongoose.Schema<Category>({
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
  image: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  parent: {
    type: String,
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
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
categorySchema.index({ featured: 1, order: 1 });
categorySchema.index({ parent: 1 });

export default mongoose.models.Category || mongoose.model<Category>('Category', categorySchema);