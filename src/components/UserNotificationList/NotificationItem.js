import NotificationMedia from './NotificationMedia';
import { ListItemAvatar, ListItemText, Fade } from '@mui/material';
import NotifText from '../Notification/NotifText';
import { formatDate, isUrl } from '../../utils/helpers';
import { NotificationItemRoot } from './styles';
import Link from '../Link';

const NotificationItem = ({ data }) => {
  const {
    image,
    createdAt,
    invoker,
    recipient,
    post,
    action,
    link: notificationLink
  } = data;
  const invokerName = invoker?.username || invoker;

  const link = post
    ? isUrl(post.url ?? post.caption)
      ? post.url ?? post.caption
      : `/post/${post._id.postid}`
    : action === 'follow'
    ? `/account/${invoker?.eosname || invoker}`
    : notificationLink;

  return (
    <Fade in timeout={100}>
      <NotificationItemRoot
        component={isUrl(link) ? 'a' : link ? Link : 'div'}
        target={isUrl(link) && '_blank'}
        href={link}
      >
        <ListItemAvatar>
          <NotificationMedia url={image} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <NotifText
              invoker={invokerName === recipient ? 'You' : invokerName}
              notif={data}
            />
          }
          secondary={formatDate(createdAt)}
          secondaryTypographyProps={{
            sx: {
              color: (theme) => theme.palette.M400
            }
          }}
          sx={{ ml: 2 }}
        />
      </NotificationItemRoot>
    </Fade>
  );
};

export default NotificationItem;
