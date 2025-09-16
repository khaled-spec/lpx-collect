import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const { userId: currentUserId } = auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user to check if they're admin
    const currentUser = await clerkClient.users.getUser(currentUserId);
    if (currentUser.publicMetadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { role } = await request.json();

    // Validate role
    const validRoles = ["collector", "vendor", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be collector, vendor, or admin" },
        { status: 400 }
      );
    }

    // Update user role
    await clerkClient.users.updateUserMetadata(params.userId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}