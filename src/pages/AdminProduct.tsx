import { useState, useEffect } from "react";
import API_BASE_URL from "@/config/apiBaseUrl";
import { Layout } from "@/components/layout/Layout";
import { addProduct, getAllProducts, deleteProduct, deleteAllProducts, updateProduct } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { categories, Product } from "@/data/products";
import { Loader2, Trash2, RefreshCw, Plus, Lock, LogIn, AlertTriangle, ShieldCheck, Upload, X, Pencil, ShoppingBag, List, ChevronDown, ExternalLink } from "lucide-react";
import { getAllOrders, updateOrderStatus, Order as OrderType } from "@/lib/orders";


export default function AdminProduct() {
    const { toast } = useToast();

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // App State
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    // Unified Image State
    type ProductImage =
        | { type: 'existing', url: string }
        | { type: 'new', file: File, previewUrl: string };

    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",       // Selling Price
        mrp: "",         // Maximum Retail Price
        category: categories[1],
        description: "",
        details: "",
        stock: "",
        isNewArrival: false,
        isBestseller: false,
    });

    // Discount Calculation for Display
    const discountPercent = formData.price && formData.mrp
        ? Math.round(((parseFloat(formData.mrp) - parseFloat(formData.price)) / parseFloat(formData.mrp)) * 100)
        : 0;

    // Fetch products
    const fetchProducts = async () => {
        try {
            setFetching(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({
                title: "Error",
                description: "Failed to load products.",
                variant: "destructive",
            });
        } finally {
            setFetching(false);
        }
    };

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setFetching(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Failed to load orders.",
                variant: "destructive",
            });
        } finally {
            setFetching(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setUpdatingStatusId(id);
            await updateOrderStatus(id, newStatus);
            toast({
                title: "Status Updated",
                description: `Order status changed to ${newStatus}.`,
            });
            fetchOrders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order status.",
                variant: "destructive",
            });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'products') {
                fetchProducts();
            } else {
                fetchOrders();
            }
        }
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded auth for now as requested
        if (username === "admin" && password === "bags123") {
            setIsAuthenticated(true);
            toast({
                title: "Welcome Admin",
                description: "You have successfully logged in.",
            });
        } else {
            toast({
                title: "Access Denied",
                description: "Invalid credentials.",
                variant: "destructive",
            });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const processFiles = (files: File[]) => {
        const newImages: ProductImage[] = files.map(file => ({
            type: 'new',
            file: file,
            previewUrl: URL.createObjectURL(file)
        }));
        setProductImages(prev => [...prev, ...newImages]);
    };

    const removeFile = (index: number) => {
        setProductImages(prev => {
            const imageToRemove = prev[index];
            // If it's a new file, revoke the URL
            if (imageToRemove.type === 'new') {
                URL.revokeObjectURL(imageToRemove.previewUrl);
            }
            // Remove exactly the item at this index
            return prev.filter((_, i) => i !== index);
        });
    };

    // API Configuration
    const PRODUCT_API_URL = `${API_BASE_URL}/api/products`;

    const uploadImages = async (): Promise<string[]> => {
        if (productImages.length === 0) return ["https://via.placeholder.com/400x500?text=No+Image"];

        // Process images sequentially to maintain strict order
        // Mixing Promise.all with sequential mapping is fine here
        const uploadPromises = productImages.map(async (image) => {
            // Case 1: Existing image (already a URL)
            if (image.type === 'existing') {
                return image.url;
            }

            // Case 2: New file (needs upload)
            const formData = new FormData();
            formData.append("file", image.file);

            try {
                const response = await fetch(`${PRODUCT_API_URL}/upload`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                console.error("Upload error:", error);
                throw error;
            }
        });

        return await Promise.all(uploadPromises);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            mrp: product.mrp ? product.mrp.toString() : "",
            category: product.category,
            description: product.description,
            details: product.details.join("\n"),
            stock: product.stock !== undefined && product.stock !== null ? product.stock.toString() : "",
            isNewArrival: product.isNewArrival || false,
            isBestseller: product.isBestseller || false,
        });

        // Map existing images to unified state
        const existingImages: ProductImage[] = (product.images || []).map(url => ({
            type: 'existing',
            url: url
        }));
        setProductImages(existingImages);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        toast({
            title: "Edit Mode",
            description: `Editing "${product.name}". Make changes and click Update.`,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            name: "",
            price: "",
            mrp: "",
            category: categories[1],
            description: "",
            details: "",
            stock: "",
            isNewArrival: false,
            isBestseller: false,
        });
        setProductImages([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload/Resolve all images
            // This function now returns the final list of URLs in the correct order
            const imageUrls = await uploadImages();

            // Parse details
            const detailsArray = formData.details.split("\n").filter((line) => line.trim() !== "");

            // Prepare product object
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                mrp: formData.mrp ? parseFloat(formData.mrp) : null,
                category: formData.category,
                description: formData.description,
                details: detailsArray,
                images: imageUrls,
                stock: formData.stock === "" ? null : parseInt(formData.stock),
                isNewArrival: formData.isNewArrival,
                isBestseller: formData.isBestseller,
                createdAt: new Date(),
            };

            if (editingId) {
                await updateProduct(editingId, productData as unknown as Partial<Product>);
                toast({
                    title: "Updated!",
                    description: "Product updated successfully.",
                });
            } else {
                await addProduct(productData as unknown as Product);
                toast({
                    title: "Success!",
                    description: `Product added with ${imageUrls.length} image(s).`,
                });
            }

            // Reset form
            cancelEdit();

            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "Failed to save product. Please check console.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteProduct(id);
            toast({
                title: "Deleted",
                description: "Product removed successfully.",
            });
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({
                title: "Error",
                description: "Failed to delete product.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm("⚠️ WARNING: This will delete ALL products from your database. This action CANNOT be undone. Are you absolutely sure?")) return;

        // Double confirmation for safety
        if (!confirm("Are you REALLY sure? This will replace your entire catalog.")) return;

        try {
            setFetching(true);
            await deleteAllProducts();
            toast({
                title: "All Products Deleted",
                description: "Your inventory has been completely cleared.",
                variant: "destructive"
            });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting all:", error);
            toast({
                title: "Error",
                description: "Failed to delete all products.",
                variant: "destructive",
            });
            setFetching(false);
        }
    };

    // Render Login Screen if not authenticated
    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center py-20 bg-secondary/30">
                    <div className="bg-card p-8 rounded-lg border border-border/50 shadow-lg w-full max-w-md animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-serif font-bold">Admin Access</h1>
                            <p className="text-muted-foreground mt-2 text-sm">Please identify yourself to manage the boutique.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Enter admin username"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-background border border-input rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Enter password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-2 bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Access Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-luxury py-16 lg:py-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-1">
                    <div>
                        <h1 className="heading-display text-3xl mb-1">Admin Dashboard</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'products' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}
                            >
                                <List className="w-4 h-4" />
                                Products
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'orders' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'}`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Orders
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {activeTab === 'products' ? (
                            <button
                                onClick={handleDeleteAll}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 border border-red-100 transition-colors"
                            >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Delete ALL Products
                            </button>
                        ) : null}
                        <button
                            onClick={activeTab === 'products' ? fetchProducts : fetchOrders}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {activeTab === 'products' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in-up">
                            {/* LEFT COLUMN: ADD PRODUCT FORM */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-card p-6 rounded-lg border border-border/50 shadow-sm sticky top-24">
                                    <h2 className="text-lg font-medium mb-5 flex items-center gap-2 pb-4 border-b border-border/50">
                                        {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                        {editingId ? "Edit Product" : "Add New Product"}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                                placeholder="Product Name"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Sale Price */}
                                            <div>
                                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Selling Price (₹)</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    required
                                                    step="0.01"
                                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                                                    placeholder="1813"
                                                />
                                            </div>
                                            {/* MRP */}
                                            <div>
                                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">MRP (₹)</label>
                                                <input
                                                    type="number"
                                                    name="mrp"
                                                    value={formData.mrp}
                                                    onChange={handleChange}
                                                    step="0.01"
                                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                                    placeholder="3650"
                                                />
                                            </div>
                                        </div>

                                        {/* Discount Preview */}
                                        {discountPercent > 0 && (
                                            <div className="bg-orange-50 text-orange-700 text-xs px-3 py-2 rounded flex items-center justify-between">
                                                <span>Discount applied:</span>
                                                <span className="font-bold">{discountPercent}% OFF</span>
                                            </div>
                                        )}

                                        {/* Stock & Category */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Category */}
                                            <div>
                                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                                >
                                                    {categories.map((cat) => (
                                                        cat !== "All" && (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Stock */}
                                            <div>
                                                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Stock</label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                                placeholder="Short description..."
                                            />
                                        </div>

                                        {/* Details */}
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Details (one per line)</label>
                                            <textarea
                                                name="details"
                                                value={formData.details}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                                placeholder="Feature 1\nFeature 2"
                                            />
                                        </div>

                                        {/* Image Upload (File Input) */}
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider text-muted-foreground">Product Images</label>

                                            <div className="space-y-3">
                                                {/* File Input */}
                                                <div
                                                    className={`relative group border-2 border-dashed rounded-md px-4 py-8 flex flex-col items-center justify-center text-center transition-all duration-200 bg-secondary/5 
                                                ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary'}`}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                >
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileSelect}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Upload className={`w-8 h-8 mb-3 transition-colors ${isDragging ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary'}`} />
                                                    <p className="text-sm font-semibold mb-1">
                                                        {isDragging ? "Drop images here" : "Click or drag images to upload"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                                                </div>

                                                {/* Image Previews */}
                                                {productImages.length > 0 && (
                                                    <div className="grid grid-cols-4 gap-2 animate-fade-in">
                                                        {productImages.map((img, idx) => (
                                                            <div key={idx} className="relative aspect-square rounded overflow-hidden border border-border group">
                                                                <img
                                                                    src={img.type === 'existing' ? img.url : img.previewUrl}
                                                                    alt={`Preview ${idx}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(idx)}
                                                                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <div className="text-xs text-muted-foreground col-span-4 mt-1">
                                                            {productImages.length} image(s) selected
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="flex gap-4 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="isNewArrival"
                                                    checked={formData.isNewArrival}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                New
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer text-sm hover:text-primary transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="isBestseller"
                                                    checked={formData.isBestseller}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                Bestseller
                                            </label>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            {editingId && (
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="w-1/3 bg-secondary text-secondary-foreground py-2 rounded hover:bg-secondary/80 transition-colors text-sm font-medium h-10"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium h-10 shadow-sm"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Update Product" : "Add Product & Upload")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: PRODUCT LIST */}
                            <div className="lg:col-span-8">
                                <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                                    <div className="p-6 border-b border-border/50 bg-secondary/10 flex justify-between items-center">
                                        <h2 className="text-lg font-medium">Manage Inventory ({products.length})</h2>
                                    </div>

                                    {products.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                            {fetching ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                                                    <p>Loading inventory...</p>
                                                </div>
                                            ) : (
                                                <div className="max-w-xs">
                                                    {/* Minimal SVG Icon for Empty State */}
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Plus className="w-8 h-8 text-muted-foreground/50" />
                                                    </div>
                                                    <p className="mb-2 text-foreground font-medium">Inventory is empty</p>
                                                    <p className="text-sm">Use the form on the left to add your first product.</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border">
                                            {products.map((product) => {
                                                // Calc discount for list view too
                                                const discount = (product.mrp && product.price)
                                                    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                                                    : 0;

                                                return (
                                                    <div key={product.id} className="p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-secondary/20 transition-colors group">
                                                        {/* Image */}
                                                        <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border/50 bg-white">
                                                            <img
                                                                src={product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/100?text=No+Img"}
                                                                alt={product.name}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Img";
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                                                {product.category && <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded">{product.category}</span>}
                                                            </div>

                                                            <p className="text-muted-foreground text-xs truncate max-w-lg">{product.description}</p>

                                                            <div className="flex items-center gap-3 text-xs pt-1">
                                                                <span className={product.stock === undefined || (product.stock && product.stock > 0) ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                                                    {product.stock === undefined ? "In Stock (Unlimited)" : (product.stock > 0 ? `${product.stock} in stock` : "Out of stock")}
                                                                </span>
                                                                {(product.isNewArrival || product.isBestseller) && <span className="text-muted-foreground">•</span>}
                                                                {product.isNewArrival && <span className="text-blue-500 font-medium">New</span>}
                                                                {product.isBestseller && <span className="text-amber-500 font-medium">Bestseller</span>}
                                                            </div>
                                                        </div>

                                                        {/* Price & Action */}
                                                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 ml-auto">
                                                            <div className="text-right">
                                                                <div className="font-bold text-base">₹ {product.price.toFixed(2)}</div>
                                                                {product.mrp && product.mrp > product.price && (
                                                                    <div className="text-xs text-muted-foreground">
                                                                        <span className="line-through mr-1">₹ {product.mrp}</span>
                                                                        <span className="text-orange-600 font-medium">({discount}% OFF)</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                                title="Edit Product"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(product.id, product.name)}
                                                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden min-h-[600px] animate-fade-in">
                            <div className="p-6 border-b border-border/50 bg-secondary/10">
                                <h2 className="text-lg font-medium">Customer Orders ({orders.length})</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-20 text-center">
                                    <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mb-4" />
                                    <p className="text-foreground font-medium">No orders yet</p>
                                    <p className="text-sm text-muted-foreground">Orders will appear here once customers start purchasing.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                                                <th className="px-6 py-4 font-semibold">Order Info</th>
                                                <th className="px-6 py-4 font-semibold">Customer</th>
                                                <th className="px-6 py-4 font-semibold">Items</th>
                                                <th className="px-6 py-4 font-semibold">Amount</th>
                                                <th className="px-6 py-4 font-semibold">Proof</th>
                                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border text-sm">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-secondary/10 transition-colors group">
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="font-bold text-sm mb-1">{order.orderId}</div>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                            <br />
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="font-medium text-sm">{order.customer.firstName} {order.customer.lastName}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">{order.customer.email}</div>
                                                        <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                                                        <div className="text-[10px] text-muted-foreground mt-2 max-w-[180px] leading-relaxed">
                                                            {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="space-y-3">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex gap-2 items-center">
                                                                    <div className="w-8 h-8 rounded border border-border bg-white p-1 overflow-hidden flex-shrink-0">
                                                                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-[11px] font-medium truncate max-w-[120px]">{item.name}</div>
                                                                        <div className="text-[10px] text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <div className="text-sm font-bold">₹ {order.total.toLocaleString('en-IN')}</div>
                                                        <div className="text-[10px] text-muted-foreground mt-1">
                                                            Sub: ₹ {order.subtotal}
                                                            <br />
                                                            Ship: ₹ {order.shippingCost}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 align-top">
                                                        <a
                                                            href={order.paymentScreenshot}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-medium"
                                                        >
                                                            View Proof <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-6 align-top text-center">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                                disabled={updatingStatusId === order._id}
                                                                className={`appearance-none px-4 py-1.5 pr-8 rounded-full text-[11px] font-bold border cursor-pointer transition-all outline-none
                                                                    ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                        order.status === 'Accepted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                            order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                                                                order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                                                                                    'bg-red-50 text-red-600 border-red-200'}`}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Accepted">Accepted</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                                <option value="Declined">Declined</option>
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                                                {updatingStatusId === order._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
