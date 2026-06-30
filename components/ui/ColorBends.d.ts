import * as React from 'react'

interface ColorBendsProps {
  colors?: string[]
  rotation?: number
  autoRotate?: number
  speed?: number
  transparent?: boolean
  scale?: number
  frequency?: number
  warpStrength?: number
  mouseInfluence?: number
  parallax?: number
  noise?: number
  iterations?: number
  intensity?: number
  bandWidth?: number
  className?: string
  style?: React.CSSProperties
}

declare function ColorBends(props: ColorBendsProps): React.JSX.Element

export default ColorBends
