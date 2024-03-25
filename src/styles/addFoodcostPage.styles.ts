import { appTheme } from 'src/config/theme'

export const SELECT_DROPDOWN_STYLES = {
  buttonStyle: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    width: '35%',

  },
  buttonTextStyle: {
    fontFamily: 'dmSerif',
    color: appTheme.dimmed,
    fontWeight: 'bold',
    fontSize: 14,
    margin: 'auto'
  },
  searchInputStyle: {
    width: '100%'
  },
  dropdownStyle: {
    borderRadius: 8,
    width: '90%',
    backgroundColor: appTheme.primary
  },
  rowTextStyle: {
    fontFamily: 'dmSerif',
    color: appTheme.dimmed
  }
}
