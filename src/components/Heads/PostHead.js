import React from 'react';
import YupHead from '../YupHead';
import {
  getAbsolutePath,
  isWeb3Post,
  summarizeContent
} from '../../utils/helpers';
import { POST_TYPES } from '../../constants/enum';
import { COMPANY_NAME } from '../../constants/const';

export default function PostHead({ post }) {
  const { tag, web3Preview = {}, previewData = {} } = post;
  const isWeb3 = isWeb3Post(tag);
  const isMirror = tag === POST_TYPES.MIRROR;
  const isPoap = tag === POST_TYPES.POAP;
  const metaOg = {};
  const metaTwitter = {};
  const metaOther = {};
  let metaTitle;
  let metaDescription;
  let metaImage;
  const { attachments = [], linkPreview = [], title = '' } = web3Preview;
  const author =
    web3Preview.creator?.fullname ||
    web3Preview.meta?.displayName ||
    web3Preview.creator?.ens;

  metaImage = previewData.img;

  if (isMirror) {
    metaTitle = `${title} | ${COMPANY_NAME}`;
    metaDescription = `${title} written by ${author} | ${summarizeContent(
      web3Preview.content
    )}`;
  } else if (isPoap) {
    metaTitle = `${author} attended to ${title} | ${COMPANY_NAME}`;
    metaDescription = summarizeContent(web3Preview.content);
  } else if (isWeb3) {
    metaTitle = `Post by ${author} | ${COMPANY_NAME}`;
    metaDescription = summarizeContent(web3Preview.content);

    if (attachments.length > 0 && attachments[0].images?.length > 0) {
      [metaImage] = attachments[0].images;
    } else if (linkPreview.length > 0) {
      metaImage = linkPreview[0].img;
    }
  }

  metaOg.author = author;
  metaOg.url = getAbsolutePath(`/post/${post._id.postid}`);
  metaOg.site_name = COMPANY_NAME;
  metaOg.type = 'article';

  metaTwitter.card = 'summary_large_image';

  metaOther.author = author;

  metaImage ||= getAbsolutePath('/images/metaImages/main-meta.jpg');

  return (
    <YupHead
      title={metaTitle}
      description={metaDescription}
      image={metaImage}
      metaOg={metaOg}
      metaOther={metaOther}
      metaTwitter={metaTwitter}
    />
  );
}
