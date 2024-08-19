"use server"

import db from '@/db/db'
import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// File ve image için şema tanımları
const fileSchema = z.instanceof(File, { message: "Required" }).optional()
const imageSchema = z.instanceof(File, { message: "Required" }).refine(
  file => file.size > 0 && file.type.startsWith("image/"), { message: "Image file is required" }
)

// addSchema: Yeni ürün eklemek için kullanılan şema
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema,  // file opsiyonel
  image: imageSchema,  // image zorunlu
})

// updateProduct için şema
const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional()
})

// Yeni ürün ekleme fonksiyonu
export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const productsDir = path.join(process.cwd(), 'public', 'products');
  await fs.mkdir(productsDir, { recursive: true });

  let filePath = null;
  if (data.file && data.file.size > 0) {  // Eğer file varsa ve boyutu > 0 ise işliyoruz
    filePath = path.join(productsDir, `${crypto.randomUUID()}-${data.file.name}`);
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  const imagePath = path.join(productsDir, `${crypto.randomUUID()}-${data.image.name}`);
  await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: filePath ? `/products/${path.basename(filePath)}` : null,  // filePath opsiyonel
      imagePath: `/products/${path.basename(imagePath)}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// Ürün güncelleme fonksiyonu
export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  const productsDir = path.join(process.cwd(), 'public', 'products');

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    if (product.filePath) {
      await fs.unlink(path.join(process.cwd(), 'public', product.filePath)); // unlink işlemi sadece filePath mevcutsa yapılır
    }
    filePath = path.join(productsDir, `${crypto.randomUUID()}-${data.file.name}`);
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    if (product.imagePath) {
      await fs.unlink(path.join(process.cwd(), 'public', product.imagePath)); // unlink işlemi sadece imagePath mevcutsa yapılır
    }
    imagePath = path.join(productsDir, `${crypto.randomUUID()}-${data.image.name}`);
    await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()));
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: filePath ? `/products/${path.basename(filePath)}` : null,
      imagePath: imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

// Ürün erişilebilirliğini değiştirme fonksiyonu
export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } })

  revalidatePath("/")
  revalidatePath("/products")
}

// Ürün silme fonksiyonu
export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });

  if (product == null) return notFound();

  if (product.filePath) {
    await fs.unlink(path.join(process.cwd(), product.filePath));
  }

  if (product.imagePath) {
    await fs.unlink(path.join(process.cwd(), product.imagePath));
  }

  revalidatePath("/");
  revalidatePath("/products");
}