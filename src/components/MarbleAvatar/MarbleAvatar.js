import { useTheme } from "@emotion/react";
import { Grid, Typography, Avatar } from "@mui/material";
import BoringAvatar from "boring-avatars";
import withSuspense from "../../hoc/withSuspense";
import { useScore } from "../../hooks/queries";
import { Brand, Other } from '../../utils/colors';


const scoreToColor = (score) => score >= 80 && score <= 100
    ? Brand.mint
    : score >= 60 && score <= 80
        ? Other.moss
        : score >= 40 && score <= 60
            ? Brand.yellow
            : score >= 20 && score <= 40
                ? Brand.orange
                : Brand.red;

function MarbleAvatar(name, isEns) {
    const { data } = useScore(name.name)
    const socialLevelColor = scoreToColor(data.yup_score)
    console.log(data, "Nameeeeeee")
    const theme = useTheme()
    return (
        <Grid container justifyContent='center' alignItems='center'
            style={{
                border: `solid 2px ${socialLevelColor}`,
                borderRadius: '25px'
            }}>
            {isEns && (<Avatar sx={{ position: 'absolute', background: 'none' }}>{name.name[0].toUpperCase()}</Avatar>)}
            <BoringAvatar
                size={36}
                name={name.name}
                variant="marble"
                colors={[theme.palette.M700, theme.palette.M300, theme.palette.M900, theme.palette.M800, theme.palette.M300]}
            />
        </Grid>)

}
export default withSuspense()(MarbleAvatar);