import { Avatar, Chip, Grid, Stack, styled } from "@mui/material"
import useAccount from "../../hooks/useAccount"
import ThumbnailIcon from "../CustomWeb3PostEmbed/ThumbnailIcon"
import VoteComp from "../VoteComp/VoteComp"

const Card = styled(Grid)(({ theme }) => ({
    background: theme.palette.M900,
    border: `1px solid ${theme.palette.M750}`,
    borderRadius: "16px",
    padding: '20px'
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
                                        <Chip avatar={<ThumbnailIcon protocol={post?.web3Preview?.protocol} />}
                                            label="Chip Filled" component="a" href="#basic-chip" clickable />
                                        <Chip label="Chip Filled" component="a" href="#basic-chip" clickable />
                                        <Chip label="Chip Filled" component="a" href="#basic-chip" clickable />
                                    </Stack>
                                </Grid>
                                <Grid item><Stack direction="row" spacing={1}>
                                    <Chip label="Chip Filled" />
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