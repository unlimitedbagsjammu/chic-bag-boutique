import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bagTote from "@/assets/bag-tote.jpg";
import bagDuffle from "@/assets/bag-duffle.jpg";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Our Story
            </p>
            <h1 className="heading-display mb-8">
              Crafting Beauty Since 1987
            </h1>
            <p className="text-body text-lg">
              Founded in a small Florentine workshop, Maison began with a singular vision: 
              to create leather goods of uncompromising quality that would age gracefully 
              and become more beautiful with time.
            </p>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="pb-24">
        <div className="container-luxury">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={bagDuffle}
              alt="Maison craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 lg:py-32 bg-card" id="craftsmanship">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
                Craftsmanship
              </p>
              <h2 className="heading-section mb-8">
                The Art of Slow Making
              </h2>
              <p className="text-body mb-6">
                In an age of mass production, we choose a different path. Each Maison bag 
                is the work of a single artisan, who guides it from cutting table to final 
                inspection. This process cannot be rushed—a single tote requires over 40 
                hours of dedicated craft.
              </p>
              <p className="text-body">
                Our leather is sourced from the finest tanneries in Tuscany, selected for its 
                character and longevity. We use vegetable-tanning methods that have remained 
                unchanged for centuries, resulting in leather that develops a rich patina 
                unique to its owner.
              </p>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={bagTote}
                alt="Artisan at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32" id="sustainability">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Our Values
            </p>
            <h2 className="heading-section">
              Principles That Guide Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center">
              <h3 className="font-serif text-xl mb-4">Timeless Design</h3>
              <p className="text-body">
                We create pieces meant to transcend seasons, designed to be worn for decades 
                and passed down through generations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl mb-4">Ethical Practice</h3>
              <p className="text-body">
                Every material is responsibly sourced. Our artisans work in conditions that 
                respect their dignity and expertise.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl mb-4">Lasting Quality</h3>
              <p className="text-body">
                We believe in buying less but better. Each piece is built to last, reducing 
                waste and honoring resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container-luxury text-center">
          <h2 className="heading-section mb-6">Experience Maison</h2>
          <p className="text-lg opacity-80 mb-10 max-w-lg mx-auto">
            Discover our collection of timeless pieces, each crafted with intention and care.
          </p>
          <Link 
            to="/shop" 
            className="btn-luxury border border-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Shop the Collection
            <ArrowRight className="ml-3 w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
