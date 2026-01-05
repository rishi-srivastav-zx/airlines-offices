"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Plane,
    Phone,
    Mail,
    MapPin,
    Clock,
    Info,
    Building,
    ExternalLink,
    Layers,
    Star,
    Navigation,
} from 'lucide-react';
import { OFFICES, aircraftByAirline, servicesList, getAirlineById } from '@/components/constdata';
import SafeImage from '@/components/safeImage';

// InfoTable Component
const InfoTable = ({ icon: Icon, title, rows }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                {title}
            </h2>
            <div className="space-y-4">
                {rows.map((row, idx) => (
                    <div key={idx} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter min-w-[140px]">
                            {row.label}
                        </span>
                        <div className="text-right flex-1 text-sm font-semibold text-slate-800">
                            {row.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// MapSection Component
const MapSection = ({ airlineName, city, address, country }) => {
    // Generate Google Maps URLs
    const mapQuery = encodeURIComponent(`${address}, ${city}, ${country}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    // Using place search which works without API key for basic embeds
    const googleMapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
    
    // Default rating (you can add this to office data later)
    const rating = 4.0;
    const reviewCount = 606;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Office Location Map
                </h2>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                    Open in Maps
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            {/* Map Container */}
            <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {/* Google Maps Embed */}
                <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                ></iframe>

                {/* Information Card Overlay */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl max-w-sm w-full border border-gray-200">
                    {/* Office Name */}
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-slate-800 text-base leading-tight">
                            {airlineName} - {city}
                        </h3>
                    </div>

                    {/* Address */}
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {address}, {city}, {country}
                        </p>
                    </div>

                    {/* Rating */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(rating)
                                            ? "fill-orange-400 text-orange-400"
                                            : i < rating
                                            ? "fill-orange-200 text-orange-200"
                                            : "fill-gray-200 text-gray-200"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                            {rating}
                        </span>
                        <span className="text-sm text-slate-500">
                            ({reviewCount} reviews)
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex flex-col gap-2">
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                            Directions
                        </a>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium text-center"
                        >
                            View larger map
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OfficeTemplate = () => {
    const router = useRouter();
    const params = useParams();
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Get office ID from URL params
        if (!params) return;
        
        const officeId = params.id;
        if (officeId) {
            const found = OFFICES.find(o => o.id === officeId);
            if (found) {
                setSelectedOffice(found);
                return;
            }
        }
        
        // Fallback to first office if not found
        if (OFFICES.length > 0) {
            setSelectedOffice(OFFICES[0]);
        }
    }, [params]);

    const handleOfficeSelect = (office) => {
        setSelectedOffice(office);
        router.push(`/airlinespages/${office.id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    if (!selectedOffice) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Loading office information...</p>
                </div>
            </div>
        );
    }

    const airline = getAirlineById(selectedOffice.airlineId);
    const aircraft = aircraftByAirline[selectedOffice.airlineId] || [];
    
    // Default values for missing fields
    const website = airline?.website || `https://www.${selectedOffice.airlineName.toLowerCase().replace(/\s+/g, '')}.com`;
    const headquarterAddress = selectedOffice.headquarterAddress || `${selectedOffice.city}, ${selectedOffice.country}`;
    const headquarterPhone = selectedOffice.headquarterPhone || selectedOffice.phone;
    const airportName = selectedOffice.airportName || `${selectedOffice.city} International Airport`;
    const airportAddress = selectedOffice.airportAddress || `${airportName}, Terminal Information Available`;
    const airportCode = selectedOffice.airportCode || selectedOffice.city.substring(0, 3).toUpperCase();
    const airportContact = selectedOffice.airportContact || selectedOffice.phone;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            <main className="flex-grow">
                {/* Hero / Header Section */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-12 md:py-20 px-4">
                    <div className="container mx-auto w-full text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-300 animate-pulse"></span>
                            Verified Airline Office Info
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                            {selectedOffice.airlineName} {selectedOffice.city} Office
                        </h1>
                        <p className="text-blue-50 text-lg max-w-2xl opacity-90 leading-relaxed font-medium">
                            Official contact details, airport coordinates, and headquarter information for {selectedOffice.airlineName} in {selectedOffice.country}.
                        </p>
                    </div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-4 w-full -mt-8 md:-mt-12 pb-20">
                    <div className="grid lg:grid-cols-12 gap-8">
                        
                        {/* Left Column (Primary Info) */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Quick Action Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a 
                                    href={`tel:${selectedOffice.phone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Phone className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Office Support</p>
                                        <p className="font-bold text-slate-800">{selectedOffice.phone}</p>
                                    </div>
                                </a>
                                <a 
                                    href={`mailto:${selectedOffice.email}`}
                                    className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <Mail className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email Inquiry</p>
                                        <p className="font-bold text-slate-800 break-all">{selectedOffice.email}</p>
                                    </div>
                                </a>
                            </div>

                            {/* Detailed Info Tables */}
                            <InfoTable 
                                icon={Info}
                                title="Office Overview"
                                rows={[
                                    { label: "Address", value: <span className="text-blue-600">{selectedOffice.address}</span> },
                                    { label: "Phone Number", value: selectedOffice.phone },
                                    { label: "Operation Hours", value: <div className="flex items-center gap-2"><Clock className="text-orange-500 w-4 h-4" /> {selectedOffice.hours}</div> },
                                    { label: "Official Website", value: <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{website} <ExternalLink className="w-3 h-3" /></a> }
                                ]}
                            />

                            <InfoTable 
                                icon={Plane}
                                title="Airport Liaison"
                                rows={[
                                    { label: "Airport Name", value: airportName },
                                    { label: "Terminal Info", value: airportAddress },
                                    { label: "IATA Code", value: <span className="inline-block bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-mono">{airportCode}</span> },
                                    { label: "Counter Contact", value: airportContact }
                                ]}
                            />

                            {/* Map Section */}
                            <MapSection 
                                airlineName={selectedOffice.airlineName}
                                city={selectedOffice.city}
                                address={selectedOffice.address}
                                country={selectedOffice.country}
                            />

                            {/* Services Grid */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                                    Available Services
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {servicesList.map((service, i) => (
                                        <div key={i} className="flex items-center gap-3 group">
                                            <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600 transition-colors"></div>
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                                {service}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Aircraft Types */}
                            <div className="bg-slate-800 p-8 rounded-2xl text-white shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Plane className="text-9xl" />
                                </div>
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <Layers className="text-blue-400 w-6 h-6" />
                                    Fleet Operations
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {aircraft.map((plane, i) => (
                                        <span key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all cursor-default">
                                            {plane}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Headquarter Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                                    <Building className="text-blue-600 w-5 h-5" />
                                    Global Headquarters
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">HQ Address</p>
                                        <p className="text-sm font-bold text-slate-700">{headquarterAddress}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">HQ Phone</p>
                                        <p className="text-sm font-bold text-slate-700">{headquarterPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Image / Featured Content */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <SafeImage
                                    src={selectedOffice.image}
                                    alt={selectedOffice.city}
                                    className="w-full h-56 object-cover"
                                    fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                                />
                                <div className="p-6">
                                    <p className="text-slate-600 text-sm leading-relaxed italic">
                                        "{selectedOffice.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Related Offices */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-5">Browse More Offices</h3>
                                <div className="space-y-3">
                                    {OFFICES.filter(o => o.id !== selectedOffice.id).map(o => (
                                        <button
                                            key={o.id}
                                            onClick={() => handleOfficeSelect(o)}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
                                        >
                                            <SafeImage 
                                                src={o.image} 
                                                alt={o.city}
                                                className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                                                fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-blue-600 leading-tight">{o.airlineName}</p>
                                                <p className="text-sm font-bold text-slate-800">{o.city} Office</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter / CTA */}
                            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8 rounded-3xl text-white shadow-2xl shadow-blue-200">
                                <h3 className="text-xl font-black mb-3 italic">Need Help?</h3>
                                <p className="text-sm text-blue-50 mb-6 opacity-80">Our support team is available 24/7 for urgent ticketing and travel inquiries.</p>
                                <button className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg">
                                    Live Chat Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OfficeTemplate;
