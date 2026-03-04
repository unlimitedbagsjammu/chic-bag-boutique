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
      <Link to={`/shop/${product.id}`} className="block">
        <div className="card-product-image relative overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x500?text=No+Image";
            }}
          />
          {product.isNewArrival && (
            <span className="absolute top-4 left-4 text-[10px] font-medium tracking-widest uppercase bg-background/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
              New
            </span>
          )}
          {product.isBestseller && !product.isNewArrival && (
            <span className="absolute top-4 left-4 text-[10px] font-medium tracking-widest uppercase bg-background/95 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
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
        <Link to={`/shop/${product.id}`}>
          <h3 className="font-serif text-lg hover:text-muted-foreground transition-colors">{product.name}</h3>

          {/* Low Stock Warning */}
          {product.stock !== undefined && product.stock > 0 && product.stock < 5 && (
            <p className="text-[10px] text-red-600 font-medium animate-pulse mt-0.5">
              Hurry up, only {product.stock} pieces left!
            </p>
          )}

          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                <span className="text-sm text-orange-500 font-medium">
                  ({Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF)
                </span>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
