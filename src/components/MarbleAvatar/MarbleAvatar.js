import { useTheme } from "@emotion/react";
import Avatar from "boring-avatars";
import { Brand } from '../../utils/colors';

      
const scoreToColor = (score) => {
    return score >= 80 && score <= 100
      ? Brand.mint
      : score >= 60 && score <= 80
      ? Other.moss
      : score >= 40 && score <= 60
      ? Brand.yellow
      : score >= 20 && score <= 40
      ? Brand.orange
      : Brand.red;
  };

export const MarbleAvatar = (name, socialLevelColor) => {
    const theme = useTheme()
   return <Avatar
         style={{
                    border: `solid 2px ${socialLevelColor}`
                }}
        size={36}
        name={name}
        variant="marble"
        colors={[theme.palette.M200, theme.palette.M600, theme.palette.M700, theme.palette.M900]}
      />

}