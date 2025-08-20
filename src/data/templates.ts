
import { Template } from '@/components/templates/TemplateCard';

export const templateCategories = [
  'All',
  'Business', 
  'Portfolio',
  'E-commerce',
  'Blog',
  'Landing Page',
  'Dashboard',
  'Agency',
  'Restaurant',
  'Education'
];

export const mockTemplates: Template[] = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    category: 'Business',
    description: 'Professional business website with clean design and modern aesthetics. Perfect for corporate websites and professional services.',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    downloads: 1247,
    rating: 4.8,
    tags: ['Responsive', 'Modern', 'Professional', 'Corporate'],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Business</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">BusinessPro</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home" class="hero">
            <div class="container">
                <h1>Transform Your Business Today</h1>
                <p>We provide innovative solutions to help your business grow and succeed in the digital age.</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>
        
        <section id="about" class="about">
            <div class="container">
                <h2>About Us</h2>
                <p>With over 10 years of experience, we deliver exceptional results for our clients.</p>
            </div>
        </section>
    </main>
</body>
</html>`
      },
      {
        name: 'styles.css',
        language: 'css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: #2563eb;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 150px 0 100px;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: rgba(255,255,255,0.2);
    border: 2px solid rgba(255,255,255,0.3);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.cta-button:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

.about {
    padding: 100px 0;
    text-align: center;
}

.about h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.about p {
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .nav-menu {
        gap: 1rem;
    }
}`
      }
    ]
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work with this stunning creative portfolio template featuring smooth animations and modern design.',
    preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    downloads: 892,
    rating: 4.9,
    tags: ['Creative', 'Portfolio', 'Animated', 'Modern'],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="portfolio-container">
        <header class="hero-section">
            <h1 class="hero-title">John Doe</h1>
            <p class="hero-subtitle">Creative Designer & Developer</p>
            <div class="hero-cta">
                <button class="btn-primary">View Work</button>
                <button class="btn-secondary">Contact Me</button>
            </div>
        </header>
        
        <section class="work-section">
            <h2>Featured Work</h2>
            <div class="work-grid">
                <div class="work-item">
                    <div class="work-image"></div>
                    <h3>Project One</h3>
                    <p>Web Design</p>
                </div>
                <div class="work-item">
                    <div class="work-image"></div>
                    <h3>Project Two</h3>
                    <p>Branding</p>
                </div>
                <div class="work-item">
                    <div class="work-image"></div>
                    <h3>Project Three</h3>
                    <p>Development</p>
                </div>
            </div>
        </section>
    </div>
</body>
</html>`
      },
      {
        name: 'styles.css',
        language: 'css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a0a;
    color: #ffffff;
    overflow-x: hidden;
}

.portfolio-container {
    min-height: 100vh;
}

.hero-section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%);
}

.hero-title {
    font-size: 4rem;
    font-weight: 300;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeInUp 1s ease-out;
}

.hero-subtitle {
    font-size: 1.5rem;
    color: #888;
    margin-bottom: 3rem;
    animation: fadeInUp 1s ease-out 0.2s both;
}

.hero-cta {
    display: flex;
    gap: 1rem;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.btn-primary {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid #333;
}

.btn-secondary:hover {
    background: #333;
    transform: translateY(-3px);
}

.work-section {
    padding: 100px 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.work-section h2 {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 4rem;
    color: #fff;
}

.work-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.work-item {
    background: #111;
    border-radius: 20px;
    padding: 2rem;
    transition: transform 0.3s ease;
}

.work-item:hover {
    transform: translateY(-10px);
}

.work-image {
    height: 200px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    border-radius: 10px;
    margin-bottom: 1rem;
}

.work-item h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.work-item p {
    color: #888;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-cta {
        flex-direction: column;
        align-items: center;
    }
    
    .work-section h2 {
        font-size: 2rem;
    }
}`
      }
    ]
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'Complete e-commerce solution with product catalog, shopping cart, and modern checkout experience.',
    preview: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
    downloads: 2156,
    rating: 4.7,
    tags: ['E-commerce', 'Shopping', 'Mobile-first', 'Modern'],
    files: [
      {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Store</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">ModernStore</div>
            <nav class="nav">
                <a href="#home">Home</a>
                <a href="#products">Products</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </nav>
            <div class="cart-icon">🛒 <span class="cart-count">0</span></div>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Discover Amazing Products</h1>
                <p>Shop the latest trends with free shipping worldwide</p>
                <button class="shop-now-btn">Shop Now</button>
            </div>
        </section>

        <section class="products" id="products">
            <div class="container">
                <h2>Featured Products</h2>
                <div class="product-grid">
                    <div class="product-card">
                        <div class="product-image"></div>
                        <h3>Premium Headphones</h3>
                        <p class="price">$199.99</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="product-card">
                        <div class="product-image"></div>
                        <h3>Smart Watch</h3>
                        <p class="price">$299.99</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                    <div class="product-card">
                        <div class="product-image"></div>
                        <h3>Wireless Speaker</h3>
                        <p class="price">$149.99</p>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>`
      },
      {
        name: 'styles.css',
        language: 'css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header {
    background: white;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 20px;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e53e3e;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav a:hover {
    color: #e53e3e;
}

.cart-icon {
    font-size: 1.2rem;
    cursor: pointer;
    position: relative;
}

.cart-count {
    background: #e53e3e;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.8rem;
    position: absolute;
    top: -8px;
    right: -8px;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 150px 0 100px;
    text-align: center;
    margin-top: 70px;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.shop-now-btn {
    background: white;
    color: #667eea;
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.shop-now-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.products {
    padding: 100px 0;
}

.products h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-10px);
}

.product-image {
    height: 250px;
    background: linear-gradient(45deg, #ff9a9e, #fecfef);
}

.product-card h3 {
    padding: 1rem;
    font-size: 1.3rem;
    color: #333;
}

.price {
    padding: 0 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #e53e3e;
}

.add-to-cart {
    width: 100%;
    background: #e53e3e;
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.add-to-cart:hover {
    background: #c53030;
}

@media (max-width: 768px) {
    .header .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero {
        margin-top: 120px;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .nav {
        gap: 1rem;
    }
}`
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `let cart = [];
let cartCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountElement = document.querySelector('.cart-count');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            addToCart(productName, productPrice);
            updateCartDisplay();
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.background = '#48bb78';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '#e53e3e';
            }, 1000);
        });
    });
    
    function addToCart(name, price) {
        cart.push({ name, price });
        cartCount++;
    }
    
    function updateCartDisplay() {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.animation = 'bounce 0.5s ease';
        
        setTimeout(() => {
            cartCountElement.style.animation = '';
        }, 500);
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add bounce animation for cart
const style = document.createElement('style');
style.textContent = \`
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
\`;
document.head.appendChild(style);`
      }
    ]
  }
];
