import API_BASE_URL_ROOT from "../config";
const API_BASE_URL = `${API_BASE_URL_ROOT}/api/orders`;

export interface Order {
    _id: string;
    orderId: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
        state: string;
        country: string;
    };
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;
    subtotal: number;
    shippingCost: number;
    total: number;
    status: 'Pending' | 'Accepted' | 'Shipped' | 'Delivered' | 'Declined';
    paymentScreenshot: string;
    createdAt: string;
    updatedAt: string;
}

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
};
