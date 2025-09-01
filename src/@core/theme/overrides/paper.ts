// MUI Imports
import type { Theme } from '@mui/material/styles'

const paper: Theme['components'] = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12
      }
    }
  }
}

export default paper
