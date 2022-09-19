import { List, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useYupAccount, useUserNotifications } from '../../hooks/queries';
import NotificationItem from './NotificationItem';
import { LOCAL_STORAGE_KEYS } from '../../constants/enum';
import wallet from '../../eos/scatter/scatter.wallet';
import {
  apiSetNotificationSeenEth,
  apiSetNotificationSeenScatter
} from '../../apis';
import { ETH_NOTIFICATION_INTERVAL } from '../../constants/const';
import { ETH_LINK_NOTIFICATION_DATA } from '../../constants/data';
import { useAuth } from '../../contexts/AuthContext';
import { FlexBox } from '../styles';

function UserNotificationList() {
  const { username, userId, authInfo } = useAuth();
  const { isLoading: isFetchingProfile, data: profile } =
    useYupAccount(username);
  const { isLoading, data: notifications } = useUserNotifications(userId);
  const [showEthLinkNotification, setShowEthLinkNotification] = useState(false);

  useEffect(() => {
    if (!notifications?.length) return;

    const setNotificationsRead = async () => {
      const unseenNotifications = notifications.filter(
        (notification) => !notification.seen
      );

      if (!authInfo) {
        const { signature, eosname } = await wallet.scatter.getAuthToken();

        await Promise.all(
          unseenNotifications.map((notification) =>
            apiSetNotificationSeenScatter(notification._id, signature, eosname)
          )
        );
      } else {
        const { signature, address } = authInfo;

        await Promise.all(
          unseenNotifications.map((notification) =>
            apiSetNotificationSeenEth(notification._id, signature, address)
          )
        );
      }
    };

    setNotificationsRead();
  }, [notifications, authInfo]);

  useEffect(() => {
    if (!profile) return;
    if (profile.ethInfo?.address) return;

    const lastEthTimestamp = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ETH_NOTIFICATION_TIMESTAMP
    );
    const currentTimestamp = new Date().getTime();

    if (
      !lastEthTimestamp ||
      lastEthTimestamp < currentTimestamp - ETH_NOTIFICATION_INTERVAL
    ) {
      setShowEthLinkNotification(true);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.ETH_NOTIFICATION_TIMESTAMP,
        currentTimestamp
      );
    }
  }, [profile]);

  if (isLoading || isFetchingProfile) {
    return (
      <FlexBox flexDirection="column" gap={2}>
        {[...Array(5).keys()].map((idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            animation="wave"
            height={40}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </FlexBox>
    );
  }

  if (!notifications.length) {
    return <Typography>No notifications, you are all caught up!</Typography>;
  }

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse'
      }}
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} data={notification} />
      ))}
      {showEthLinkNotification && (
        <NotificationItem
          data={{
            ...ETH_LINK_NOTIFICATION_DATA,
            link: `/account/${username}?dialogOpen=true`,
            createdAt: new Date().getTime()
          }}
        />
      )}
    </List>
  );
}

export default UserNotificationList;
