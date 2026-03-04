import { useState } from "react";
import API_BASE_URL from "@/config";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, CreditCard, Truck, ArrowRight, Loader2, Copy, Upload, Image as ImageIcon, Download, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import paymentQr from "@/assets/payment.jpeg";

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        state: "",
        country: "India",
    });

    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const copyUpiId = () => {
        navigator.clipboard.writeText("pranjalsharma640-1@okicici");
        toast.info("UPI ID copied to clipboard");
    };

    const downloadQr = () => {
        const link = document.createElement('a');
        link.href = paymentQr;
        link.download = 'chic-bag-boutique-payment-qr.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR Code download started");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Calculate totals
    const shippingCost = 100;
    const total = totalPrice + shippingCost;

    const handleProceedToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
        window.scrollTo(0, 0);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!screenshot) {
            toast.error("Please upload a payment screenshot to proceed.");
            return;
        }

        setIsProcessing(true);

        try {
            const newOrderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

            const orderData = {
                orderId: newOrderId,
                customer: {
                    ...formData
                },
                items: items.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images[0]
                })),
                subtotal: totalPrice,
                shippingCost: shippingCost,
                total: total
            };

            const formDataToSend = new FormData();
            if (screenshot) {
                formDataToSend.append('screenshot', screenshot);
            }
            formDataToSend.append('orderData', JSON.stringify(orderData));

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const savedOrder = await response.json();

            setOrderId(savedOrder.orderId);
            setStep('success');
            clearCart();
            window.scrollTo(0, 0);
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && step !== 'success') {
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

    if (step === 'success') {
        return (
            <Layout>
                <div className="container-luxury py-32 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="heading-display text-4xl mb-4">Thank You for Your Order</h1>
                    <p className="text-muted-foreground text-lg mb-2">Order identity: <span className="font-medium text-foreground">{orderId}</span></p>
                    <p className="text-body max-w-md mx-auto mb-12">
                        Your order has been placed successfully. We'll send you a shipping confirmation email as soon as your items are on the way.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/shop" className="btn-luxury-primary">
                            Continue Shopping
                        </Link>
                        <Link to="/" className="btn-luxury-outline">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-background min-h-screen pt-24 pb-12">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto">
                        {/* Stepper */}
                        <div className="flex items-center justify-center mb-16 px-4">
                            <div className={`flex flex-col items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${step === 'shipping' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>1</div>
                                <span className="text-xs uppercase tracking-widest font-medium">Shipping</span>
                            </div>
                            <div className="w-20 h-[1px] bg-border mx-4 mt-[-20px]"></div>
                            <div className={`flex flex-col items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium ${step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>2</div>
                                <span className="text-xs uppercase tracking-widest font-medium">Payment</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
                            {/* Form Area */}
                            <div className="lg:col-span-3">
                                {step === 'shipping' ? (
                                    <form onSubmit={handleProceedToPayment} className="space-y-10 animate-fade-in-up">
                                        <section>
                                            <h2 className="text-xl font-serif mb-6">Contact Information</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                                    <Input
                                                        type="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="you@example.com"
                                                        required
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                                    <Input
                                                        type="tel"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="+91 00000 00000"
                                                        required
                                                        className="h-12"
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h2 className="text-xl font-serif mb-6">Shipping Address</h2>
                                            <div className="grid gap-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground">First Name</Label>
                                                        <Input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} required className="h-12" />
                                                    </div>
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</Label>
                                                        <Input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} required className="h-12" />
                                                    </div>
                                                </div>
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label htmlFor="address" className="text-xs uppercase tracking-wider text-muted-foreground">Address</Label>
                                                    <Input type="text" id="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address, Apartment, Suite" required className="h-12" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground">City</Label>
                                                        <Input type="text" id="city" value={formData.city} onChange={handleInputChange} required className="h-12" />
                                                    </div>
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="pincode" className="text-xs uppercase tracking-wider text-muted-foreground">Pincode</Label>
                                                        <Input type="text" id="pincode" value={formData.pincode} onChange={handleInputChange} required maxLength={6} className="h-12" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="state" className="text-xs uppercase tracking-wider text-muted-foreground">State</Label>
                                                        <Input type="text" id="state" value={formData.state} onChange={handleInputChange} required className="h-12" />
                                                    </div>
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground">Country</Label>
                                                        <Input type="text" id="country" value={formData.country} onChange={handleInputChange} defaultValue="India" required className="h-12" />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <Button type="submit" className="w-full btn-luxury-primary h-14 text-sm uppercase tracking-widest">
                                            Continue to Payment
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handlePayment} className="space-y-10 animate-fade-in-up">
                                        <section>
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-xl font-serif">Payment</h2>
                                                <button type="button" onClick={() => setStep('shipping')} className="text-xs uppercase tracking-widest text-primary hover:underline">Edit Shipping</button>
                                            </div>

                                            <div className="bg-muted/10 p-8 border border-border rounded-sm space-y-10">
                                                <div className="text-center space-y-6">
                                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                        Scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to make the payment.
                                                    </p>

                                                    <div className="relative group mx-auto cursor-zoom-in" onClick={() => setIsQrModalOpen(true)}>
                                                        <div className="relative p-4 bg-white border border-border shadow-md rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                                                            <img
                                                                src={paymentQr}
                                                                alt="Payment QR"
                                                                className="w-64 h-64 md:w-72 md:h-72 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=QR+CODE";
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        downloadQr();
                                                                    }}
                                                                    className="bg-white text-primary p-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2 font-medium text-sm"
                                                                >
                                                                    <Download className="w-5 h-5" />
                                                                    Save QR
                                                                </button>
                                                                <span className="text-xs font-medium uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-full">Tap to Enlarge</span>
                                                            </div>
                                                        </div>
                                                        <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Click image to enlarge or save</p>

                                                        {/* Explicit Download for Mobile */}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                downloadQr();
                                                            }}
                                                            className="mt-4 md:hidden flex items-center gap-2 mx-auto"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Download QR
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">UPI ID</p>
                                                        <div className="flex items-center justify-center gap-3 group">
                                                            <span className="text-lg font-medium tracking-wide text-foreground">
                                                                pranjalsharma640-1@okicici
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={copyUpiId}
                                                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                                                title="Copy UPI ID"
                                                            >
                                                                <Copy className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-primary" />
                                                        <h3 className="text-sm font-serif">Upload Screenshot</h3>
                                                    </div>

                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            id="screenshot"
                                                            accept="image/*"
                                                            onChange={handleScreenshotChange}
                                                            className="hidden"
                                                            required
                                                        />
                                                        <label
                                                            htmlFor="screenshot"
                                                            className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-border rounded-lg bg-white/50 hover:bg-white hover:border-primary transition-all cursor-pointer p-6 text-center"
                                                        >
                                                            {screenshotPreview ? (
                                                                <div className="space-y-3">
                                                                    <div className="w-20 h-20 mx-auto border border-border rounded overflow-hidden">
                                                                        <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <p className="text-xs text-primary font-medium">Click to change screenshot</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium">Tap to upload screenshot</p>
                                                                        <p className="text-xs text-muted-foreground">Verification is required to process order</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-md">
                                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                                    <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                                                        Your order will be verified manually once the payment screenshot is reviewed by our team.
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full btn-luxury-primary h-14 text-sm uppercase tracking-widest"
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center gap-3">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                                        </Button>
                                    </form>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-2">
                                <div className="bg-card p-8 border border-border sticky top-28">
                                    <h3 className="font-serif text-lg mb-6 uppercase tracking-wider">Your Bag</h3>

                                    <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={item.product.id} className="flex gap-4">
                                                <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : "https://via.placeholder.com/100?text=No+Img"}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Img";
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-medium mt-2">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span>₹{shippingCost.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="pt-4 flex justify-between items-center border-t border-border font-serif text-lg">
                                            <span>Total</span>
                                            <span>₹{total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-4 bg-muted/50 rounded-sm">
                                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                                            <Truck className="w-4 h-4" />
                                            Express Delivery Guaranteed
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Full Screen Modal */}
                {isQrModalOpen && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
                        onClick={() => setIsQrModalOpen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
                            onClick={() => setIsQrModalOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div
                            className="relative max-w-full max-h-full p-4 bg-white rounded-2xl shadow-2xl animate-scale-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={paymentQr}
                                alt="Full Size Payment QR"
                                className="w-[85vw] max-w-md h-auto object-contain"
                            />
                            <div className="mt-6 flex flex-col items-center gap-4 border-t border-border pt-6">
                                <div className="text-center">
                                    <p className="text-sm font-serif text-foreground font-medium">Scan with any UPI App</p>
                                    <p className="text-xs text-muted-foreground mt-1">GPay, PhonePe, Paytm, etc.</p>
                                </div>
                                <button
                                    onClick={downloadQr}
                                    className="btn-luxury-primary w-full flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
