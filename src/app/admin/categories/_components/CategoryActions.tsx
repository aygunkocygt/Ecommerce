"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteCategory, toggleCategoryAvailability } from "../../_actions/categories";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({id, isActive} : { id:string, isActive: boolean}) {
    const [isPending,startTransition] = useTransition()
    const router = useRouter()
    return(
        <DropdownMenuItem 
        disabled={isPending}
        onClick={() => {
            startTransition(async () => {
                await toggleCategoryAvailability(id,!isActive)
                router.refresh()
            })
        }}>
        {isActive ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
    )
}

export function DeleteDropdownItem({id, disabled}: { id:string, disabled:boolean}){
    const [isPending,startTransition] = useTransition()
    const router = useRouter()
    return(
        <DropdownMenuItem 
        variant="destructive"
        disabled={isPending || disabled}
        onClick={() => {
            startTransition(async () => {
                await deleteCategory(id)
                router.refresh()
            })
        }}>
         Delete
        </DropdownMenuItem>
    )
}