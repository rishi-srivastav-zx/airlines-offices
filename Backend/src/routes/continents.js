router.post("/bulk", async (req, res) => {
	try {
		const result = await Continent.insertMany(req.body);
		res.json({ success: true, count: result.length });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});
