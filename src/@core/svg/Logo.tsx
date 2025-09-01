// React Imports
import type { SVGAttributes } from 'react'

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg width='1.5em' height='1em' viewBox='0 0 120 80' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      {/* CR3DIFY Logo - Modern geometric design */}
      <rect x='10' y='20' width='20' height='40' rx='4' fill='currentColor' />
      <path d='M40 35 C40 25, 50 20, 60 20 C70 20, 80 25, 80 35 C80 45, 70 50, 60 50 L50 50' stroke='currentColor' strokeWidth='8' strokeLinecap='round' fill='none' />
      <rect x='90' y='45' width='8' height='8' fill='currentColor' />
      <rect x='90' y='30' width='8' height='8' fill='currentColor' />
      <rect x='90' y='15' width='8' height='8' fill='currentColor' />
      <rect x='105' y='45' width='8' height='8' fill='currentColor' />
      <rect x='105' y='30' width='8' height='8' fill='currentColor' />
      <rect x='105' y='15' width='8' height='8' fill='currentColor' />
    </svg>
  )
}

export default Logo
