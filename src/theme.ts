import { createMuiTheme } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    overrides: {
        MuiCard: {
            root: {
                backgroundColor: 'transparent',
                borderColor: grey[400],
                borderWidth: 2,
            },
        },
        MuiCardActions: {
            root: {
                display: 'flex',
                justifyContent: 'flex-end',
            },
        },
        MuiFormControl: {
            root: {
                minWidth: 120,
            },
        },
        MuiInputBase: {
            root: {
                maxHeight: '2rem',
            },
        },
        MuiTab: {
            root: {
                textTransform: 'none',
            },
        },
    },
    palette: {
        background: {
            default: '#fff',
        },
        error: {
            main: red.A400,
        },
        primary: {
            main: '#553cd6',
        },
        secondary: {
            main: '#585858',
        },
        text: {
            secondary: grey[500],
        },
    },
});

export default theme;
