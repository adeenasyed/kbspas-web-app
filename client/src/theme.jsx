import { createTheme } from '@mui/material/styles';

const customPalette = {
    accent: '#B67C76',
    hover: '#F8F2F2',
    displayText: '#2A1D15',
    formText: '#666666',
    formText2: '#646361',
    admin: '#03A9F4',
    err: '#E30707',
    bg: '#F9F7F2'
};

const customBorderRadius = '10px';

const customShadow = '0px 4px 30px rgba(0, 0, 0, 0.1)';

const customFont = 'Nunito';

const theme = createTheme({
    palette: customPalette,
    customBorderRadius: customBorderRadius,
    typography: {
        fontFamily: customFont,
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: customBorderRadius,
                    boxShadow: customShadow,
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '100%',
                    '& .MuiInput-underline:after': {
                        borderBottomColor: customPalette.accent,
                    },
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: customBorderRadius,
                    '&.Mui-focused fieldset': {
                        borderColor: customPalette.accent + '!important',
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: customPalette.accent,
                    }
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    borderRadius: customBorderRadius,
                    boxShadow: customShadow,
                }
            }
        },
        MuiPickersCalendarHeader: {
            styleOverrides: {
                label: {
                    fontFamily: customFont,
                }
            }
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekContainer: {
                    button: {
                        fontFamily: customFont,
                    }
                }
            }
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: customPalette.accent + '!important',
                        color: 'white',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: customPalette.accent,
                    },
                    '&:not(.Mui-selected):hover': {
                        backgroundColor: customPalette.hover,
                    },
                    '&:active, &:focus': {
                        backgroundColor: customPalette.hover,
                    }
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: customBorderRadius,
                    borderColor: '#a3686a',
                    color: '#a3686a',
                    '&.Mui-selected': {
                        borderColor: customPalette.accent,
                        backgroundColor: customPalette.accent,
                        color: 'white',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: customPalette.accent,
                    },
                    '&:hover': {
                        backgroundColor: customPalette.hover,
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: customBorderRadius,
                    height: '40px'
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: customPalette.admin,
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: customPalette.admin,
                    }
                }
            }
        }
    }
});

export default theme;