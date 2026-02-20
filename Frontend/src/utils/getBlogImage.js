export const BLOG_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200&q=80&auto=format&fit=crop";

export function getBlogImage(imageUrl) {
  if (!imageUrl) return BLOG_FALLBACK_IMAGE;

  if (typeof imageUrl !== "string") return BLOG_FALLBACK_IMAGE;

  return imageUrl.trim() !== "" ? imageUrl : BLOG_FALLBACK_IMAGE;
}
