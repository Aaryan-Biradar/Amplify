export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "pink-gremlin",
    name: "Pink Gremlin",
    price: 4.00,
    description: "Mischievous pink creature with a wild grin",
    image: "/stickers/pink-gremlin.png"
  },
  {
    id: "blue-hamster",
    name: "Blue Hamster",
    price: 4.00,
    description: "Chubby blue friend ready to hack",
    image: "/stickers/blue-hamster.png"
  },
  {
    id: "lollipop-owl",
    name: "Lollipop Owl",
    price: 4.50,
    description: "Colorful owl with a sweet tooth",
    image: "/stickers/lollipop-owl.png"
  },
  {
    id: "laptop-gal",
    name: "Laptop Gal",
    price: 4.00,
    description: "Blue hacker girl at her laptop",
    image: "/stickers/laptop-gal.png"
  },
  {
    id: "screaming-cloud",
    name: "Screaming Cloud",
    price: 3.50,
    description: "Dramatic purple cloud having a moment",
    image: "/stickers/screaming-cloud.png"
  },
  {
    id: "stork-delivery",
    name: "Stork Delivery",
    price: 4.00,
    description: "Green stork with a special bundle",
    image: "/stickers/stork-delivery.png"
  },
  {
    id: "job-seekers",
    name: "Job Seekers Badge",
    price: 3.00,
    description: "Mountain badge for the job hunt",
    image: "/stickers/job-seekers.png"
  },
  {
    id: "job-application",
    name: "Job Application",
    price: 3.50,
    description: "Resume themed sticker for developers",
    image: "/stickers/job-application.png"
  },
  {
    id: "procrastinate",
    name: "Born to Procrastinate",
    price: 3.00,
    description: "Forced to lock in - developer mood",
    image: "/stickers/procrastinate.png"
  },
  {
    id: "fire-hacker",
    name: "Fire Laptop Hacker",
    price: 4.50,
    description: "Intense coding vibes with flames",
    image: "/stickers/fire-hacker.png"
  },
  {
    id: "sleep-not-found",
    name: "404 Sleep Not Found",
    price: 3.00,
    description: "Developer humor owl for night coders",
    image: "/stickers/sleep-not-found.png"
  },
  {
    id: "trophy-axolotl",
    name: "Trophy Axolotl",
    price: 4.50,
    description: "Champion axolotl ready to win",
    image: "/stickers/trophy-axolotl.png"
  }
];

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
