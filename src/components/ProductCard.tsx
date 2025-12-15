import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block cursor-pointer">
      <div className="card-product-image relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 text-[10px] font-medium tracking-widest uppercase bg-background px-3 py-1">
            New
          </span>
        )}
        {product.isBestseller && !product.isNew && (
          <span className="absolute top-4 left-4 text-[10px] font-medium tracking-widest uppercase bg-gold-light text-foreground px-3 py-1">
            Bestseller
          </span>
        )}
      </div>
      <div className="mt-5">
        <h3 className="font-serif text-lg">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">${product.price}</p>
      </div>
    </Link>
  );
}
