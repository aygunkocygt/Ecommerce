import db from "@/db/db"
import { notFound } from "next/navigation"
import DetailPage from "./_components/DetailPage"

export default async function ProductDetailPage({params : { id }} : { params: { id:string }}){
    
    const product = await db.product.findUnique({ where: { id }})

    if(product == null) return notFound()
        
    return(
        <DetailPage product={product} />
    )
}