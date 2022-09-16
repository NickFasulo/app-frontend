import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Chip, Divider, Grid, Icon, Stack, styled, Typography } from "@mui/material"
import { faLink, faPlus, faFlag, faStar } from "@fortawesome/pro-regular-svg-icons"
import useAccount from "../../hooks/useAccount"
import ThumbnailIcon from "../CustomWeb3PostEmbed/ThumbnailIcon"
import VoteComp from "../VoteComp/VoteComp"
import { useFollowers, useYupAccount } from "../../hooks/queries"
import FollowUser from "../FollowUser"
import { useAuth } from "../../contexts/AuthContext"
import { CollectionPostMenu } from "../Collections"

const Card = styled(Grid)(({ theme }) => ({
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: `${theme.palette.M900}80`,
    backdropFilter: 'blur(24px)',
    boxShadow: `0px 0px 30px 0px ${theme.palette.M900}44, 0px 0px 0.75px  ${theme.palette.M900}66`,
    backgroundSize: 'cover',
    minWidth: 0,
    padding: "20px"
}));
const YupChip = styled(Chip)(({ theme }) => ({
    padding: '1rem 0.5rem'
}));
const YupLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.M400
}));

const StyledIcon = styled(Typography)(({ theme }) => ({
    width: '20px',
    height: '20px'
}))


const YupDivider = styled(Grid)(({ theme }) => ({
    borderWidth: "0 0 1px 0",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, transparent, #7E7C84, transparent) 1"
}))
function PostCard({ post }) {
    const { username } = useAuth();
    const account = useYupAccount(username)
    const id = account?._id

    // Just for showing the data, needs to replaced once backend has "Relevant people" functionality
    const followers = useFollowers(id);
    console.log({ id, account, followers })
    return (
        <Card>
            <Grid container direction='column' >
                <Grid item>
                    <Grid container direction='column' rowSpacing={4} >
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
                        {/* <Grid item sx={{
                            background: " linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)",
                            border: "1px solid",
                            borderImageSource: "linear-gradient(270deg, rgba(51, 50, 53, 0) 0%, #333235 49.48%, rgba(51, 50, 53, 0) 100%)"

                        }} /> */}
                        <Grid item>
                            <Grid container direction='column' spacing={3}>
                                <Grid item>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <YupChip avatar={<ThumbnailIcon protocol={post?.web3Preview?.protocol} />}
                                                label={<YupLabel variant='body2' >Source</YupLabel>} component="a" href={post.url} clickable />
                                        </Grid>
                                        {/* 
                                        <Grid item>
                                            <YupChip avatar={<FontAwesomeIcon style={{ width: '20px', height: '20px' }} icon={faLink} />}
                                                label={<YupLabel variant='body2' >Some other link</YupLabel>}
                                                component="a" href="#basic-chip" clickable />
                                        </Grid> */}

                                        <Grid item>
                                            <CollectionPostMenu
                                                noIcon
                                                accountName={account && account.name}
                                                postid={post?._id.postid}
                                            >
                                                <YupChip avatar={<FontAwesomeIcon style={{ width: '20px', height: '20px' }} icon={faPlus} />}
                                                    label={<YupLabel variant='body2' >Collect</YupLabel>}
                                                    component="a" clickable />
                                            </CollectionPostMenu>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <Grid item>
                                    <Grid container spacing={1}>

                                        <Grid item>
                                            <YupChip avatar={<FontAwesomeIcon style={{ width: '16px', height: '16px' }} icon={faFlag} />} label={<YupLabel variant='body2' >Report</YupLabel>} clickable />
                                        </Grid>
                                        <Grid item>
                                            <YupChip avatar={<FontAwesomeIcon style={{ width: '20px', height: '20px' }} icon={faStar} />} label={<YupLabel variant='body2' >Something else</YupLabel>} clickable />
                                        </Grid>
                                    </Grid>
                                </Grid> */}
                                {/* <Grid item>
                                    <YupChip
                                        avatar={
                                            <FontAwesomeIcon
                                                style={{ width: '20px', height: '20px' }}
                                                icon={faLink}
                                            />
                                        }
                                        label={
                                            <YupLabel variant="body2">Some other link</YupLabel>
                                        }
                                        component="a"
                                        href="#basic-chip"
                                        clickable
                                    />
                                </Grid> */}

                                <YupDivider item />
                                <Grid item>
                                    <Grid container direction='column' spacing={2}>
                                        <Grid item>
                                            <Typography variant='h6'>Relevant People</Typography>
                                        </Grid>
                                        <Grid item>
                                            {followers.map((follower) => <FollowUser noBorder userId={follower} />)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>


                        </Grid>


                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
}
export default PostCard;
