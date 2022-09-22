import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, IconButton, Popover, Typography } from "@mui/material";
import {
    faChevronUp
} from '@fortawesome/pro-regular-svg-icons';
import { useState } from "react";
import { useAppUtils } from "../../contexts/AppUtilsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useYupAccount } from "../../hooks/queries";
import PostChips from "../PostChips/PostChips";
import VoteComp from "../VoteComp/VoteComp";
import PostCard from "../PostCard/PostCard";
import { StyledPopover } from "./StyledPopover";

export default function MobilePostHeader({ post, scrolled }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const { isMobile } = useAppUtils()
    const { username } = useAuth();
    const account = useYupAccount(username);
    return (
        <Grid container direction='column' rowSpacing={2} >
            <Grid item>
                <Grid container justifyContent="space-between" alignItems='center'>
                    <Grid item>
                        <Grid container alignItems="center" columnSpacing={1}>
                            <img
                                src={`/images/icons/${post?.web3Preview?.protocol}.svg`}
                                height={isMobile ? '32 ' : '32'}
                                alt={`${post?.web3Preview?.protocol} post`}
                            />
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    color="M100"
                                    sx={{ letterSpacing: '0.02em' }}
                                >
                                    post by {post.author}
                                </Typography>
                            </Grid>
                            {scrolled && (
                                <Grid item >
                                    <IconButton onClick={handleClick}>

                                        <FontAwesomeIcon icon={faChevronUp} />
                                    </IconButton>
                                </Grid>)}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <VoteComp
                            postInfo={{ post }}
                            url={post?.url}
                            account={account}
                            postid={post?._id.postid}
                            quantiles={post?.quantiles}
                            rating={post?.rating}
                            weights={post?.weights}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {!scrolled && (
                <Grid item>
                    <PostChips post={post} />
                </Grid>)}
            <StyledPopover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <PostCard post={post} withoutVotecomp />
            </StyledPopover>

        </Grid>)
}