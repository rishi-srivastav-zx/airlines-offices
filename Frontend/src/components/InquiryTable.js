const OfficeInquiryList = ({ data = {} }) => {
    const { title, city, inquiries = [] } = data;

    return (
        <div className="max-w-6xl mx-auto sm:px-4 py-6">
            {/* Title */}
            {/* <h2 className="text-orange-500 font-semibold text-lg mb-2">
                {title}
            </h2> */}

            <h3 className="sm:text-xl sm:text-left text-center text-lg font-medium text-gray-800 mb-6">
                The Qatar Airways Office in {city} Handles the Following
                Inquiries
            </h3>

            {/* Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
                {inquiries.length > 0 ? (
                    inquiries.map((row, index) => (
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
                    ))
                ) : (
                    <p className="text-center py-6 text-gray-500">
                        No inquiries available
                    </p>
                )}
            </div>
        </div>
    );
};

export default OfficeInquiryList;
