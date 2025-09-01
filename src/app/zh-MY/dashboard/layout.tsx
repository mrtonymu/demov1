// Next Intl Imports
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

// Type Imports
import type { ChildrenType } from '@core/types'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import AuthGuard from '@/components/AuthGuard'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers direction={direction}>
        <AuthGuard>
          <LayoutWrapper
            verticalLayout={
              <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<VerticalFooter />}>
                {children}
              </VerticalLayout>
            }
          />
        </AuthGuard>
      </Providers>
    </NextIntlClientProvider>
  )
}

export default Layout
