import { dimensions, height, width } from 'src/utils/dimensions'

/**
 * Theme For Styled Components
 * -
 */
export const appTheme = {
  background: '#FFFFEC',
  primary: '#F1E4C3',
  secondary: '#C6A969',
  highlight: '#597E52',
  dimmed: '#3A5235',
  error: '#FF3333',
  size: dimensions,
  windowHeight: `${height}px`,
  windowWidth: `${width}px`
}

/**
 * Theme For Expo Navigation Header
 * -
 */
export const navTheme = {
  dark: false,
  colors: {
    background: appTheme.background,
    border: appTheme.secondary,
    card: appTheme.background,
    notification: appTheme.highlight,
    primary: appTheme.primary,
    text: appTheme.primary
  }
}
