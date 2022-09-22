import { Popover } from "@mui/material";
import { styled } from "@mui/system";

export const StyledPopover = styled(Popover)(({ theme }) => `
    .MuiPopover-paper{
        background-color: ${theme.palette.M900};
        border: 1px solid ${theme.palette.M750};
        backdrop-filter: blur(20px);
        border-radius: 16px;        
    }
`)