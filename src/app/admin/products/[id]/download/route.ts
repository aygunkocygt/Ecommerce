import db from "@/db/db"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id },
    select: { imagePath: true, name: true },
  })

  console.log("product:", product)
  if (product == null) return notFound()

  // Construct the image path relative to the project's public directory
  const resolvedImagePath = path.join(process.cwd(), 'public', product.imagePath)

  try {
    const { size } = await fs.stat(resolvedImagePath)
    const file = await fs.readFile(resolvedImagePath)
    const extension = path.extname(resolvedImagePath).slice(1)

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(product.name)}.${extension}"`,
        "Content-Length": size.toString(),
      },
    })
  } catch (error) {
    console.error("Error reading file:", error)
    return notFound()
  }
}
