/* ==========================================================
   KARAYANA HUB: EDIT THIS FILE TO UPDATE THE SHOP
   ========================================================== */

/* 1. Shop details.
   Leave a value as "" and that item is simply hidden on the site.
   whatsapp: country code + number, digits only, e.g. "919876543210" */
const SHOP = {
  whatsapp: "",
  phone: "",            // e.g. "+91 98765 43210"
  address: "",          // e.g. "Shop 12, Main Market, Ludhiana"
  hours: "",            // e.g. "Mon to Sat, 8 am to 9 pm"
  mapQuery: "Karayana Hub"
};

/* 2. Categories shown as filter chips (order matters). */
const CATEGORIES = ["Snacks", "Staples", "Dairy", "Drinks and breakfast", "Personal care", "Home care"];

/* 3. Products.
   name, desc, cat      : text
   tone                 : a colour used for the tile when there is no photo
   price                : rupees, or 0 to hide the price
   stock                : true / false (false shows "Sold out")
   img                  : optional photo path, e.g. "images/products/parle.jpg"   */
const PRODUCTS = [
  { name: "Parle-G",                 desc: "Original gluco biscuits",        cat: "Snacks",  tone: "#f2c230", price: 0, stock: true, img: "images/products/parle.jpg" },
  { name: "Maggi 2-minute noodles",  desc: "Masala noodles",                 cat: "Snacks",  tone: "#f2c230", price: 0, stock: true, img: "images/products/maggi.jpg" },
  { name: "Good Day Butter Cookies", desc: "Britannia biscuits",             cat: "Snacks",  tone: "#1c7ed6", price: 0, stock: true, img: "images/products/goodday.jpg" },
  { name: "Aloo Bhujia",             desc: "Haldiram’s namkeen",             cat: "Snacks",  tone: "#f2c230", price: 0, stock: true, img: "images/products/bhujia.jpg" },
  { name: "Aashirvaad Atta",         desc: "Shudh chakki atta",              cat: "Staples", tone: "#d62828", price: 0, stock: true, img: "images/products/atta.jpg" },
  { name: "Tata Salt",               desc: "Iodised salt, 1 kg",             cat: "Staples", tone: "#e8590c", price: 0, stock: true, img: "images/products/salt.jpg" },
  { name: "Amul Butter",             desc: "Pasteurised butter, 100 g",      cat: "Dairy",   tone: "#f2a900", price: 0, stock: true, img: "images/products/amul.jpg" },
  { name: "Tata Tea Gold",           desc: "Tea leaf",                       cat: "Drinks and breakfast", tone: "#c8a24a", price: 0, stock: true, img: "images/products/tea.jpg" },
  { name: "Lifebuoy Total",          desc: "Germ-protection soap",           cat: "Personal care", tone: "#d62828", price: 0, stock: true, img: "images/products/lifebuoy.jpg" },
  { name: "Santoor Almond Soft",     desc: "Sandal and almond milk soap",    cat: "Personal care", tone: "#f2a900", price: 0, stock: true, img: "images/products/santoor.jpg" },
  { name: "Dove Cream Beauty Bar",   desc: "Moisturising bathing bar",       cat: "Personal care", tone: "#1c3f8a", price: 0, stock: true, img: "images/products/dove.jpg" },

  { name: "Lay’s Classic Salted",    desc: "Potato chips",                   cat: "Snacks",  tone: "#f2c230", price: 0, stock: true, img: "images/products/lays.jpg" },
  { name: "Kurkure Masala Munch",    desc: "Crunchy snack",                  cat: "Snacks",  tone: "#f08a1c", price: 0, stock: true, img: "images/products/kurkure-masala.jpg" },
  { name: "Kurkure Puffcorn",        desc: "Yummy cheese",                   cat: "Snacks",  tone: "#2f9e44", price: 0, stock: true, img: "images/products/kurkure-puffcorn.jpg" },
  { name: "Uncle Chipps",            desc: "Chips",                          cat: "Snacks",  tone: "#43a047", price: 0, stock: true, img: "images/products/uncle-chipps.jpg" },
  { name: "Marie biscuits",          desc: "Tea-time biscuits",              cat: "Snacks",  tone: "#d9a05b", price: 0, stock: true, img: "images/products/marie.jpg" },
  { name: "Kellogg’s Corn Flakes",   desc: "Breakfast cereal",               cat: "Snacks",  tone: "#e03131", price: 0, stock: true, img: "images/products/cornflakes.jpg" },
  { name: "Basmati rice",            desc: "Long-grain rice",                cat: "Staples", tone: "#2b6e3f", price: 0, stock: true, img: "images/products/basmati-rice.jpg" },
  { name: "Fortune cooking oil",     desc: "Edible oil",                     cat: "Staples", tone: "#f2a900", price: 0, stock: true, img: "images/products/fortune-oil.jpg" },
  { name: "Jivo oil",                desc: "Edible oil",                     cat: "Staples", tone: "#2b8a3e", price: 0, stock: true, img: "images/products/jivo-oil.jpg" },
  { name: "Turmeric powder",         desc: "Spice",                          cat: "Staples", tone: "#f2b705", price: 0, stock: true, img: "images/products/turmeric.jpg" },
  { name: "Horlicks",                desc: "Health drink",                   cat: "Drinks and breakfast", tone: "#1c64a8", price: 0, stock: true, img: "images/products/horlicks.jpg" },
  { name: "Bournvita",               desc: "Health drink",                   cat: "Drinks and breakfast", tone: "#e8590c", price: 0, stock: true, img: "images/products/bournvita.jpg" },
  { name: "Lux soap",                desc: "Bathing soap",                   cat: "Personal care", tone: "#d6336c", price: 0, stock: true, img: "images/products/lux.jpg" },
  { name: "Colgate",                 desc: "Toothpaste",                     cat: "Personal care", tone: "#d62828", price: 0, stock: true, img: "images/products/colgate.jpg" }
];

/* 4. Gallery photos (Inside the shop). */
const GALLERY = [
  { src: "images/shop/snacks.jpg",  alt: "Wall of hanging chips and snack packets", cap: "The snacks wall" },
  { src: "images/shop/shelfB.jpg",  alt: "Toiletries and home care shelves",        cap: "Toiletries and home care" },
  { src: "images/shop/front.jpg",   alt: "Biscuits, staples and tea shelves",       cap: "Biscuits and staples" },
  { src: "images/shop/oils.jpg",    alt: "Cooking oils and breakfast items",        cap: "Oils and breakfast" },
  { src: "images/shop/aisle.jpg",   alt: "Cleaning and personal care aisle",        cap: "Cleaning aisle" },
  { src: "images/shop/floor.jpg",   alt: "The full shop floor",                     cap: "The full shop floor" }
];
