export type Lang = 'fr' | 'en' | 'pt';

interface PlanFeature { label: string; soon?: true; badge?: 'premium' | 'business' }

interface TranslationSet {
  nav: {
    features: string; pricing: string; testimonials: string; faq: string;
    login: string; create_shop: string;
  };
  hero: {
    badge: string; title1: string; title2: string;
    subtitle_before: string; mobile_money: string; subtitle_after: string;
    cta_primary: string; cta_how: string; cta_resigo: string; trust: string;
    revenue_label: string; order_label: string; order_value: string; visitors_label: string;
  };
  feat: {
    badge: string; title: string; subtitle: string;
    items: { title: string; desc: string }[];
  };
  how: {
    badge: string; title: string; subtitle: string;
    steps: { title: string; desc: string }[];
  };
  stats: { shops: string; products: string; orders: string; clients: string };
  price: {
    badge: string; title: string; subtitle: string; popular: string;
    soon: string; footer: string; period: string; free_period: string;
    plans: { name: string; desc: string; cta: string; features: PlanFeature[] }[];
  };
  test: { badge: string; title: string; subtitle: string };
  faq: {
    badge: string; title: string; subtitle: string;
    items: { q: string; a: string }[];
  };
  foot: {
    cta_title: string; cta_subtitle: string; cta_btn: string;
    tagline: string; copyright: string;
    sections: { product: string; resources: string; company: string; legal: string };
    links: {
      features: string; pricing: string; testimonials: string; updates: string;
      docs: string; blog: string; tutorials: string; help: string;
      about: string; careers: string; partners: string; contact: string;
      terms: string; privacy: string; cookies: string; mentions: string;
    };
  };
  auth: {
    login_title: string; login_subtitle: string;
    login_left_title: string; login_left_subtitle: string;
    login_btn: string; login_forgot: string;
    login_no_account: string; login_register_link: string;
    register_title: string; register_subtitle: string;
    register_left_title: string; register_left_subtitle: string;
    register_btn: string; register_terms: string;
    register_terms_link: string; register_and: string; register_privacy_link: string;
    register_has_account: string; register_login_link: string; register_trust: string;
    name_label: string; name_placeholder: string;
    email_label: string; email_placeholder: string;
    password_label: string; password_placeholder: string;
    perks: string[];
    stats: { label: string; value: string }[];
  };
  dash: {
    nav: {
      dashboard: string; products: string; orders: string; customers: string;
      stats: string; coupons: string; settings: string; create_shop: string;
      light_mode: string; dark_mode: string; link_copied: string;
    };
    plan: { free: string; premium: string; business: string };
  };
  guide: {
    badge: string; title: string; subtitle: string;
    shots_badge: string; shots_title: string; shots_subtitle: string;
    shots: { title: string; desc: string }[];
  };
  market: {
    badge: string; title: string; subtitle: string;
    search_placeholder: string; category_all: string;
    no_results: string; from_shop: string;
    premium_tag: string; business_tag: string; products_count: string;
  };
  shop: {
    add_to_cart: string; out_of_stock: string; buy_now: string; more_info: string;
    cart: string; cart_empty: string; checkout: string;
    total: string; subtotal: string; discount: string;
    coupon: string; coupon_placeholder: string; apply: string;
    name: string; phone: string; address: string;
    payment_method: string; order_note: string; place_order: string;
    subscribe: string; subscribed: string; subscribe_tip: string;
    back: string; products_count: string; search: string;
    sort: string; sort_recent: string; sort_price_asc: string; sort_price_desc: string;
    whatsapp_msg: string; order_success: string; payment_instructions: string;
    in_stock: string; low_stock: string; category_all: string;
    featured_products: string; share: string; delivery_fee: string;
    free_delivery_available: string; free_delivery: string;
    fedapay_fee: string; pay_secure_fedapay: string;
    escrow_notice: string; escrow_success: string; delivery_by_shoply: string;
  };
}

export const translations: Record<Lang, TranslationSet> = {
  fr: {
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      testimonials: 'Témoignages',
      faq: 'FAQ',
      login: 'Connexion',
      create_shop: 'Créer ma boutique',
    },
    hero: {
      badge: 'Plateforme #1 pour les commerçants africains',
      title1: 'Créez votre boutique, recevez des paiements Mobile Money',
      title2: 'et obtenez de nouveaux clients grâce à Shoply',
      subtitle_before: 'Vendez vos produits sur internet et recevez vos paiements via',
      mobile_money: 'Mobile Money',
      subtitle_after: '. Sans compétences techniques, sans frais cachés.',
      cta_primary: 'Créer ma boutique',
      cta_how: 'Comment ça marche',
      cta_resigo: 'Découvrir ResiGo',
      trust: '+10 000 vendeurs satisfaits',
      revenue_label: 'Revenus ce mois',
      order_label: 'Nouvelle commande',
      order_value: '+1 commande !',
      visitors_label: "Visiteurs aujourd'hui",
    },
    feat: {
      badge: 'Fonctionnalités',
      title: 'Tout ce dont vous avez besoin\npour vendre en ligne',
      subtitle: 'Une plateforme complète pensée pour les commerçants africains, avec toutes les fonctionnalités pour développer votre business en ligne.',
      items: [
        { title: 'Boutique instantanée', desc: 'Créez votre boutique en 2 minutes avec votre lien unique myshoply.web.app/shop/votre-nom' },
        { title: 'Catalogue produits', desc: 'Ajoutez vos produits avec photos, prix, stock et description en quelques clics' },
        { title: 'Paiement Mobile Money', desc: 'Acceptez MTN MoMo, Moov Money et cartes bancaires directement sur votre boutique' },
        { title: 'Statistiques détaillées', desc: 'Suivez vos ventes, revenus, visiteurs et produits les plus populaires en temps réel' },
        { title: 'Gestion des livraisons', desc: 'Gérez la livraison, le retrait en magasin ou votre propre système de livraison' },
        { title: 'QR Code automatique', desc: 'Chaque boutique génère automatiquement un QR Code pour faciliter le partage' },
        { title: 'Multi-boutiques', desc: "Gérez jusqu'à 5 boutiques différentes depuis un seul compte avec le plan Business" },
        { title: 'Coupons & Promotions', desc: 'Créez des codes promo et promotions pour booster vos ventes rapidement' },
        { title: 'Notifications push', desc: 'Recevez une notification à chaque nouvelle commande sur votre téléphone' },
        { title: 'Multi-devises', desc: 'Vendez en FCFA, EUR, USD et plus de 30 devises supportées automatiquement' },
        { title: 'Multi-langues', desc: 'Votre boutique est disponible en français, anglais, arabe et plus encore' },
        { title: 'Sécurité garantie', desc: 'Données chiffrées, paiements sécurisés, conformité RGPD et protection totale' },
      ],
    },
    how: {
      badge: 'Comment ça marche',
      title: 'Lancez-vous en 4 étapes simples',
      subtitle: "De zéro à votre première vente en moins d'une heure, sans aucune expertise technique.",
      steps: [
        { title: 'Créez votre compte', desc: "Inscrivez-vous gratuitement en 30 secondes. Aucune carte bancaire n'est requise pour commencer." },
        { title: 'Personnalisez votre boutique', desc: 'Choisissez votre nom, ajoutez votre logo, votre bannière et décrivez votre activité.' },
        { title: 'Ajoutez vos produits', desc: 'Publiez vos produits avec photos, prix et stock. Vos clients peuvent commander immédiatement.' },
        { title: 'Commencez à vendre', desc: 'Partagez votre lien, recevez des commandes et encaissez via Mobile Money depuis votre dashboard.' },
      ],
    },
    stats: {
      shops: 'Boutiques actives',
      products: 'Produits en vente',
      orders: 'Commandes traitées',
      clients: 'Clients satisfaits',
    },
    price: {
      badge: 'Tarifs',
      title: 'Des prix simples et transparents',
      subtitle: 'Commencez gratuitement. Passez au niveau supérieur quand vous êtes prêt. Aucun frais caché.',
      popular: 'Le plus populaire',
      soon: 'Bientôt',
      footer: 'Tous les prix sont en FCFA. Annulez à tout moment sans frais.',
      period: '/ mois',
      free_period: '',
      plans: [
        {
          name: 'Gratuit', desc: 'Parfait pour démarrer et tester la plateforme.', cta: 'Commencer gratuitement',
          features: [
            { label: '10 produits maximum' }, { label: '1 boutique en ligne' },
            { label: 'Paiement Mobile Money (MTN, Moov, Wave, Orange)' }, { label: 'Lien boutique unique' },
            { label: 'Tableau de bord basique' }, { label: 'Support par email' },
            { label: 'Protection anti-arnaque' },
          ],
        },
        {
          name: 'Premium', desc: 'Pour les commerçants sérieux qui veulent se développer.', cta: 'Démarrer Premium',
          features: [
            { label: 'Produits illimités' }, { label: '1 boutique en ligne' },
            { label: 'Paiement Mobile Money (tous opérateurs)' },
            { label: 'Badge vérifié officiel', badge: 'premium' as const },
            { label: 'QR Code boutique' }, { label: 'Statistiques' },
            { label: 'Coupons & promotions' }, { label: 'Notifications push' },
            { label: 'Mise en avant légère (Recommandé)' },
          ],
        },
        {
          name: 'Business', desc: 'Pour les entreprises avec plusieurs boutiques et équipes.', cta: 'Contacter les ventes',
          features: [
            { label: 'Tout du plan Premium' },
            { label: 'Badge certifié Business', badge: 'business' as const },
            { label: 'Publicité sur Shoply (accueil + page Certifiées)' },
            { label: "Jusqu'à 5 boutiques simultanées" },
            { label: 'Outils marketing (bannière, vedettes, partage)' },
            { label: 'Statistiques avancées' },
            { label: '5 livraisons gratuites / mois' },
            { label: 'Support prioritaire' },
          ],
        },
      ],
    },
    test: {
      badge: 'Témoignages',
      title: 'Ils ont transformé leur business',
      subtitle: 'Rejoignez des milliers de commerçants africains qui développent leur activité avec Shoply.',
    },
    faq: {
      badge: 'FAQ',
      title: 'Questions fréquentes',
      subtitle: 'Tout ce que vous devez savoir avant de vous lancer.',
      items: [
        { q: 'Comment créer ma boutique en ligne ?', a: "Créez un compte gratuitement, choisissez le nom de votre boutique, ajoutez votre logo et commencez à publier vos produits. Votre boutique est accessible immédiatement sur l'URL myshoply.web.app/shop/votre-nom." },
        { q: 'Quels moyens de paiement puis-je accepter ?', a: 'Tous les plans incluent MTN Mobile Money, Moov Money, Wave, Orange Money et le virement bancaire. Configurez vos numéros dans le tableau de bord, et vos clients voient les options disponibles au moment de commander.' },
        { q: 'Puis-je gérer plusieurs boutiques avec un seul compte ?', a: "Oui, le plan Business vous permet de créer et gérer jusqu'à 5 boutiques différentes depuis un seul compte, idéal si vous avez plusieurs activités ou points de vente." },
        { q: 'Y a-t-il des frais sur les transactions ?', a: "Shoply ne prélève aucune commission sur vos ventes. Les seuls frais sont les frais de transaction Mobile Money standards appliqués par les opérateurs (MTN, Moov, etc.)." },
        { q: 'Puis-je vendre en dehors de mon pays ?', a: "Absolument ! Votre boutique est accessible depuis partout dans le monde. Vous pouvez configurer plusieurs devises, des zones de livraison différentes et accepter des clients internationaux." },
        { q: "Que se passe-t-il si je dépasse la limite de 10 produits du plan gratuit ?", a: "Vous ne pourrez plus ajouter de nouveaux produits jusqu'à ce que vous passiez au plan Premium ou supprimiez des produits existants. Vos produits actuels et votre boutique restent actifs." },
        { q: 'Mes données sont-elles sécurisées ?', a: "Oui. Toutes vos données sont chiffrées et stockées de façon sécurisée sur les serveurs Firebase de Google. Nous sommes conformes au RGPD et ne vendons jamais vos données." },
        { q: 'Puis-je annuler mon abonnement à tout moment ?', a: "Oui, sans frais d'annulation ni engagement. Si vous annulez, vous conservez votre boutique et vos produits mais avec les limitations du plan gratuit." },
      ],
    },
    foot: {
      cta_title: 'Prêt à lancer votre boutique ?',
      cta_subtitle: 'Rejoignez 10 000+ vendeurs qui développent leur business en ligne.',
      cta_btn: 'Créer ma boutique gratuitement',
      tagline: 'La plateforme e-commerce #1 pour les commerçants africains. Simple, puissant et mobile-first.',
      copyright: '© 2026 Shoply Africa. Tous droits réservés.',
      sections: { product: 'Produit', resources: 'Ressources', company: 'Entreprise', legal: 'Légal' },
      links: {
        features: 'Fonctionnalités', pricing: 'Tarifs', testimonials: 'Témoignages', updates: 'Mises à jour',
        docs: 'Documentation', blog: 'Blog', tutorials: 'Tutoriels vidéo', help: "Centre d'aide",
        about: 'À propos', careers: 'Carrières', partners: 'Partenaires', contact: 'Contact',
        terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité', cookies: 'Cookies', mentions: 'Mentions légales',
      },
    },
    auth: {
      login_title: 'Connexion', login_subtitle: 'Connectez-vous à votre espace vendeur.',
      login_left_title: 'Bon retour sur Shoply', login_left_subtitle: 'Accédez à votre tableau de bord et gérez vos ventes en toute simplicité.',
      login_btn: 'Se connecter', login_forgot: 'Mot de passe oublié ?',
      login_no_account: 'Pas encore de compte ?', login_register_link: 'Créer un compte',
      register_title: 'Créer un compte', register_subtitle: 'Gratuit, sans carte bancaire requise.',
      register_left_title: 'Rejoignez Shoply Africa', register_left_subtitle: "Lancez votre boutique en ligne et commencez à vendre dès aujourd'hui.",
      register_btn: 'Créer mon compte gratuitement',
      register_terms: "J'accepte les", register_terms_link: "conditions d'utilisation",
      register_and: 'et la', register_privacy_link: 'politique de confidentialité',
      register_has_account: 'Déjà un compte ?', register_login_link: 'Se connecter',
      register_trust: 'Déjà +10 000 vendeurs nous font confiance',
      name_label: 'Nom complet', name_placeholder: 'Votre prénom et nom',
      email_label: 'Adresse email', email_placeholder: 'vous@exemple.com',
      password_label: 'Mot de passe', password_placeholder: '8 caractères minimum',
      perks: ['Boutique en ligne en 2 minutes', 'Paiement Mobile Money intégré', '10 produits gratuits pour démarrer'],
      stats: [{ label: 'Boutiques actives', value: '10 000+' }, { label: 'Commandes / jour', value: '5 000+' }, { label: 'Satisfaction', value: '4.9 / 5' }],
    },
    dash: {
      nav: {
        dashboard: 'Tableau de bord', products: 'Produits', orders: 'Commandes',
        customers: 'Clients', stats: 'Statistiques', coupons: 'Coupons', settings: 'Paramètres',
        create_shop: 'Créer une boutique', light_mode: 'Mode clair', dark_mode: 'Mode sombre', link_copied: 'Lien copié !',
      },
      plan: { free: 'Gratuit', premium: 'Premium', business: 'Business' },
    },
    guide: {
      badge: 'Guide complet',
      title: 'Comment fonctionne Shoply ?',
      subtitle: "Découvrez comment créer votre boutique, gérer vos produits et vos commandes, et choisir le plan adapté à votre activité.",
      shots_badge: 'Aperçu',
      shots_title: 'Votre activité, en un coup d\'œil',
      shots_subtitle: 'Un aperçu des outils que vous utiliserez au quotidien.',
      shots: [
        { title: 'Votre boutique en ligne', desc: 'Une vitrine moderne et rapide, accessible via votre lien unique myshoply.web.app/shop/votre-boutique, avec catalogue produits, panier et paiement Mobile Money.' },
        { title: 'Tableau de bord vendeur', desc: 'Gérez vos produits, suivez vos commandes et consultez vos revenus depuis une interface simple, accessible sur mobile et ordinateur.' },
        { title: 'Statistiques de vente', desc: 'Suivez vos revenus, vos commandes par statut et vos produits les plus vendus pour piloter votre activité.' },
        { title: 'Commande & paiement', desc: 'Vos clients commandent en quelques clics et paient directement via Mobile Money (MTN, Moov, Wave, Orange).' },
      ],
    },
    market: {
      badge: 'Marketplace Shoply',
      title: 'Trouvez tout ce qu\'il vous faut',
      subtitle: 'Téléphones, vêtements, chaussures, cosmétiques, électronique... Découvrez les produits de toutes les boutiques Shoply au même endroit.',
      search_placeholder: 'Rechercher un produit...',
      category_all: 'Tout',
      no_results: 'Aucun produit trouvé',
      from_shop: 'Vendu par',
      premium_tag: 'Premium',
      business_tag: 'Certifié',
      products_count: 'produits',
    },
    shop: {
      add_to_cart: 'Ajouter au panier', out_of_stock: 'Rupture de stock',
      buy_now: 'Commander maintenant', more_info: "Plus d'infos",
      cart: 'Panier', cart_empty: 'Votre panier est vide', checkout: 'Commander',
      total: 'Total', subtotal: 'Sous-total', discount: 'Réduction',
      coupon: 'Code promo', coupon_placeholder: 'Entrez votre code', apply: 'Appliquer',
      name: 'Nom complet', phone: 'Téléphone', address: 'Adresse de livraison',
      payment_method: 'Méthode de paiement', order_note: 'Note (optionnel)', place_order: 'Passer la commande',
      subscribe: "S'abonner", subscribed: 'Abonné', subscribe_tip: 'Recevoir les nouveaux produits',
      back: 'Retour', products_count: 'produits', search: 'Rechercher...',
      sort: 'Trier', sort_recent: 'Plus récents', sort_price_asc: 'Prix croissant', sort_price_desc: 'Prix décroissant',
      whatsapp_msg: "Bonjour, je suis intéressé(e) par votre produit",
      order_success: 'Commande passée ! Le vendeur vous contactera bientôt.',
      payment_instructions: 'Instructions de paiement',
      in_stock: 'En stock', low_stock: 'Stock limité', category_all: 'Tous',
      featured_products: 'Produits vedettes', share: 'Partager',
      delivery_fee: 'Frais de livraison',
      free_delivery_available: 'Livraison gratuite disponible sur cette commande !',
      free_delivery: 'Livraison gratuite',
      fedapay_fee: 'Frais de paiement sécurisé',
      pay_secure_fedapay: 'Payer avec FedaPay',
      escrow_notice: 'Paiement 100% sécurisé : votre argent est conservé par Shoply et reversé au vendeur uniquement après confirmation de la livraison par un livreur Shoply.',
      escrow_success: 'Paiement reçu ! Votre commande est confirmée et sera livrée par un livreur Shoply. Le vendeur recevra son paiement après confirmation de la livraison.',
      delivery_by_shoply: 'Livraison assurée par un livreur Shoply',
    },
  },

  en: {
    nav: {
      features: 'Features', pricing: 'Pricing', testimonials: 'Testimonials', faq: 'FAQ',
      login: 'Login', create_shop: 'Create my shop',
    },
    hero: {
      badge: '#1 Platform for African merchants',
      title1: 'Create your online shop',
      title2: 'in minutes',
      subtitle_before: 'Sell your products online and receive payments via',
      mobile_money: 'Mobile Money',
      subtitle_after: '. No technical skills, no hidden fees.',
      cta_primary: 'Create my shop', cta_how: 'How it works', cta_resigo: 'Discover ResiGo',
      trust: '+10,000 satisfied sellers',
      revenue_label: 'Revenue this month', order_label: 'New order', order_value: '+1 order!',
      visitors_label: 'Visitors today',
    },
    feat: {
      badge: 'Features',
      title: 'Everything you need\nto sell online',
      subtitle: 'A complete platform built for African merchants, with all the features to grow your business online.',
      items: [
        { title: 'Instant shop', desc: 'Create your shop in 2 minutes with your unique link myshoply.web.app/shop/your-name' },
        { title: 'Product catalog', desc: 'Add products with photos, prices, stock and descriptions in a few clicks' },
        { title: 'Mobile Money payments', desc: 'Accept MTN MoMo, Moov Money and bank cards directly on your shop' },
        { title: 'Detailed statistics', desc: 'Track your sales, revenue, visitors and top products in real time' },
        { title: 'Delivery management', desc: 'Manage home delivery, in-store pickup or your own delivery system' },
        { title: 'Automatic QR code', desc: 'Each shop automatically generates a QR Code for easy sharing' },
        { title: 'Multi-shop', desc: 'Manage up to 5 different shops from a single account with the Business plan' },
        { title: 'Coupons & Promotions', desc: 'Create promo codes and promotions to boost your sales quickly' },
        { title: 'Push notifications', desc: 'Receive a notification on your phone for every new order' },
        { title: 'Multi-currency', desc: 'Sell in FCFA, EUR, USD and 30+ supported currencies automatically' },
        { title: 'Multi-language', desc: 'Your shop is available in French, English, Arabic and more' },
        { title: 'Guaranteed security', desc: 'Encrypted data, secure payments, GDPR compliance and total protection' },
      ],
    },
    how: {
      badge: 'How it works',
      title: 'Get started in 4 simple steps',
      subtitle: 'From zero to your first sale in under an hour, with no technical expertise.',
      steps: [
        { title: 'Create your account', desc: 'Sign up for free in 30 seconds. No credit card required to get started.' },
        { title: 'Customize your shop', desc: 'Choose your name, add your logo, banner and describe your business.' },
        { title: 'Add your products', desc: 'List your products with photos, prices and stock. Customers can order immediately.' },
        { title: 'Start selling', desc: 'Share your link, receive orders and collect via Mobile Money from your dashboard.' },
      ],
    },
    stats: { shops: 'Active shops', products: 'Products for sale', orders: 'Orders processed', clients: 'Satisfied customers' },
    price: {
      badge: 'Pricing', title: 'Simple and transparent pricing',
      subtitle: "Start for free. Upgrade when you're ready. No hidden fees.",
      popular: 'Most popular', soon: 'Soon',
      footer: 'All prices in FCFA. Cancel anytime at no cost.', period: '/ month', free_period: '',
      plans: [
        {
          name: 'Free', desc: 'Perfect to get started and test the platform.', cta: 'Start for free',
          features: [
            { label: '10 products max' }, { label: '1 online shop' },
            { label: 'Mobile Money payments (MTN, Moov, Wave, Orange)' }, { label: 'Unique shop link' },
            { label: 'Basic dashboard' }, { label: 'Email support' },
            { label: 'Anti-fraud protection' },
          ],
        },
        {
          name: 'Premium', desc: 'For serious merchants who want to grow.', cta: 'Start Premium',
          features: [
            { label: 'Unlimited products' }, { label: '1 online shop' },
            { label: 'Mobile Money payments (all operators)' },
            { label: 'Official verified badge', badge: 'premium' as const },
            { label: 'Shop QR code' }, { label: 'Statistics' },
            { label: 'Coupons & promotions' }, { label: 'Push notifications' },
            { label: 'Light spotlight (Recommended)' },
          ],
        },
        {
          name: 'Business', desc: 'For companies with multiple shops and teams.', cta: 'Contact sales',
          features: [
            { label: 'Everything in Premium' },
            { label: 'Certified Business badge', badge: 'business' as const },
            { label: 'Advertising on Shoply (homepage + Certified page)' },
            { label: 'Up to 5 simultaneous shops' },
            { label: 'Marketing tools (banner, featured, sharing)' },
            { label: 'Advanced statistics' },
            { label: '5 free deliveries / month' },
            { label: 'Priority support' },
          ],
        },
      ],
    },
    test: { badge: 'Testimonials', title: 'They transformed their business', subtitle: 'Join thousands of African merchants growing their business with Shoply.' },
    faq: {
      badge: 'FAQ', title: 'Frequently asked questions', subtitle: 'Everything you need to know before getting started.',
      items: [
        { q: 'How do I create my online shop?', a: "Create a free account, choose your shop name, add your logo and start publishing your products. Your shop is immediately accessible at myshoply.web.app/shop/your-name." },
        { q: 'What payment methods can I accept?', a: 'All plans include MTN Mobile Money, Moov Money, Wave, Orange Money and bank transfers. Set up your numbers in the dashboard and your customers will see available options at checkout.' },
        { q: 'Can I manage several shops with one account?', a: "Yes, the Business plan lets you create and manage up to 5 different shops from a single account — ideal if you run multiple businesses or locations." },
        { q: 'Are there transaction fees?', a: "Shoply charges no commission on your sales. The only fees are the standard Mobile Money transaction fees charged by the operators (MTN, Moov, etc.)." },
        { q: 'Can I sell outside my country?', a: "Absolutely! Your shop is accessible from anywhere in the world. You can configure multiple currencies, different shipping zones and accept international customers." },
        { q: "What happens if I exceed the 10-product limit on the free plan?", a: "You won't be able to add new products until you upgrade to the Premium plan or remove existing ones. Your current products and shop remain active." },
        { q: 'Is my data secure?', a: "Yes. All your data is encrypted and securely stored on Google's Firebase servers. We are GDPR compliant and never sell your data." },
        { q: 'Can I cancel my subscription at any time?', a: "Yes, with no cancellation fees or commitment. If you cancel, you keep your shop and products but with free plan limitations." },
      ],
    },
    foot: {
      cta_title: 'Ready to launch your shop?', cta_subtitle: 'Join 10,000+ sellers growing their business online.',
      cta_btn: 'Create my shop for free',
      tagline: 'The #1 e-commerce platform for African merchants. Simple, powerful and mobile-first.',
      copyright: '© 2026 Shoply Africa. All rights reserved.',
      sections: { product: 'Product', resources: 'Resources', company: 'Company', legal: 'Legal' },
      links: {
        features: 'Features', pricing: 'Pricing', testimonials: 'Testimonials', updates: 'Updates',
        docs: 'Documentation', blog: 'Blog', tutorials: 'Video tutorials', help: 'Help center',
        about: 'About', careers: 'Careers', partners: 'Partners', contact: 'Contact',
        terms: 'Terms of service', privacy: 'Privacy policy', cookies: 'Cookies', mentions: 'Legal notices',
      },
    },
    auth: {
      login_title: 'Login', login_subtitle: 'Sign in to your seller account.',
      login_left_title: 'Welcome back to Shoply', login_left_subtitle: 'Access your dashboard and manage your sales with ease.',
      login_btn: 'Sign in', login_forgot: 'Forgot password?',
      login_no_account: "Don't have an account?", login_register_link: 'Create an account',
      register_title: 'Create an account', register_subtitle: 'Free, no credit card required.',
      register_left_title: 'Join Shoply Africa', register_left_subtitle: 'Launch your online shop and start selling today.',
      register_btn: 'Create my account for free',
      register_terms: 'I agree to the', register_terms_link: 'terms of service',
      register_and: 'and the', register_privacy_link: 'privacy policy',
      register_has_account: 'Already have an account?', register_login_link: 'Sign in',
      register_trust: 'Trusted by 10,000+ sellers',
      name_label: 'Full name', name_placeholder: 'Your first and last name',
      email_label: 'Email address', email_placeholder: 'you@example.com',
      password_label: 'Password', password_placeholder: 'Minimum 8 characters',
      perks: ['Online shop in 2 minutes', 'Integrated Mobile Money payment', '10 free products to get started'],
      stats: [{ label: 'Active shops', value: '10,000+' }, { label: 'Orders / day', value: '5,000+' }, { label: 'Satisfaction', value: '4.9 / 5' }],
    },
    dash: {
      nav: {
        dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
        customers: 'Customers', stats: 'Statistics', coupons: 'Coupons', settings: 'Settings',
        create_shop: 'Create a shop', light_mode: 'Light mode', dark_mode: 'Dark mode', link_copied: 'Link copied!',
      },
      plan: { free: 'Free', premium: 'Premium', business: 'Business' },
    },
    guide: {
      badge: 'Full guide',
      title: 'How does Shoply work?',
      subtitle: 'Discover how to create your shop, manage your products and orders, and pick the plan that fits your business.',
      shots_badge: 'Preview',
      shots_title: 'Your business, at a glance',
      shots_subtitle: 'A look at the tools you\'ll use every day.',
      shots: [
        { title: 'Your online shop', desc: 'A modern, fast storefront available via your unique link myshoply.web.app/shop/your-shop, with a product catalog, cart and Mobile Money payment.' },
        { title: 'Seller dashboard', desc: 'Manage your products, track your orders and check your revenue from a simple interface, available on mobile and desktop.' },
        { title: 'Sales statistics', desc: 'Track your revenue, orders by status and best-selling products to steer your business.' },
        { title: 'Order & payment', desc: 'Your customers order in a few clicks and pay directly via Mobile Money (MTN, Moov, Wave, Orange).' },
      ],
    },
    market: {
      badge: 'Shoply Marketplace',
      title: 'Find everything you need',
      subtitle: 'Phones, clothing, shoes, cosmetics, electronics... Discover products from every Shoply shop in one place.',
      search_placeholder: 'Search for a product...',
      category_all: 'All',
      no_results: 'No products found',
      from_shop: 'Sold by',
      premium_tag: 'Premium',
      business_tag: 'Certified',
      products_count: 'products',
    },
    shop: {
      add_to_cart: 'Add to cart', out_of_stock: 'Out of stock',
      buy_now: 'Order now', more_info: 'More info',
      cart: 'Cart', cart_empty: 'Your cart is empty', checkout: 'Checkout',
      total: 'Total', subtotal: 'Subtotal', discount: 'Discount',
      coupon: 'Promo code', coupon_placeholder: 'Enter your code', apply: 'Apply',
      name: 'Full name', phone: 'Phone', address: 'Delivery address',
      payment_method: 'Payment method', order_note: 'Note (optional)', place_order: 'Place order',
      subscribe: 'Subscribe', subscribed: 'Subscribed', subscribe_tip: 'Receive new product alerts',
      back: 'Back', products_count: 'products', search: 'Search...',
      sort: 'Sort', sort_recent: 'Most recent', sort_price_asc: 'Price: low to high', sort_price_desc: 'Price: high to low',
      whatsapp_msg: 'Hello, I am interested in your product',
      order_success: 'Order placed! The seller will contact you soon.',
      payment_instructions: 'Payment instructions',
      in_stock: 'In stock', low_stock: 'Limited stock', category_all: 'All',
      featured_products: 'Featured products', share: 'Share',
      delivery_fee: 'Delivery fee',
      free_delivery_available: 'Free delivery available on this order!',
      free_delivery: 'Free delivery',
      fedapay_fee: 'Secure payment fee',
      pay_secure_fedapay: 'Pay with FedaPay',
      escrow_notice: '100% secure payment: your money is held by Shoply and released to the seller only after a Shoply delivery agent confirms delivery.',
      escrow_success: 'Payment received! Your order is confirmed and will be delivered by a Shoply agent. The seller will be paid once delivery is confirmed.',
      delivery_by_shoply: 'Delivery handled by a Shoply agent',
    },
  },

  pt: {
    nav: {
      features: 'Funcionalidades', pricing: 'Preços', testimonials: 'Depoimentos', faq: 'FAQ',
      login: 'Entrar', create_shop: 'Criar minha loja',
    },
    hero: {
      badge: 'Plataforma #1 para comerciantes africanos',
      title1: 'Crie sua loja online',
      title2: 'em minutos',
      subtitle_before: 'Venda seus produtos online e receba pagamentos via',
      mobile_money: 'Mobile Money',
      subtitle_after: '. Sem habilidades técnicas, sem taxas ocultas.',
      cta_primary: 'Criar minha loja', cta_how: 'Como funciona', cta_resigo: 'Descobrir ResiGo',
      trust: '+10.000 vendedores satisfeitos',
      revenue_label: 'Receita este mês', order_label: 'Novo pedido', order_value: '+1 pedido!',
      visitors_label: 'Visitantes hoje',
    },
    feat: {
      badge: 'Funcionalidades',
      title: 'Tudo que você precisa\npara vender online',
      subtitle: 'Uma plataforma completa pensada para comerciantes africanos, com todas as funcionalidades para crescer o seu negócio online.',
      items: [
        { title: 'Loja instantânea', desc: 'Crie sua loja em 2 minutos com seu link único myshoply.web.app/shop/seu-nome' },
        { title: 'Catálogo de produtos', desc: 'Adicione produtos com fotos, preços, estoque e descrição em poucos cliques' },
        { title: 'Pagamento Mobile Money', desc: 'Aceite MTN MoMo, Moov Money e cartões bancários diretamente na sua loja' },
        { title: 'Estatísticas detalhadas', desc: 'Acompanhe suas vendas, receitas, visitantes e produtos mais populares em tempo real' },
        { title: 'Gestão de entregas', desc: 'Gerencie entrega a domicílio, retirada na loja ou seu próprio sistema de entrega' },
        { title: 'QR Code automático', desc: 'Cada loja gera automaticamente um QR Code para facilitar o compartilhamento' },
        { title: 'Múltiplas lojas', desc: 'Gerencie até 5 lojas diferentes a partir de uma única conta com o plano Business' },
        { title: 'Cupons & Promoções', desc: 'Crie códigos de desconto e promoções para aumentar suas vendas rapidamente' },
        { title: 'Notificações push', desc: 'Receba uma notificação no celular para cada novo pedido' },
        { title: 'Multi-moedas', desc: 'Venda em FCFA, EUR, USD e mais de 30 moedas suportadas automaticamente' },
        { title: 'Multi-idiomas', desc: 'Sua loja está disponível em francês, inglês, árabe e mais' },
        { title: 'Segurança garantida', desc: 'Dados criptografados, pagamentos seguros, conformidade RGPD e proteção total' },
      ],
    },
    how: {
      badge: 'Como funciona',
      title: 'Comece em 4 etapas simples',
      subtitle: 'Do zero à sua primeira venda em menos de uma hora, sem nenhuma experiência técnica.',
      steps: [
        { title: 'Crie sua conta', desc: 'Registre-se gratuitamente em 30 segundos. Nenhum cartão de crédito é necessário para começar.' },
        { title: 'Personalize sua loja', desc: 'Escolha seu nome, adicione seu logotipo, banner e descreva sua atividade.' },
        { title: 'Adicione seus produtos', desc: 'Publique seus produtos com fotos, preços e estoque. Seus clientes podem pedir imediatamente.' },
        { title: 'Comece a vender', desc: 'Compartilhe seu link, receba pedidos e receba via Mobile Money pelo seu painel.' },
      ],
    },
    stats: { shops: 'Lojas ativas', products: 'Produtos à venda', orders: 'Pedidos processados', clients: 'Clientes satisfeitos' },
    price: {
      badge: 'Preços', title: 'Preços simples e transparentes',
      subtitle: 'Comece gratuitamente. Faça upgrade quando estiver pronto. Sem taxas ocultas.',
      popular: 'Mais popular', soon: 'Em breve',
      footer: 'Todos os preços em FCFA. Cancele a qualquer momento sem custos.', period: '/ mês', free_period: '',
      plans: [
        {
          name: 'Gratuito', desc: 'Perfeito para começar e testar a plataforma.', cta: 'Começar gratuitamente',
          features: [
            { label: '10 produtos máximo' }, { label: '1 loja online' },
            { label: 'Pagamento Mobile Money (MTN, Moov, Wave, Orange)' }, { label: 'Link de loja único' },
            { label: 'Painel básico' }, { label: 'Suporte por email' },
            { label: 'Proteção anti-fraude' },
          ],
        },
        {
          name: 'Premium', desc: 'Para comerciantes sérios que querem crescer.', cta: 'Iniciar Premium',
          features: [
            { label: 'Produtos ilimitados' }, { label: '1 loja online' },
            { label: 'Pagamento Mobile Money (todos os operadores)' },
            { label: 'Selo verificado oficial', badge: 'premium' as const },
            { label: 'QR Code da loja' }, { label: 'Estatísticas' },
            { label: 'Cupons & promoções' }, { label: 'Notificações push' },
            { label: 'Destaque leve (Recomendado)' },
          ],
        },
        {
          name: 'Business', desc: 'Para empresas com várias lojas e equipes.', cta: 'Contactar vendas',
          features: [
            { label: 'Tudo do plano Premium' },
            { label: 'Selo certificado Business', badge: 'business' as const },
            { label: 'Publicidade no Shoply (início + página Certificadas)' },
            { label: 'Até 5 lojas simultâneas' },
            { label: 'Ferramentas de marketing (banner, destaques, partilha)' },
            { label: 'Estatísticas avançadas' },
            { label: '5 entregas grátis / mês' },
            { label: 'Suporte prioritário' },
          ],
        },
      ],
    },
    test: { badge: 'Depoimentos', title: 'Eles transformaram seus negócios', subtitle: 'Junte-se a milhares de comerciantes africanos que crescem com o Shoply.' },
    faq: {
      badge: 'FAQ', title: 'Perguntas frequentes', subtitle: 'Tudo que você precisa saber antes de começar.',
      items: [
        { q: 'Como criar minha loja online?', a: "Crie uma conta gratuita, escolha o nome da sua loja, adicione seu logotipo e comece a publicar seus produtos. Sua loja está acessível imediatamente em myshoply.web.app/shop/seu-nome." },
        { q: 'Quais métodos de pagamento posso aceitar?', a: 'Todos os planos incluem MTN Mobile Money, Moov Money, Wave, Orange Money e transferência bancária. Configure seus números no painel e seus clientes verão as opções disponíveis na hora de pagar.' },
        { q: 'Posso gerenciar várias lojas com uma única conta?', a: "Sim, o plano Business permite criar e gerenciar até 5 lojas diferentes a partir de uma única conta — ideal se você tem vários negócios ou pontos de venda." },
        { q: 'Há taxas sobre as transações?', a: "O Shoply não cobra nenhuma comissão sobre suas vendas. As únicas taxas são as taxas padrão de transação Mobile Money aplicadas pelos operadores (MTN, Moov, etc.)." },
        { q: 'Posso vender fora do meu país?', a: "Com certeza! Sua loja está acessível de qualquer lugar do mundo. Você pode configurar múltiplas moedas, diferentes zonas de entrega e aceitar clientes internacionais." },
        { q: "O que acontece se eu ultrapassar o limite de 10 produtos do plano gratuito?", a: "Você não poderá adicionar novos produtos até fazer upgrade para o plano Premium ou remover produtos existentes. Seus produtos atuais e sua loja permanecem ativos." },
        { q: 'Meus dados estão seguros?', a: "Sim. Todos os seus dados são criptografados e armazenados com segurança nos servidores Firebase do Google. Somos conformes com o RGPD e nunca vendemos seus dados." },
        { q: 'Posso cancelar minha assinatura a qualquer momento?', a: "Sim, sem taxas de cancelamento nem compromisso. Se cancelar, você mantém sua loja e produtos mas com as limitações do plano gratuito." },
      ],
    },
    foot: {
      cta_title: 'Pronto para lançar sua loja?', cta_subtitle: 'Junte-se a 10.000+ vendedores que crescem online.',
      cta_btn: 'Criar minha loja gratuitamente',
      tagline: 'A plataforma de e-commerce #1 para comerciantes africanos. Simples, poderosa e mobile-first.',
      copyright: '© 2026 Shoply Africa. Todos os direitos reservados.',
      sections: { product: 'Produto', resources: 'Recursos', company: 'Empresa', legal: 'Legal' },
      links: {
        features: 'Funcionalidades', pricing: 'Preços', testimonials: 'Depoimentos', updates: 'Atualizações',
        docs: 'Documentação', blog: 'Blog', tutorials: 'Tutoriais em vídeo', help: 'Central de ajuda',
        about: 'Sobre', careers: 'Carreiras', partners: 'Parceiros', contact: 'Contato',
        terms: 'Termos de uso', privacy: 'Política de privacidade', cookies: 'Cookies', mentions: 'Avisos legais',
      },
    },
    auth: {
      login_title: 'Entrar', login_subtitle: 'Acesse sua conta de vendedor.',
      login_left_title: 'Bem-vindo de volta ao Shoply', login_left_subtitle: 'Acesse seu painel e gerencie suas vendas com facilidade.',
      login_btn: 'Entrar', login_forgot: 'Esqueceu a senha?',
      login_no_account: 'Não tem uma conta?', login_register_link: 'Criar uma conta',
      register_title: 'Criar uma conta', register_subtitle: 'Gratuito, sem cartão de crédito necessário.',
      register_left_title: 'Junte-se ao Shoply Africa', register_left_subtitle: 'Lance sua loja online e comece a vender hoje.',
      register_btn: 'Criar minha conta gratuitamente',
      register_terms: 'Aceito os', register_terms_link: 'termos de uso',
      register_and: 'e a', register_privacy_link: 'política de privacidade',
      register_has_account: 'Já tem uma conta?', register_login_link: 'Entrar',
      register_trust: 'Mais de 10.000 vendedores confiam em nós',
      name_label: 'Nome completo', name_placeholder: 'Seu nome e sobrenome',
      email_label: 'Endereço de email', email_placeholder: 'voce@exemplo.com',
      password_label: 'Senha', password_placeholder: 'Mínimo 8 caracteres',
      perks: ['Loja online em 2 minutos', 'Pagamento Mobile Money integrado', '10 produtos gratuitos para começar'],
      stats: [{ label: 'Lojas ativas', value: '10.000+' }, { label: 'Pedidos / dia', value: '5.000+' }, { label: 'Satisfação', value: '4.9 / 5' }],
    },
    dash: {
      nav: {
        dashboard: 'Painel', products: 'Produtos', orders: 'Pedidos',
        customers: 'Clientes', stats: 'Estatísticas', coupons: 'Cupons', settings: 'Configurações',
        create_shop: 'Criar uma loja', light_mode: 'Modo claro', dark_mode: 'Modo escuro', link_copied: 'Link copiado!',
      },
      plan: { free: 'Gratuito', premium: 'Premium', business: 'Business' },
    },
    guide: {
      badge: 'Guia completo',
      title: 'Como funciona o Shoply?',
      subtitle: 'Descubra como criar sua loja, gerenciar seus produtos e pedidos, e escolher o plano certo para o seu negócio.',
      shots_badge: 'Visão geral',
      shots_title: 'Seu negócio, em poucos cliques',
      shots_subtitle: 'Uma prévia das ferramentas que você usará todos os dias.',
      shots: [
        { title: 'Sua loja online', desc: 'Uma vitrine moderna e rápida, acessível pelo seu link único myshoply.web.app/shop/sua-loja, com catálogo de produtos, carrinho e pagamento por Mobile Money.' },
        { title: 'Painel do vendedor', desc: 'Gerencie seus produtos, acompanhe seus pedidos e veja sua receita em uma interface simples, disponível no celular e no computador.' },
        { title: 'Estatísticas de vendas', desc: 'Acompanhe sua receita, pedidos por status e produtos mais vendidos para gerenciar seu negócio.' },
        { title: 'Pedido & pagamento', desc: 'Seus clientes pedem em poucos cliques e pagam diretamente via Mobile Money (MTN, Moov, Wave, Orange).' },
      ],
    },
    market: {
      badge: 'Marketplace Shoply',
      title: 'Encontre tudo o que precisa',
      subtitle: 'Telefones, roupas, sapatos, cosméticos, eletrônicos... Descubra os produtos de todas as lojas Shoply em um só lugar.',
      search_placeholder: 'Pesquisar um produto...',
      category_all: 'Todos',
      no_results: 'Nenhum produto encontrado',
      from_shop: 'Vendido por',
      premium_tag: 'Premium',
      business_tag: 'Certificado',
      products_count: 'produtos',
    },
    shop: {
      add_to_cart: 'Adicionar ao carrinho', out_of_stock: 'Esgotado',
      buy_now: 'Pedir agora', more_info: 'Mais informações',
      cart: 'Carrinho', cart_empty: 'Seu carrinho está vazio', checkout: 'Finalizar pedido',
      total: 'Total', subtotal: 'Subtotal', discount: 'Desconto',
      coupon: 'Código promocional', coupon_placeholder: 'Digite seu código', apply: 'Aplicar',
      name: 'Nome completo', phone: 'Telefone', address: 'Endereço de entrega',
      payment_method: 'Método de pagamento', order_note: 'Observação (opcional)', place_order: 'Fazer pedido',
      subscribe: 'Assinar', subscribed: 'Assinado', subscribe_tip: 'Receber alertas de novos produtos',
      back: 'Voltar', products_count: 'produtos', search: 'Pesquisar...',
      sort: 'Ordenar', sort_recent: 'Mais recentes', sort_price_asc: 'Menor preço', sort_price_desc: 'Maior preço',
      whatsapp_msg: 'Olá, estou interessado(a) no seu produto',
      order_success: 'Pedido feito! O vendedor entrará em contato em breve.',
      payment_instructions: 'Instruções de pagamento',
      in_stock: 'Em estoque', low_stock: 'Estoque limitado', category_all: 'Todos',
      featured_products: 'Produtos em destaque', share: 'Compartilhar',
      delivery_fee: 'Taxa de entrega',
      free_delivery_available: 'Entrega grátis disponível neste pedido!',
      free_delivery: 'Entrega grátis',
      fedapay_fee: 'Taxa de pagamento seguro',
      pay_secure_fedapay: 'Pagar com FedaPay',
      escrow_notice: 'Pagamento 100% seguro: seu dinheiro fica retido pela Shoply e só é repassado ao vendedor após a confirmação da entrega por um entregador Shoply.',
      escrow_success: 'Pagamento recebido! Seu pedido está confirmado e será entregue por um agente Shoply. O vendedor receberá o pagamento após a confirmação da entrega.',
      delivery_by_shoply: 'Entrega feita por um agente Shoply',
    },
  },
};
