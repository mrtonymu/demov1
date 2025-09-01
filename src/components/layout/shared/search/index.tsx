'use client'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Next Intl Imports
import { useTranslations } from 'next-intl'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

const NavSearch = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()
  const t = useTranslations('search')

  return isBreakpointReached ? (
    <IconButton className='text-textSecondary'>
      <i className='ri-search-line' />
    </IconButton>
  ) : (
    <div className='flex items-center cursor-pointer gap-2'>
      <IconButton className='text-textSecondary'>
        <i className='ri-search-line' />
      </IconButton>
      <div className='whitespace-nowrap select-none text-textDisabled'>{t('placeholder')}</div>
    </div>
  )
}

export default NavSearch
