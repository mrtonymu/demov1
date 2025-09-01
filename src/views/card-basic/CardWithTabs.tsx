'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Next Intl Imports
import { useTranslations } from 'next-intl'

const CardWithTabs = () => {
  // Hooks
  const t = useTranslations('cardBasic.cardWithTabs')

  // State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label='card navigation examples'>
          <Tab value='1' label={t('itemOne')} />
          <Tab value='2' label={t('itemTwo')} />
          <Tab value='3' label={t('itemThree')} />
        </TabList>
        <CardContent>
          <TabPanel value='1'>
            <Typography variant='h5' className='mbe-2'>
              {t('headerOne')}
            </Typography>
            <Typography className='mbe-6'>
              {t('contentOne')}
            </Typography>
            <Button variant='contained'>{t('buttonOne')}</Button>
          </TabPanel>
          <TabPanel value='2'>
            <Typography variant='h5' className='mbe-2'>
              {t('headerTwo')}
            </Typography>
            <Typography className='mbe-6'>
              {t('contentTwo')}
            </Typography>
            <Button variant='contained'>{t('buttonTwo')}</Button>
          </TabPanel>
          <TabPanel value='3'>
            <Typography variant='h5' className='mbe-2'>
              {t('headerThree')}
            </Typography>
            <Typography className='mbe-6'>
              {t('contentThree')}
            </Typography>
            <Button variant='contained'>{t('buttonThree')}</Button>
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

export default CardWithTabs
