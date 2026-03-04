import { Product } from "@/data/products";
import API_BASE_URL from "../config/apiBaseUrl";

const API_URL = `${API_BASE_URL}/api/products`;

// Get all products
export async function getAllProducts(): Promise<Product[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();
        console.log("📦 Fetched products:", products);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

// Get a single product by ID
export async function getProductById(productId: string): Promise<Product | null> {
    try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Failed to fetch product");
        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        const response = await fetch(`${API_URL}/category/${category}`);
        if (!response.ok) throw new Error("Failed to fetch products by category");
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
}

// Add a new product
export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error("Failed to add product");
        const data = await response.json();
        console.log("✅ Product added with ID:", data.id);
        return data.id;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}

// Update a product
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error("Failed to update product");
        console.log("✅ Product updated:", productId);
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete product");
        console.log("🗑️ Product deleted:", productId);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

// Delete all products
export async function deleteAllProducts(): Promise<void> {
    try {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete all products");
        console.log("🔥 All products deleted!");
    } catch (error) {
        console.error("Error deleting all products:", error);
        throw error;
    }
}
