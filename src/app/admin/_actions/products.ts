"use server"

import db from '@/db/db'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(file => file.size > 0, "Required"),
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  const productsDir = path.join(process.cwd(), 'public', 'products')
  await fs.mkdir(productsDir, { recursive: true })

  const filePath = path.join(productsDir, `${crypto.randomUUID()}-${data.file.name}`)
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  const imagePath = path.join(productsDir, `${crypto.randomUUID()}-${data.image.name}`)
  await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()))

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: `/products/${path.basename(filePath)}`,
      imagePath: `/products/${path.basename(imagePath)}`,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional()
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))

  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })

  if (product == null) return notFound()

  const productsDir = path.join(process.cwd(), 'public', 'products')

  let filePath = product.filePath
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(path.join(process.cwd(), 'public', product.filePath))
    filePath = path.join(productsDir, `${crypto.randomUUID()}-${data.file.name}`)
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(path.join(process.cwd(), 'public', product.imagePath))
    imagePath = path.join(productsDir, `${crypto.randomUUID()}-${data.image.name}`)
    await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()))
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: `/products/${path.basename(filePath)}`,
      imagePath: `/products/${path.basename(imagePath)}`,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } })

  revalidatePath("/")
  revalidatePath("/products")
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })

  if (product == null) return notFound()

  await fs.unlink(path.join(process.cwd(), 'public', product.filePath))
  await fs.unlink(path.join(process.cwd(), 'public', product.imagePath))

  revalidatePath("/")
  revalidatePath("/products")
}
