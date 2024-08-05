"use server"

import db from '@/db/db'
import { z } from 'zod'
import fs from 'fs/promises'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'


const addSchema = z.object({
  name: z.string().min(1),
})

export async function addCategory(prevState: unknown, formData: FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if (result.success === false) {
      return result.error.formErrors.fieldErrors
    }

    const data = result.data
  
    await db.category.create({
      data: {
        isActive: false,
        name: data.name,
      },
    })
    revalidatePath("/")
    redirect("/admin/categories")
}

const editSchema = addSchema.extend({
    name: z.string().min(1),
})

export async function updateCategory(id:string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))

  console.log("result:",result)
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  console.log("formdata:",formData)

  const data = result.data
  const category = await db.category.findUnique({ where: { id }})

  if(category == null) return notFound()



 
  await db.category.update({
    where: { id },
    data: {
      name: data.name,
    },
  })
  revalidatePath("/")
  redirect("/admin/categories")
}

export async function toggleCategoryAvailability(id:string,isActive:boolean){
  await db.category.update({where: { id }, data: { isActive }})

  revalidatePath("/")
  revalidatePath("/categories")
}

export async function deleteCategory(id:string){
 const category = await db.category.delete({ where: { id }})

 if(category == null) return notFound()

 revalidatePath("/")
 revalidatePath("/categories")
}