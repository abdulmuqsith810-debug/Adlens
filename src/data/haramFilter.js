// Haram MCC blocklist — Stripe Merchant Category Codes for prohibited businesses
// Source: Stripe MCC documentation + Islamic finance principles
export const HARAM_MCC_CODES = {
    '5813': 'Bars, Taverns and Drinking Places (Alcohol)',
    '5921': 'Package Stores — Beer, Wine and Liquor',
    '7801': 'Government Licensed Casinos (Online Gambling)',
    '7802': 'Government Licensed Horse/Dog Racing',
    '7993': 'Video Game Arcades / Slot Machine Establishments',
    '7995': 'Betting, Casino Gambling, Lottery Tickets',
    '9754': 'Gambling — Horse/Dog Racing, State Lotteries',
    '7273': 'Dating and Escort Services',
    '7841': 'DVD/Video Tape Rental (Adult Content)',
    '5912': 'Drug Stores and Pharmacies (Controlled Substances)',
    '5122': 'Drugs, Drug Proprietaries — Wholesale',
    '6012': 'Financial Institutions — Interest-Based Lending',
    '6022': 'State-Chartered Banks — Interest-Based',
    '6023': 'Savings and Loans — Interest-Based',
    '6051': 'Non-Financial Institutions — Money Orders',
    '6141': 'Personal Loans — Interest-Based',
    '6153': 'Short-Term Business Loans — Riba',
    '6159': 'Federal-Sponsored Credit Agencies',
    '6211': 'Security Brokers, Dealers — Speculative',
    '7011': 'Hotels, Motels (primary business is alcohol/entertainment)',
};

// Business compatibility checks — framed as data modeling / platform compatibility
export const HARAM_DECLARATIONS = [
    'My business sells age-restricted products (alcoholic beverages, tobacco, vaping, or adult content)',
    'My business operates in the gambling, lottery, or games-of-chance industry',
    'My business is primarily a financial services, lending, or credit institution',
    'My business sells food or beverage products that require specialized regulatory certifications or supply chain documentation',
    'My business is in the defense, firearms, or regulated equipment industry',
];


// Ecommerce product categories that are supported
export const HALAL_ECOMMERCE_CATEGORIES = [
    { value: 'clothing', label: 'Clothing & Fashion' },
    { value: 'electronics', label: 'Electronics & Gadgets' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'health', label: 'Health & Wellness (Non-pharmaceutical)' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'baby', label: 'Baby & Kids Products' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books, Education & Stationery' },
    { value: 'religious', label: 'Religious Products (Prayer items, texts, etc.)' },
    { value: 'crafts', label: 'Arts, Crafts & Collectibles' },
    { value: 'pets', label: 'Pet Supplies' },
    { value: 'other', label: 'Other' },
];

// Business types — supported vs. inaccurate-data warning
export const BUSINESS_TYPES = [
    {
        value: 'ecommerce',
        label: '🛒 Ecommerce — Physical products sold online',
        supported: true,
        note: null,
    },
    {
        value: 'digital',
        label: '💻 Digital Products or SaaS — Software, courses, digital downloads',
        supported: true,
        note: null,
    },
    {
        value: 'service',
        label: '🤝 Service Business — Agency, freelance, consulting',
        supported: false,
        note: 'Adlens is built for product-based businesses. Service businesses have a different customer journey — revenue attribution through the Adlens Tracker and Stripe may not reflect your actual acquisition costs accurately.',
    },
    {
        value: 'subscription',
        label: '🔄 Subscription Business — Recurring billing',
        supported: true,
        note: null,
    },
    {
        value: 'other',
        label: '🏢 Other business type',
        supported: false,
        note: 'Adlens is optimised for product-based ecommerce and digital businesses. Your business type may produce inaccurate attribution data. We recommend verifying all figures independently.',
    },
];

// Check an MCC code against the blocklist
export function isMCCBlocked(mcc) {
    return Object.prototype.hasOwnProperty.call(HARAM_MCC_CODES, String(mcc));
}

export function getMCCLabel(mcc) {
    return HARAM_MCC_CODES[String(mcc)] || 'Unknown category';
}
