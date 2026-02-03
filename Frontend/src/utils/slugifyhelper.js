// slugify
export const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");


        // generate airline ID
export const generateAirlineId = (name = "") => {
  return (
    name
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "") +
    "_" +
    Math.floor(Math.random() * 1000)
  );
};


export const formatOfficeHours = (hours) => {
  if (!hours?.start || !hours?.end) return "";
  return `${hours.start} – ${hours.end}`;
};

export default slugify;