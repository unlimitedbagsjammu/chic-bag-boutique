import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { getProductById, getAllProducts } from "@/lib/products";
import { Product } from "@/data/products";
import { ArrowLeft, Minus, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [productData, allProducts] = await Promise.all([
          getProductById(id),
          getAllProducts()
        ]);
        setProduct(productData);
        if (productData) {
          setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container-luxury py-32 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-luxury py-32 text-center">
          <h1 className="heading-section mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-luxury-outline">
            Return to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container-luxury py-8 border-b border-border">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
      </div>

      {/* Product Content */}
      <section className="py-16 lg:py-24">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            {/* Image Section */}
            <div className="flex flex-col gap-4">
              <div className="aspect-[3/4] bg-card overflow-hidden">
                <img
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] || product.images[0] : "https://via.placeholder.com/400x500?text=No+Img"}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:py-8">
              {product.isNewArrival && (
                <span className="inline-block text-[10px] font-medium tracking-widest uppercase bg-card px-3 py-1 mb-6">
                  New Arrival
                </span>
              )}
              {product.isBestseller && !product.isNewArrival && (
                <span className="inline-block text-[10px] font-medium tracking-widest uppercase bg-gold-light px-3 py-1 mb-6">
                  Bestseller
                </span>
              )}

              <h1 className="heading-display text-3xl lg:text-4xl mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-serif mb-8">₹{product.price}</p>

              <p className="text-body mb-6 max-w-md">{product.description}</p>

              {/* Low Stock Warning */}
              {product.stock !== undefined && product.stock > 0 && product.stock < 5 && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md inline-block">
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    🔥 Hurry up, only {product.stock} pieces left!
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-10">
                <p className="text-xs font-medium tracking-widest uppercase mb-4">
                  Quantity
                </p>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-card transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-card transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  if (product) {
                    addToCart(product, quantity);
                    toast({
                      title: "Added to bag",
                      description: `${product.name} has been added to your shopping bag.`,
                    });
                  }
                }}
                className="btn-luxury-primary w-full lg:w-auto mb-8"
              >
                Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}
              </button>

              {/* Details Accordion */}
              <div className="border-t border-border pt-10">
                <h3 className="text-xs font-medium tracking-widest uppercase mb-6">
                  Details
                </h3>
                <ul className="space-y-3">
                  {product.details.map((detail, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="border-t border-border pt-10 mt-10">
                <h3 className="text-xs font-medium tracking-widest uppercase mb-6">
                  Shipping & Returns
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complimentary shipping on all orders. Returns accepted within 30 days of delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container-luxury">
          <h2 className="heading-section text-center mb-16">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/shop/${p.id}`} className="group block">
                <div className="aspect-[3/4] bg-background overflow-hidden mb-5">
                  <img
                    src={p.images && p.images.length > 0 ? p.images[0] : "https://via.placeholder.com/400x500?text=No+Img"}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
