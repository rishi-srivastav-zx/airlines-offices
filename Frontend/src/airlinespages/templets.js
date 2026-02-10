"use client";

import React, { useState, useEffect, useCallback } from "react";
import AboutAirline from "@/components/Aboutairline";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
	Plane,
	MapPin,
	Clock,
	Info,
	ExternalLink,
	Star,
	Navigation,
	PhoneOutgoing,
	Sparkles,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import axios from "axios";
import SafeImage from "@/components/safeImage";
import OfficeInquiryList from "@/components/InquiryTable";
import AirlineOfficesSection from "@/components/List";
import { officeInquiries } from "@/components/constdata";

// Environment configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// InfoTable Component
const InfoTable = ({ icon: Icon, title, rows }) => {
	return (
		<div className="bg-white p-4 sm:p-6 md:p-8 border border-slate-200 rounded-lg sm:rounded-xl shadow-sm">
			<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-800 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 sm:gap-3">
				<div className="w-1 sm:w-1.5 md:w-2 h-5 sm:h-6 md:h-8 bg-blue-600 rounded-full flex-shrink-0" />
				{Icon && (
					<Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
				)}
				<span className="break-words leading-tight">{title}</span>
			</h2>
			<div className="space-y-2 sm:space-y-3 md:space-y-4">
				{rows.map((row, idx) => (
					<div
						key={`${title}-${idx}`}
						className="flex flex-col sm:flex-row sm:items-start py-2 sm:py-3 border-b border-slate-100 last:border-0 gap-1 sm:gap-2 md:gap-4"
					>
						<span className="text-xs sm:text-sm md:text-base font-bold text-slate-500 uppercase tracking-tight sm:min-w-[120px] md:min-w-[140px] flex-shrink-0">
							{row.label}
						</span>
						<div className="sm:text-right sm:ml-auto text-sm sm:text-base md:text-lg font-semibold text-slate-800 break-words w-full sm:w-auto">
							{row.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// MapSection Component
const MapSection = ({ office }) => {
	const { address, city, country } = office.officeOverview || {};
	const { latitude, longitude } = office.airportMapLocation || {};

	const mapQuery = encodeURIComponent(`${address}, ${city}, ${country}`);
	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
	const googleMapsEmbedUrl =
		latitude && longitude
			? `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`
			: `https://www.google.com/maps?q=${mapQuery}&output=embed`;

	const rating = office.metadata?.rating || 4.0;
	const reviewCount = office.metadata?.reviewCount || 0;

	return (
		<div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
				<h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
					<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
					<span className="break-words">Office Location Map</span>
				</h2>
				<a
					href={googleMapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1 w-fit transition-colors"
					aria-label="Open location in Google Maps"
				>
					Open in Maps
					<ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
				</a>
			</div>

			<div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
				<iframe
					src={googleMapsEmbedUrl}
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					className="w-full h-full"
					title={`Map location for ${office.officeOverview?.airlineName} in ${city}`}
				/>

				<div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-white rounded-lg shadow-xl max-w-[calc(100%-1rem)] sm:max-w-sm w-full border border-gray-200">
					<div className="p-2 sm:p-3 md:p-4 border-b border-gray-100">
						<h3 className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base leading-tight break-words">
							{office.officeOverview?.airlineName} - {city}
						</h3>
					</div>

					<div className="p-2 sm:p-3 md:p-4 border-b border-gray-100">
						<p className="text-[10px] sm:text-xs md:text-sm text-slate-600 leading-relaxed break-words">
							{address}, {city}, {country}
						</p>
					</div>

					<div className="p-2 sm:p-3 md:p-4 border-b border-gray-100 flex flex-wrap items-center gap-1 sm:gap-2">
						<div
							className="flex items-center gap-0.5 sm:gap-1"
							aria-label={`Rating: ${rating} out of 5 stars`}
						>
							{[...Array(5)].map((_, i) => (
								<Star
									key={`star-${i}`}
									className={`w-3 h-3 sm:w-4 sm:h-4 ${
										i < Math.floor(rating)
											? "fill-orange-400 text-orange-400"
											: i < rating
												? "fill-orange-200 text-orange-200"
												: "fill-gray-200 text-gray-200"
									}`}
								/>
							))}
						</div>
						<span className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-700">
							{parseFloat(rating).toFixed(1)}
						</span>
						<span className="text-[10px] sm:text-xs md:text-sm text-slate-500">
							({reviewCount} reviews)
						</span>
					</div>

					<div className="p-2 sm:p-3 md:p-4 flex flex-col gap-2">
						<a
							href={googleMapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-colors"
						>
							<Navigation className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
							Directions
						</a>
						<a
							href={googleMapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-700 text-[10px] sm:text-xs md:text-sm font-medium text-center transition-colors"
						>
							View larger map
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

// Services Section Component
const ServicesSection = ({ services }) => {
	// If no services data
	if (!services || services.trim().length === 0) {
		return (
			<div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-1.5 h-8 bg-slate-300 rounded-full" />
					<h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
						Available Services
					</h2>
				</div>
				<div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
					<AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
					<p className="text-slate-500 text-sm sm:text-base">
						No services information available for this office.
					</p>
				</div>
			</div>
		);
	}

	// Clean and format the services text
	const cleanText = services
		.replace(/<[^>]*>/g, " ") // Remove HTML tags
		.replace(/\s+/g, " ") // Normalize whitespace
		.trim();

	// Try to split into bullet points if text contains common delimiters
	const serviceItems = cleanText
		.split(/[•·◆◇▪▫■□►▻▸▹→⇒—–-]|\n+|\.\s+(?=[A-Z])/)
		.map((item) => item.trim())
		.filter((item) => item.length > 0);

	const hasMultipleItems = serviceItems.length > 1;

	return (
		<div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
			{/* Header */}
			<div className="flex items-center gap-3 mb-4 sm:mb-6">
				<div className="w-1.5 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full" />
				<div className="flex items-center gap-2">
					<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
					<h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
						Available Services
					</h2>
				</div>
			</div>

			{/* Content */}
			<div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-100">
				{hasMultipleItems ? (
					// Render as bullet list if multiple items detected
					<ul className="space-y-3">
						{serviceItems.map((item, index) => (
							<li
								key={index}
								className="flex items-start gap-3 text-slate-700"
							>
								<CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
								<span className="text-sm sm:text-base leading-relaxed">
									{item}
								</span>
							</li>
						))}
					</ul>
				) : (
					// Render as paragraph if single block of text
					<p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
						{cleanText}
					</p>
				)}
			</div>

			{/* Footer note */}
			<div className="mt-4 pt-4 border-t border-slate-100">
				<p className="text-xs sm:text-sm text-slate-500 italic">
					Services may vary by location. Contact the office directly
					for the most up-to-date information.
				</p>
			</div>
		</div>
	);
};

// Loading State Component
const LoadingState = () => (
	<div className="flex items-center justify-center min-h-screen px-4 bg-slate-50">
		<div className="text-center">
			<div
				className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"
				role="status"
				aria-label="Loading"
			/>
			<p className="text-slate-600 text-lg font-medium">
				Loading office information...
			</p>
		</div>
	</div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
	<div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
		<div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
			<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Info className="w-8 h-8 text-red-600" />
			</div>
			<h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
			<p className="text-slate-700 mb-6">{error}</p>
			<div className="flex gap-3 justify-center">
				<button
					onClick={onRetry}
					className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
				>
					Try Again
				</button>
				<Link
					href="/"
					className="bg-slate-200 text-slate-800 px-6 py-2.5 rounded-lg hover:bg-slate-300 transition-colors font-medium"
				>
					Go Home
				</Link>
			</div>
		</div>
	</div>
);

// Not Found State Component
const NotFoundState = () => (
	<div className="flex items-center justify-center min-h-screen px-4 bg-slate-50">
		<div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
			<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<MapPin className="w-8 h-8 text-slate-400" />
			</div>
			<h2 className="text-2xl font-bold text-slate-800 mb-2">
				Office Not Found
			</h2>
			<p className="text-slate-600 mb-6">
				The office you're looking for doesn't exist or may have been
				removed.
			</p>
			<Link
				href="/directoryAirlines"
				className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
			>
				Browse All Offices
			</Link>
		</div>
	</div>
);

// Main Component
const OfficeTemplate = () => {
	const router = useRouter();
	const params = useParams();

	const [selectedOffice, setSelectedOffice] = useState(null);
	const [relatedOffices, setRelatedOffices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchOfficeData = useCallback(
		async (signal) => {
			const slug = params?.slug;

			if (!slug) {
				setLoading(false);
				setError("No office specified.");
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const [officeRes, relatedRes] = await Promise.all([
					axios.get(`${API_BASE}/api/offices/${slug}`, { signal }),
					axios.get(`${API_BASE}/api/offices?limit=6`, { signal }),
				]);

				if (!officeRes.data?.data) {
					throw new Error("Office data not found");
				}

				setSelectedOffice(officeRes.data.data);
				setRelatedOffices(
					relatedRes.data?.data
						?.filter((o) => o.slug !== slug)
						.slice(0, 5) || [],
				);
			} catch (err) {
				if (axios.isCancel(err)) return;

				console.error("Error fetching office data:", err);
				setError(
					err.response?.status === 404
						? "Office not found."
						: "Failed to load office data. Please try again later.",
				);
			} finally {
				setLoading(false);
			}
		},
		[params?.slug],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchOfficeData(controller.signal);

		return () => controller.abort();
	}, [fetchOfficeData]);

	const handleOfficeSelect = useCallback(
		(office) => {
			if (!office?.slug) return;

			router.push(`/directoryAirlines/airlinespages/${office.slug}`);
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[router],
	);

	const handleRetry = useCallback(() => {
		const controller = new AbortController();
		fetchOfficeData(controller.signal);
	}, [fetchOfficeData]);

	if (loading) return <LoadingState />;
	if (error) return <ErrorState error={error} onRetry={handleRetry} />;
	if (!selectedOffice) return <NotFoundState />;

	const { officeOverview, aboutOffice, airportLocation, airline } =
		selectedOffice;

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<main className="flex-grow">
				{/* Hero Section */}
				<div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-6 sm:py-10 md:py-14 lg:py-20 px-3 sm:px-4 lg:px-6">
					<div className="container mx-auto max-w-8xl">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-3 sm:gap-4 md:gap-6">
							{/* Logo */}
							<div className="flex-shrink-0 md:ml-8">
								<div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-2xl md:mt-2 lg:mt-10">
									<div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
										{airline?.logo ? (
											<SafeImage
												src={`${API_BASE}${airline.logo}`}
												alt={`${airline.airlineName} logo`}
												className="w-full h-full object-cover rounded-lg"
												width={96}
												height={96}
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
												<span className="text-white font-black text-lg sm:text-2xl md:text-3xl">
													{(
														airline?.airlineName ||
														"Office"
													)
														.substring(0, 2)
														.toUpperCase()}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Title Content */}
							<div className="flex-1 text-center md:text-left w-full">
								<div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 md:mb-6">
									<span className="flex h-2 w-2 rounded-full bg-blue-300 animate-pulse flex-shrink-0" />
									<span className="whitespace-nowrap">
										Verified Airline Office Info
									</span>
								</div>

								<h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 leading-tight break-words px-2 sm:px-0">
									{airline?.airlineName}{" "}
									{officeOverview?.city} Office
								</h1>

								<p className="text-blue-50 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto md:mx-0 opacity-90 leading-relaxed font-medium px-2 sm:px-0">
									Official contact details, airport
									coordinates, and headquarter information for{" "}
									{airline?.airlineName} in{" "}
									{officeOverview?.country}.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="container mx-auto max-w-8xl px-3 sm:px-4 lg:px-6 -mt-4 sm:-mt-8 md:-mt-12 pb-8 sm:pb-16 md:pb-20">
					<div className="grid lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
						{/* Left Column */}
						<div className="lg:col-span-8 space-y-4 sm:space-y-6 md:space-y-8">
							{/* Office Overview */}
							<InfoTable
								icon={Info}
								title="Office Overview"
								rows={[
									{
										label: "Address",
										value: (
											<span className="text-blue-600 break-words">
												{officeOverview?.address}
											</span>
										),
									},
									{
										label: "Phone Number",
										value: officeOverview?.phone || "N/A",
									},
									{
										label: "Operation Hours",
										value: officeOverview?.hours ? (
											<div className="flex items-center gap-2">
												<Clock className="text-orange-500 w-4 h-4 flex-shrink-0" />
												<span className="break-words">
													{officeOverview.hours.start}{" "}
													- {officeOverview.hours.end}
												</span>
											</div>
										) : (
											"N/A"
										),
									},
									{
										label: "Official Website",
										value: selectedOffice?.website ? (
											<a
												href={selectedOffice.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline flex items-center gap-1 break-all transition-colors"
											>
												<span className="break-all">
													{selectedOffice.website}
												</span>
												<ExternalLink className="w-3 h-3 flex-shrink-0" />
											</a>
										) : (
											"N/A"
										),
									},
									{
										label: "Toll-Free Number",
										value: (
											<a
												href="tel:+18338426011"
												className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-3 sm:px-4 py-2 text-sm font-bold rounded-lg shadow-md border border-yellow-300 transition-colors"
											>
												<PhoneOutgoing className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
												<span>+1-833-842-6011</span>
												<span className="hidden sm:inline text-xs font-medium opacity-75">
													(Toll-Free)
												</span>
											</a>
										),
									},
								]}
							/>

							{/* About Section */}
							<AboutAirline
								officeSlug={selectedOffice.slug}
								airlineName={airline?.airlineName}
								city={officeOverview?.city}
							/>

							{/* Airport Location */}
							<InfoTable
								icon={Plane}
								title="Airport Location"
								rows={[
									{
										label: "Airport Name",
										value:
											airportLocation?.airportName ||
											"N/A",
									},
									{
										label: "Terminal Info",
										value:
											airportLocation?.terminalInfo ||
											"N/A",
									},
									{
										label: "IATA Code",
										value: airportLocation?.iataCode ? (
											<span className="inline-block bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-mono">
												{airportLocation.iataCode}
											</span>
										) : (
											"N/A"
										),
									},
									{
										label: "Counter Contact",
										value:
											airportLocation?.counterContact ||
											"N/A",
									},
								]}
							/>

							{/* Map */}
							<MapSection office={selectedOffice} />

							{/* Inquiries */}
							<OfficeInquiryList data={officeInquiries} />

							{/* Related Offices */}
							<AirlineOfficesSection data={relatedOffices} />

							{/* Services */}
							<ServicesSection services={aboutOffice?.services} />
						</div>

						{/* Right Column - Sidebar */}
						<div className="lg:col-span-4 space-y-4 sm:space-y-6">
							
							{/* Photo Card */}
							<div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
								<SafeImage
									src={
										selectedOffice.photo
											? `${API_BASE}${selectedOffice.photo}`
											: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
									}
									alt={
										officeOverview?.city ||
										"Office location"
									}
									className="w-full h-40 sm:h-56 object-cover"
									fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
									width={400}
									height={224}
								/>
								<div className="p-3 sm:p-4 md:p-6">
									{aboutOffice?.description ? (
										<p
											className="text-slate-600 text-xs sm:text-sm leading-relaxed italic break-words"
											dangerouslySetInnerHTML={{
												__html: aboutOffice.description.replace(
													/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
													"",
												),
											}}
										/>
									) : (
										<p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic break-words">
											No description available.
										</p>
									)}
								</div>
							</div>

							{/* Browse More */}
							<div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
								<h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 mb-3 sm:mb-4 break-words">
									Browse More Offices
								</h3>
								<div className="space-y-2 sm:space-y-3">
									{relatedOffices.length > 0 ? (
										relatedOffices.map((office) => (
											<button
												key={office.slug}
												onClick={() =>
													handleOfficeSelect(office)
												}
												className="w-full flex items-center gap-2 sm:gap-3 p-2 rounded-lg sm:rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left group"
											>
												<SafeImage
													src={
														office.photo
															? `${API_BASE}${office.photo}`
															: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
													}
													alt={
														office.officeOverview
															?.city || "Office"
													}
													className="w-10 h-10 sm:w-12 sm:h-12 rounded-md sm:rounded-lg object-cover flex-shrink-0"
													fallbackSrc="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800"
													width={48}
													height={48}
												/>
												<div className="min-w-0 flex-1">
													<p className="text-[10px] sm:text-xs font-bold text-blue-600 leading-tight break-words">
														{office.airline
															?.airlineName ||
															"Unknown Airline"}
													</p>
													<p className="text-xs sm:text-sm font-bold text-slate-800 break-words group-hover:text-blue-600 transition-colors">
														{
															office
																.officeOverview
																?.city
														}{" "}
														Office
													</p>
												</div>
											</button>
										))
									) : (
										<p className="text-sm text-slate-500 text-center py-4">
											No related offices found
										</p>
									)}
								</div>
							</div>

							{/* Help CTA */}
							<div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 sticky top-24 p-4 sm:p-6 md:p-8 rounded-2xl text-white shadow-2xl shadow-blue-200">
								<h3 className="text-base sm:text-lg md:text-xl font-black mb-2 sm:mb-3 italic break-words">
									Need Help?
								</h3>
								<p className="text-xs sm:text-sm text-blue-50 mb-4 sm:mb-6 opacity-90 break-words leading-relaxed">
									Our support team is available 24/7 for
									urgent ticketing and travel inquiries.
								</p>
								<a
									href="tel:+18338426011"
									className="w-full bg-white flex items-center justify-center gap-2 text-blue-600 font-black py-2.5 sm:py-3 md:py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
								>
									<PhoneOutgoing
										size={18}
										className="flex-shrink-0"
									/>
									<span className="whitespace-nowrap">
										+1-833-842-6011
									</span>
									<span className="font-normal whitespace-nowrap hidden sm:inline">
										(Toll-Free)
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default OfficeTemplate;
