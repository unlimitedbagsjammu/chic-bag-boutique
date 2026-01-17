
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock shipping cost logic (Free above 10,000 INR, else 500 INR)
    const shippingCost = totalPrice > 10000 ? 0 : 500;
    const total = totalPrice + shippingCost;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            toast.success("Order placed successfully!", {
                description: "Thank you for your purchase. You will receive an email shortly.",
            });
            navigate("/");
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <Layout>
                <div className="container-luxury py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <h1 className="heading-section mb-4">Your bag is empty</h1>
                    <p className="text-body mb-8">It looks like you haven't added any unique pieces to your collection yet.</p>
                    <Link to="/shop" className="btn-luxury-primary">
                        Continue Shopping
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-background min-h-screen pt-24 pb-12">
                <div className="container-luxury">
                    <h1 className="heading-display text-3xl md:text-4xl mb-12 text-center">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                        {/* Left Column: Forms */}
                        <div className="space-y-12">
                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">

                                {/* Contact Information */}
                                <div>
                                    <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
                                        Contact Information
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input type="email" id="email" placeholder="you@example.com" required />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Shipping Details */}
                                <div>
                                    <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                                        Shipping Address
                                    </h2>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input type="text" id="firstName" required />
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input type="text" id="lastName" required />
                                            </div>
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="address">Address</Label>
                                            <Input type="text" id="address" placeholder="123 Luxury Lane" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="city">City</Label>
                                                <Input type="text" id="city" required />
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="pincode">Pincode</Label>
                                                <Input type="text" id="pincode" required maxLength={6} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="state">State</Label>
                                                <Input type="text" id="state" required />
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="country">Country</Label>
                                                <Input type="text" id="country" defaultValue="India" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Mobile Payment Mockup */}
                                <div>
                                    <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
                                        Payment Details
                                    </h2>

                                    <div className="bg-muted/30 p-6 rounded-lg border border-border">
                                        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                            <span className="text-xs uppercase tracking-wider">Secure SSL Encryption</span>
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="cardNumber">Card Number</Label>
                                                <div className="relative">
                                                    <Input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-10" required />
                                                    <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label htmlFor="expiry">Expiry Date</Label>
                                                    <Input type="text" id="expiry" placeholder="MM/YY" required />
                                                </div>
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input type="text" id="cvc" placeholder="123" required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full btn-luxury-primary h-14 text-base mt-8"
                                >
                                    {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')}`}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:pl-12">
                            <div className="bg-muted/20 p-8 rounded-sm sticky top-28">
                                <h3 className="font-serif text-xl mb-6">Order Summary</h3>

                                <div className="space-y-6 mb-8 max-h-[40vh] overflow-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex gap-4">
                                            <div className="w-20 h-24 bg-white flex-shrink-0 overflow-hidden border border-border/50">
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-serif text-sm font-medium">{item.product.name}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="mb-6" />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="flex justify-between items-center text-lg font-medium font-serif">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground bg-white p-4 border border-border/50">
                                    <Truck className="w-4 h-4" />
                                    <p>Free express delivery on orders over ₹10,000.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
