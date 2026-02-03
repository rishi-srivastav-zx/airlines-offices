

export const updateOffice = async (req, res) => {
    try {
        const { slug } = req.params;

        const office = await office.findOne({ slug });
        if (!office) {
            return res
                .status(404)
                .json({ success: false, message: "Office not found" });
        }

        Object.assign(office, req.body);
        await office.save();

        res.json({ success: true, data: office });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
