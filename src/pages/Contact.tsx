import { Layout } from "@/components/layout/Layout";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message. We'll be in touch soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32 border-b border-border">
        <div className="container-luxury text-center">
          <h1 className="heading-display mb-4">Contact Us</h1>
          <p className="text-body max-w-lg mx-auto">
            We're here to assist you. Reach out with any questions about our collection, 
            orders, or partnerships.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div>
              <h2 className="heading-section mb-12">Get in Touch</h2>
              
              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-card flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-2">Visit Our Atelier</h3>
                    <p className="text-body">
                      245 Fifth Avenue, Suite 1200<br />
                      New York, NY 10016
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-card flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-2">Email Us</h3>
                    <p className="text-body">
                      General: hello@maison.com<br />
                      Press: press@maison.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-card flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-2">Call Us</h3>
                    <p className="text-body">
                      +1 (212) 555-0100
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-card flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-2">Hours</h3>
                    <p className="text-body">
                      Monday – Friday: 10am – 6pm<br />
                      Saturday: 11am – 5pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="mt-16 pt-16 border-t border-border" id="shipping">
                <h3 className="font-serif text-xl mb-6">Shipping & Returns</h3>
                <p className="text-body mb-4">
                  We offer complimentary shipping on all orders within the United States. 
                  International shipping rates are calculated at checkout.
                </p>
                <p className="text-body">
                  Returns are accepted within 30 days of delivery for unworn items in original 
                  packaging. Contact us to initiate a return.
                </p>
              </div>

              <div className="mt-10" id="care">
                <h3 className="font-serif text-xl mb-6">Care Guide</h3>
                <p className="text-body">
                  Store your bag in the provided dust bag when not in use. Avoid prolonged 
                  exposure to direct sunlight. Clean with a soft, dry cloth. For deeper cleaning, 
                  we recommend professional leather care services.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="heading-section mb-12">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium tracking-widest uppercase mb-3">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium tracking-widest uppercase mb-3">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium tracking-widest uppercase mb-3">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium tracking-widest uppercase mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full bg-transparent border border-border px-5 py-4 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                <button type="submit" className="btn-luxury-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
