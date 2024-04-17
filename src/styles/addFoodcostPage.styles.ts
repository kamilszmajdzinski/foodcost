import { appTheme } from 'src/config/theme'

export const SELECT_DROPDOWN_STYLES = {
  buttonStyle: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    width: 'auto',
    marginTop: 30 

  },
  buttonTextStyle: {
    fontFamily: 'dmSerif',
    color: appTheme.dimmed,
    fontWeight: 'bold',
    fontSize: 18,
    margin: 'auto'
  },
  searchInputStyle: {
    width: '100%',
    color: 'red'
  },
  dropdownStyle: {
    borderRadius: 8,
    width: '99%',
    backgroundColor: appTheme.primary
  },
  rowTextStyle: {
    fontFamily: 'dmSerif',
    color: appTheme.dimmed
  }
}
