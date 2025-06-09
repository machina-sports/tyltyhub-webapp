const getImageUrl = (article: any): string => {
  if (!article) return "";
  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;
  if (article?.image_path) {
    const originalUrl = `${imageAddress}/${article.image_path}`;
    return `/api/images?url=${encodeURIComponent(originalUrl)}`;
  }
  const title = article.title || "Article";
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

export default getImageUrl;
