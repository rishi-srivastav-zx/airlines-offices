"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus, Search, Building2, MapPin, Globe, Phone, Edit2, Trash2, ExternalLink, Filter, ArrowRight, Loader2, CheckCircle, CheckCircle2, AlertCircle, Plane, Star, X, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { getUserPermissions } from "../utils/usePermission";
import AirlineAdminForm from "./airlineform";
import AirlineOfficeForm from "./officeform";

const API_BASE_URL = "http://localhost:3001/api";
const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default function AirlinesManagementPage() {
	const [airlines, setAirlines] = useState([]);
	const [offices, setOffices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeView, setActiveView] = useState("airlines"); // 'airlines' or 'offices'

	// Modal states
	const [isAirlineModalOpen, setIsAirlineModalOpen] = useState(false);
	const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
	const [selectedAirline, setSelectedAirline] = useState(null);
	const [selectedOffice, setSelectedOffice] = useState(null);

	// Search and filter
	const [searchQuery, setSearchQuery] = useState("");
	const [filterContinent, setFilterContinent] = useState("");

	// Pagination
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: 10,
	});

	// Fetch airlines
	const fetchAirlines = useCallback(async (page = 1, search = "") => {
		try {
			const response = await api.get("/airlines", {
				params: { page, limit: 10, search },
			});
			if (response.data.success) {
				setAirlines(response.data.data);
				setPagination(response.data.pagination);
			}
		} catch (error) {
			toast.error("Failed to fetch airlines");
			console.error(error);
		}
	}, []);

	// Fetch offices
	const fetchOffices = useCallback(async (page = 1, search = "") => {
		try {
			const response = await api.get("/offices", {
				params: { page, limit: 10, search },
			});
			if (response.data.success) {
				setOffices(response.data.data);
				setPagination(response.data.pagination);
			}
		} catch (error) {
			toast.error("Failed to fetch offices");
			console.error(error);
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		if (activeView === "airlines") {
			fetchAirlines(pagination.currentPage, searchQuery).finally(() =>
				setLoading(false),
			);
		} else {
			fetchOffices(pagination.currentPage, searchQuery).finally(() =>
				setLoading(false),
			);
		}
	}, [
		activeView,
		pagination.currentPage,
		searchQuery,
		fetchAirlines,
		fetchOffices,
	]);

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			setPagination((prev) => ({ ...prev, currentPage: 1 }));
		}, 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const handleSaveAirline = async (formData) => {
		try {
			const config = {
				headers: { "Content-Type": "multipart/form-data" },
			};
			let response;

            const permissions = getUserPermissions();
            // Only users with explicit approval permissions can publish directly
            // SUPERADMIN and MANAGER have approvals: true
            // EDITOR has approvals: false
            // Unknown/logged out users have approvals: undefined
            const canPublishDirectly = permissions.approvals === true;
            const needsApproval = !canPublishDirectly;

			if (selectedAirline) {
                // For updates, we currently publish directly. 
                // In a full system, updates by EDITORS should also go to pending.
                // But for now, let's keep it simple as per the requirements.
				response = await api.put(
					`/airlines/${selectedAirline.slug}`,
					formData,
					config,
				);
			} else {
                if (needsApproval) {
                    response = await api.post("/approval/submit-airline", formData, config);
                } else {
    				response = await api.post("/airlines", formData, config);
                }
			}

			if (response.data.success) {
				toast.success(
					selectedAirline 
                        ? "Airline updated!" 
                        : (needsApproval ? "Airline submitted for approval!" : "Airline created!")
				);
				setIsAirlineModalOpen(false);
				setSelectedAirline(null);
				fetchAirlines(pagination.currentPage, searchQuery);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to save airline",
			);
			throw error;
		}
	};

	const handleSaveOffice = async (formData) => {
		try {
			const config = {
				headers: { "Content-Type": "multipart/form-data" },
			};
			let response;

            const permissions = getUserPermissions();
            // Only users with explicit approval permissions can publish directly
            // SUPERADMIN and MANAGER have approvals: true
            // EDITOR has approvals: false
            // Unknown/logged out users have approvals: undefined
            const canPublishDirectly = permissions.approvals === true;
            const needsApproval = !canPublishDirectly;

			if (selectedOffice) {
                // For updates, we currently publish directly. 
                // In a full system, updates by EDITORS should also go to pending.
                // But for now, let's keep it simple as per the requirements.
				response = await api.put(
					`/offices/${selectedOffice.slug}`,
					formData,
					config,
				);
			} else {
                if (needsApproval) {
                    response = await api.post("/approval/submit", formData, config);
                } else {
    				response = await api.post("/offices", formData, config);
                }
			}

			if (response.data.success) {
				toast.success(
					selectedOffice 
                        ? "Office updated!" 
                        : (needsApproval ? "Office submitted for approval!" : "Office created!")
				);
				setIsOfficeModalOpen(false);
				setSelectedOffice(null);
				fetchOffices(pagination.currentPage, searchQuery);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to save office",
			);
			throw error;
		}
	};

	const handleDeleteAirline = async (slug) => {
		if (
			!confirm(
				"Are you sure? This will also delete all associated offices.",
			)
		)
			return;

		try {
			const response = await api.delete(`/airlines/${slug}`);
			if (response.data.success) {
				toast.success("Airline deleted");
				fetchAirlines(pagination.currentPage, searchQuery);
			}
		} catch (error) {
			toast.error("Failed to delete airline");
		}
	};

	const handleDeleteOffice = async (slug) => {
		if (!confirm("Are you sure you want to delete this office?")) return;

		try {
			const response = await api.delete(`/offices/${slug}`);
			if (response.data.success) {
				toast.success("Office deleted");
				fetchOffices(pagination.currentPage, searchQuery);
			}
		} catch (error) {
			toast.error("Failed to delete office");
		}
	};

	const handleEditAirline = (airline) => {
		setSelectedAirline(airline);
		setIsAirlineModalOpen(true);
	};

	const handleEditOffice = (office) => {
		setSelectedOffice(office);
		setIsOfficeModalOpen(true);
	};

	const handleAddNew = () => {
		if (activeView === "airlines") {
			setSelectedAirline(null);
			setIsAirlineModalOpen(true);
		} else {
			if (airlines.length === 0) {
				toast.error("Please create an airline first");
				return;
			}
			setSelectedOffice(null);
			setIsOfficeModalOpen(true);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
			<Toaster position="top-center" />

			<div className="max-w-8xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-slate-900">
							Airlines Management
						</h1>
						<p className="text-slate-500 mt-1">
							Manage airlines and their office locations worldwide
						</p>
					</div>

					<div className="flex gap-3">
						<div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
							<button
								onClick={() => setActiveView("airlines")}
								className={`px-4 py-2 rounded-lg font-medium transition-all ${
									activeView === "airlines"
										? "bg-blue-600 text-white shadow-md"
										: "text-slate-600 hover:bg-slate-100"
								}`}
							>
								<div className="flex items-center gap-2">
									<Plane size={18} />
									Airlines
								</div>
							</button>
							<button
								onClick={() => setActiveView("offices")}
								className={`px-4 py-2 rounded-lg font-medium transition-all ${
									activeView === "offices"
										? "bg-indigo-600 text-white shadow-md"
										: "text-slate-600 hover:bg-slate-100"
								}`}
							>
								<div className="flex items-center gap-2">
									<Building2 size={18} />
									Offices
								</div>
							</button>
						</div>

						<button
							onClick={handleAddNew}
							className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg ${
								activeView === "airlines"
									? "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
									: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20"
							}`}
						>
							<Plus size={20} />
							Add{" "}
							{activeView === "airlines" ? "Airline" : "Office"}
						</button>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
					<div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-gradient-to-r from-slate-50 to-blue-50">
						<div className="relative flex-1 max-w-md">
							<Search
								className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
								size={18}
							/>
							<input
								type="text"
								placeholder={`Search ${activeView}...`}
								className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{activeView === "airlines" && (
							<select
								value={filterContinent}
								onChange={(e) =>
									setFilterContinent(e.target.value)
								}
								className="px-4 py-3 rounded-xl border-2 border-slate-200 text-gray-900 focus:border-blue-500 outline-none bg-white"
							>
								<option value="">All Continents</option>
								{[
									"Asia",
									"Europe",
									"Africa",
									"North America",
									"South America",
									"Australia",
									"Antarctica",
								].map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</select>
						)}
					</div>

					{/* Content */}
					{loading ? (
						<div className="flex items-center justify-center py-20">
							<Loader2
								size={40}
								className="animate-spin text-blue-600"
							/>
						</div>
					) : activeView === "airlines" ? (
						/* Airlines Table */
						<div className="overflow-x-auto">
							{airlines.length > 0 ? (
								<table className="w-full text-left">
									<thead className="bg-slate-50 text-slate-600 text-sm uppercase font-bold tracking-wider">
										<tr>
											<th className="px-6 py-4">Airline</th>
											<th className="px-6 py-4">Coverage</th>
											<th className="px-6 py-4">Rating</th>
											<th className="px-6 py-4">Status</th>
											<th className="px-6 py-4">
												Last Updated
											</th>
											<th className="px-6 py-4">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{airlines.map((airline) => (
											<tr
												key={airline._id}
												className="hover:bg-slate-50/80 transition-colors"
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														{airline.logo && (
															<img
																src={`http://localhost:3001${airline.logo}`}
																alt={
																	airline.airlineName
																}
																className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm"
															/>
														)}
														<div>
															<div className="font-semibold text-slate-900 flex items-center gap-2">
																{
																	airline.airlineName
																}
																{airline.metadata
																	?.verified && (
																	<CheckCircle
																		className="text-blue-500"
																		size={16}
																	/>
																)}
															</div>
															<div className="text-xs text-slate-500">
																/{airline.slug}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="flex flex-wrap gap-1">
														{airline.continents?.length > 0 && (
															<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
																{airline.continents.length} Continents
															</span>
														)}
													</div>
													<div className="text-xs text-slate-500 mt-1">
														{airline.countries
															?.length || 0}{" "}
														countries,{" "}
														{airline.cities?.length ||
															0}{" "}
														cities
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-1">
														<Star
															className="text-amber-400 fill-amber-400"
															size={16}
														/>
														<span className="font-bold text-slate-900">
															{airline.metadata
																?.rating?.value ||
																0}
														</span>
														<span className="text-slate-500 text-sm">
															(
															{airline.metadata
																?.rating
																?.reviewCount || 0}
															)
														</span>
													</div>
												</td>
												<td className="px-6 py-4">
													{airline.metadata?.verified ? (
														<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
															Verified
														</span>
													) : (
														<span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
															Pending
														</span>
													)}
												</td>
												<td className="px-6 py-4 text-sm text-slate-500">
													{new Date(
														airline.metadata
															?.lastUpdated ||
															airline.updatedAt,
													).toLocaleDateString()}
												</td>
												<td className="px-6 py-4">
													<div className="flex gap-2">
														<button
															onClick={() =>
																handleEditAirline(
																	airline,
																)
															}
															className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
															title="Edit"
														>
															<Edit2 size={18} />
														</button>
														<button
															onClick={() =>
																handleDeleteAirline(
																	airline.slug,
																)
															}
															className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
															title="Delete"
														>
															<Trash2 size={18} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="flex flex-col items-center justify-center py-20 text-slate-500">
									<AlertCircle size={48} className="mb-4 text-slate-300" />
									<p className="text-lg font-medium">No airlines found</p>
									<p className="text-sm">Try adjusting your search or add a new airline.</p>
								</div>
							)}
						</div>
					) : (
						/* Offices Table */
						<div className="overflow-x-auto">
							{offices.length > 0 ? (
								<table className="w-full text-left">
									<thead className="bg-slate-50 text-slate-600 text-sm uppercase font-bold tracking-wider">
										<tr>
											<th className="px-6 py-4">
												Office Location
											</th>
											<th className="px-6 py-4">
												Parent Airline
											</th>
											<th className="px-6 py-4">Airport</th>
											<th className="px-6 py-4">Contact</th>
											<th className="px-6 py-4">Status</th>
											<th className="px-6 py-4">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{offices.map((office) => (
											<tr
												key={office._id}
												className="hover:bg-slate-50/80 transition-colors"
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														{office.photo && (
															<img
																src={`http://localhost:3001${office.photo}`}
																alt="Office"
																className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm"
															/>
														)}
														<div>
															<div className="font-semibold text-slate-900">
																{
																	office
																		.officeOverview
																		?.city
																}
																,{" "}
																{
																	office
																		.officeOverview
																		?.country
																}
															</div>
															<div className="text-xs text-slate-500 flex items-center gap-1">
																<MapPin size={12} />
																{
																	office
																		.officeOverview
																		?.continent
																}
															</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="font-medium text-slate-900">
														{office.airline
															?.airlineName ||
															"Unknown"}
													</div>
													<div className="text-xs text-slate-500">
														/{office.airline?.slug}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="font-medium text-slate-900">
														{
															office.airportLocation
																?.airportName
														}
													</div>
													<div className="text-xs text-slate-500">
														{
															office.airportLocation
																?.iataCode
														}{" "}
														•{" "}
														{
															office.airportLocation
																?.terminalInfo
														}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="text-sm text-slate-600">
														{office.officeOverview
															?.phone || "N/A"}
													</div>
												</td>
												<td className="px-6 py-4">
													{office.metadata?.verified ? (
														<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
															Verified
														</span>
													) : (
														<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
															Unverified
														</span>
													)}
												</td>
												<td className="px-6 py-4">
													<div className="flex gap-2">
														<button
															onClick={() =>
																handleEditOffice(
																	office,
																)
															}
															className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
														>
															<Edit2 size={18} />
														</button>
														<button
															onClick={() =>
																handleDeleteOffice(
																	office.slug,
																)
															}
															className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														>
															<Trash2 size={18} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="flex flex-col items-center justify-center py-20 text-slate-500">
									<AlertCircle size={48} className="mb-4 text-slate-300" />
									<p className="text-lg font-medium">No offices found</p>
									<p className="text-sm">Try adjusting your search or add a new office.</p>
								</div>
							)}
						</div>
					)}

					{/* Pagination */}
					{!loading && (
						<div className="p-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
							<div>
								Showing{" "}
								{(pagination.currentPage - 1) *
									pagination.itemsPerPage +
									1}{" "}
								-{" "}
								{Math.min(
									pagination.currentPage *
										pagination.itemsPerPage,
									pagination.totalItems,
								)}{" "}
								of {pagination.totalItems}
							</div>
							<div className="flex gap-2">
								<button
									onClick={() =>
										setPagination((prev) => ({
											...prev,
											currentPage: prev.currentPage - 1,
										}))
									}
									disabled={pagination.currentPage === 1}
									className="p-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronLeft size={16} />
								</button>
								<div className="px-4 py-2 font-medium">
									Page {pagination.currentPage} of{" "}
									{pagination.totalPages}
								</div>
								<button
									onClick={() =>
										setPagination((prev) => ({
											...prev,
											currentPage: prev.currentPage + 1,
										}))
									}
									disabled={
										pagination.currentPage ===
										pagination.totalPages
									}
									className="p-2 border-2 border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Modals */}
			{isAirlineModalOpen && (
				<AirlineAdminForm
					onClose={() => {
						setIsAirlineModalOpen(false);
						setSelectedAirline(null);
					}}
					onSave={handleSaveAirline}
					initialData={selectedAirline}
				/>
			)}

			{isOfficeModalOpen && (
				<AirlineOfficeForm
					onClose={() => {
						setIsOfficeModalOpen(false);
						setSelectedOffice(null);
					}}
					onSave={handleSaveOffice}
					initialData={selectedOffice}
					airlines={airlines}
				/>
			)}
		</div>
	);
}
