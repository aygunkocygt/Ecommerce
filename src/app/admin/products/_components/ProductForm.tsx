"use client"

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from "react-dom"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/formatters'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { addProduct, updateProduct } from '../../_actions/products'
import { Product } from '@prisma/client'
import Image from 'next/image'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/admin/categories/getCategories')
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, [])

  return (
    <form action={action} className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input type='text' id="name" name="name" defaultValue={product?.name || ""} required />
        {error.name && <div className='text-destructive'>{error.name}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='priceInCents'>Price In Cents</Label>
        <Input type='number' id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)} />
        <div className='text-muted-foreground'>{formatCurrency((priceInCents || 0))}</div>
        {error.priceInCents && <div className='text-destructive'>{error.priceInCents}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea defaultValue={product?.description || ""} id="description" name="description" required />
        {error.description && <div className='text-destructive'>{error.description}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='categoryId'>Category</Label>
        <Select id="categoryId" name="categoryId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error.categoryId && <div className='text-destructive'>{error.categoryId}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>File</Label>
        <Input type='file' id="file" name="file" />
        {product != null && <div className='text-muted-foreground'>{product.filePath}</div>}
        {error.file && <div className='text-destructive'>{error.file}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='image'>Image</Label>
        <Input type='file' id="image" name="image" required={product == null} />
        {product != null && <Image src={product.imagePath} height="400" width="400" alt="Product Image" />}
        {error.image && <div className='text-destructive'>{error.image}</div>}
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
