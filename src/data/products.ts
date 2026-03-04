import bagTote from "@/assets/bag-clutch.jpg";
import bagCrossbody from "@/assets/bag-crossbody.jpg";
import bagSatchel from "@/assets/bag-satchel.jpg";
import bagClutch from "@/assets/bag-clutch.jpg";
import bagDuffle from "@/assets/bag-bucket.jpg";
import bagBucket from "@/assets/bag-bucket.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number; // Maximum Retail Price for discount display
  category: string;
  description: string;
  details: string[];
  images: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  stock?: number;
  createdAt?: Date;
}

export const products: Product[] = [];

export const categories = [
  "All",
  "Handbags",
  "Tote Bags",
  "Ladies Wallets",
  "Laptop Bags",
  "Sling Bags",
  "School Bags",
  "Luggages",
  "Men Wallets"
];
