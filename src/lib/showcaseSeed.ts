import { Editor, createBindingId, createShapeId, toRichText } from 'tldraw'

const ARTEFACT1_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMBER — Flame-Roasted Specialty Coffee</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-obsidian: #0B0706;
            --bg-card: rgba(26, 17, 14, 0.7);
            --ember-core: #FF4D1C;
            --ember-warmth: #E05A2B;
            --amber-glow: #F3A852;
            --cream-main: #FAF4EB;
            --cream-muted: #B8AC9E;
            --border-subtle: rgba(243, 168, 82, 0.15);
            --border-light: rgba(250, 244, 235, 0.1);
            --font-serif: 'Instrument Serif', Georgia, serif;
            --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-obsidian);
            color: var(--cream-main);
            font-family: var(--font-sans);
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Ambient Glow Backdrop */
        .ambient-glow {
            position: absolute;
            top: -150px;
            right: -100px;
            width: 750px;
            height: 750px;
            background: radial-gradient(circle, rgba(224, 90, 43, 0.22) 0%, rgba(255, 77, 28, 0.08) 40%, rgba(11, 7, 6, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            filter: blur(60px);
        }

        .ambient-glow-left {
            position: absolute;
            bottom: -100px;
            left: -150px;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(243, 168, 82, 0.12) 0%, rgba(11, 7, 6, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            filter: blur(50px);
        }

        /* Container */
        .hero-wrapper {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            max-width: 1440px;
            margin: 0 auto;
            padding: 2rem 3rem 3rem 3rem;
            z-index: 1;
        }

        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 2.5rem;
            border-bottom: 1px solid var(--border-light);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            text-decoration: none;
            color: var(--cream-main);
            font-family: var(--font-serif);
            font-size: 2.2rem;
            font-weight: 400;
            letter-spacing: 0.05em;
        }

        .logo-flame {
            width: 12px;
            height: 12px;
            background-color: var(--ember-core);
            border-radius: 50% 0 50% 50%;
            transform: rotate(-45deg);
            box-shadow: 0 0 12px var(--ember-core);
            display: inline-block;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--cream-muted);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.03em;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--amber-glow);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .btn-link {
            color: var(--cream-main);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Hero Content Layout */
        .hero-content {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 4rem;
            align-items: center;
            margin: 3.5rem 0;
        }

        /* Left Column Content */
        .hero-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .badge-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.4rem 1rem;
            border-radius: 100px;
            background: rgba(243, 168, 82, 0.08);
            border: 1px solid var(--border-subtle);
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--amber-glow);
            margin-bottom: 2rem;
        }

        .badge-pill .dot {
            width: 6px;
            height: 6px;
            background-color: var(--ember-core);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--ember-core);
        }

        h1 {
            font-family: var(--font-serif);
            font-size: clamp(3.8rem, 6.5vw, 5.8rem);
            line-height: 0.98;
            font-weight: 400;
            letter-spacing: -0.01em;
            margin-bottom: 1.8rem;
        }

        h1 i {
            font-style: italic;
            color: var(--amber-glow);
            font-weight: 400;
        }

        .hero-description {
            font-size: 1.125rem;
            line-height: 1.65;
            color: var(--cream-muted);
            max-width: 520px;
            margin-bottom: 2.5rem;
            font-weight: 300;
        }

        /* Interactive Subscription Mini-Bar */
        .config-preview {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-light);
            border-radius: 16px;
            padding: 1.25rem 1.5rem;
            width: 100%;
            max-width: 540px;
            margin-bottom: 2rem;
        }

        .config-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--cream-muted);
            margin-bottom: 0.8rem;
            display: flex;
            justify-content: space-between;
        }

        .config-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.6rem;
        }

        .option-btn {
            background: rgba(250, 244, 235, 0.04);
            border: 1px solid rgba(250, 244, 235, 0.08);
            border-radius: 8px;
            padding: 0.6rem 0.8rem;
            color: var(--cream-main);
            font-size: 0.85rem;
            font-weight: 500;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .option-btn.active {
            background: rgba(224, 90, 43, 0.15);
            border-color: var(--ember-warmth);
            color: #FFF;
            box-shadow: 0 0 15px rgba(224, 90, 43, 0.2);
        }

        /* CTA Area */
        .cta-group {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            width: 100%;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--ember-warmth) 0%, var(--ember-core) 100%);
            color: #FFF;
            padding: 1.1rem 2.2rem;
            border-radius: 100px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            box-shadow: 0 8px 30px rgba(255, 77, 28, 0.35);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(255, 77, 28, 0.5);
        }

        .btn-secondary {
            background: transparent;
            color: var(--cream-main);
            padding: 1.1rem 2rem;
            border-radius: 100px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            border: 1px solid var(--border-light);
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            border-color: var(--amber-glow);
            color: var(--amber-glow);
            background: rgba(243, 168, 82, 0.05);
        }

        /* Right Column Showcase */
        .showcase-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .card-main {
            position: relative;
            width: 100%;
            max-width: 440px;
            aspect-ratio: 4/5;
            background: linear-gradient(160deg, rgba(35, 23, 18, 0.8) 0%, rgba(15, 10, 8, 0.95) 100%);
            border-radius: 24px;
            border: 1px solid var(--border-subtle);
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            overflow: hidden;
        }

        /* Subtle glowing radial inside showcase card */
        .card-main::before {
            content: '';
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(243, 168, 82, 0.25) 0%, rgba(0,0,0,0) 70%);
            pointer-events: none;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            z-index: 2;
        }

        .batch-tag {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--amber-glow);
            background: rgba(243, 168, 82, 0.1);
            padding: 0.3rem 0.8rem;
            border-radius: 100px;
            border: 1px solid rgba(243, 168, 82, 0.2);
        }

        .origin-country {
            font-size: 0.8rem;
            color: var(--cream-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        /* Packaging Art Centerpiece */
        .product-visual {
            position: relative;
            z-index: 2;
            text-align: center;
            margin: 1.5rem 0;
        }

        .coffee-bag-mock {
            width: 170px;
            height: 240px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1C1411 0%, #0D0907 100%);
            border: 1px solid rgba(243, 168, 82, 0.3);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(224, 90, 43, 0.15);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem 1rem;
            position: relative;
            transform: rotate(-3deg);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .showcase-container:hover .coffee-bag-mock {
            transform: rotate(0deg) scale(1.03);
        }

        .bag-seal {
            width: 100%;
            height: 4px;
            background: var(--amber-glow);
            border-radius: 2px;
            opacity: 0.7;
        }

        .bag-label {
            background: #FAF4EB;
            color: #0B0706;
            padding: 1rem 0.8rem;
            border-radius: 4px;
            text-align: left;
        }

        .bag-title {
            font-family: var(--font-serif);
            font-size: 1.4rem;
            line-height: 1;
            font-weight: 600;
            margin-bottom: 0.3rem;
        }

        .bag-sub {
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #666;
            font-weight: 600;
        }

        .bag-notes {
            font-size: 0.65rem;
            color: var(--cream-muted);
            margin-top: 0.8rem;
            letter-spacing: 0.05em;
        }

        /* Flavor Profile Tags */
        .card-details {
            z-index: 2;
        }

        .notes-list {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-top: 0.8rem;
        }

        .note-chip {
            font-size: 0.75rem;
            background: rgba(250, 244, 235, 0.06);
            border: 1px solid var(--border-light);
            padding: 0.3rem 0.7rem;
            border-radius: 100px;
            color: var(--cream-main);
        }

        /* Floating Info Cards */
        .float-card-roast {
            position: absolute;
            bottom: -20px;
            right: -25px;
            background: rgba(22, 14, 11, 0.9);
            border: 1px solid var(--border-subtle);
            backdrop-filter: blur(12px);
            padding: 1rem 1.25rem;
            border-radius: 16px;
            z-index: 3;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .roast-meter {
            display: flex;
            gap: 3px;
        }

        .meter-bar {
            width: 6px;
            height: 20px;
            background: rgba(250, 244, 235, 0.2);
            border-radius: 10px;
        }

        .meter-bar.active {
            background: var(--ember-core);
            box-shadow: 0 0 8px var(--ember-core);
        }

        .float-card-rating {
            position: absolute;
            top: 40px;
            left: -30px;
            background: rgba(22, 14, 11, 0.9);
            border: 1px solid var(--border-subtle);
            backdrop-filter: blur(12px);
            padding: 0.8rem 1.2rem;
            border-radius: 100px;
            z-index: 3;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }

        .stars {
            color: var(--amber-glow);
            font-size: 0.85rem;
            letter-spacing: 2px;
        }

        /* Footer / Social Proof Ticker */
        .hero-footer {
            padding-top: 3rem;
            border-top: 1px solid var(--border-light);
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }

        .stat-value {
            font-family: var(--font-serif);
            font-size: 1.8rem;
            color: var(--cream-main);
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--cream-muted);
            letter-spacing: 0.02em;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
            .hero-content {
                grid-template-columns: 1fr;
                gap: 3.5rem;
            }
            .hero-text {
                align-items: center;
                text-align: center;
            }
            .hero-description {
                max-width: 600px;
            }
            .showcase-container {
                margin-top: 1rem;
            }
            .hero-footer {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }
        }

        @media (max-width: 640px) {
            .hero-wrapper {
                padding: 1.5rem 1.25rem;
            }
            .nav-links {
                display: none;
            }
            h1 {
                font-size: 3.2rem;
            }
            .config-options {
                grid-template-columns: 1fr;
            }
            .cta-group {
                flex-direction: column;
            }
            .btn-primary, .btn-secondary {
                width: 100%;
                justify-content: center;
            }
            .float-card-rating {
                left: 0;
                top: -20px;
            }
            .float-card-roast {
                right: 0;
            }
            .hero-footer {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>

    <div class="ambient-glow"></div>
    <div class="ambient-glow-left"></div>

    <div class="hero-wrapper">
        <!-- Navigation -->
        <nav>
            <a href="#" class="logo">
                <span class="logo-flame"></span>
                EMBER
            </a>
            
            <ul class="nav-links">
                <li><a href="#">The Flame Roast</a></li>
                <li><a href="#">Curated Origins</a></li>
                <li><a href="#">Subscription</a></li>
                <li><a href="#">Our Journal</a></li>
            </ul>

            <div class="nav-actions">
                <a href="#" class="btn-link">Sign In</a>
                <a href="#" class="btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.85rem;">Claim Trial</a>
            </div>
        </nav>

        <!-- Main Hero Section -->
        <main class="hero-content">
            <!-- Left Text Column -->
            <div class="hero-text">
                <div class="badge-pill">
                    <span class="dot"></span>
                    Micro-Lot Specialty Subscription
                </div>
                
                <h1>The Daily Ritual, <i>Re-Ignited.</i></h1>
                
                <p class="hero-description">
                    Rare, single-origin beans flame-roasted in small batches within 24 hours of dispatch. Delivered on your schedule, tailored to your exact taste profile.
                </p>

                <!-- Interactive Preview Component -->
                <div class="config-preview">
                    <div class="config-title">
                        <span>Select Your Roast Preference</span>
                        <span style="color: var(--amber-glow);">Step 01/03</span>
                    </div>
                    <div class="config-options">
                        <button class="option-btn active">Filter & Pour</button>
                        <button class="option-btn">Espresso Roast</button>
                        <button class="option-btn">Roaster's Choice</button>
                    </div>
                </div>

                <!-- Call to Action -->
                <div class="cta-group">
                    <a href="#" class="btn-primary">
                        Start Subscription
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                    <a href="#" class="btn-secondary">Explore Single Batches</a>
                </div>
            </div>

            <!-- Right Visual Column -->
            <div class="showcase-container">
                
                <!-- Floating Rating Pill -->
                <div class="float-card-rating">
                    <div class="stars">★★★★★</div>
                    <div style="font-size: 0.8rem; font-weight: 600;">4.95 / 5.0</div>
                </div>

                <!-- Floating Roast Level Indicator -->
                <div class="float-card-roast">
                    <div>
                        <div style="font-size: 0.7rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.05em;">Roast Profile</div>
                        <div style="font-size: 0.85rem; font-weight: 600; margin-top: 0.1rem;">Ember Light-Medium</div>
                    </div>
                    <div class="roast-meter">
                        <div class="meter-bar active"></div>
                        <div class="meter-bar active"></div>
                        <div class="meter-bar active"></div>
                        <div class="meter-bar"></div>
                        <div class="meter-bar"></div>
                    </div>
                </div>

                <!-- Main Feature Card -->
                <div class="card-main">
                    <div class="card-header">
                        <div>
                            <span class="batch-tag">CURRENT RELEASE</span>
                            <div class="origin-country" style="margin-top: 0.5rem;">Yirgacheffe • Ethiopia</div>
                        </div>
                        <span style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--amber-glow);">No. 042</span>
                    </div>

                    <!-- Packaging Visual Mockup -->
                    <div class="product-visual">
                        <div class="coffee-bag-mock">
                            <div class="bag-seal"></div>
                            <div class="bag-label">
                                <div class="bag-sub">EMBER SPECIALTY</div>
                                <div class="bag-title">SOLARIS</div>
                                <div style="font-size: 0.55rem; color: #888; margin-top: 0.2rem;">250G / 8.8 OZ</div>
                            </div>
                            <div class="bag-notes">FLAME ROASTED</div>
                        </div>
                    </div>

                    <div class="card-details">
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--cream-muted);">Tasting Notes</div>
                        <div class="notes-list">
                            <span class="note-chip">Wild Peach</span>
                            <span class="note-chip">Bergamot</span>
                            <span class="note-chip">Smoked Honey</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Social Proof & Guarantees Ticker -->
        <footer class="hero-footer">
            <div class="stat-item">
                <div class="stat-value">24 Hours</div>
                <div class="stat-label">Roasted to door dispatch window</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">Top 1%</div>
                <div class="stat-label">Ethically sourced micro-lot arabica</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">14,000+</div>
                <div class="stat-label">Active coffee purists subscribed</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">Zero Risk</div>
                <div class="stat-label">Pause, skip, or cancel anytime</div>
            </div>
        </footer>
    </div>

</body>
</html>`

const ARTEFACT2_CODE = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ember — Specialty Coffee Subscription</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        ember: {
                            950: '#0F0B09',
                            900: '#17120E',
                            800: '#261E18',
                            700: '#3D3027',
                            cream: '#F5F0EB',
                            sand: '#E6DDD4',
                            rust: '#C85A32',
                            flame: '#E06D3B',
                            gold: '#D49A5A',
                        }
                    },
                    fontFamily: {
                        serif: ['"Cormorant Garamond"', 'serif'],
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom grain overlay for an editorial texture */
        .bg-grain {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }
        
        /* Subtle glow animation for ember accent */
        @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-glow {
            animation: pulse-glow 6s infinite ease-in-out;
        }
    </style>
</head>
<body class="bg-ember-950 text-ember-cream font-sans antialiased selection:bg-ember-rust selection:text-ember-cream relative overflow-x-hidden">

    <!-- Texture Overlay -->
    <div class="fixed inset-0 bg-grain pointer-events-none z-50"></div>

    <!-- Ambient Glow Effects -->
    <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-ember-rust/20 rounded-full blur-[140px] pointer-events-none animate-glow"></div>
    <div class="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-ember-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- NAVIGATION -->
    <header class="relative z-40 border-b border-ember-cream/10 backdrop-blur-md bg-ember-950/60 sticky top-0">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
            
            <!-- Brand Logo -->
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded-full bg-ember-rust flex items-center justify-center text-ember-950 font-bold text-sm tracking-tighter group-hover:bg-ember-flame transition-colors duration-300">
                    ✦
                </div>
                <span class="font-serif text-2xl font-semibold tracking-wider text-ember-cream group-hover:text-ember-gold transition-colors duration-300">
                    EMBER
                </span>
            </a>

            <!-- Editorial Nav Links -->
            <nav class="hidden md:flex items-center space-x-10 text-xs tracking-[0.2em] uppercase font-medium text-ember-cream/70">
                <a href="#curation" class="hover:text-ember-gold transition-colors duration-200">The Curation</a>
                <a href="#roastery" class="hover:text-ember-gold transition-colors duration-200">Our Craft</a>
                <a href="#subscriptions" class="hover:text-ember-gold transition-colors duration-200">Subscriptions</a>
                <a href="#journal" class="hover:text-ember-gold transition-colors duration-200">Journal</a>
            </nav>

            <!-- CTA Actions -->
            <div class="flex items-center space-x-6">
                <a href="#" class="hidden sm:inline-block text-xs uppercase tracking-[0.15em] text-ember-cream/80 hover:text-ember-cream transition-colors">
                    Sign In
                </a>
                <a href="#subscribe" class="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-ember-rust">
                    <span class="absolute inset-0 bg-gradient-to-r from-ember-rust via-ember-gold to-ember-flame transition-all duration-300 group-hover:opacity-90"></span>
                    <span class="relative block px-5 py-2.5 rounded-full bg-ember-900 text-ember-cream text-xs font-semibold tracking-widest uppercase transition-all duration-300 group-hover:bg-transparent group-hover:text-ember-950">
                        Claim Your Roast
                    </span>
                </a>
            </div>
        </div>
    </header>

    <!-- HERO SECTION -->
    <section class="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
        
        <!-- Top Editorial Tag -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ember-cream/15 pb-6 mb-12 gap-4">
            <div class="flex items-center space-x-3">
                <span class="inline-block w-2 h-2 rounded-full bg-ember-rust animate-ping"></span>
                <span class="text-xs uppercase tracking-[0.25em] text-ember-gold font-semibold">
                    Issue No. 04 — Winter Harvest Micro-Lots
                </span>
            </div>
            <span class="text-xs tracking-[0.15em] text-ember-cream/50 uppercase font-mono">
                Direct Trade / Peak Freshness Guaranteed
            </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            <!-- Left Column: Typography & CTAs -->
            <div class="lg:col-span-7 space-y-8">
                
                <!-- Headline -->
                <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-ember-cream leading-[0.95]">
                    Ignite your <br/>
                    <span class="italic font-light text-ember-gold">morning ritual</span> <br/>
                    with rare warmth.
                </h1>

                <!-- Body Copy -->
                <p class="text-base sm:text-lg text-ember-cream/75 max-w-xl font-light leading-relaxed">
                    Ember brings micro-lot, single-origin coffees directly from high-altitude volcanic soils to your doorstep within 48 hours of roasting. Bold, complex, and unashamedly distinct.
                </p>

                <!-- Actions / Buttons -->
                <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a href="#start" class="px-8 py-4 bg-ember-rust hover:bg-ember-flame text-ember-cream font-medium tracking-wider uppercase text-xs rounded-none transition-all duration-300 text-center shadow-lg shadow-ember-rust/20 hover:shadow-ember-rust/40">
                        Begin Subscription — From $24/mo
                    </a>
                    <a href="#tasting-box" class="px-8 py-4 border border-ember-cream/20 hover:border-ember-gold text-ember-cream hover:text-ember-gold font-medium tracking-wider uppercase text-xs rounded-none transition-all duration-300 text-center backdrop-blur-sm">
                        Explore Tasting Sample Kit
                    </a>
                </div>

                <!-- Editorial Mini Features / Social Proof -->
                <div class="pt-8 border-t border-ember-cream/10 grid grid-cols-3 gap-6">
                    <div>
                        <p class="font-serif text-2xl sm:text-3xl text-ember-cream">88+</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-wider text-ember-cream/50 mt-1">SCA Specialty Score</p>
                    </div>
                    <div>
                        <p class="font-serif text-2xl sm:text-3xl text-ember-cream">48h</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-wider text-ember-cream/50 mt-1">Roast To Door</p>
                    </div>
                    <div>
                        <p class="font-serif text-2xl sm:text-3xl text-ember-cream">100%</p>
                        <p class="text-[10px] sm:text-xs uppercase tracking-wider text-ember-cream/50 mt-1">Direct Producer Pay</p>
                    </div>
                </div>

            </div>

            <!-- Right Column: Editorial Visuals Block -->
            <div class="lg:col-span-5 relative">
                
                <!-- Main Framing Wrapper -->
                <div class="relative z-10 aspect-[4/5] w-full rounded-2xl overflow-hidden bg-ember-900 border border-ember-cream/10 shadow-2xl group">
                    <!-- High Quality Editorial Coffee Image -->
                    <img 
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop" 
                        alt="Specialty Coffee Pouring" 
                        class="w-full h-full object-cover object-center grayscale-[20%] contrast-[105%] group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    <!-- Gradient Vignette -->
                    <div class="absolute inset-0 bg-gradient-to-t from-ember-950 via-transparent to-transparent opacity-80"></div>

                    <!-- Overlay Bag Detail Badge -->
                    <div class="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-md bg-ember-950/80 border border-ember-cream/15 rounded-xl">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="text-[10px] uppercase tracking-widest text-ember-gold font-mono block">Featured Origin</span>
                                <h3 class="font-serif text-xl text-ember-cream font-medium">Guatemala Antigua Volcán</h3>
                            </div>
                            <span class="bg-ember-rust/30 text-ember-gold text-[10px] font-mono px-2 py-1 rounded border border-ember-rust/40">
                                LIGHT-MEDIUM
                            </span>
                        </div>
                        <p class="text-xs text-ember-cream/70 font-light italic">
                            "Notes of dark cacao, toasted hazelnut, and sweet blood orange zest."
                        </p>
                    </div>
                </div>

                <!-- Decorative Background Stamp / Badge behind image -->
                <div class="absolute -top-6 -right-6 w-32 h-32 border border-ember-gold/30 rounded-full flex items-center justify-center pointer-events-none hidden sm:flex">
                    <div class="w-28 h-28 border border-dashed border-ember-gold/20 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
                        <span class="text-[8px] uppercase tracking-[0.3em] text-ember-gold/60">Roasting Every Monday • Fresh</span>
                    </div>
                </div>

                <!-- Floating Accent Box -->
                <div class="absolute -bottom-8 -left-8 bg-ember-800/90 backdrop-blur-md border border-ember-cream/10 p-4 shadow-xl z-20 hidden md:block max-w-[200px]">
                    <div class="flex items-center gap-1 text-ember-gold text-xs mb-1">
                        ★★★★★
                    </div>
                    <p class="text-xs text-ember-cream/90 font-light">
                        "The most aromatic, rich roast I’ve experienced at home."
                    </p>
                    <p class="text-[10px] text-ember-cream/50 mt-2 font-mono uppercase">— Marcus K., Sommelier</p>
                </div>

            </div>

        </div>

        <!-- Ticker / Brand Value Banner Below Hero -->
        <div class="mt-20 pt-8 border-t border-ember-cream/10 flex flex-wrap justify-between items-center gap-6 text-xs text-ember-cream/60 tracking-widest uppercase">
            <div class="flex items-center gap-2">
                <span class="text-ember-rust">❖</span> Ethically Sourced Single Origins
            </div>
            <div class="flex items-center gap-2">
                <span class="text-ember-rust">❖</span> Zero Plastic Compostable Packaging
            </div>
            <div class="flex items-center gap-2">
                <span class="text-ember-rust">❖</span> Flexible Deliveries — Pause Anytime
            </div>
            <div class="flex items-center gap-2">
                <span class="text-ember-rust">❖</span> Tailored Grind or Whole Bean
            </div>
        </div>

    </section>

</body>
</html>`

const ARTEFACT3_CODE = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMBER — Flame-Roasted Specialty Coffee</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        obsidian: '#090605',
                        ember: {
                            950: '#0E0907',
                            900: '#170E0B',
                            800: '#261612',
                            card: 'rgba(23, 14, 11, 0.72)',
                            core: '#FF4D1C',
                            warmth: '#E05A2B',
                            gold: '#F3A852',
                            glow: 'rgba(243, 168, 82, 0.15)'
                        },
                        cream: {
                            50: '#FAF4EB',
                            200: '#E7DCCF',
                            400: '#B8AC9E',
                            600: '#6B6258'
                        }
                    },
                    fontFamily: {
                        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
                        sans: ['"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace']
                    }
                }
            }
        }
    </script>

    <style>
        .bg-grain {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }

        @keyframes pulse-glow {
            0%, 100% { opacity: 0.35; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.08); }
        }

        .ambient-pulse {
            animation: pulse-glow 7s infinite ease-in-out;
        }

        .glass-panel {
            background: linear-gradient(145deg, rgba(28, 17, 13, 0.75) 0%, rgba(14, 9, 7, 0.88) 100%);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }

        .coffee-bag {
            transform: rotate(-3deg);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease;
        }

        .card-showcase:hover .coffee-bag {
            transform: rotate(0deg) scale(1.03);
        }
    </style>
</head>

<body class="bg-obsidian text-cream-50 font-sans antialiased selection:bg-ember-warmth selection:text-cream-50 relative overflow-x-hidden min-h-screen">

    <!-- Texture Overlay -->
    <div class="fixed inset-0 bg-grain pointer-events-none z-50"></div>

    <!-- Atmospheric Glows -->
    <div class="absolute -top-32 -right-24 w-[720px] h-[720px] bg-radial from-ember-warmth/20 via-ember-core/10 to-transparent rounded-full blur-[120px] pointer-events-none ambient-pulse"></div>
    <div class="absolute bottom-10 -left-28 w-[580px] h-[580px] bg-radial from-ember-gold/15 to-transparent rounded-full blur-[130px] pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-between min-h-screen">
        
        <!-- Header / Navigation -->
        <header class="py-6 border-b border-cream-50/10 flex items-center justify-between">
            <a href="#" class="flex items-center gap-3 group">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-ember-warmth to-ember-gold flex items-center justify-center text-obsidian font-bold text-xs shadow-[0_0_15px_rgba(255,77,28,0.5)] group-hover:scale-105 transition-transform">
                    ✦
                </div>
                <span class="font-serif text-2xl sm:text-3xl tracking-wide font-normal text-cream-50 group-hover:text-ember-gold transition-colors">
                    EMBER
                </span>
            </a>

            <nav class="hidden md:flex items-center space-x-10 text-xs font-semibold tracking-[0.18em] uppercase text-cream-400">
                <a href="#roast" class="hover:text-ember-gold transition-colors">The Flame Roast</a>
                <a href="#curations" class="hover:text-ember-gold transition-colors">Micro-Lots</a>
                <a href="#subscription" class="hover:text-ember-gold transition-colors">Subscription</a>
                <a href="#journal" class="hover:text-ember-gold transition-colors">Journal</a>
            </nav>

            <div class="flex items-center gap-6">
                <a href="#" class="hidden sm:inline-block text-xs uppercase tracking-widest text-cream-400 hover:text-cream-50 transition-colors">
                    Sign In
                </a>
                <a href="#checkout" class="relative group overflow-hidden rounded-full p-[1px] focus:outline-none">
                    <span class="absolute inset-0 bg-gradient-to-r from-ember-warmth via-ember-gold to-ember-core transition-all duration-300 group-hover:opacity-90"></span>
                    <span class="relative block px-5 py-2.5 rounded-full bg-ember-950 text-cream-50 text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-transparent group-hover:text-obsidian">
                        Claim Trial
                    </span>
                </a>
            </div>
        </header>

        <!-- Main Hero Section -->
        <main class="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            <!-- Left Column: Content & Interactive Config -->
            <div class="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-8">
                
                <!-- Editorial Pill Tag -->
                <div class="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ember-gold/10 border border-ember-gold/25 text-ember-gold text-xs font-semibold uppercase tracking-[0.14em]">
                    <span class="w-2 h-2 rounded-full bg-ember-core shadow-[0_0_8px_#FF4D1C] animate-pulse"></span>
                    Micro-Lot Single Origin • Batch 042
                </div>

                <!-- Headline -->
                <h1 class="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-cream-50 leading-[0.96]">
                    The Daily Ritual, <br/>
                    <i class="italic font-normal text-ember-gold">Re-Ignited</i> With Warmth.
                </h1>

                <!-- Subtitle -->
                <p class="text-base sm:text-lg text-cream-400 font-light leading-relaxed max-w-xl">
                    Rare, single-origin coffees harvested from high-altitude volcanic soils and flame-roasted in small batches. Shipped to your counter within 24 hours of roasting.
                </p>

                <!-- Interactive Roast Selector Bar -->
                <div class="w-full max-w-lg glass-panel border border-ember-gold/20 rounded-2xl p-5 shadow-xl shadow-black/40">
                    <div class="flex items-center justify-between text-xs uppercase tracking-wider mb-3">
                        <span class="text-cream-400 font-mono">Select Flavor Profile</span>
                        <span class="text-ember-gold font-semibold">Step 01/03</span>
                    </div>

                    <div class="grid grid-cols-3 gap-2.5">
                        <button class="py-2.5 px-3 rounded-lg text-xs font-semibold bg-ember-warmth/20 border border-ember-warmth text-cream-50 shadow-[0_0_15px_rgba(224,90,43,0.3)] transition-all text-center">
                            Filter / Floral
                        </button>
                        <button class="py-2.5 px-3 rounded-lg text-xs font-medium bg-cream-50/5 border border-cream-50/10 text-cream-400 hover:text-cream-50 hover:border-ember-gold/40 transition-all text-center">
                            Balanced Roast
                        </button>
                        <button class="py-2.5 px-3 rounded-lg text-xs font-medium bg-cream-50/5 border border-cream-50/10 text-cream-400 hover:text-cream-50 hover:border-ember-gold/40 transition-all text-center">
                            Bold Espresso
                        </button>
                    </div>
                </div>

                <!-- CTAs -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                    <a href="#subscribe" class="inline-flex justify-center items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-ember-warmth to-ember-core text-cream-50 text-xs font-semibold uppercase tracking-wider shadow-[0_8px_30px_rgba(255,77,28,0.35)] hover:shadow-[0_12px_40px_rgba(255,77,28,0.55)] hover:-translate-y-0.5 transition-all duration-300">
                        Start Subscription — $24/mo
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                    <a href="#samples" class="inline-flex justify-center items-center px-7 py-4 rounded-full border border-cream-50/20 hover:border-ember-gold text-cream-50 hover:text-ember-gold text-xs font-medium uppercase tracking-wider transition-colors duration-300">
                        Explore Tasting Kit
                    </a>
                </div>

                <!-- Quick Metric Bar -->
                <div class="pt-6 border-t border-cream-50/10 grid grid-cols-3 gap-6 w-full max-w-lg">
                    <div>
                        <span class="font-serif text-2xl sm:text-3xl text-cream-50 block">89.5</span>
                        <span class="text-[10px] uppercase tracking-wider text-cream-400 font-mono">Cup of Excellence</span>
                    </div>
                    <div>
                        <span class="font-serif text-2xl sm:text-3xl text-cream-50 block">24h</span>
                        <span class="text-[10px] uppercase tracking-wider text-cream-400 font-mono">Roast to Ship</span>
                    </div>
                    <div>
                        <span class="font-serif text-2xl sm:text-3xl text-cream-50 block">100%</span>
                        <span class="text-[10px] uppercase tracking-wider text-cream-400 font-mono">Volcanic Soil</span>
                    </div>
                </div>

            </div>

            <!-- Right Column: Visual Showcase & Badges -->
            <div class="lg:col-span-5 flex justify-center relative card-showcase">
                
                <!-- Floating Rating Pill -->
                <div class="absolute -top-5 sm:-top-6 -left-3 sm:-left-6 z-30 glass-panel border border-ember-gold/25 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5">
                    <span class="text-ember-gold text-xs tracking-widest">★★★★★</span>
                    <span class="text-xs font-mono font-semibold text-cream-50">4.97 / 5.0</span>
                </div>

                <!-- Floating Roast Level Badge -->
                <div class="absolute -bottom-5 sm:-bottom-6 -right-2 sm:-right-4 z-30 glass-panel border border-ember-gold/25 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
                    <div>
                        <span class="block text-[10px] font-mono uppercase tracking-wider text-cream-400">Roast Profile</span>
                        <span class="text-xs font-semibold text-cream-50">Medium-Light</span>
                    </div>
                    <div class="flex gap-1">
                        <span class="w-1.5 h-5 rounded-full bg-ember-core shadow-[0_0_8px_#FF4D1C]"></span>
                        <span class="w-1.5 h-5 rounded-full bg-ember-core shadow-[0_0_8px_#FF4D1C]"></span>
                        <span class="w-1.5 h-5 rounded-full bg-ember-core shadow-[0_0_8px_#FF4D1C]"></span>
                        <span class="w-1.5 h-5 rounded-full bg-cream-50/20"></span>
                        <span class="w-1.5 h-5 rounded-full bg-cream-50/20"></span>
                    </div>
                </div>

                <!-- Main Frame Showcase -->
                <div class="relative w-full max-w-md aspect-[4/5] glass-panel border border-ember-gold/25 rounded-3xl p-7 flex flex-col justify-between shadow-2xl shadow-black/80 overflow-hidden">
                    
                    <!-- Card Header -->
                    <div class="flex items-start justify-between relative z-10">
                        <div>
                            <span class="text-[10px] font-mono tracking-widest text-ember-gold uppercase bg-ember-gold/10 px-2.5 py-1 rounded-full border border-ember-gold/20">
                                Current Allocation
                            </span>
                            <h3 class="text-xs uppercase tracking-wider text-cream-400 mt-2 font-mono">
                                Antigua Valley • Guatemala
                            </h3>
                        </div>
                        <span class="font-serif text-lg text-ember-gold">No. 042</span>
                    </div>

                    <!-- Visual Coffee Bag Packaging Mockup -->
                    <div class="relative z-10 my-auto py-4">
                        <div class="coffee-bag w-44 sm:w-48 h-64 mx-auto bg-gradient-to-b from-[#1C1310] to-[#0A0706] border border-ember-gold/30 rounded-xl p-4 flex flex-col justify-between shadow-2xl shadow-black">
                            
                            <div class="w-full h-1 rounded-full bg-ember-gold/70 shadow-[0_0_8px_#F3A852]"></div>
                            
                            <div class="bg-cream-50 text-obsidian p-3 rounded shadow-sm">
                                <span class="text-[9px] font-mono font-bold tracking-widest uppercase text-cream-600 block">EMBER RESERVE</span>
                                <h4 class="font-serif text-xl font-bold leading-none tracking-tight my-1">SOLARIS</h4>
                                <div class="text-[8px] font-mono text-cream-600 uppercase">250g • Whole Bean</div>
                            </div>

                            <div class="border-t border-cream-50/10 pt-2 flex justify-between items-center text-[9px] font-mono text-cream-400 uppercase">
                                <span>Batch 042</span>
                                <span>Flame Roasted</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card Footer Detail: Tasting Notes -->
                    <div class="relative z-10 pt-3 border-t border-cream-50/10">
                        <span class="text-[10px] font-mono uppercase tracking-widest text-cream-400 block mb-2">Cupping Profile</span>
                        <div class="flex flex-wrap gap-1.5">
                            <span class="text-xs px-2.5 py-1 rounded-full bg-cream-50/5 border border-cream-50/10 text-cream-200">Wild Peach</span>
                            <span class="text-xs px-2.5 py-1 rounded-full bg-cream-50/5 border border-cream-50/10 text-cream-200">Bergamot</span>
                            <span class="text-xs px-2.5 py-1 rounded-full bg-cream-50/5 border border-cream-50/10 text-cream-200">Smoked Honey</span>
                        </div>
                    </div>

                </div>

            </div>

        </main>

        <!-- Footer / Guarantees Banner -->
        <footer class="py-8 border-t border-cream-50/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-cream-400">
            <div class="flex items-center gap-2.5">
                <span class="text-ember-core text-base">✦</span>
                <span>Ethically Sourced Top 1% Beans</span>
            </div>
            <div class="flex items-center gap-2.5">
                <span class="text-ember-core text-base">✦</span>
                <span>Compostable Plant-Fiber Bags</span>
            </div>
            <div class="flex items-center gap-2.5">
                <span class="text-ember-core text-base">✦</span>
                <span>Dispatched 24h From Roasting</span>
            </div>
            <div class="flex items-center gap-2.5">
                <span class="text-ember-core text-base">✦</span>
                <span>Pause, Skip, or Cancel Anytime</span>
            </div>
        </footer>

    </div>

</body>
</html>`

const ARTEFACT4_CODE = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');

  :root {
    --color-primary: #E07A5F;      /* Warm ember */
    --color-bg-overlay: rgba(57, 24, 12, 0.55);
    --color-text-primary: #F5EEDC; /* Soft cream */
    --color-text-accent: #FFE0B2;  /* Light amber */
    --color-btn-secondary-bg: rgba(255,255,255,0.12);
    --color-btn-secondary-border: rgba(255,255,255,0.6);
  }

  .hero {
    position: relative;
    width: 100%;
    min-height: 600px;
    height: 100vh;
    background: url('https://images.unsplash.com/photo-1511920172-1d0cbb0c7a3c?auto=format&fit=crop&w=1800&q=80')
      no-repeat center center / cover;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-text-primary);
    overflow: hidden;
  }

  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--color-bg-overlay);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .hero__content {
    position: relative;
    max-width: 800px;
    padding: 0 1.5rem;
    z-index: 1;
  }

  .hero__title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(2.5rem, 10vw, 5rem);
    margin: 0 0 0.5rem;
    line-height: 1.1;
    color: var(--color-text-accent);
  }

  .hero__subtitle {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 400;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    margin: 0 0 1.5rem;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .hero__cta .btn {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.75rem 1.75rem;
    border-radius: 9999px;
    text-decoration: none;
    transition: transform 0.2s ease, background-color 0.2s ease;
    cursor: pointer;
    display: inline-block;
  }

  .hero__cta .btn-primary {
    background-color: var(--color-primary);
    color: #fff;
    border: none;
  }

  .hero__cta .btn-primary:hover,
  .hero__cta .btn-primary:focus {
    background-color: #c46355;
    transform: translateY(-3px);
  }

  .hero__cta .btn-secondary {
    background-color: var(--color-btn-secondary-bg);
    color: #fff;
    border: 2px solid var(--color-btn-secondary-border);
  }

  .hero__cta .btn-secondary:hover,
  .hero__cta .btn-secondary:focus {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }

  @media (max-width: 500px) {
    .hero__title {
      font-size: clamp(2rem, 12vw, 4rem);
    }
  }
</style>

<section class="hero" aria-labelledby="hero-heading">
  <div class="hero__content">
    <h1 id="hero-heading" class="hero__title">Ignite Your Morning Ritual</h1>
    <p class="hero__subtitle">
      Hand‑crafted, small‑batch coffee delivered fresh to your door every month. Experience the heat of expertly roasted beans, curated just for you.
    </p>
    <div class="hero__cta">
      <a href="/subscribe" class="btn btn-primary" aria-label="Start your Ember subscription">Start Your Ember</a>
      <a href="/learn-more" class="btn btn-secondary" aria-label="Learn more about Ember coffee">Learn More</a>
    </div>
  </div>
</section>`

const ARTEFACT5_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ember Coffee Subscription</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #d2691e;      /* chocolate */
            --secondary: #f4a261;    /* warm orange */
            --dark: #2b1c0e;         /* deep brown */
            --light: #fff;
        }
        body, html {
            margin:0;
            padding:0;
            height:100%;
            font-family: 'Montserrat', sans-serif;
            color: var(--light);
            background: var(--dark);
        }
        .hero {
            position: relative;
            height: 100vh;
            background: url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .hero::before {
            content:"";
            position:absolute;
            inset:0;
            background: linear-gradient(135deg, rgba(210,105,30,0.7), rgba(44,28,15,0.7));
        }
        .hero-content {
            position: relative;
            max-width: 800px;
            padding: 0 20px;
        }
        h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2.5rem, 8vw, 5rem);
            margin: 0 0 0.5rem;
            line-height: 1.1;
            font-weight: 700;
        }
        p {
            font-size: clamp(1rem, 2.5vw, 1.5rem);
            margin: 0 0 1.5rem;
            font-weight: 400;
        }
        .cta-btn {
            display: inline-block;
            padding: 0.9rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            color: var(--dark);
            background: var(--secondary);
            border: none;
            border-radius: 4px;
            text-decoration: none;
            transition: background 0.3s, transform 0.2s;
        }
        .cta-btn:hover {
            background: #e8955a;
            transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
            .cta-btn {
                transition: none;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Ember</h1>
            <p>Bold, handcrafted coffee delivered to your door. Warm up your mornings with our curated specialty roasts.</p>
            <a href="#" class="cta-btn">Start Your Ember Journey</a>
        </div>
    </section>
</body>
</html>`

const TEXT1_TEXT = "1 · Fan out — four models, four directions"

const TEXT2_TEXT = "2 · Synthesize — merge the strongest ideas"

const TEXT3_TEXT = "3 · Extend — reuse the design system"

export function seedShowcase(editor: Editor) {
	if (editor.getCurrentPageShapes().some((shape) => shape.type === 'prompt')) return

	const text1 = createShapeId()
	const text2 = createShapeId()
	const text3 = createShapeId()
	const prompt1 = createShapeId()
	const prompt2 = createShapeId()
	const prompt3 = createShapeId()
	const artefact1 = createShapeId()
	const artefact2 = createShapeId()
	const artefact3 = createShapeId()
	const artefact4 = createShapeId()
	const artefact5 = createShapeId()
	const arrow1 = createShapeId()
	const arrow2 = createShapeId()
	const arrow3 = createShapeId()
	const arrow4 = createShapeId()
	const arrow5 = createShapeId()
	const arrow6 = createShapeId()
	const arrow7 = createShapeId()
	const arrow8 = createShapeId()
	const arrow9 = createShapeId()
	const arrow10 = createShapeId()
	const arrow11 = createShapeId()

	editor.createShapes([
		{
			id: text1,
			type: 'text',
			x: 368.20164972408634,
			y: 444.6468174621997,
			props: {
				richText: toRichText(TEXT1_TEXT),
				color: 'grey',
				size: 'm',
				font: 'sans',
				textAlign: 'start',
				w: 600,
				scale: 1,
				autoSize: true,
			},
		},
		{
			id: text2,
			type: 'text',
			x: 495.5482567014581,
			y: 1445.6751961871782,
			props: {
				richText: toRichText(TEXT2_TEXT),
				color: 'grey',
				size: 'm',
				font: 'sans',
				textAlign: 'start',
				w: 600,
				scale: 1,
				autoSize: true,
			},
		},
		{
			id: text3,
			type: 'text',
			x: 2055.548256701458,
			y: 1765.6751961871782,
			props: {
				richText: toRichText(TEXT3_TEXT),
				color: 'grey',
				size: 'm',
				font: 'sans',
				textAlign: 'start',
				w: 600,
				scale: 1,
				autoSize: true,
			},
		},
		{
			id: prompt1,
			type: 'prompt',
			x: -1398.4607235701897,
			y: -630.0191828500323,
			props: {
				w: 441.9880230711226,
				h: 182.97641428417546,
				richText: toRichText("I like both of these designs, use them to recreate a final better one."),
				models: ["groq:qwen/qwen3.8-27b","gemini:gemini-3.8-flash"],
			},
		},
		{
			id: prompt2,
			type: 'prompt',
			x: 368.20164972408634,
			y: 504.6468174621997,
			props: {
				w: 280,
				h: 140,
				richText: toRichText("Design the hero section for a specialty coffee subscription brand called Ember. Be bold, warm, and editorial."),
				models: ["gemini:gemini-3.6-flash","gemini:gemini-3.8-flash","groq:openai/gpt-oss-120b","groq:qwen/qwen3.8-27b"],
			},
		},
		{
			id: prompt3,
			type: 'prompt',
			x: 618.6670396753732,
			y: 2371.2537207093906,
			props: {
				w: 280,
				h: 140,
				richText: toRichText("Compare the four hero concepts. Keep the strongest layout, copy, and visual language, and produce one refined hero that fuses them."),
				models: ["gemini:gemini-3.8-flash"],
			},
		},
		{
			id: artefact1,
			type: 'artefact',
			x: -2249.8696213556213,
			y: 829.3809662760748,
			props: { w: 1515.7287223372323, h: 1089.5381781610104, code: ARTEFACT1_CODE },
		},
		{
			id: artefact2,
			type: 'artefact',
			x: -127.95913693886541,
			y: 975.2066901999132,
			props: { w: 1239.6960222774633, h: 874.4265517992428, code: ARTEFACT2_CODE },
		},
		{
			id: artefact3,
			type: 'artefact',
			x: -102.95274832995779,
			y: -1402.0003599549764,
			props: { w: 1473.9860073392256, h: 1094.0110245591395, code: ARTEFACT3_CODE },
		},
		{
			id: artefact4,
			type: 'artefact',
			x: 1854.3881013039397,
			y: 900.2422914443713,
			props: { w: 1493.0472303245542, h: 1119.7981942385513, code: ARTEFACT4_CODE },
		},
		{
			id: artefact5,
			type: 'artefact',
			x: 1909.1277864369044,
			y: -160.40855947310683,
			props: { w: 1325.4752834240132, h: 884.401008808971, code: ARTEFACT5_CODE },
		},
		{
			id: arrow1,
			type: 'arrow',
			props: {
				start: { x: -739.378148109236, y: 2407.7558996574116 },
				end: { x: -739.378148109236, y: 1987.7558996574116 },
				size: 'm',
				richText: toRichText("Gemini 3.8 Flash"),
			},
		},
		{
			id: arrow2,
			type: 'arrow',
			props: {
				start: { x: -1860.2069099110918, y: 1514.2723269748853 },
				end: { x: -729.2570150887364, y: 2371.5893037601327 },
				size: 'm',
				richText: toRichText(""),
			},
		},
		{
			id: arrow3,
			type: 'arrow',
			props: {
				start: { x: 280, y: 210 },
				end: { x: 1360, y: 210 },
				size: 'm',
				richText: toRichText("GPT-OSS 120B"),
			},
		},
		{
			id: arrow4,
			type: 'arrow',
			props: {
				start: { x: 280, y: 130 },
				end: { x: 600, y: 210 },
				size: 'm',
				richText: toRichText("Gemini 3.6 Flash"),
			},
		},
		{
			id: arrow5,
			type: 'arrow',
			props: {
				start: { x: 280, y: 170 },
				end: { x: 980, y: 210 },
				size: 'm',
				richText: toRichText("Gemini 3.8 Flash"),
			},
		},
		{
			id: arrow6,
			type: 'arrow',
			props: {
				start: { x: 280, y: 250 },
				end: { x: 1740, y: 210 },
				size: 'm',
				richText: toRichText("Qwen 3.8 27B"),
			},
		},
		{
			id: arrow7,
			type: 'arrow',
			props: {
				start: { x: 123.68722447577989, y: 1444.9864245369563 },
				end: { x: -783.8538681352944, y: 2412.5244802007046 },
				size: 'm',
				richText: toRichText(""),
			},
		},
		{
			id: arrow8,
			type: 'arrow',
			props: {
				start: { x: 1910, y: 340 },
				end: { x: 810, y: 420 },
				size: 'm',
				richText: toRichText(""),
			},
		},
		{
			id: arrow9,
			type: 'arrow',
			props: {
				start: { x: 770, y: 340 },
				end: { x: 620, y: 420 },
				size: 'm',
				richText: toRichText(""),
			},
		},
		{
			id: arrow10,
			type: 'arrow',
			props: {
				start: { x: 1150, y: 340 },
				end: { x: 710, y: 420 },
				size: 'm',
				richText: toRichText(""),
			},
		},
		{
			id: arrow11,
			type: 'arrow',
			props: {
				start: { x: 1530, y: 340 },
				end: { x: 760, y: 420 },
				size: 'm',
				richText: toRichText(""),
			},
		},
	])

	editor.createBindings([
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow7,
			toId: artefact2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow4,
			toId: artefact2,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow9,
			toId: artefact2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow2,
			toId: artefact1,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow2,
			toId: prompt1,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow10,
			toId: artefact5,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow8,
			toId: prompt3,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow1,
			toId: prompt1,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow6,
			toId: artefact1,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow9,
			toId: prompt3,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow3,
			toId: artefact4,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow1,
			toId: artefact3,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow7,
			toId: prompt1,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow10,
			toId: prompt3,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow6,
			toId: prompt2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow8,
			toId: artefact1,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow5,
			toId: artefact5,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow3,
			toId: prompt2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow5,
			toId: prompt2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow11,
			toId: prompt3,
			props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow11,
			toId: artefact4,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
		{
			id: createBindingId(),
			type: 'arrow',
			fromId: arrow4,
			toId: prompt2,
			props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 0.5 }, isPrecise: false, isExact: false, snap: 'none' },
		},
	])

	const bounds = editor.getCurrentPageBounds()
	if (bounds) editor.zoomToBounds(bounds, { targetZoom: 0.6, immediate: true })
}
