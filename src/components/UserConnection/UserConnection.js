import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { ConnectionAvatar, FlexBox } from '../styles';
import { useSideBar } from '../SideBar/SideBarContext';

const UserConnection = ({ user }) => {
  const { closeSearch } = useSideBar();
  return (
    <Link
      key={user.userId}
      href={`/account/${user.username || user.userId}`}
      style={{ textDecoration: 'none' }}
    >
      <FlexBox my={2} alignItems="center" sx={{ cursor: 'pointer' }}
      onClick={() => closeSearch()}>
        <ConnectionAvatar src={user.avatar} alt="avatar">
          {user.username?.toUpperCase() ?? 'AN'}
        </ConnectionAvatar>
        <Box ml={2}>
          <Typography noWrap variant="body1">
            <strong>{user.fullname || user.username || user.userId }</strong>
          </Typography>
          <Typography noWrap variant="body2">
            @{user.username || user.userId}
          </Typography>
        </Box>
      </FlexBox>
    </Link>
  );
};

export default UserConnection;
