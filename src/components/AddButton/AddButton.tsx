import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import styled from 'styled-components/native'

import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { Link } from 'expo-router'

const StyledButton = {
  Button: styled.TouchableOpacity`
    width: 60px;
    height: 60px;
    background-color: ${(p) => p.theme.highlight};
    position: absolute;
    bottom: 32px;
    right: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Icon: styled(FontAwesomeIcon)`
    color: ${(p) => p.theme.primary};
  `
}

export const AddButton = ({href}: { href: string }) => (
  <Link href={href} asChild>
    <StyledButton.Button>
      <StyledButton.Icon size={30} icon={faPlus} />
    </StyledButton.Button>
  </Link>
)
