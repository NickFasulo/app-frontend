import Colors, { Gradients } from './colors'

export const darkPalette = {
  palette: {
    type: 'dark',
    common: {
      first: Colors.W1,
      second: Colors.W2,
      third: Colors.W3,
      fourth: Colors.W4,
      fifth: Colors.W5
    },
    alt: {
      first: Colors.B1,
      second: Colors.B2,
      third: Colors.B3,
      fourth: Colors.B4,
      fifth: Colors.B5
    },
    primary: {
      main: Colors.W1,
      gradient: Gradients.background.dark
    },
    secondary: {
      main: Colors.Green
    },
    text: {
      primary: Colors.W1,
      secondary: Colors.W2
    },
    shadow: {
      first: '#000000',
      second: Colors.B1
    },
    action: {
      hover: Colors.B3
    }
  }
}

export const lightPalette = {
  palette: {
    type: 'light',
    common: {
      first: Colors.B1,
      second: Colors.B2,
      third: Colors.B3,
      fourth: Colors.B4,
      fifth: Colors.B5
    },
    alt: {
      first: Colors.W1,
      second: Colors.W2,
      third: Colors.W3,
      fourth: Colors.W4,
      fifth: Colors.W5
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
      first: Colors.W6,
      second: Colors.W5
    },
    action: {
      hover: Colors.W3
    }
  }
}

export const theme = ({ palette }) => {
  return { overrides: {
    body: {
      backgroundColor: palette.common.fifth
    },
    MuiButton: {
      root: {
        textTransform: 'capitalize',
        borderRadius: '0.65rem'
      },
      outlined: {
        borderRadius: '0.65rem',
        borderWidth: '0.15rem',
        borderColor: palette.common.second,
        color: palette.common.second,
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
        backgroundColor: palette.alt.third,
        color: palette.common.second,
        boxShadow: 'none',
        lineHeight: '23px',
        letterSpacing: '1%',
        fontWeight: '500',
          '&:hover': {
          backgroundColor: palette.alt.third,
          boxShadow: `0px 0px 0px 2px ${palette.alt.third}`
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
        boxShadow: `8px 8px 30px 0 ${palette.common.first}04, -8px -8px 15px 0 ${palette.common.first}02, inset 8px 8px 30px 0 ${palette.common.first}04, inset -8px -8px 15px 0 ${palette.common.first}02`,
        '&:hover': {
          boxShadow:
            '-8px -8px 30px 0 rgba(0, 0, 0, 0.04), 8px 8px 15px 0 rgba(170, 170, 170, 0.02), inset -8px -8px 30px 0 rgba(0, 0, 0, 0.04), inset 8px 8px 15px 0 rgba(170, 170, 170, 0.02)',
          backgroundColor: 'inherit'
        }
      }
    },
    MuiIcon: {
      root: {
        color: palette.common.first
      }
    },
    MuiDialogContent: {
      root: {
        color: palette.common.first
      }
    },
    MuiAvatar: {
      colorDefault: {
        color: palette.common.first
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
        // backgroundColor: palette.common.fifth,
        fontSize: '12px'
      }
    },
    MuiListItemIcon: {
      root: {
        color: palette.common.third,
        overflow: 'visible',
        textAlign: 'center',
        justifyContent: 'center'
      }
    },
    MuiListSubheader: {
      root: {
        color: palette.common.second
      }
    },
    MuiBadge: {
      colorSecondary: {
        backgroundColor: palette.common.second
      }
    },
    MuiInputLabel: {
      shrink: {
        color: `${palette.common.first}50`
      },
      outlined: {
        transform: 'translate(15%, 85%) scale(1)'
      },
      formControl: {
      }
    },
    MuiMenu: {
      paper: {
        backgroundColor: `${palette.alt.second}CC`,
        backdropFilter: 'blur(20px)'
      }
    },
    MuiMenuItem: {
      dense: {
        color: palette.common.first
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '0.625rem',
        color: palette.common.first
      },
      notchedOutline: {
        borderColor: palette.common.fifth,
        color: palette.common.first
      },
      input: {
        padding: '10px 14px'
      }
    },
    MuiTextField: {
      root: {
        color: palette.common.first
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
        background: palette.alt.second
      },
      colorPrimary: {
        backgroundColor: palette.alt.second
      }
    },
    MuiDrawer: {
      paper: {
        background: palette.alt.second
      }
    },
    MuiDialog: {
      paper: {
        backgroundColor: `${palette.alt.second}99`,
        borderRadius: '25px',
        backdropFilter: 'blur(45px)',
        boxShadow: `0px 0px 20px 6px ${palette.common.first}05`,
        width: '80%',
        padding: '1rem 0.5rem',
        maxWidth: '500px'
      },
      backdrop: {
        backdropFilter: 'blur(3px)'
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: palette.alt.third
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
        fill: `${palette.alt.first} !important`
      }
    },
    MuiStepLabel: {
      label: {
        color: `${palette.common.first} !important`
      }
    },
    MuiBackdrop: {
      root: {
        backgroundColor: `${palette.common.third}40`,
        backdropFilter: 'blur(10px)'
      }
    },
    MuiFab: {
      extended: {
        textTransform: 'capitalize',
        backgroundColor: palette.alt.third,
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
        background: `${palette.alt.fourth}AA`,
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${palette.alt.second}, transparent)`
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
    fonStyle: 'normal',
    h1: {
      fontWeight: 600,
      fontSize: '3.815rem',
      lineHeight: '105%',
      color: `${palette.common.first}EE`
    },
    h2: {
      fontWeight: 700,
      fontSize: '3.052rem',
      lineHeight: '105%',
      color: `${palette.common.first}EE`
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.441rem',
      lineHeight: '105%',
      color: `${palette.common.second}EE`
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.953rem',
      lineHeight: '105%',
      color: `${palette.common.third}EE`
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.562rem',
      lineHeight: '105%',
      color: `${palette.common.third}EE`
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.339rem',
      lineHeight: '105%',
      color: `${palette.common.third}EE`
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1.25rem',
      lineHeight: '105%',
      color: `${palette.common.third}DD`
    },
    subtitle2: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '105%',
      color: `${palette.common.third}DD`
    },
    body1: {
      fontWeight: 800,
      fontSize: '0.8rem',
      lineHeight: '105%',
      color: `${palette.common.third}EE`
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.8rem',
      lineHeight: '105%',
      color: `${palette.common.first}DE`
    },
    caption: {
      fontStyle: '600',
      fontSize: '1rem',
      color: `${palette.common.third}DE`
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
