import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const featuredProducts = products.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Maison luxury handbag"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>
        <div className="container-luxury relative z-10">
          <div className="max-w-xl animate-fade-in-up">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
              New Collection
            </p>
            <h1 className="heading-display mb-6">
              Timeless Elegance, Artfully Crafted
            </h1>
            <p className="text-body text-lg mb-10 max-w-md">
              Discover our curated collection of handcrafted leather goods, 
              designed for those who appreciate understated luxury.
            </p>
            <Link to="/shop" className="btn-luxury-primary">
              Explore Collection
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Curated Selection
              </p>
              <h2 className="heading-section">Featured Pieces</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium tracking-wide uppercase link-underline inline-flex items-center gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12 border-border hover:bg-muted" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-12 border-border hover:bg-muted" />
          </Carousel>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Our Philosophy
              </p>
              <h2 className="heading-section mb-8">
                Where Heritage Meets Modern Craft
              </h2>
              <p className="text-body mb-6">
                Every Maison piece begins with a single thread of intention—to create
                objects of enduring beauty that transcend the ephemeral nature of trends.
              </p>
              <p className="text-body mb-10">
                Our artisans, trained in time-honored techniques, bring decades of expertise
                to each bag. From the selection of the finest leathers to the precision of
                every stitch, we honor the art of slow craftsmanship.
              </p>
              <Link to="/about" className="btn-luxury-outline">
                Our Story
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/3] bg-muted relative overflow-hidden">
              <img
                src={products[0].images[0]}
                alt="Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury text-center max-w-2xl mx-auto">
          <h2 className="heading-section mb-6">Join the Maison World</h2>
          <p className="text-body mb-10">
            Be the first to discover new collections, private events, and exclusive stories from our atelier.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-border px-5 py-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            <button type="submit" className="btn-luxury-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
