"use client"

import { useState } from 'react'
import { useFormState, useFormStatus } from "react-dom"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/formatters'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { addProduct, updateProduct } from '../../_actions/products'
import { Category } from '@prisma/client'
import Image from 'next/image'
import { addCategory, updateCategory } from '../../_actions/categories'

export function CategoryForm({category} : {category?:Category | null}) {
    const [error,action] = useFormState(category == null ? addCategory : updateCategory.bind(null,category.id), {})

    return (
        <form action={action} className='space-y-8'>
            <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input type='text' id="name" name="name" defaultValue={category?.name || ""} required />
                {error.name && <div className='text-destructive'>{error.name}</div>}
            </div>
            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    )
  }