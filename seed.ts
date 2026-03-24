import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const initialData = {
  categories: [
    { name: "Diamond Top-Up", slug: "topup", displayOrder: 1 },
    { name: "Guild Boost", slug: "boost", displayOrder: 2 },
    { name: "Panel Store", slug: "panel", displayOrder: 3 },
    { name: "TikTok Offers", slug: "tiktok", displayOrder: 4 },
    { name: "Web Dev", slug: "webdev", displayOrder: 5 }
  ],
  packages: [
    // Diamond Top-Up
    { name: "25 Diamonds", price: 80, categorySlug: "topup", displayOrder: 1, status: "active", buttonText: "Buy Now" },
    { name: "50 Diamonds", price: 160, categorySlug: "topup", displayOrder: 2, status: "active", buttonText: "Buy Now" },
    { name: "100 Diamonds", price: 300, categorySlug: "topup", displayOrder: 3, status: "active", buttonText: "Buy Now" },
    { name: "200 Diamonds", price: 600, categorySlug: "topup", displayOrder: 4, status: "active", buttonText: "Buy Now" },
    { name: "310 Diamonds", price: 900, categorySlug: "topup", displayOrder: 5, status: "active", buttonText: "Buy Now" },
    { name: "520 Diamonds", price: 1520, categorySlug: "topup", displayOrder: 6, status: "active", buttonText: "Buy Now" },
    { name: "1060 Diamonds", price: 2980, categorySlug: "topup", displayOrder: 7, status: "active", buttonText: "Buy Now" },
    { name: "1580 Diamonds", price: 4490, categorySlug: "topup", displayOrder: 8, status: "active", buttonText: "Buy Now" },
    { name: "2180 Diamonds", price: 6020, categorySlug: "topup", displayOrder: 9, status: "active", buttonText: "Buy Now" },
    { name: "5000 Diamonds", price: 13930, categorySlug: "topup", displayOrder: 10, status: "active", buttonText: "Buy Now" },
    { name: "5600 Diamonds", price: 14900, categorySlug: "topup", displayOrder: 11, status: "active", buttonText: "Buy Now" },
    { name: "11500 Diamonds", price: 30690, categorySlug: "topup", displayOrder: 12, status: "active", buttonText: "Buy Now" },
    // Memberships
    { name: "Weekly Lite", price: 120, categorySlug: "topup", displayOrder: 13, status: "active", description: "Instant Diamonds, Daily Rewards", buttonText: "Select" },
    { name: "Weekly", price: 500, categorySlug: "topup", displayOrder: 14, status: "active", description: "450+ Diamonds Total, Special Badge", badge: "Most Popular", buttonText: "Select" },
    { name: "Monthly", price: 2500, categorySlug: "topup", displayOrder: 15, status: "active", description: "2600+ Diamonds Total, Premium Rewards", buttonText: "Select" },
    
    // Guild Boost
    { name: "Guild Boost Service", price: 5, categorySlug: "boost", displayOrder: 1, status: "active", description: "135,500 Glory in 1.5 Hours", buttonText: "Order Now" },
    
    // Panel Store - iOS
    { name: "Fluorite 1 Day", price: 1000, categorySlug: "panel", displayOrder: 1, status: "active", description: "iOS Platform", buttonText: "Order" },
    { name: "Fluorite 7 Days", price: 3000, categorySlug: "panel", displayOrder: 2, status: "active", description: "iOS Platform", buttonText: "Order" },
    { name: "Fluorite 31 Days", price: 6200, categorySlug: "panel", displayOrder: 3, status: "active", description: "iOS Platform", buttonText: "Order" },
    { name: "E Sign 1 Year", price: 2500, categorySlug: "panel", displayOrder: 4, status: "active", description: "iOS Platform", buttonText: "Order" },
    // Panel Store - Android
    { name: "Drip Client 1 Day", price: 1000, categorySlug: "panel", displayOrder: 5, status: "active", description: "Android Platform", buttonText: "Order" },
    { name: "Drip Client 7 Days", price: 1500, categorySlug: "panel", displayOrder: 6, status: "active", description: "Android Platform", buttonText: "Order" },
    { name: "Drip Client 15 Days", price: 2100, categorySlug: "panel", displayOrder: 7, status: "active", description: "Android Platform", buttonText: "Order" },
    { name: "Drip Client 30 Days", price: 4500, categorySlug: "panel", displayOrder: 8, status: "active", description: "Android Platform", buttonText: "Order" },
    { name: "HG Tools 15 Days", price: 2100, categorySlug: "panel", displayOrder: 9, status: "active", description: "Android Platform", buttonText: "Order" },
    { name: "HG Tools 30 Days", price: 4000, categorySlug: "panel", displayOrder: 10, status: "active", description: "Android Platform", buttonText: "Order" },
    
    // TikTok Offers
    { name: "1000 Likes", price: 200, categorySlug: "tiktok", displayOrder: 1, status: "active", description: "High Quality Likes", buttonText: "Order" },
    { name: "1000 Views", price: 50, categorySlug: "tiktok", displayOrder: 2, status: "active", description: "High Quality Views", buttonText: "Order" },
    
    // Web Dev
    { name: "Landing Page", price: 5000, categorySlug: "webdev", displayOrder: 1, status: "active", description: "Professional Landing Page", buttonText: "Order" },
    { name: "E-commerce Site", price: 15000, categorySlug: "webdev", displayOrder: 2, status: "active", description: "Full E-commerce Solution", buttonText: "Order" }
  ]
};

async function seed() {
  console.log("Seeding data...");
  
  // Clear existing data (optional, but good for clean start)
  const categoriesSnap = await getDocs(collection(db, "categories"));
  for (const docSnap of categoriesSnap.docs) {
    await deleteDoc(doc(db, "categories", docSnap.id));
  }
  const packagesSnap = await getDocs(collection(db, "packages"));
  for (const docSnap of packagesSnap.docs) {
    await deleteDoc(doc(db, "packages", docSnap.id));
  }

  const categoryIds: Record<string, string> = {};

  for (const cat of initialData.categories) {
    const docRef = await addDoc(collection(db, "categories"), cat);
    categoryIds[cat.slug] = docRef.id;
    console.log(`Added category: ${cat.name}`);
  }

  for (const pkg of initialData.packages) {
    const { categorySlug, ...pkgData } = pkg;
    await addDoc(collection(db, "packages"), {
      ...pkgData,
      categoryId: categoryIds[categorySlug]
    });
    console.log(`Added package: ${pkg.name}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
