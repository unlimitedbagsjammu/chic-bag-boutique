import bagTote from "@/assets/bag-tote.jpg";
import bagCrossbody from "@/assets/bag-crossbody.jpg";
import bagSatchel from "@/assets/bag-satchel.jpg";
import bagClutch from "@/assets/bag-clutch.jpg";
import bagDuffle from "@/assets/bag-duffle.jpg";
import bagBucket from "@/assets/bag-bucket.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  details: string[];
  images: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: "classic-tote",
    name: "The Classic Tote",
    price: 495,
    category: "Totes",
    description: "A timeless silhouette crafted from the finest Italian leather. The perfect companion for work and weekend alike.",
    details: [
      "Premium Italian pebbled leather",
      "Gold-tone hardware",
      "Interior zip pocket",
      "Dimensions: 14\" W x 12\" H x 5\" D",
      "Magnetic closure"
    ],
    images: [bagTote],
    isBestseller: true
  },
  {
    id: "mini-crossbody",
    name: "The Mini Crossbody",
    price: 345,
    category: "Crossbody",
    description: "Elegant simplicity in a compact form. Handcrafted with meticulous attention to detail.",
    details: [
      "Smooth calfskin leather",
      "Adjustable strap",
      "Card slots interior",
      "Dimensions: 7\" W x 5\" H x 2\" D",
      "Gold chain detail"
    ],
    images: [bagCrossbody],
    isNew: true
  },
  {
    id: "structured-satchel",
    name: "The Structured Satchel",
    price: 625,
    category: "Satchels",
    description: "Architectural lines meet artisanal craftsmanship. A statement piece for the discerning collector.",
    details: [
      "Box calfskin leather",
      "Signature lock closure",
      "Two compartments",
      "Dimensions: 11\" W x 8\" H x 4\" D",
      "Detachable shoulder strap"
    ],
    images: [bagSatchel]
  },
  {
    id: "evening-clutch",
    name: "The Evening Clutch",
    price: 275,
    category: "Clutches",
    description: "Understated elegance for your most memorable evenings. Crafted to make an impression.",
    details: [
      "Satin-finish leather",
      "Magnetic closure",
      "Chain strap included",
      "Dimensions: 10\" W x 5\" H x 1.5\" D",
      "Suede lining"
    ],
    images: [bagClutch],
    isNew: true
  },
  {
    id: "weekend-duffle",
    name: "The Weekend Duffle",
    price: 895,
    category: "Travel",
    description: "Journey in style with our signature duffle. Spacious yet refined, for the modern traveler.",
    details: [
      "Full-grain vegetable-tanned leather",
      "Brass hardware",
      "Interior zip pocket",
      "Dimensions: 20\" W x 12\" H x 9\" D",
      "Adjustable shoulder strap"
    ],
    images: [bagDuffle],
    isBestseller: true
  },
  {
    id: "bucket-bag",
    name: "The Bucket Bag",
    price: 445,
    category: "Shoulder Bags",
    description: "Contemporary elegance meets everyday functionality. A modern classic in the making.",
    details: [
      "Soft nappa leather",
      "Drawstring closure",
      "Removable pouch",
      "Dimensions: 9\" W x 10\" H x 6\" D",
      "Gold-tone hardware"
    ],
    images: [bagBucket]
  }
];

export const categories = ["All", "Totes", "Crossbody", "Satchels", "Clutches", "Travel", "Shoulder Bags"];
