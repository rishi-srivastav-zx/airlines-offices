// controllers/approval.js
export const approveData = async (req, res) => {
    try {
        // Example: get ID or data from request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }


        res.status(200).json({
            message: `Data with ID ${id} approved successfully.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
