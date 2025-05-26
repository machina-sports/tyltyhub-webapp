const getImageUrl = (article: any): string => {
  if (!article) return "";

  const imageAddress = process.env.NEXT_PUBLIC_IMAGE_CONTAINER_ADDRESS;

  if (article?.image_path) {
    return `${imageAddress}/${article.image_path}`;
  }

  const title = article.title || "Article";
  return `https://placehold.co/1200x600/2A9D8F/FFFFFF?text=${encodeURIComponent(title)}`;
};

export default getImageUrl;
