import type {
  PaymentRequest,
  PaymentRequestItem,
  PaymentRequestStats,
  VendorPaymentSummary,
} from "@/types/payment-request";
import { mockVendorOrders, mockVendors } from "./index";

// Commission rate for the platform
const PLATFORM_COMMISSION_RATE = 0.15; // 15%

// Helper function to generate payment request items from orders
function generatePaymentRequestItems(
  _vendorId: string,
  orderIds?: string[],
): PaymentRequestItem[] {
  const vendorOrders = mockVendorOrders.filter(
    (order) => order.status === "completed",
  );

  const selectedOrders = orderIds
    ? vendorOrders.filter((order) => orderIds.includes(order.id))
    : vendorOrders.slice(0, Math.floor(Math.random() * 5) + 1);

  return selectedOrders.map((order) => {
    const commission = order.total * PLATFORM_COMMISSION_RATE;
    const netAmount = order.total - commission;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      commission,
      netAmount,
      orderDate: order.orderDate,
      customer: order.customer,
      products: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  });
}

// Generate mock payment requests
export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: "pr-001",
    vendorId: "vendor-1",
    vendorName: "Rare Finds Collectibles",
    vendorEmail: "contact@rarefinds.com",
    status: "pending",
    requestDate: "2024-01-20T10:00:00Z",
    totalAmount: 2847.5,
    commission: 427.13,
    netAmount: 2420.37,
    items: generatePaymentRequestItems("vendor-1"),
    notes: "Payment request for January sales. Invoice attached.",
    invoiceUrl: "/uploads/invoices/vendor-1-jan-2024.pdf",
  },
  {
    id: "pr-002",
    vendorId: "vendor-2",
    vendorName: "Premium Cards Hub",
    vendorEmail: "billing@premiumcards.com",
    status: "approved",
    requestDate: "2024-01-18T14:30:00Z",
    approvedDate: "2024-01-19T09:15:00Z",
    totalAmount: 1653.25,
    commission: 247.99,
    netAmount: 1405.26,
    items: generatePaymentRequestItems("vendor-2"),
    notes: "Bi-weekly payment request",
    adminNotes: "Approved. Payment scheduled for next business day.",
    invoiceUrl: "/uploads/invoices/vendor-2-week2-jan.pdf",
    approvedBy: "admin@lpxcollect.com",
  },
  {
    id: "pr-003",
    vendorId: "vendor-3",
    vendorName: "Vintage Vault",
    vendorEmail: "finance@vintagevault.com",
    status: "paid",
    requestDate: "2024-01-15T11:45:00Z",
    approvedDate: "2024-01-16T10:20:00Z",
    paidDate: "2024-01-17T16:30:00Z",
    totalAmount: 3241.8,
    commission: 486.27,
    netAmount: 2755.53,
    items: generatePaymentRequestItems("vendor-3"),
    notes: "Monthly payment request for December sales",
    adminNotes: "Payment processed via bank transfer",
    invoiceUrl: "/uploads/invoices/vintage-vault-dec-2024.pdf",
    paymentProofUrl: "/uploads/payment-proofs/pr-003-payment.pdf",
    approvedBy: "admin@lpxcollect.com",
  },
  {
    id: "pr-004",
    vendorId: "vendor-1",
    vendorName: "Rare Finds Collectibles",
    vendorEmail: "contact@rarefinds.com",
    status: "rejected",
    requestDate: "2024-01-10T09:00:00Z",
    rejectedDate: "2024-01-12T14:15:00Z",
    totalAmount: 987.3,
    commission: 148.1,
    netAmount: 839.2,
    items: generatePaymentRequestItems("vendor-1"),
    notes: "Emergency payment request",
    adminNotes: "Rejected due to incomplete documentation",
    rejectedReason:
      "Missing required tax documentation. Please resubmit with all required forms.",
    invoiceUrl: "/uploads/invoices/vendor-1-emergency.pdf",
  },
  {
    id: "pr-005",
    vendorId: "vendor-4",
    vendorName: "Sports Cards Central",
    vendorEmail: "payments@sportscentral.com",
    status: "approved",
    requestDate: "2024-01-19T16:20:00Z",
    approvedDate: "2024-01-20T11:40:00Z",
    totalAmount: 5432.15,
    commission: 814.82,
    netAmount: 4617.33,
    items: generatePaymentRequestItems("vendor-4"),
    notes: "Large order batch payment - priority processing requested",
    adminNotes: "High-value request approved. Payment scheduled for tomorrow.",
    invoiceUrl: "/uploads/invoices/sports-central-batch-001.pdf",
    approvedBy: "admin@lpxcollect.com",
  },
  {
    id: "pr-006",
    vendorId: "vendor-2",
    vendorName: "Premium Cards Hub",
    vendorEmail: "billing@premiumcards.com",
    status: "paid",
    requestDate: "2024-01-12T13:10:00Z",
    approvedDate: "2024-01-13T09:25:00Z",
    paidDate: "2024-01-14T15:45:00Z",
    totalAmount: 2156.4,
    commission: 323.46,
    netAmount: 1832.94,
    items: generatePaymentRequestItems("vendor-2"),
    notes: "Weekly payment cycle",
    adminNotes: "Standard processing - payment completed",
    invoiceUrl: "/uploads/invoices/premium-cards-week1-jan.pdf",
    paymentProofUrl: "/uploads/payment-proofs/pr-006-payment.pdf",
    approvedBy: "admin@lpxcollect.com",
  },
];

// Generate payment request statistics
export function generatePaymentRequestStats(): PaymentRequestStats {
  const totalRequests = mockPaymentRequests.length;
  const pendingRequests = mockPaymentRequests.filter(
    (pr) => pr.status === "pending",
  ).length;
  const approvedRequests = mockPaymentRequests.filter(
    (pr) => pr.status === "approved",
  ).length;
  const paidRequests = mockPaymentRequests.filter(
    (pr) => pr.status === "paid",
  ).length;
  const rejectedRequests = mockPaymentRequests.filter(
    (pr) => pr.status === "rejected",
  ).length;

  const totalAmount = mockPaymentRequests.reduce(
    (sum, pr) => sum + pr.totalAmount,
    0,
  );
  const pendingAmount = mockPaymentRequests
    .filter((pr) => pr.status === "pending" || pr.status === "approved")
    .reduce((sum, pr) => sum + pr.netAmount, 0);
  const paidAmount = mockPaymentRequests
    .filter((pr) => pr.status === "paid")
    .reduce((sum, pr) => sum + pr.netAmount, 0);

  return {
    totalRequests,
    pendingRequests,
    approvedRequests,
    paidRequests,
    rejectedRequests,
    totalAmount,
    pendingAmount,
    paidAmount,
  };
}

// Generate vendor payment summaries
export function generateVendorPaymentSummaries(): VendorPaymentSummary[] {
  return mockVendors.map((vendor) => {
    const vendorRequests = mockPaymentRequests.filter(
      (pr) => pr.vendorId === vendor.id,
    );

    const totalEarnings = vendorRequests.reduce(
      (sum, pr) => sum + pr.totalAmount,
      0,
    );
    const paidAmount = vendorRequests
      .filter((pr) => pr.status === "paid")
      .reduce((sum, pr) => sum + pr.netAmount, 0);
    const pendingAmount = vendorRequests
      .filter((pr) => pr.status === "pending" || pr.status === "approved")
      .reduce((sum, pr) => sum + pr.netAmount, 0);

    const totalOrders = vendorRequests.reduce(
      (sum, pr) => sum + pr.items.length,
      0,
    );
    const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    const lastPaidRequest = vendorRequests
      .filter((pr) => pr.status === "paid")
      .sort((a, b) => {
        const bDate = b.paidDate ? new Date(b.paidDate).getTime() : 0;
        const aDate = a.paidDate ? new Date(a.paidDate).getTime() : 0;
        return bDate - aDate;
      })[0];

    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      totalEarnings,
      paidAmount,
      pendingAmount,
      totalOrders,
      averageOrderValue,
      commissionRate: PLATFORM_COMMISSION_RATE,
      lastPaymentDate: lastPaidRequest?.paidDate,
    };
  });
}

// Mock API functions
// biome-ignore lint/complexity/noStaticOnlyClass: Mock API class for development
export class PaymentRequestMockAPI {
  // Get payment requests with optional filtering
  static async getPaymentRequests(
    vendorId?: string,
    status?: string,
  ): Promise<PaymentRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = mockPaymentRequests;

    if (vendorId) {
      filtered = filtered.filter((pr) => pr.vendorId === vendorId);
    }

    if (status && status !== "all") {
      filtered = filtered.filter((pr) => pr.status === status);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
    );
  }

  // Get single payment request
  static async getPaymentRequest(id: string): Promise<PaymentRequest | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPaymentRequests.find((pr) => pr.id === id) || null;
  }

  // Create payment request
  static async createPaymentRequest(
    vendorId: string,
    data: { orderIds: string[]; notes?: string },
  ): Promise<PaymentRequest> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const items = generatePaymentRequestItems(vendorId, data.orderIds);
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const commission = totalAmount * PLATFORM_COMMISSION_RATE;
    const netAmount = totalAmount - commission;

    const vendor = mockVendors.find((v) => v.id === vendorId);

    const newRequest: PaymentRequest = {
      id: `pr-${Date.now()}`,
      vendorId,
      vendorName: vendor?.name || "Unknown Vendor",
      vendorEmail: vendor?.contact?.email || "unknown@example.com",
      status: "pending",
      requestDate: new Date().toISOString(),
      totalAmount,
      commission,
      netAmount,
      items,
      notes: data.notes,
    };

    mockPaymentRequests.unshift(newRequest);
    return newRequest;
  }

  // Update payment request status (admin function)
  static async updatePaymentRequestStatus(
    id: string,
    status: "approved" | "rejected" | "paid",
    adminNotes?: string,
    rejectedReason?: string,
  ): Promise<PaymentRequest | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const request = mockPaymentRequests.find((pr) => pr.id === id);
    if (!request) return null;

    request.status = status;
    request.adminNotes = adminNotes;

    const now = new Date().toISOString();

    switch (status) {
      case "approved":
        request.approvedDate = now;
        request.approvedBy = "admin@lpxcollect.com";
        break;
      case "rejected":
        request.rejectedDate = now;
        request.rejectedReason = rejectedReason;
        break;
      case "paid":
        request.paidDate = now;
        break;
    }

    return request;
  }

  // Get statistics
  static async getStats(): Promise<PaymentRequestStats> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return generatePaymentRequestStats();
  }

  // Get vendor summaries
  static async getVendorSummaries(): Promise<VendorPaymentSummary[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateVendorPaymentSummaries();
  }
}
