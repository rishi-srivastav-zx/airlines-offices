const OfficeInquiryList = ({ airlineName = "Airline", city = "" }) => {
  return (
    <div className="max-w-6xl mx-auto sm:px-4 py-6">
      <h3 className="sm:text-xl sm:text-left text-center text-lg font-medium text-gray-800 mb-6">
        The {airlineName} Office in {city} Handles the Following Inquiries
      </h3>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        {STATIC_INQUIRIES.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-3 text-gray-700
            ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
          >
            {row.map((item, i) => (
              <p key={i} className="text-sm md:text-base">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficeInquiryList;



const STATIC_INQUIRIES = [
  ["Flight Ticket Booking", "Ok to Board", "Flight Ticket Cancellation"],
  ["Airport Lounges", "Visa Services", "Baggage Allowance, Online Check-in"],
  ["Airport Transfers", "Meet and Greet", "Duty-Free Allowance"],
  ["Immigration Services", "Business Class", "In-Flight Meals"],
  ["Missing Luggage", "Airport Lounges", "Flight/Visa Info"],
  ["Miles", "Economy Class", "Delayed Flights"],
  ["Airport Facilities", "In-Flight Entertainment", "Airport Wifi"],
  ["Valet Parking", "Visa on Arrival", "Flight Wifi"],
];
