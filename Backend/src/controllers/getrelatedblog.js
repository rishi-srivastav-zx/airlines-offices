export const getRelatedBlogs = async (req, res) => {
    try {
        const { slug } = req.params;

        const currentBlog = await Blog.findOne({ slug });

        if (!currentBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        // If no tags → return empty (frontend hide karega)
        if (!currentBlog.tags || currentBlog.tags.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }

        const relatedBlogs = await Blog.find({
            _id: { $ne: currentBlog._id },
            status: "published",
            tags: { $in: currentBlog.tags },
        })
            .limit(5)
            .select("title slug featuredImage createdAt");

        res.status(200).json({
            success: true,
            data: relatedBlogs,
        });
    } catch (error) {
        console.error("Related blogs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch related blogs",
        });
    }
};
