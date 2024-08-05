import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/CategoryActions";

export default function AdminCategoryPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Categories</PageHeader>
        <Button asChild>
          <Link href="/admin/categories/new">Add Category</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      isActive:true,
      _count: { select: { products: true } },
    },
    orderBy:{ name: "asc"}
  });

  if(categories.length === 0) return <p>No categories found</p>

  console.log("categories:",categories)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map(category => (
            <TableRow key={category.id}> 
                <TableCell>
                {category.isActive ? (
                    <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2 className="stroke-blue-600"  />
                    </>
                ) : (
                    <>
                     <span className="sr-only">Unavailable</span>
                    <XCircle className="stroke-destructive" />
                    </>
                )}
                </TableCell>

                <TableCell>
                    {category.name}
                </TableCell>
                <TableCell>
                {formatNumber(category._count.products)}
                </TableCell>
     
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <a download href={`/admin/categories/${category.id}/download`}>
                                Download
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/categories/${category.id}/edit`}>
                                Edit
                                </Link>
                            </DropdownMenuItem>
                            <ActiveToggleDropdownItem id={category.id} isActive={category.isActive} />
                            <DropdownMenuSeparator />
                            <DeleteDropdownItem id={category.id} disabled={category._count.products > 0} />
                        </DropdownMenuContent>
                    </DropdownMenu>
          
                </TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
