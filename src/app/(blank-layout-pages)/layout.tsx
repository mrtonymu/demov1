// Next Intl Imports
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers direction={direction}>
        <BlankLayout>{children}</BlankLayout>
      </Providers>
    </NextIntlClientProvider>
  )
}

export default Layout
