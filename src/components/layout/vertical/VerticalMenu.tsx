// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: { scrollMenu: (container: any, isPerfectScrollbar: boolean) => void }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* CR3DIFY 垂直菜单 */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/dashboard' icon={<i className='ri-dashboard-line' />}>
          仪表板
        </MenuItem>
        
        <MenuSection label='业务管理'>
          <MenuItem href='/clients' icon={<i className='ri-user-line' />}>
            客户管理
          </MenuItem>
          <MenuItem href='/loans' icon={<i className='ri-money-dollar-circle-line' />}>
            贷款管理
          </MenuItem>
          <MenuItem href='/repayments' icon={<i className='ri-refund-line' />}>
            还款记录
          </MenuItem>
          <MenuItem href='/reports' icon={<i className='ri-bar-chart-line' />}>
            报表
          </MenuItem>
        </MenuSection>
        
        <MenuSection label='系统管理'>
          <MenuItem href='/blacklist' icon={<i className='ri-user-forbid-line' />}>
            黑名单
          </MenuItem>
          <MenuItem href='/approvals' icon={<i className='ri-checkbox-circle-line' />}>
            审批
          </MenuItem>
          <MenuItem href='/settings' icon={<i className='ri-settings-line' />}>
            系统设置
          </MenuItem>
        </MenuSection>
        
        <MenuSection label='账户'>
          <MenuItem href='/account-settings' icon={<i className='ri-user-settings-line' />}>
            账户设置
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
