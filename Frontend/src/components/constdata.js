export const COLORS = {
    skyBlue: "#00ADEF",
    white: "#FFFFFF",
    charcoal: "#333333",
    gold: "#F5A623",
    lightBlue: "#E6F7FF",
    darkBlue: "#0096d6",
};

export const AIRLINES = [
    {
        id: "qatar",
        name: "Qatar Airways",
        logo: "https://images.kiwi.com/airlines/64/QR.png",
        category: "Premium",
    },
    {
        id: "philippine",
        name: "Philippine Airlines",
        logo: "https://images.kiwi.com/airlines/64/PR.png",
        category: "Major",
    },
    {
        id: "gulf",
        name: "Gulf Air",
        logo: "https://images.kiwi.com/airlines/64/GF.png",
        category: "Premium",
    },
    {
        id: "saudia",
        name: "Saudia",
        logo: "https://images.kiwi.com/airlines/64/SV.png",
        category: "Major",
    },
    {
        id: "etihad",
        name: "Etihad Airways",
        logo: "https://images.kiwi.com/airlines/64/EY.png",
        category: "Premium",
    },
    {
        id: "srilankan",
        name: "SriLankan Airlines",
        logo: "https://images.kiwi.com/airlines/64/UL.png",
        category: "Regional",
    },
    {
        id: "wizz",
        name: "Wizz Air",
        logo: "https://images.kiwi.com/airlines/64/W6.png",
        category: "Low Cost",
    },
];

export const OFFICES = [
    {
        id: "1",
        airlineId: "qatar",
        airlineName: "Qatar Airways",
        logo: "https://images.kiwi.com/airlines/64/QR.png",
        city: "Dubai",
        country: "United Arab Emirates",
        address: "Deira, Near Clock Tower, Dubai",
        phone: "+971 4 229 2222",
        email: "dxboffice@qatarairways.com.qa",
        hours: "Sun - Thu: 09:00 AM - 05:30 PM",
        image: "https://avgeekery.com/wp-content/uploads/2023/11/flydubaiBoeing7879DreamlinerRender2-1920x1080.jpg",
        featured: true,
        description:
            "Experience world-class service at our Dubai office, centrally located in Deira.",
    },
    {
        id: "2",
        airlineId: "etihad",
        airlineName: "Etihad Airways",
        logo: "https://images.kiwi.com/airlines/64/EY.png",
        city: "London",
        country: "United Kingdom",
        address: "Heathrow Airport, Terminal 4",
        phone: "+44 345 608 1225",
        email: "lhrsupport@etihad.ae",
        hours: "Mon - Fri: 08:00 AM - 08:00 PM",
        image: "/images/officeimage/etihad.avif",
        featured: true,
        description:
            "Located at London Heathrow Terminal 4, providing premium travel assistance.",
    },
    {
        id: "3",
        airlineId: "philippine",
        airlineName: "Philippine Airlines",
        logo: "https://images.kiwi.com/airlines/64/PR.png",
        city: "Manila",
        country: "Philippines",
        address: "PNB Financial Center, Pres. Diosdado Macapagal Blvd, Pasay",
        phone: "+63 2 8855 8888",
        email: "manila@pal.com.ph",
        hours: "Mon - Sat: 08:30 AM - 06:00 PM",
        image: "/images/officeimage/philippine.avif",
        featured: true,
        description:
            "Our flagship Manila office located in the heart of Pasay's business district.",
    },
    {
        id: "4",
        airlineId: "saudia",
        airlineName: "Saudia",
        logo: "https://images.kiwi.com/airlines/64/SV.png",
        city: "New York",
        country: "USA",
        address: "Empire State Building, 350 5th Ave",
        phone: "+1 800 472 8342",
        email: "nyc@saudia.com",
        hours: "Mon - Fri: 09:00 AM - 05:00 PM",
        image: "/images/officeimage/saudia.avif",
        featured: true,
        description:
            "Iconic New York office located in the historic Empire State Building.",
    },
];

export const BLOG_POSTS = [
    {
        id: "b1",
        title: "How to Resolve Airline Booking Issues Fast",
        excerpt:
            "Facing issues with your flight booking? Here is a step-by-step guide to contacting airline offices effectively.",
        author: "Travel Expert",
        date: "Oct 24, 2024",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=800",
        category: "Travel Tips",
    },
    {
        id: "b2",
        title: "Top 5 Airline Lounges in the Middle East",
        excerpt:
            "Exploring the luxury and comfort of premium lounges offered by Qatar Airways, Etihad, and Emirates.",
        author: "Sky Wanderer",
        date: "Nov 12, 2024",
        image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800",
        category: "Luxury Travel",
    },
    {
        id: "b3",
        title: "Understanding Airline Ticketing Policies",
        excerpt:
            "A comprehensive guide to airline ticketing rules, cancellations, and refund policies across major carriers.",
        author: "Aviation Insider",
        date: "Dec 05, 2024",
        image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800",
        category: "Guidelines",
    },

    /* 🔽 NEW BLOG POSTS 🔽 */

    {
        id: "b4",
        title: "Best Time to Book Cheap International Flights",
        excerpt:
            "Learn when and how to book international flights to get the lowest fares and avoid hidden charges.",
        author: "Fare Finder",
        date: "Dec 18, 2024",
        image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
        category: "Flight Deals",
    },
    {
        id: "b5",
        title: "Airline Baggage Allowance Explained",
        excerpt:
            "Confused about baggage rules? This guide breaks down cabin and checked baggage policies for major airlines.",
        author: "Travel Desk",
        date: "Jan 03, 2025",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764b8a?auto=format&fit=crop&q=80&w=800",
        category: "Baggage Rules",
    },
    {
        id: "b6",
        title: "How to Change or Cancel Flight Tickets Online",
        excerpt:
            "Step-by-step instructions to modify or cancel airline tickets online without paying extra fees.",
        author: "Aviation Guide",
        date: "Jan 15, 2025",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800",
        category: "Ticketing",
    },
    {
        id: "b7",
        title: "Visa Requirements for International Travelers",
        excerpt:
            "A country-wise overview of visa requirements and documentation needed for international air travel.",
        author: "Global Travel",
        date: "Jan 28, 2025",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=800",
        category: "Visa Info",
    },
    {
        id: "b8",
        title: "Tips for Stress-Free Airport Check-In",
        excerpt:
            "Avoid long queues and last-minute hassles with these proven airport check-in tips.",
        author: "Airport Insider",
        date: "Feb 08, 2025",
        image: "https://images.unsplash.com/photo-1494415859740-21e878dd929d?auto=format&fit=crop&q=80&w=800",
        category: "Airport Tips",
    },
];

// Helper function to get office by airline
export const getOfficesByAirline = (airlineId) => {
    return OFFICES.filter((office) => office.airlineId === airlineId);
};

// Helper function to get featured offices
export const getFeaturedOffices = () => {
    return OFFICES.filter((office) => office.featured);
};

// Helper function to get airline by id
export const getAirlineById = (airlineId) => {
    return AIRLINES.find((airline) => airline.id === airlineId);
};

// Aircraft data by airline
export const aircraftByAirline = {
    qatar: [
        "Airbus A350-900",
        "Airbus A380-800",
        "Boeing 777-300ER",
        "Boeing 787-9",
        "Airbus A330-300",
        "Boeing 777-200LR",
    ],
    etihad: [
        "Airbus A380-800",
        "Boeing 787-9",
        "Boeing 777-300ER",
        "Airbus A350-1000",
        "Boeing 787-10",
    ],
    philippine: [
        "Airbus A350-900",
        "Airbus A330-300",
        "Boeing 777-300ER",
        "Airbus A321neo",
        "Airbus A320",
    ],
    saudia: [
        "Boeing 787-9",
        "Boeing 777-300ER",
        "Airbus A330-300",
        "Airbus A320",
        "Boeing 787-10",
    ],
    gulf: ["Boeing 787-9", "Airbus A320", "Airbus A321neo", "Boeing 777-300ER"],
    srilankan: ["Airbus A330-300", "Airbus A320", "Airbus A321neo"],
    wizz: ["Airbus A320", "Airbus A321neo"],
};

// Services list
export const servicesList = [
    "Flight Ticket Booking",
    "Call to Airport",
    "Flight Ticket Cancellation",
    "Frequent Baggage Claim Cases",
    "Board Complaint",
    "Baggage Promotion Claims Check-in",
    "Miles and Smiles",
    "Exceptional Services",
    "Getting Luggage",
    "In-flight Meals",
    "Flight Cancellation",
    "Flight Complaints",
    "In-flight Entertainment",
    "Baggage Policy",
    "Seat Booking",
    "Passenger Tickets",
    "Group Sales",
    "Flight Costs",
];

export const airlineAbout = {
    qatar: {
        location:
            "G/F One Global Place, Fifth Avenue corner 25th Street, Bonifacio Global City, Taguig, Manila, Philippines.",
        overview:
            "Qatar Airways is the national carrier of Qatar and one of the world’s leading airlines, known for luxury service and global connectivity.",
        network:
            "From its hub at Hamad International Airport (DOH), the airline flies to more than 145 destinations across six continents.",
        fleet: "Qatar Airways operates a modern fleet of nearly 200 aircraft including Airbus A350, A320, A380, and Boeing 777 and 787 Dreamliner.",
        cabins: "The airline offers Economy Class, award-winning Qsuite Business Class, and First Class on select long-haul routes.",
        alliance:
            "Qatar Airways has been a member of the Oneworld alliance since October 2013.",
        services:
            "Services include flight reservations, ticket rebooking, cancellations, seat selection, and special assistance requests.",
        baggage:
            "Passengers can get support for baggage allowance, excess baggage fees, delayed or lost baggage claims.",
        loyalty:
            "The airline operates Privilege Club, allowing members to earn and redeem Avios across partner airlines.",
        airportServices:
            "Premium passengers enjoy access to world-class airport lounges, priority check-in, and fast-track services.",
        support:
            "Customers can contact the Manila office for bookings, cancellations, baggage services, Privilege Club inquiries, and other travel assistance.",
        targetCustomers:
            "The airline serves leisure travelers, business passengers, and premium international flyers worldwide.",
    },

    etihad: {
        location: "Etihad Airways Office, Abu Dhabi, United Arab Emirates.",
        overview:
            "Etihad Airways is the national airline of the United Arab Emirates, recognized for premium service and innovative cabin products.",
        network:
            "Operating from its hub at Abu Dhabi International Airport (AUH), Etihad serves destinations across Asia, Europe, the Americas, Africa, and Oceania.",
        fleet: "Etihad operates a modern fleet including Airbus A320, A350, A380, and Boeing 787 Dreamliner aircraft.",
        cabins: "The airline offers Economy Class, Business Class, First Class, and The Residence on select Airbus A380 routes.",
        alliance:
            "Etihad partners with leading global airlines through strategic codeshare agreements rather than a traditional airline alliance.",
        services:
            "Passengers can access services such as flight bookings, ticket rescheduling, cancellations, refunds, and seat upgrades.",
        baggage:
            "Support is available for baggage allowance information, excess baggage purchases, and delayed or lost baggage assistance.",
        loyalty:
            "Etihad Guest is the airline’s frequent flyer program, allowing members to earn and redeem miles with partner airlines.",
        airportServices:
            "Premium travelers benefit from priority check-in, luxury airport lounges, chauffeur services, and fast-track security.",
        support:
            "The Abu Dhabi office assists customers with reservations, ticket changes, baggage support, Etihad Guest inquiries, and special travel assistance.",
        targetCustomers:
            "Etihad serves leisure travelers, corporate clients, and luxury international passengers worldwide.",
    },
};

export const officeInquiries = {
    title: "Qatar Airways Office List",
    city: "Manila",
    inquiries: [
        ["Flight Ticket Booking", "Ok to Board", "Flight Ticket Cancellation"],
        [
            "Airport Lounges",
            "Visa Services",
            "Baggage Allowance, Online Check-in",
        ],
        ["Airport Transfers", "Meet and Greet", "Duty-Free Allowance"],
        ["Immigration Services", "Business Class", "In-Flight Meals"],
        ["Missing Luggage", "Airport Lounges", "Flight/Visa Info"],
        ["Miles", "Economy Class", "Delayed Flights"],
        ["Airport Facilities", "In-Flight Entertainment", "Airport Wifi"],
        ["Valet Parking", "Visa on Arrival", "Flight Wifi"],
    ],
};

export const BLOG_CONTENT = {
    b1: {
        id: "b1",

        title: "How to Get an Upgrade on Air Transat?",
        subtitle:
            "Are you tired of squeezing in an economy seat on Air Transat?",
        heroImage:
            "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=1200",

        tableOfContents: [
            { id: "cabin-classes", title: "Air Transat Cabin Classes" },
            { id: "economy", title: "Economy Class" },
            { id: "standard", title: "Standard Seats" },
            { id: "front-cabin", title: "Front Cabin Seats" },
            { id: "two-by-two", title: "Two by Two Seats" },
            { id: "extra-legroom", title: "Extra Legroom Seats" },
            {
                id: "club-class",
                title: "What are the advantages of Club Class?",
            },
            {
                id: "upgrade-methods",
                title: "How to Upgrade to Club Class on Air Transat?",
            },
            { id: "online", title: "Making an upgrade online" },
            { id: "auction", title: "Upgrading your flight by auction" },
            { id: "worth-it", title: "Is Upgrading Worth It?" },
            { id: "cost", title: "Air Transat Club Class Upgrade Cost" },
            { id: "faq", title: "Frequently Asked Questions" },
        ],

        intro: {
            text: "If you're planning to fly with Air Transat, you know that the airline offers a comfortable flying experience and a personalized experience...",
            additionalText:
                "You need upgraded travel options to enjoy different Air Transat seat features from icing during eating fun.",
        },

        cabinClasses: {
            title: "Air Transat Cabin Classes",
            image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80&w=1200",
            intro: "To learn more about the upgrade options you need to be well-informed about the different cabin classes available on Air Transat.",

            classes: [
                {
                    title: "Economy Class",
                    subtitle:
                        "Air Transat's economy class offers low fares and quality services.",
                    features: [],
                },
                {
                    title: "Standard Seats",
                    description:
                        "The Economy Class cabin offers basic seating and economical services.",
                },
                {
                    title: "Front Cabin Seats",
                    description:
                        "Located near the front for faster exit and better service.",
                },
                {
                    title: "Two by Two Seats",
                    description:
                        "Reserved in pairs for extra space and privacy.",
                },
                {
                    title: "Extra Legroom Seats",
                    description: "4–6 inches more legroom with added comfort.",
                },
            ],
        },

        clubClass: {
            title: "Club Class",
            image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80&w=1200",
            subtitle: "What are the advantages of Club Class?",
            description:
                "Club Class is the premium cabin of Air Transat offering luxury seating and services.",
            additionalInfo:
                "Available on select routes with premium experience.",

            benefits: [
                "Priority services",
                "Premium seats with extra legroom",
                "Noise-canceling headphones",
                "Premium meals & beverages",
                "Dedicated cabin crew",
            ],
        },

        upgradeMethods: {
            title: "How to Upgrade to Club Class on Air Transat?",
            intro: "Upgrades are available on select routes and subject to availability.",

            online: {
                title: "Making an upgrade online",
                steps: [
                    "Visit Air Transat official website",
                    "Retrieve booking details",
                    "Select Club Class upgrade",
                    "Complete payment",
                ],
            },

            auction: {
                title: "Upgrading your flight by auction",
                description: "Bid for an upgrade and get notified if approved.",
                steps: [
                    "Place your bid",
                    "Wait for approval",
                    "Receive confirmation email",
                ],
                note: "Approval depends on seat availability.",
            },
        },

        worthIt: {
            title: "Is Upgrading Worth It?",
            points: [
                "Complimentary seat selection",
                "Premium baggage allowance",
                "Priority boarding",
                "Comfortable long-haul experience",
            ],
        },

        upgradeCost: {
            title: "Air Transat Club Class Upgrade Cost",
            content:
                "Upgrade prices typically range between $400 and $700 depending on route and demand.",
        },

        conclusion: {
            title: "Conclusion",
            content:
                "Upgrading to Club Class offers a premium and comfortable travel experience.",
        },

        faq: [
            {
                question: "What is the best cabin on Air Transat?",
                answer: "Club Class is the premium cabin.",
            },
            {
                question: "How much does an upgrade cost?",
                answer: "$400–$700 depending on route.",
            },
        ],
    },
};

// Add this to your data.js file

export const FOOTER_LINKS = [
    {
        title: "About Airline Office",
        links: [
            "About Us",
            "Investor Relations",
            "Careers",
            "Sustainability",
            "Foundation",
            "Legal Notices",
            "CSR Policy & Committee",
            "Travel Agent Portal",
            "List Your Office",
            "Partner Airlines",
            "Advertise with Us",
            "Franchise Opportunities",
        ],
    },
    {
        title: "About the Site",
        links: [
            "Customer Support",
            "Loyalty Program",
            "Payment Security",
            "Privacy Policy",
            "Cookie Policy",
            "User Agreement",
            "Terms of Service",
            "Franchise Offices",
            "Make A Payment",
            "Work From Home",
            "Escalation Channel",
        ],
    },
    {
        title: "Services Offering",
        links: [
            "Flight Bookings",
            "International Flights",
            "Charter Flights",
            "Hotel Bookings",
            "International Hotels",
            "Travel Activities",
            "Holiday Packages",
            "International Holidays",
            "Corporate Travel",
            "Airport Transfers",
            "Bus Tickets",
            "Train Tickets",
            "Cheap Flight Tickets",
            "Trip Planner",
            "Travel Insurance",
            "Visa Assistance",
            "Travel Insurance for Europe",
            "Travel Insurance for USA",
            "Travel Insurance for Asia",
            "Gift Cards",
            "Travel Blog",
            "PNR Status",
            "Travel Credit Card",
        ],
    },
    {
        title: "Quick Links",
        links: [
            "Flight Discount Coupons",
            "Domestic Airlines",
            "Qatar Airways",
            "Etihad Airways",
            "Philippine Airlines",
            "Saudia",
            "Dubai Offices",
            "London Offices",
            "Manila Offices",
            "New York Offices",
            "Airport Information",
            "Baggage Policies",
            "Check-in Services",
            "Flight Status",
        ],
    },
];

export const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
);
export const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
);
