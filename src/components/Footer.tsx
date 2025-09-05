import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LPX Collect</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted marketplace for authentic collectibles. Connect with
              verified vendors and discover rare treasures.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-gray-400 hover:text-white transition"
                >
                  Browse All
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="text-gray-400 hover:text-white transition"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/featured"
                  className="text-gray-400 hover:text-white transition"
                >
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-gray-400 hover:text-white transition"
                >
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors"
                  className="text-gray-400 hover:text-white transition"
                >
                  Top Vendors
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="font-semibold mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sell"
                  className="text-gray-400 hover:text-white transition"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-guide"
                  className="text-gray-400 hover:text-white transition"
                >
                  Vendor Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition"
                >
                  Pricing & Fees
                </Link>
              </li>
              <li>
                <Link
                  href="/vendor-tools"
                  className="text-gray-400 hover:text-white transition"
                >
                  Vendor Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-gray-400 hover:text-white transition"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-white transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="text-gray-400 hover:text-white transition"
                >
                  Verification Process
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <Separator className="my-8 bg-gray-800" />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-gray-400">support@lpxcollect.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-gray-400">1-800-COLLECT</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-gray-400">New York, NY 10001</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="my-8 bg-gray-800" />
        <div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 LPX Collect. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
