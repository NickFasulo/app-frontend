import React, { memo } from 'react';
import { SkeletonItem } from './styles';

const SKELETON_COUNT = 6;

function ListSkeleton() {
  const indexArr = Array.from(Array(SKELETON_COUNT).keys());

  return (
    <>
      {indexArr.map((index) => (
        <SkeletonItem key={index} animation="wave" />
      ))}
    </>
  );
}

export default memo(ListSkeleton);
