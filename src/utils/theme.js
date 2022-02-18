import Colors, { Gradients } from './colors'

export const darkPalette = {
  palette: {
    type: 'dark',
    M50: Colors.M50,
    M100: Colors.M100,
    M150: Colors.M150,
    M200: Colors.M200,
    M300: Colors.M300,
    M400: Colors.M400,
    M500: Colors.M500,
    M600: Colors.M600,
    M700: Colors.M700,
    M750: Colors.M750,
    M800: Colors.M800,
    M900: Colors.M900,
    P50: Colors.P50,
    P100: Colors.P100,
    P150: Colors.P150,
    P200: Colors.P200,
    P300: Colors.P300,
    P400: Colors.P400,
    P500: Colors.P500,
    P600: Colors.P600,
    P700: Colors.P700,
    P800: Colors.P800,
    P850: Colors.P850,
    P900: Colors.P900
  },
  text: {
    primary: Colors.W300,
    secondary: Colors.W100
  },
  shadow: {
    first: '#000000',
    second: Colors.B1
  },
  action: {
    hover: Colors.B3
  }
}

export const lightPalette = {
  palette: {
    type: 'light',
    M50: Colors.M900,
    M100: Colors.M850,
    M150: Colors.M800,
    M200: Colors.M750,
    M300: Colors.M700,
    M400: Colors.M600,
    M500: Colors.M500,
    M600: Colors.M400,
    M700: Colors.M300,
    M750: Colors.M200,
    M800: Colors.M150,
    M850: Colors.M100,
    M900: Colors.M50,
    P50: Colors.P900,
    P100: Colors.P850,
    P150: Colors.P800,
    P200: Colors.P750,
    P300: Colors.P700,
    P400: Colors.P600,
    P500: Colors.P500,
    P600: Colors.P400,
    P700: Colors.P300,
    P750: Colors.P200,
    P800: Colors.P200,
    P900: Colors.P150,
    P900: Colors.P100,
    P900: Colors.P50,
  },
    primary: {
      main: Colors.B2,
      gradient: Gradients.background.light
    },
    secondary: {
      main: Colors.Black
    },
    third: {
      main: Colors.Green
    },
    text: {
      primary: Colors.Black,
      secondary: Colors.DarkGrey
    },
    shadow: {
      first: Colors.W400,
      second: Colors.W300
    },
    action: {
      hover: Colors.W150
    }
  }
}

export const theme = ({ palette }) => {
  return { overrides: {
    body: {
      backgroundColor: palette.M500
    },
    MuiButton: {
      root: {
        textTransform: 'capitalize',
        borderRadius: '0.65rem'
      },
      outlined: {
        borderRadius: '0.65rem',
        borderWidth: '0.15rem',
        borderColor: palette.M200,
        color: palette.M200,
        lineHeight: '23px',
        letterSpacing: '1%',
        fontWeight: '500',
          '&:hover': {
          backgroundColor: 'inherit'
        }
      },
      contained: {
        borderRadius: '0.55rem',
        border: 'none',
        backgroundColor: palette.M700,
        color: palette.M200,
        boxShadow: 'none',
        lineHeight: '23px',
        letterSpacing: '1%',
        fontWeight: '500',
          '&:hover': {
          backgroundColor: palette.M700,
          boxShadow: `0px 0px 0px 2px ${palette.M700}`
        },
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiIconButton: {
      root: {
        borderRadius: '100px',
        border: 'none',
        boxShadow: `8px 8px 30px 0 ${palette.M100}04, -8px -8px 15px 0 ${palette.M100}02, inset 8px 8px 30px 0 ${palette.M100}04, inset -8px -8px 15px 0 ${palette.M100}02`,
        '&:hover': {
          boxShadow:
            '-8px -8px 30px 0 rgba(0, 0, 0, 0.04), 8px 8px 15px 0 rgba(170, 170, 170, 0.02), inset -8px -8px 30px 0 rgba(0, 0, 0, 0.04), inset 8px 8px 15px 0 rgba(170, 170, 170, 0.02)',
          backgroundColor: 'inherit'
        }
      }
    },
    MuiIcon: {
      root: {
        color: palette.M100
      }
    },
    MuiAvatar: {
      colorDefault: {
        color: palette.M100
      }
    },
    MuiTab: {
      root: {
        textTransform: 'capitalize',
        fontSize: '1.2rem'
      }
    },
    MuiTooltip: {
      tooltip: {
        color: '#fff',
        // backgroundColor: palette.M500,
        fontSize: '12px'
      }
    },
    MuiListItemIcon: {
      root: {
        color: palette.M300,
        overflow: 'visible',
        textAlign: 'center',
        justifyContent: 'center'
      }
    },
    MuiListSubheader: {
      root: {
        color: palette.M200
      }
    },
    MuiBadge: {
      colorSecondary: {
        backgroundColor: palette.M200
      }
    },
    MuiInputLabel: {
      shrink: {
        color: `${palette.M100}50`
      },
      outlined: {
        transform: 'translate(15%, 85%) scale(1)'
      },
      formControl: {
      }
    },
    MuiMenu: {
      paper: {
        backgroundColor: `${palette.M800}CC`,
        backdropFilter: 'blur(20px)'
      }
    },
    MuiMenuItem: {
      dense: {
        color: palette.M100
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '0.625rem',
        color: palette.M100
      },
      notchedOutline: {
        borderColor: palette.M500,
        color: palette.M100
      },
      input: {
        padding: '10px 14px'
      }
    },
    MuiTextField: {
      root: {
        color: palette.M100
      }
    },
    MuiSelect: {
      icon: {
        color: Colors.White
      }
    },
    MuiDialogActions: {
      root: {
        padding: '8px 24px'
      }
    },
    MuiAppBar: {
      root: {
        background: palette.M800
      },
      colorPrimary: {
        backgroundColor: palette.M800
      }
    },
    MuiDrawer: {
      paper: {
        background: palette.M800
      }
    },
    MuiDialog: {
      paper: {
        backgroundColor: `${palette.M800}cc`,
        borderRadius: '25px',
        backdropFilter: 'blur(45px)',
        boxShadow: `0px 0px 20px 6px ${palette.M100}05`,
        width: '80%',
        padding: '1rem 0.5rem',
        maxWidth: '500px'
      },
      backdrop: {
        backdropFilter: 'blur(3px)'
      }
    },
    MuiDialogContent: {
      root: {
        color: palette.M100
      }
    },
    MuiDialogTitle: {
      root: {
        fontWeight: 100,
        fontSize: '2.441rem',
        lineHeight: '105%',
        color: `${palette.M200}EE`
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: palette.M700
      },
      rounded: {
        borderRadius: '0.65rem'
      }
    },
    MuiStepIcon: {
      root: {
        color: `${Colors.YupGreen} !important`
      },
      text: {
        fill: `${palette.M900} !important`
      }
    },
    MuiStepLabel: {
      label: {
        color: `${palette.M100} !important`
      }
    },
    MuiBackdrop: {
      root: {
        backgroundColor: `${palette.M300}40`,
        backdropFilter: 'blur(10px)'
      }
    },
    MuiFab: {
      extended: {
        textTransform: 'capitalize',
        backgroundColor: palette.M700,
        borderRadius: '0.65rem'
      }
    },
    MuiTouchRipple: {
      root: {
        opacity: 0.2
      }
    },
    MuiSkeleton: {
      wave: {
        background: `${palette.M600}AA`,
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${palette.M800}, transparent)`
        }
      }
    },
    MuiChip: {
      root: {
        padding: '0 0.5rem'
      },
      icon: {
        height: 'minContent',
        color: palette.text.secondary,
        fontSize: 'small !important',
        opacity: 0.4
      }
    }
  },
  typography: {
    fontFamily: [
      'Gilroy',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(','),
    fontStyle: 'normal',
    h1: {
      fontWeight: 600,
      fontSize: '3.815rem',
      lineHeight: '100%',
      color: `${palette.M100}EE`
    },
    h2: {
      fontWeight: 700,
      fontSize: '3.052rem',
      lineHeight: '100%',
      color: `${palette.M100}EE`
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.441rem',
      lineHeight: '100%',
      color: `${palette.M200}EE`
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.953rem',
      lineHeight: '100%',
      color: `${palette.M300}EE`
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.562rem',
      lineHeight: '105%',
      color: `${palette.M300}EE`
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.339rem',
      lineHeight: '105%',
      color: `${palette.M300}EE`
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1.25rem',
      lineHeight: '100%',
      color: `${palette.M300}DD`
    },
    subtitle2: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '100%',
      color: `${palette.M300}DD`
    },
    body1: {
      fontWeight: 800,
      fontSize: '0.875rem',
      lineHeight: '110%',
      color: `${palette.M300}EE`
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '110%',
      color: `${palette.M100}DE`
    },
    caption: {
      fontStyle: '600',
      fontSize: '1rem',
      color: `${palette.M300}DE`
    },
    tooltip: {
      fontSize: '0.75rem',
      fontWeight: '200'
    },
    colorError: {
      color: Colors.Red
    }
  },
  props: {
    MuiWithWidth: {
      initialWidth: 'lg'
    }
  }
}
}
