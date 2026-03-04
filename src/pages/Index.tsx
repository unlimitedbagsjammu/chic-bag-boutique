import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/data/products";
import { ArrowRight, Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import heroSlider2 from "@/assets/hero-slider-2.png";
import heroSlider3 from "@/assets/hero-slider-3.png";
import about1 from "@/assets/about-1.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const featuredProducts = products.slice(0, 6);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const heroSlides = [
    {
      image: heroImage,
      subtitle: "New Collection",
      title: "Timeless Elegance, Artfully Crafted",
      description: "Discover our curated collection of handcrafted leather goods, designed for those who appreciate understated luxury."
    },
    {
      image: heroSlider2,
      subtitle: "Travel in Style",
      title: "Journey with Sophistication",
      description: "Explore our premium luggage collection, built for the modern traveler who refuses to compromise on style or durability."
    },
    {
      image: heroSlider3,
      subtitle: "Back to School",
      title: "Prepared for Excellence",
      description: "Durable, stylish, and functional school bags designed to carry ambitions and essentials with ease."
    }
  ];

  /* Using new categories subset for the home page filter */
  const categories = ["All", "Handbags", "Tote Bags", "Luggage’s", "Laptop Bags"];
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 8000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="relative h-[90vh] min-h-[600px]">
                <div className="absolute inset-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
                </div>
                <div className="container-luxury relative z-10 h-full flex items-center">
                  <div className="max-w-xl animate-fade-in-up">
                    <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
                      {slide.subtitle}
                    </p>
                    <h1 className="heading-display mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-body text-lg mb-10 max-w-md">
                      {slide.description}
                    </p>
                    <Link to="/shop" className="btn-luxury-primary">
                      Explore Collection
                      <ArrowRight className="ml-3 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="container-custom py-24" id="collection">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Collection</h2>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-border/40 pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-medium tracking-wide transition-all duration-300 pb-4 -mb-4.5 px-2
                ${activeCategory === category
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
                <p className="text-muted-foreground">Loading featured products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">New collection coming soon.</p>
              </div>
            )}
          </div>
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
                Crafted to Last. Designed to Perform.
              </h2>
              <p className="text-body mb-6">
                Every Bags Unlimited creation begins with a clear purpose — to design bags that balance durability, functionality, and timeless style, going beyond short-lived trends.
              </p>
              <p className="text-body mb-10">
                Rooted in skilled craftsmanship and refined through modern manufacturing, our bags are made using high-grade materials, strong fiber, and precision stitching. From the careful selection of fabrics and leather to the strength of every seam, we believe in quality that lasts and performance you can rely on, every day.
              </p>
              <Link to="/about" className="btn-luxury-outline">
                Our Story
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/3] bg-muted relative overflow-hidden">
              <img
                src={about1}
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
          <h2 className="heading-section mb-6">Join the Bags Unlimited World</h2>
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
