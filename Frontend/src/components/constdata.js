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
        city: "Dubai",
        country: "United Arab Emirates",
        address: "Deira, Near Clock Tower, Dubai",
        phone: "+971 4 229 2222",
        email: "dxboffice@qatarairways.com.qa",
        hours: "Sun - Thu: 09:00 AM - 05:30 PM",
        image: "/images/officeimage/qatar.avif",
        featured: true,
        description:
            "Experience world-class service at our Dubai office, centrally located in Deira.",
    },
    {
        id: "2",
        airlineId: "etihad",
        airlineName: "Etihad Airways",
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
        readTime: "5 min read",
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
        readTime: "7 min read",
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
        readTime: "8 min read",
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
    gulf: [
        "Boeing 787-9",
        "Airbus A320",
        "Airbus A321neo",
        "Boeing 777-300ER",
    ],
    srilankan: [
        "Airbus A330-300",
        "Airbus A320",
        "Airbus A321neo",
    ],
    wizz: [
        "Airbus A320",
        "Airbus A321neo",
    ],
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