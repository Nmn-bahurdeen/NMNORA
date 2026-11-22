const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

const products = [
  // ─── iPhones ───
  {
    id: 'prod_iphone11',
    name: 'Apple iPhone 11',
    price: 34999,
    originalPrice: 42900,
    category: 'iPhone',
    description: 'Apple iPhone 11 with 6.1-inch Liquid Retina HD display, dual 12MP Ultra Wide and Wide cameras with Night mode, and A13 Bionic chip. Available in vibrant finishes.',
    image: '/products/iphone-base.svg',
    rating: 4.5, reviews: 2341, inStock: true, featured: false, bestseller: true, stock: 25,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'prod_iphone11pro',
    name: 'Apple iPhone 11 Pro',
    price: 54999,
    originalPrice: 62900,
    category: 'iPhone',
    description: 'iPhone 11 Pro with groundbreaking triple-camera system (Ultra Wide, Wide, Telephoto). 5.8-inch Super Retina XDR OLED display with textured matte glass and surgical-grade stainless steel.',
    image: '/products/iphone-pro.svg',
    rating: 4.6, reviews: 1892, inStock: true, featured: false, bestseller: false, stock: 15,
    createdAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: 'prod_iphone11promax',
    name: 'Apple iPhone 11 Pro Max',
    price: 59999,
    originalPrice: 69900,
    category: 'iPhone',
    description: 'iPhone 11 Pro Max featuring a 6.5-inch Super Retina XDR display, triple-camera system, A13 Bionic chip, and up to 5 hours longer battery life with stainless steel band.',
    image: '/products/iphone-promax.svg',
    rating: 4.6, reviews: 1543, inStock: true, featured: false, bestseller: false, stock: 10,
    createdAt: new Date('2024-01-03').toISOString(),
  },
  {
    id: 'prod_iphone12',
    name: 'Apple iPhone 12',
    price: 41999,
    originalPrice: 54900,
    category: 'iPhone',
    description: 'iPhone 12 with 5G speed, A14 Bionic, edge-to-edge Super Retina XDR OLED display, Ceramic Shield with 4x better drop performance, and Night mode on every camera.',
    image: '/products/iphone-base.svg',
    rating: 4.6, reviews: 3102, inStock: true, featured: false, bestseller: true, stock: 30,
    createdAt: new Date('2024-01-04').toISOString(),
  },
  {
    id: 'prod_iphone12pro',
    name: 'Apple iPhone 12 Pro',
    price: 69999,
    originalPrice: 79900,
    category: 'iPhone',
    description: 'iPhone 12 Pro with 5G, A14 Bionic chip, LiDAR Scanner for AR and low-light portraits, ProRAW image processing, and surgical-grade stainless steel flat edges.',
    image: '/products/iphone-pro.svg',
    rating: 4.7, reviews: 2456, inStock: true, featured: false, bestseller: false, stock: 20,
    createdAt: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'prod_iphone12promax',
    name: 'Apple iPhone 12 Pro Max',
    price: 79999,
    originalPrice: 89900,
    category: 'iPhone',
    description: 'iPhone 12 Pro Max has a 6.7-inch Super Retina XDR display, LiDAR Scanner, 5x optical zoom range, and sensor-shift optical image stabilisation for handheld long exposures.',
    image: '/products/iphone-promax.svg',
    rating: 4.7, reviews: 1987, inStock: true, featured: false, bestseller: true, stock: 12,
    createdAt: new Date('2024-01-06').toISOString(),
  },
  {
    id: 'prod_iphone13',
    name: 'Apple iPhone 13',
    price: 54999,
    originalPrice: 69900,
    category: 'iPhone',
    description: 'iPhone 13 with A15 Bionic chip, diagonal dual-camera system with sensor-shift OIS, Cinematic mode in 1080p at 30fps, and 2.5 hours longer battery life.',
    image: '/products/iphone-base.svg',
    rating: 4.7, reviews: 4521, inStock: true, featured: false, bestseller: true, stock: 40,
    createdAt: new Date('2024-01-07').toISOString(),
  },
  {
    id: 'prod_iphone13pro',
    name: 'Apple iPhone 13 Pro',
    price: 99999,
    originalPrice: 119900,
    category: 'iPhone',
    description: 'iPhone 13 Pro introduces the 120Hz ProMotion Super Retina XDR display, massive triple cameras with macro photography down to 2cm, ProRes video, and A15 Bionic 5-core GPU.',
    image: '/products/iphone-pro.svg',
    rating: 4.8, reviews: 3254, inStock: true, featured: true, bestseller: false, stock: 18,
    createdAt: new Date('2024-01-08').toISOString(),
  },
  {
    id: 'prod_iphone13promax',
    name: 'Apple iPhone 13 Pro Max',
    price: 109999,
    originalPrice: 129900,
    category: 'iPhone',
    description: 'iPhone 13 Pro Max has the largest 6.7-inch ProMotion display, longest battery life in iPhone history at launch, 3x optical zoom telephoto camera, and macro video.',
    image: '/products/iphone-promax.svg',
    rating: 4.8, reviews: 2876, inStock: true, featured: false, bestseller: true, stock: 14,
    createdAt: new Date('2024-01-09').toISOString(),
  },
  {
    id: 'prod_iphone14',
    name: 'Apple iPhone 14',
    price: 69999,
    originalPrice: 79900,
    category: 'iPhone',
    description: 'iPhone 14 with Photonic Engine for unbelievable detail and color, Action mode for smooth handheld video, Crash Detection, and Emergency SOS via satellite.',
    image: '/products/iphone-base.svg',
    rating: 4.7, reviews: 3987, inStock: true, featured: false, bestseller: true, stock: 35,
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'prod_iphone14pro',
    name: 'Apple iPhone 14 Pro',
    price: 122999,
    originalPrice: 134900,
    category: 'iPhone',
    description: 'iPhone 14 Pro introduces Dynamic Island, Always-On display, 48MP Main camera with quad-pixel sensor, and the groundbreaking A16 Bionic chip in Space Black and Deep Purple.',
    image: '/products/iphone-pro.svg',
    rating: 4.8, reviews: 2654, inStock: true, featured: true, bestseller: false, stock: 20,
    createdAt: new Date('2024-01-11').toISOString(),
  },
  {
    id: 'prod_iphone14promax',
    name: 'Apple iPhone 14 Pro Max',
    price: 134999,
    originalPrice: 149900,
    category: 'iPhone',
    description: 'iPhone 14 Pro Max featuring 6.7-inch Always-On Super Retina XDR display with Dynamic Island, 48MP Pro camera system with 2x and 3x optical zoom, and A16 Bionic.',
    image: '/products/iphone-promax.svg',
    rating: 4.9, reviews: 1987, inStock: true, featured: true, bestseller: true, stock: 10,
    createdAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: 'prod_iphone15',
    name: 'Apple iPhone 15',
    price: 79999,
    originalPrice: 89900,
    category: 'iPhone',
    description: 'iPhone 15 featuring Dynamic Island, 48MP Main camera with 2x Telephoto, USB-C universal charging, durable color-infused glass, and aluminum contoured edge design.',
    image: '/products/iphone-base.svg',
    rating: 4.8, reviews: 2109, inStock: true, featured: false, bestseller: true, stock: 28,
    createdAt: new Date('2024-01-13').toISOString(),
  },
  {
    id: 'prod_iphone15pro',
    name: 'Apple iPhone 15 Pro',
    price: 134999,
    originalPrice: 149900,
    category: 'iPhone',
    description: 'iPhone 15 Pro forged in aerospace-grade Titanium. Powered by A17 Pro with console-quality gaming, customizable Action button, USB 3 transfer speeds, and 48MP camera.',
    image: '/products/iphone-pro.svg',
    rating: 4.9, reviews: 1876, inStock: true, featured: true, bestseller: false, stock: 15,
    createdAt: new Date('2024-01-14').toISOString(),
  },
  {
    id: 'prod_iphone15promax',
    name: 'Apple iPhone 15 Pro Max',
    price: 159999,
    originalPrice: 174900,
    category: 'iPhone',
    description: 'iPhone 15 Pro Max in Natural Titanium with 5x optical zoom on the 120mm Telephoto lens, Action button, A17 Pro chip, USB 3 with 10Gbps, and all-day battery life.',
    image: '/products/iphone-promax.svg',
    rating: 4.9, reviews: 1432, inStock: true, featured: true, bestseller: true, stock: 8,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'prod_iphone16pro',
    name: 'Apple iPhone 16 Pro',
    price: 119900,
    originalPrice: 134900,
    category: 'iPhone',
    description: 'iPhone 16 Pro with Camera Control button, 48MP Ultra Wide sensor, A18 Pro chip with Apple Intelligence, 4K 120 fps Dolby Vision recording, and 6.3-inch display.',
    image: '/products/iphone-pro.svg',
    rating: 4.9, reviews: 987, inStock: true, featured: true, bestseller: true, stock: 20,
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 'prod_iphone16promax',
    name: 'Apple iPhone 16 Pro Max',
    price: 134900,
    originalPrice: 149900,
    category: 'iPhone',
    description: 'iPhone 16 Pro Max with huge 6.9-inch Super Retina XDR display, Camera Control, 48MP Ultra Wide with autofocus, 5x optical zoom tetraprism camera, and A18 Pro.',
    image: '/products/iphone-promax.svg',
    rating: 4.9, reviews: 743, inStock: true, featured: true, bestseller: true, stock: 12,
    createdAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: 'prod_iphone17pro',
    name: 'Apple iPhone 17 Pro',
    price: 139900,
    originalPrice: 154900,
    category: 'iPhone',
    description: 'iPhone 17 Pro — the ultra-thin flagship Pro with A19 Pro chip, next-generation ProMotion, 48MP front TrueDepth camera with autofocus, and advanced Apple Intelligence.',
    image: '/products/iphone-pro.svg',
    rating: 5.0, reviews: 312, inStock: true, featured: true, bestseller: false, stock: 10,
    createdAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'prod_iphone17promax',
    name: 'Apple iPhone 17 Pro Max',
    price: 154900,
    originalPrice: 169900,
    category: 'iPhone',
    description: 'iPhone 17 Pro Max — the ultimate 6.9-inch Titanium flagship with A19 Pro, revolutionary triple-camera array with periscope zoom, and highest battery capacity ever.',
    image: '/products/iphone-promax.svg',
    rating: 5.0, reviews: 198, inStock: true, featured: true, bestseller: true, stock: 7,
    createdAt: new Date('2024-01-19').toISOString(),
  },

  // ─── Temper Glass ───
  {
    id: 'prod_tg_11',
    name: 'Tempered Glass – iPhone 11 / 11 Pro',
    price: 299,
    originalPrice: 599,
    category: 'Temper Glass',
    description: '9H hardness tempered glass screen protector for iPhone 11 series. Edge-to-edge coverage, anti-fingerprint oleophobic coating, and bubble-free auto alignment.',
    image: '/products/temperglass.svg',
    rating: 4.3, reviews: 892, inStock: true, featured: false, bestseller: true, stock: 100,
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'prod_tg_12',
    name: 'Tempered Glass – iPhone 12 / 12 Pro',
    price: 349,
    originalPrice: 699,
    category: 'Temper Glass',
    description: '9H hardness tempered glass for iPhone 12 / 12 Pro. 2.5D curved edges, case-friendly precision cut, and high-response touch sensitivity.',
    image: '/products/temperglass.svg',
    rating: 4.4, reviews: 1234, inStock: true, featured: false, bestseller: false, stock: 100,
    createdAt: new Date('2024-01-21').toISOString(),
  },
  {
    id: 'prod_tg_13',
    name: 'Tempered Glass – iPhone 13 / 13 Pro',
    price: 399,
    originalPrice: 799,
    category: 'Temper Glass',
    description: 'Ultra-clear 9H tempered glass with speaker dust mesh protection for iPhone 13 series. Full-cover protection with rounded smooth edges.',
    image: '/products/temperglass.svg',
    rating: 4.5, reviews: 2109, inStock: true, featured: false, bestseller: true, stock: 150,
    createdAt: new Date('2024-01-22').toISOString(),
  },
  {
    id: 'prod_tg_14',
    name: 'Tempered Glass – iPhone 14 / 14 Pro',
    price: 449,
    originalPrice: 899,
    category: 'Temper Glass',
    description: '9H tempered glass screen protector for iPhone 14 Pro with Dynamic Island cutout. Optical grade transparency with shatter-resistant safety film.',
    image: '/products/temperglass.svg',
    rating: 4.5, reviews: 1876, inStock: true, featured: false, bestseller: false, stock: 120,
    createdAt: new Date('2024-01-23').toISOString(),
  },
  {
    id: 'prod_tg_15',
    name: 'Tempered Glass – iPhone 15 / 15 Pro',
    price: 499,
    originalPrice: 999,
    category: 'Temper Glass',
    description: 'Premium 9H tempered glass for iPhone 15 series. Privacy filter and anti-glare coating, reinforced shatterproof edges, and installation alignment frame.',
    image: '/products/temperglass.svg',
    rating: 4.6, reviews: 987, inStock: true, featured: true, bestseller: false, stock: 100,
    createdAt: new Date('2024-01-24').toISOString(),
  },
  {
    id: 'prod_tg_16',
    name: 'Tempered Glass – iPhone 16 / 16 Pro',
    price: 549,
    originalPrice: 1099,
    category: 'Temper Glass',
    description: '9H tempered glass designed specifically for iPhone 16 Pro and 16 Pro Max with ultra-slim 0.33mm thickness and military-grade drop defense.',
    image: '/products/temperglass.svg',
    rating: 4.7, reviews: 543, inStock: true, featured: false, bestseller: false, stock: 80,
    createdAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'prod_tg_17',
    name: 'Tempered Glass – iPhone 17 Pro / Pro Max',
    price: 599,
    originalPrice: 1199,
    category: 'Temper Glass',
    description: 'Next-gen titanium-shielded 9H tempered glass engineered for iPhone 17 Pro and Pro Max with edge-to-edge sapphire crystal coating.',
    image: '/products/temperglass.svg',
    rating: 4.9, reviews: 240, inStock: true, featured: true, bestseller: true, stock: 90,
    createdAt: new Date('2024-01-26').toISOString(),
  },

  // ─── Cases & Covers ───
  {
    id: 'prod_case_sil11',
    name: 'Silicone Case – iPhone 11 (Midnight Black)',
    price: 699,
    originalPrice: 1499,
    category: 'Cases & Covers',
    description: 'Soft-touch liquid silicone case for iPhone 11. Microfibre inner lining, non-slip grip, raised camera lip, and wireless charging support.',
    image: '/products/phonecase.svg',
    rating: 4.4, reviews: 1109, inStock: true, featured: false, bestseller: true, stock: 60,
    createdAt: new Date('2024-01-27').toISOString(),
  },
  {
    id: 'prod_case_clear13',
    name: 'Clear Case – iPhone 13 / 13 Pro',
    price: 599,
    originalPrice: 1299,
    category: 'Cases & Covers',
    description: 'Anti-yellowing crystal-clear transparent case for iPhone 13 Pro. Reinforced corner airbags for 10-foot military drop defense.',
    image: '/products/phonecase.svg',
    rating: 4.3, reviews: 876, inStock: true, featured: false, bestseller: false, stock: 70,
    createdAt: new Date('2024-01-28').toISOString(),
  },
  {
    id: 'prod_case_magsafe14',
    name: 'MagSafe Leather Case – iPhone 14 Pro',
    price: 1699,
    originalPrice: 2999,
    category: 'Cases & Covers',
    description: 'Premium genuine leather MagSafe-compatible case for iPhone 14 Pro. Built-in N52 strong magnets for high-speed wireless charging.',
    image: '/products/phonecase.svg',
    rating: 4.6, reviews: 654, inStock: true, featured: true, bestseller: false, stock: 40,
    createdAt: new Date('2024-01-29').toISOString(),
  },
  {
    id: 'prod_case_magsafe15',
    name: 'MagSafe FineWoven Case – iPhone 15 Pro',
    price: 1799,
    originalPrice: 3499,
    category: 'Cases & Covers',
    description: 'Apple FineWoven case with MagSafe for iPhone 15 Pro. Soft microtwill texture with machined aluminum buttons and instant MagSafe snap.',
    image: '/products/phonecase.svg',
    rating: 4.5, reviews: 432, inStock: true, featured: false, bestseller: false, stock: 35,
    createdAt: new Date('2024-01-30').toISOString(),
  },
  {
    id: 'prod_case_magsafe16',
    name: 'MagSafe Titanium Armor Case – iPhone 16 Pro / Max',
    price: 1999,
    originalPrice: 3999,
    category: 'Cases & Covers',
    description: 'Titanium-reinforced armor case with Camera Control cutout for iPhone 16 Pro Max. 360-degree impact ring with folding kickstand.',
    image: '/products/phonecase.svg',
    rating: 4.8, reviews: 310, inStock: true, featured: true, bestseller: true, stock: 50,
    createdAt: new Date('2024-01-31').toISOString(),
  },

  // ─── Wired Headphones ───
  {
    id: 'prod_wired_earpods',
    name: 'Apple EarPods with Lightning Connector',
    price: 1900,
    originalPrice: 1900,
    category: 'Wired Headphones',
    description: 'Original Apple EarPods with Lightning Connector. Engineered for acoustic comfort with in-line remote for volume, playback, and calls.',
    image: '/products/earpods.svg',
    rating: 4.3, reviews: 5432, inStock: true, featured: false, bestseller: true, stock: 80,
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'prod_wired_earpods_usbc',
    name: 'Apple EarPods with USB-C Connector',
    price: 1900,
    originalPrice: 1900,
    category: 'Wired Headphones',
    description: 'Original Apple EarPods with USB-C Connector for iPhone 15, 16 & 17 series. Lossless high-res audio playback with built-in DAC and remote.',
    image: '/products/earpods.svg',
    rating: 4.4, reviews: 2109, inStock: true, featured: false, bestseller: true, stock: 80,
    createdAt: new Date('2024-02-02').toISOString(),
  },
  {
    id: 'prod_wired_boatbass',
    name: 'boAt Bassheads 100 Wired Earphones',
    price: 499,
    originalPrice: 999,
    category: 'Wired Headphones',
    description: 'boAt Bassheads 100 in-ear wired earphones with 10mm dynamic drivers, super extra bass, in-line microphone, and hawk-inspired design.',
    image: '/products/earpods.svg',
    rating: 4.1, reviews: 8765, inStock: true, featured: false, bestseller: false, stock: 100,
    createdAt: new Date('2024-02-03').toISOString(),
  },

  // ─── Wireless Headphones ───
  {
    id: 'prod_wireless_airpods3',
    name: 'Apple AirPods (3rd Generation)',
    price: 19900,
    originalPrice: 19900,
    category: 'Wireless Headphones',
    description: 'Apple AirPods 3 with Personalized Spatial Audio, dynamic head tracking, sweat & water resistance, and up to 30 hours total listening time.',
    image: '/products/airpods.svg',
    rating: 4.7, reviews: 3210, inStock: true, featured: true, bestseller: true, stock: 25,
    createdAt: new Date('2024-02-04').toISOString(),
  },
  {
    id: 'prod_wireless_airpodspro2',
    name: 'Apple AirPods Pro (2nd Gen with USB-C)',
    price: 24900,
    originalPrice: 24900,
    category: 'Wireless Headphones',
    description: 'AirPods Pro 2 with up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and MagSafe charging case with speaker.',
    image: '/products/airpods.svg',
    rating: 4.9, reviews: 4180, inStock: true, featured: true, bestseller: true, stock: 20,
    createdAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'prod_wireless_airdopes',
    name: 'boAt Airdopes 141 TWS Earbuds',
    price: 999,
    originalPrice: 2990,
    category: 'Wireless Headphones',
    description: 'boAt Airdopes 141 true wireless earbuds with 42 hours playback, ENx call noise cancellation, BEAST low latency gaming mode, and IPX4.',
    image: '/products/airpods.svg',
    rating: 4.2, reviews: 12345, inStock: true, featured: false, bestseller: true, stock: 90,
    createdAt: new Date('2024-02-06').toISOString(),
  },
  {
    id: 'prod_wireless_jbl',
    name: 'JBL Tune 510BT Wireless Headphones',
    price: 2499,
    originalPrice: 3999,
    category: 'Wireless Headphones',
    description: 'JBL Tune 510BT over-ear wireless headphones with JBL Pure Bass Sound, 40 hours battery life, Bluetooth 5.0, and foldable design.',
    image: '/products/airpods.svg',
    rating: 4.5, reviews: 4321, inStock: true, featured: true, bestseller: false, stock: 40,
    createdAt: new Date('2024-02-07').toISOString(),
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Checking database initialization...');

    // 1. Seed or update Admin user
    const adminEmail = 'admin@nmnora.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    const adminPasswordHash = await bcrypt.hash('AdminPassword@123', 10);
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: 'NMNORA Store Admin',
          email: adminEmail,
          password: adminPasswordHash,
          role: 'ADMIN',
          phone: '9943881393',
          address: '123 Commerce Street',
          city: 'Chennai',
          pincode: '600048'
        }
      });
      console.log('[Seed] Admin account created: admin@nmnora.com / AdminPassword@123');
    }

    // 2. Seed or update Demo Customer user
    const customerEmail = 'customer@nmnora.com';
    const existingCustomer = await prisma.user.findUnique({ where: { email: customerEmail } });
    const customerPasswordHash = await bcrypt.hash('Customer@123', 10);
    let customerUser = existingCustomer;
    if (!existingCustomer) {
      customerUser = await prisma.user.create({
        data: {
          name: 'Demo Customer',
          email: customerEmail,
          password: customerPasswordHash,
          role: 'CUSTOMER',
          phone: '9943881393',
          address: '123 Commerce Street',
          city: 'Chennai',
          pincode: '600048'
        }
      });
      console.log('[Seed] Demo customer account created: customer@nmnora.com / Customer@123');
    }

    // 3. Seed products if needed
    const existingProductsCount = await prisma.product.count();
    if (existingProductsCount === 0) {
      console.log(`[Seed] Seeding ${products.length} products into database...`);
      for (const p of products) {
        await prisma.product.create({
          data: {
            id: p.id,
            name: p.name,
            price: parseFloat(p.price),
            originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
            category: p.category,
            description: p.description || '',
            image: p.image,
            rating: p.rating || 4.8,
            reviews: p.reviews || 0,
            stock: p.stock !== undefined ? p.stock : 20,
            inStock: p.inStock !== false,
            featured: p.featured === true,
            bestseller: p.bestseller === true,
            compatibility: p.compatibility || null,
          }
        });
      }
      console.log(`[Seed] Successfully seeded ${products.length} products.`);
    } else {
      console.log(`[Seed] Products already present: ${existingProductsCount}`);
    }

    // 4. Seed sample orders if none exist
    const orderCount = await prisma.order.count();
    if (orderCount === 0 && customerUser) {
      console.log('[Seed] Seeding sample demo orders for admin analytics...');
      await prisma.order.create({
        data: {
          orderNumber: 'ORD-DEMO-001',
          userId: customerUser.id,
          customerName: customerUser.name,
          customerEmail: customerUser.email,
          customerPhone: '9943881393',
          shippingAddress: '123 Commerce Street',
          city: 'Chennai',
          pincode: '600048',
          subtotal: 154900,
          deliveryFee: 0,
          total: 154900,
          status: 'Delivered',
          items: {
            create: [
              {
                productName: 'Apple iPhone 17 Pro Max',
                price: 154900,
                quantity: 1,
                image: '/products/iphone-promax.svg',
                category: 'iPhone'
              }
            ]
          }
        }
      });

      await prisma.order.create({
        data: {
          orderNumber: 'ORD-DEMO-002',
          userId: customerUser.id,
          customerName: customerUser.name,
          customerEmail: customerUser.email,
          customerPhone: '9943881393',
          shippingAddress: '123 Commerce Street',
          city: 'Chennai',
          pincode: '600048',
          subtotal: 2298,
          deliveryFee: 0,
          total: 2298,
          status: 'Pending',
          items: {
            create: [
              {
                productName: 'Tempered Glass – iPhone 17 Pro / Pro Max',
                price: 599,
                quantity: 1,
                image: '/products/temperglass.svg',
                category: 'Temper Glass'
              },
              {
                productName: 'MagSafe Leather Case – iPhone 16 Pro',
                price: 1699,
                quantity: 1,
                image: '/products/phonecase.svg',
                category: 'Cases & Covers'
              }
            ]
          }
        }
      });
      console.log('[Seed] Sample demo orders created.');
    }

    console.log('[Seed] Database initialization complete.');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
}

module.exports = seedDatabase;
