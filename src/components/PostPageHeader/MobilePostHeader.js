import { Grid, Typography } from "@mui/material";
import { useAppUtils } from "../../contexts/AppUtilsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useYupAccount } from "../../hooks/queries";
import VoteComp from "../VoteComp/VoteComp";

export default function MobilePostHeader({ post }) {
    const { isMobile } = useAppUtils()
    const { username } = useAuth();
    const account = useYupAccount(username);
    return (
        <Grid container direction='column' alignItems="center" columnSpacing={1}>
            <Grid container justifyContent="space-between">
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
        </Grid>)
}