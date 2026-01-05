import { CheckCircle } from "lucide-react";


export default function InquiryTable({ title, columns }) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">{title}</h2>

            <div className="grid md:grid-cols-3 gap-4">
                {columns.map((column, colIdx) => (
                    <ul key={colIdx} className="space-y-3">
                        {column.map((item, idx) => (
                            <li
                                key={idx}
                                className="flex items-start gap-3 text-sm text-gray-700"
                            >
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
