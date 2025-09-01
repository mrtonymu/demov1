// MUI Imports
import type { Theme } from '@mui/material/styles'

const colorSchemes = (): Theme['colorSchemes'] => {
  const skin = 'default' as string

  return {
    light: {
      palette: {
        primary: {
          main: '#9155FD',
          light: '#B985FD',
          dark: '#6E41C4',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.38)'
        },
        secondary: {
          main: '#8A8D93',
          light: '#B4B7BD',
          dark: '#5E6368',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.38)'
        },
        error: {
          main: '#FF4C51',
          light: '#FF8083',
          dark: '#E1393E',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.38)'
        },
        warning: {
          main: '#FFB400',
          light: '#FFD666',
          dark: '#E19A00',
          contrastText: '#1F1F1F',
          lighterOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.38)'
        },
        info: {
          main: '#16B1FF',
          light: '#76D2FF',
          dark: '#0E8ECF',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.38)'
        },
        success: {
          main: '#56CA00',
          light: '#7BE249',
          dark: '#38A400',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.38)'
        },
        text: {
          primary: '#2F2B3D',
          secondary: '#8A8D93',
          disabled: 'rgba(47,43,61,0.38)',
          primaryChannel: '47 43 61',
          secondaryChannel: '138 141 147'
        },
        divider: 'rgba(47,43,61,0.12)',
        dividerChannel: '47 43 61',
        background: {
          default: skin === 'bordered' ? '#FFFFFF' : '#F7F7F9',
          paper: '#FFFFFF'
        },
        action: {
          active: `rgb(var(--mui-mainColorChannels-light) / 0.6)`,
          hover: `rgb(var(--mui-mainColorChannels-light) / 0.04)`,
          selected: `rgb(var(--mui-mainColorChannels-light) / 0.08)`,
          disabled: `rgb(var(--mui-mainColorChannels-light) / 0.3)`,
          disabledBackground: `rgb(var(--mui-mainColorChannels-light) / 0.12)`,
          focus: `rgb(var(--mui-mainColorChannels-light) / 0.1)`,
          focusOpacity: 0.1,
          activeChannel: 'var(--mui-mainColorChannels-light)',
          selectedChannel: 'var(--mui-mainColorChannels-light)'
        },
        Alert: {
          errorColor: 'var(--mui-palette-error-main)',
          warningColor: 'var(--mui-palette-warning-main)',
          infoColor: 'var(--mui-palette-info-main)',
          successColor: 'var(--mui-palette-success-main)',
          errorStandardBg: 'var(--mui-palette-error-lightOpacity)',
          warningStandardBg: 'var(--mui-palette-warning-lightOpacity)',
          infoStandardBg: 'var(--mui-palette-info-lightOpacity)',
          successStandardBg: 'var(--mui-palette-success-lightOpacity)',
          errorFilledColor: 'var(--mui-palette-error-contrastText)',
          warningFilledColor: 'var(--mui-palette-warning-contrastText)',
          infoFilledColor: 'var(--mui-palette-info-contrastText)',
          successFilledColor: 'var(--mui-palette-success-contrastText)',
          errorFilledBg: 'var(--mui-palette-error-main)',
          warningFilledBg: 'var(--mui-palette-warning-main)',
          infoFilledBg: 'var(--mui-palette-info-main)',
          successFilledBg: 'var(--mui-palette-success-main)'
        },
        Avatar: {
          defaultBg: '#F0EFF0'
        },
        Chip: {
          defaultBorder: 'var(--mui-palette-divider)'
        },
        FilledInput: {
          bg: `rgb(var(--mui-mainColorChannels-light) / 0.06)`,
          hoverBg: `rgb(var(--mui-mainColorChannels-light) / 0.08)`,
          disabledBg: `rgb(var(--mui-mainColorChannels-light) / 0.06)`
        },
        LinearProgress: {
          primaryBg: 'var(--mui-palette-primary-mainOpacity)',
          secondaryBg: 'var(--mui-palette-secondary-mainOpacity)',
          errorBg: 'var(--mui-palette-error-mainOpacity)',
          warningBg: 'var(--mui-palette-warning-mainOpacity)',
          infoBg: 'var(--mui-palette-info-mainOpacity)',
          successBg: 'var(--mui-palette-success-mainOpacity)'
        },
        SnackbarContent: {
          bg: '#1A0E33',
          color: 'var(--mui-palette-background-paper)'
        },
        Switch: {
          defaultColor: 'var(--mui-palette-common-white)',
          defaultDisabledColor: 'var(--mui-palette-common-white)',
          primaryDisabledColor: 'var(--mui-palette-common-white)',
          secondaryDisabledColor: 'var(--mui-palette-common-white)',
          errorDisabledColor: 'var(--mui-palette-common-white)',
          warningDisabledColor: 'var(--mui-palette-common-white)',
          infoDisabledColor: 'var(--mui-palette-common-white)',
          successDisabledColor: 'var(--mui-palette-common-white)'
        },
        Tooltip: {
          bg: '#1A0E33'
        },
        TableCell: {
          border: 'var(--mui-palette-divider)'
        },
        customColors: {
          bodyBg: '#F4F5FA',
          chatBg: '#F7F6FA',
          greyLightBg: '#FAFAFA',
          inputBorder: `rgb(var(--mui-mainColorChannels-light) / 0.22)`,
          tableHeaderBg: '#F6F7FB',
          tooltipText: '#FFFFFF',
          trackBg: '#F0F2F8'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#9155FD',
          light: '#B985FD',
          dark: '#6E41C4',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-primary-mainChannel) / 0.38)'
        },
        secondary: {
          main: '#8A8D93',
          light: '#B4B7BD',
          dark: '#5E6368',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-secondary-mainChannel) / 0.38)'
        },
        error: {
          main: '#FF4C51',
          light: '#FF8083',
          dark: '#E1393E',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-error-mainChannel) / 0.38)'
        },
        warning: {
          main: '#FFB400',
          light: '#FFD666',
          dark: '#E19A00',
          contrastText: '#1F1F1F',
          lighterOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-warning-mainChannel) / 0.38)'
        },
        info: {
          main: '#16B1FF',
          light: '#76D2FF',
          dark: '#0E8ECF',
          contrastText: '#fff',
          lighterOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-info-mainChannel) / 0.38)'
        },
        success: {
          main: '#56CA00',
          light: '#7BE249',
          dark: '#38A400',
          contrastText: '#1F1F1F',
          lighterOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.08)',
          lightOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.16)',
          mainOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.24)',
          darkOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.32)',
          darkerOpacity: 'rgb(var(--mui-palette-success-mainChannel) / 0.38)'
        },
        text: {
          primary: '#E1E1E6',
          secondary: '#B4B7BD',
          disabled: 'rgba(228,230,244,0.38)',
          primaryChannel: '225 225 230',
          secondaryChannel: '180 183 189'
        },
        divider: 'rgba(228,230,244,0.12)',
        dividerChannel: '228 230 244',
        background: {
          default: skin === 'bordered' ? '#1A1C23' : '#12141A',
          paper: '#1A1C23'
        },
        action: {
          active: `rgb(var(--mui-mainColorChannels-dark) / 0.6)`,
          hover: `rgb(var(--mui-mainColorChannels-dark) / 0.04)`,
          selected: `rgb(var(--mui-mainColorChannels-dark) / 0.08)`,
          disabled: `rgb(var(--mui-mainColorChannels-dark) / 0.3)`,
          disabledBackground: `rgb(var(--mui-mainColorChannels-dark) / 0.12)`,
          focus: `rgb(var(--mui-mainColorChannels-dark) / 0.1)`,
          focusOpacity: 0.1,
          activeChannel: 'var(--mui-mainColorChannels-dark)',
          selectedChannel: 'var(--mui-mainColorChannels-dark)'
        },
        Alert: {
          errorColor: 'var(--mui-palette-error-main)',
          warningColor: 'var(--mui-palette-warning-main)',
          infoColor: 'var(--mui-palette-info-main)',
          successColor: 'var(--mui-palette-success-main)',
          errorStandardBg: 'var(--mui-palette-error-lightOpacity)',
          warningStandardBg: 'var(--mui-palette-warning-lightOpacity)',
          infoStandardBg: 'var(--mui-palette-info-lightOpacity)',
          successStandardBg: 'var(--mui-palette-success-lightOpacity)',
          errorFilledColor: 'var(--mui-palette-error-contrastText)',
          warningFilledColor: 'var(--mui-palette-warning-contrastText)',
          infoFilledColor: 'var(--mui-palette-info-contrastText)',
          successFilledColor: 'var(--mui-palette-success-contrastText)',
          errorFilledBg: 'var(--mui-palette-error-main)',
          warningFilledBg: 'var(--mui-palette-warning-main)',
          infoFilledBg: 'var(--mui-palette-info-main)',
          successFilledBg: 'var(--mui-palette-success-main)'
        },
        Avatar: {
          defaultBg: '#3F3B59'
        },
        Chip: {
          defaultBorder: 'var(--mui-palette-divider)'
        },
        FilledInput: {
          bg: `rgb(var(--mui-mainColorChannels-dark) / 0.06)`,
          hoverBg: `rgb(var(--mui-mainColorChannels-dark) / 0.08)`,
          disabledBg: `rgb(var(--mui-mainColorChannels-dark) / 0.06)`
        },
        LinearProgress: {
          primaryBg: 'var(--mui-palette-primary-mainOpacity)',
          secondaryBg: 'var(--mui-palette-secondary-mainOpacity)',
          errorBg: 'var(--mui-palette-error-mainOpacity)',
          warningBg: 'var(--mui-palette-warning-mainOpacity)',
          infoBg: 'var(--mui-palette-info-mainOpacity)',
          successBg: 'var(--mui-palette-success-mainOpacity)'
        },
        SnackbarContent: {
          bg: '#F7F4FF',
          color: 'var(--mui-palette-background-paper)'
        },
        Switch: {
          defaultColor: 'var(--mui-palette-common-white)',
          defaultDisabledColor: 'var(--mui-palette-common-white)',
          primaryDisabledColor: 'var(--mui-palette-common-white)',
          secondaryDisabledColor: 'var(--mui-palette-common-white)',
          errorDisabledColor: 'var(--mui-palette-common-white)',
          warningDisabledColor: 'var(--mui-palette-common-white)',
          infoDisabledColor: 'var(--mui-palette-common-white)',
          successDisabledColor: 'var(--mui-palette-common-white)'
        },
        Tooltip: {
          bg: '#F7F4FF'
        },
        TableCell: {
          border: 'var(--mui-palette-divider)'
        },
        customColors: {
          bodyBg: '#28243D',
          chatBg: '#373452',
          greyLightBg: '#373350',
          inputBorder: `rgb(var(--mui-mainColorChannels-dark) / 0.22)`,
          tableHeaderBg: '#3D3759',
          tooltipText: '#312D4B',
          trackBg: '#474360'
        }
      }
    }
  } as Theme['colorSchemes']
}

export default colorSchemes
