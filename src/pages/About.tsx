import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bagTote from "@/assets/about-2.jpg";
import bagDuffle from "@/assets/about-1.jpg";

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
              Crafting Quality Since 2007
            </h1>
            <p className="text-body text-lg mb-6">
              Founded in Jammu, India, Bags Unlimited began with a clear vision — to manufacture bags that combine durability, functionality, and refined design. What started as a focused production unit has grown into a trusted name, supplying high-quality bags to retailers and partners across India.
            </p>
            <p className="text-body text-lg">
              Rooted in in-house manufacturing and skilled craftsmanship, every Bags Unlimited product is created using premium materials, strong fiber, and precision stitching — ensuring each bag delivers long-lasting performance and everyday reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="pb-24">
        <div className="container-luxury">
          <div className="overflow-hidden rounded-lg">
            <img
              src={bagDuffle}
              alt="Bags Unlimited craftsmanship"
              className="w-full h-auto"
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
                Built with Care. Made to Last.
              </h2>
              <p className="text-body mb-6">
                In a world driven by speed and mass production, Bags Unlimited focuses on precision, consistency, and quality-led manufacturing. Every bag is carefully produced in our in-house unit, where skilled craftsmen oversee each stage — from material selection to stitching and final inspection.
              </p>
              <p className="text-body mb-6">
                By using high-grade fiber, premium fabrics, quality leather, and reinforced stitching, we ensure every bag meets our standards for strength, comfort, and durability. Each product is designed to perform under everyday use, delivering reliability without compromising on style.
              </p>
              <p className="text-body">
                Our process combines traditional craftsmanship with modern manufacturing techniques, allowing us to maintain high quality at scale while ensuring every Bags Unlimited bag reflects attention to detail, long-lasting performance, and trusted build quality.
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
              <h3 className="font-serif text-xl mb-4">Purposeful Design</h3>
              <p className="text-body">
                We design bags with a clear focus on functionality, comfort, and modern style. Every detail is thoughtfully considered to ensure our products remain practical, relevant, and visually timeless across everyday use.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl mb-4">Responsible Manufacturing</h3>
              <p className="text-body">
                With an in-house production unit, we maintain complete control over quality, processes, and working conditions. Our manufacturing practices prioritize consistency, skilled craftsmanship, and responsible sourcing of materials.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl mb-4">Enduring Quality</h3>
              <p className="text-body">
                We believe quality should last. By using premium materials, strong fiber, and precision stitching, every Bags Unlimited product is built for durability, reducing frequent replacement and ensuring long-term value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container-luxury text-center">
          <h2 className="heading-section mb-6">Experience Bags Unlimited</h2>
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
