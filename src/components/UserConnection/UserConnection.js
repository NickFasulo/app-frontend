import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { ConnectionAvatar, FlexBox } from '../styles';
import { useSideBar } from '../SideBar/SideBarContext';

const UserConnection = ({ user }) => {
  const { closeSearch } = useSideBar();
  return (
    <Link
      key={user._id}
      href={`/account/${user.username || user._id}`}
      style={{ textDecoration: 'none' }}
    >
      <FlexBox my={2} alignItems="center" sx={{ cursor: 'pointer' }}
      onClick={() => closeSearch()}>
        <ConnectionAvatar src={user.avatar} alt="avatar">
          {user.username[0].toUpperCase()}
        </ConnectionAvatar>
        <Box ml={2}>
          <Typography noWrap variant="body1">
            <strong>{user.fullname || user._id || user.username}</strong>
          </Typography>
          <Typography noWrap variant="body2">
            @{user.username || user.eosname}
          </Typography>
        </Box>
      </FlexBox>
    </Link>
  );
};

export default UserConnection;
