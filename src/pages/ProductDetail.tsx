import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { products } from "@/data/products";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

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
            <div className="aspect-[3/4] bg-card overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="lg:py-8">
              {product.isNew && (
                <span className="inline-block text-[10px] font-medium tracking-widest uppercase bg-card px-3 py-1 mb-6">
                  New Arrival
                </span>
              )}
              {product.isBestseller && !product.isNew && (
                <span className="inline-block text-[10px] font-medium tracking-widest uppercase bg-gold-light px-3 py-1 mb-6">
                  Bestseller
                </span>
              )}

              <h1 className="heading-display text-3xl lg:text-4xl mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-serif mb-8">${product.price}</p>

              <p className="text-body mb-10 max-w-md">{product.description}</p>

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
              <button className="btn-luxury-primary w-full lg:w-auto mb-8">
                Add to Bag — ${product.price * quantity}
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
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                  <div className="aspect-[3/4] bg-background overflow-hidden mb-5">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-lg">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">${p.price}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
