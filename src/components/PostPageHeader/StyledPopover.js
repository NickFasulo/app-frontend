import { Popover } from '@mui/material';
import { styled } from '@mui/system';

export const StyledPopover = styled(Popover)(
  ({ theme }) => `
    .MuiPopover-paper{
        background-color: transparent;
        border: none;
        backdrop-filter: none;
        border-radius: 16px;        
    }
`
);
