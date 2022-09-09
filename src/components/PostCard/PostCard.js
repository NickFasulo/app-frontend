import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Chip, Grid, Icon, Stack, styled } from "@mui/material"
import { faLink, faPlus, faFlag, faStar } from "@fortawesome/pro-regular-svg-icons"
import useAccount from "../../hooks/useAccount"
import ThumbnailIcon from "../CustomWeb3PostEmbed/ThumbnailIcon"
import VoteComp from "../VoteComp/VoteComp"

const Card = styled(Grid)(({ theme }) => ({
    background: theme.palette.M900,
    border: `1px solid ${theme.palette.M750}`,
    borderRadius: "16px",
    padding: '20px'
}))
const YupChip = styled(Chip)(({ theme }) => ({
    padding: '1rem 0.5rem'
}))

function PostCard({ post }) {
    const { account } = useAccount()
    console.log({ account })
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

                        <Grid item>
                            <Grid container direction='column' rowSpacing={1}  >
                                <Grid item>
                                    <Stack direction="row" spacing={1}>
                                        <YupChip avatar={<ThumbnailIcon protocol={post?.web3Preview?.protocol} />}
                                            label="Source" component="a" href={post.url} clickable />
                                        <YupChip avatar={<FontAwesomeIcon icon={faLink} />} label="Some other link" component="a" href="#basic-chip" clickable />

                                        <YupChip avatar={<FontAwesomeIcon icon={faPlus} />} label="Collect" component="a" href="#basic-chip" clickable />
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <Stack direction="row" spacing={1}>
                                        <YupChip avatar={<FontAwesomeIcon icon={faFlag} />} label="Report" clickable />
                                        <YupChip avatar={<FontAwesomeIcon icon={faStar} />} label="Something else" clickable />
                                    </Stack>
                                </Grid>

                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </Card>
    )
}
export default PostCard