import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import numeral from 'numeral';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faThumbsDown as faThumbsDownSolid,
  faThumbsUp as faThumbsUpSolid
} from '@fortawesome/free-solid-svg-icons';
import { useTransition, useSpring, easings, animated } from '@react-spring/web';
import { levelColors } from '../../utils/colors';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { useAuth } from '../../contexts/AuthContext';
import useLongPress from '../../hooks/useLongPress';
import { FlexBox } from '../styles';

const styles = (theme) => ({
  greenArrow: {
    color: levelColors.second
  },
  redArrow: {
    color: levelColors.sixth
  },
  defaultArrow: {
    color: 'white',
    opacity: 0.6
  },
  catIcon: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    padding: '2px',
    [theme.breakpoints.down('md')]: {
      height: 25,
      width: 25,
      margin: 0
    }
  },
  postWeight: {
    userSelect: 'none',
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px'
    }
  },
  snackbar: {
    position: 'absolute',
    backgroundColor: '#ff5252',
    textColor: '#f0f0f0',
    width: '8%'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackbarContent: {
    width: 150
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  dialog: {
    width: '100%',
    marginLeft: 190,
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 190,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    }
  },
  mobileBtn: {
    [theme.breakpoints.down('lg')]: {
      width: '1.2em'
    }
  }
});

const StyledTooltip = memo(
  withStyles({
    popper: {
      marginTop: '-10px',
      marginLeft: '14px'
    }
  })((props) => (
    <Tooltip
      {...props}
      disableTouchListener
      classes={{
        popper: props.classes.popper
      }}
    />
  ))
);

StyledTooltip.propTypes = {
  classes: PropTypes.object.isRequired
};

function PostStats({ classes, isShown, quantile, theme, totalVoters, weight }) {
  return (
    <Typography
      variant="body2"
      className={classes.weight}
      sx={{
        color: !isShown ? levelColors[quantile] : theme.palette.M200,
        lineHeight: '100%'
      }}
      placeholder={weight}
    >
      {
        Math.round(
          totalVoters ** (1 + 0.001 * weight)
        ) /* this is a temporary calculation to be expanded on */
      }
    </Typography>
  );
}

PostStats.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  totalVoters: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  isShown: PropTypes.bool.isRequired
};

const postStatStyles = (theme) => ({
  weight: {},
  totalVoters: {
    color: theme.palette.M300,
    opacity: 0.3,
    marginLeft: '7px'
  }
});

const StyledPostStats = withTheme(withStyles(postStatStyles)(PostStats));

function VoteButton({
  isShown,
  type,
  totalVoters,
  handleOnclick,
  catWeight,
  rating = 0,
  isVoted,
  setLastClicked,
  lastClicked,
  web3Likes = 0,
  userInfluence = 1
}) {
  const { isLoggedIn } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [clickFinished, setClickFinished] = useState(false);

  const onLongPress = (isPressed) => {
    if (isLoggedIn) {
      setIsLongPress(isPressed);
    } else {
      openAuthModal({ noRedirect: true });
    }
  };
  const onClick = () => {
    if (isLoggedIn) {
      setIsClicked(true);
      setLastClicked();
      handleOnclick();
    } else {
      openAuthModal({ noRedirect: true });
    }
  };
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 200
  };
  const longPress = useLongPress(onLongPress, onClick, defaultOptions);
  // Resets clickFinished so animation plays again next time
  useEffect(() => {
    if (lastClicked !== type) {
      setIsClicked(false);
      setClickFinished(false);
    }
  }, [rating]);

  useEffect(() => {
    let interval;
    if (isLongPress && !isLoggedIn) {
      openAuthModal({ noRedirect: true });
    } else if (isLongPress) {
      setLastClicked();
      handleOnclick();
      interval = setInterval(() => {
        setLastClicked();
        handleOnclick();
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLongPress]);

  const ratingToMultiplier = () => {
    if (type === 'dislike') {
      if (rating === 1) {
        return 2;
      }
      return 1;
    }
    return rating - 2 > 0 ? rating - 2 : 1;
  };

  const formatWeight = (weight) => {
    const _weight = Math.round(weight);
    if (weight < 1000) {
      return numeral(_weight).format('0a');
    }
    if (weight < 10000) {
      return numeral(_weight).format('0.00a');
    }
    return numeral(_weight).format('0.0a');
  };

  // This resets mousedown for whatever reason...
  const transition = useTransition(
    isLongPress || isClicked ? [rating !== 0 && rating] : [],
    {
      config: { mass: 0.7, tension: 300, friction: 35, clamp: true },
      from: { top: 0, opacity: 0 },
      enter: { top: -15, opacity: 10 },
      leave: { top: -70, opacity: 0 },
      easings: easings.linear
    }
  );

  const AnimatedIcon = animated(FontAwesomeIcon);
  const { ...hover } = useSpring({
    config: { tension: 300, friction: 15, clamp: true },
    from: { width: '5px', height: '15px', transform: 'rotate(0deg)' },

    to: {
      width: isHovered ? '18px' : '15px',
      height: isHovered ? '18px' : '15px',
      transform:
        isHovered && isLoggedIn
          ? type === 'like'
            ? 'rotate(-15deg)'
            : 'rotate(15deg)'
          : 'rotate(0deg)'
    }
  });
  const { ...hardPressAnimation } = useSpring({
    config: { tension: 300, friction: 35 },
    loop: { reverse: isLongPress },
    from: { width: '16px', height: '16px' },

    to: {
      width: isLongPress ? '14px' : '16px',
      height: isLongPress ? '14px' : '16px'
    }
  });

  const { ...clickAnimation } = useSpring({
    config: { tension: 300, friction: 35 },
    from: { width: '16px', height: '16px' },
    to: {
      width: isVoted ? '14px' : '16px',
      height: isVoted ? '14px' : '16px'
    },
    reverse: clickFinished,
    onRest: () => {
      setClickFinished(true);
    }
  });
  const formattedWeight = totalVoters === 0 ? 0 : formatWeight(catWeight);
  const icon =
    type === 'like'
      ? (isHovered || isVoted) && isLoggedIn
        ? faThumbsUpSolid
        : faThumbsUp
      : (isHovered || isVoted) && isLoggedIn
      ? faThumbsDownSolid
      : faThumbsDown;
  return (
    <FlexBox alignItems="baseline" gap={0.5} position="relative">
      {transition((style, item) => (
        <animated.div
          className={styles.item}
          style={{
            left: 15,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style
          }}
        >
          {item && <Typography variant="label">x{item}</Typography>}
        </animated.div>
      ))}
      <div
        style={{ width: '18px', cursor: 'pointer' }}
        {...longPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLongPress || isVoted ? (
          <>
            {isLongPress ? (
              <AnimatedIcon style={{ ...hardPressAnimation }} icon={icon} />
            ) : (
              <AnimatedIcon style={{ ...clickAnimation }} icon={icon} />
            )}
          </>
        ) : (
          <AnimatedIcon style={{ ...hover }} icon={icon} />
        )}
      </div>
      <StyledPostStats
        totalVoters={
          totalVoters + web3Likes + rating * userInfluence.toFixed(0)
        }
        weight={Number(formattedWeight)}
        isShown={isShown}
      />
    </FlexBox>
  );
}

VoteButton.propTypes = {
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  rating: PropTypes.number.isRequired,
  postInfo: PropTypes.object.isRequired,
  isShown: PropTypes.bool,
  isVoted: PropTypes.bool,
  totalVoters: PropTypes.number.isRequired,
  type: PropTypes.string,
  handleOnclick: PropTypes.func,
  setLastClicked: PropTypes.func
};

export default withStyles(styles)(VoteButton);
