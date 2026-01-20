const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // spaces → dashes
        .replace(/-+/g, "-"); // remove duplicate dashes

export default slugify;