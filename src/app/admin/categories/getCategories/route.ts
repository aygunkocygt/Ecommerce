import { NextRequest, NextResponse } from "next/server"
import db from "@/db/db"

export async function GET(req: NextRequest) {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    if (categories.length === 0) {
      return new NextResponse('No categories found', { status: 404 });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
