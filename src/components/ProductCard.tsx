import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  return (
    <div className="group block">
      <Link to={`/product/${product.id}`} className="block">
        <div className="card-product-image relative overflow-hidden">
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
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-foreground hover:text-background"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg hover:text-muted-foreground transition-colors">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">${product.price}</p>
        </Link>
      </div>
    </div>
  );
}
