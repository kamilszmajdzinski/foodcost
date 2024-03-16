import { useFonts } from 'expo-font'

/**
 * Use Cache Assets Before Render
 * -
 */
export default function useCacheAssets() {
  const [fontsLoaded] = useFonts({
    helvetica: require('src/assets/fonts/helvetica.otf'),
    lato: require('src/assets/fonts/Lato-Regular.ttf'),
    dmSerif: require('src/assets/fonts/DMSerifDisplay-Regular.ttf')
  })
  return fontsLoaded
}
