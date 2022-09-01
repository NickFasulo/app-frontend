import { FEED_CATEGORIES } from '../constants/data';
import { appMetaImagesUrl } from '../config';
import ImgFeedDailyHits from '../../public/images/feeds/dailyhitscover.png';

export const getFeedCategory = (categoryName) =>
  Object.values(FEED_CATEGORIES).find((item) => item.id === categoryName);
export const getFeedCategoryWithDefault = (categoryName) =>
  getFeedCategory(categoryName) || {
    id: categoryName,
    title: categoryName,
    image: ImgFeedDailyHits,
    metaTitle: 'Yup • Social Network for Curators',
    description: 'Yup • Social Layer for the Internet'
  };

export const getFeedCategoryMetaImage = (categoryName) => {
  const imageFileName =
    categoryName === FEED_CATEGORIES.MIRROR.name
      ? 'mirror-meta.jpg'
      : 'main-meta.jpg';

  return `${appMetaImagesUrl}/${imageFileName}`;
};
