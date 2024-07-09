import { useState } from 'react'
import styled from 'styled-components/native'

import { Common } from 'src/styles/common'
import { Modal } from '../Modal'

import { Button } from '../Button'
import { appTheme } from 'src/config/theme'

type ServingsModalProps = {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  handleSelectServings: (servings: number) => void
  servings: number
}

export const ServingsModal = ({ isVisible, setIsVisible, handleSelectServings, servings }: ServingsModalProps) => {
  const [servingsInput, setServingsInput] = useState(servings.toString())

  const handleSave = () => {
    handleSelectServings(Number(servingsInput))
    setIsVisible(false)
  }

  return (
    <Modal setIsVisible={setIsVisible} isVisible={isVisible}>
      <Common.PageWrapper>
        <S.InputAndButtonWrapper>
          <S.InputWrapper>
            <Common.Input
              keyboardType="numeric"
              value={servingsInput}
              onChangeText={setServingsInput}
              placeholder="Servings"
              autoFocus
              placeholderTextColor={appTheme.background}
              selectionColor={appTheme.highlight}
            />
          </S.InputWrapper>
          <Button onPress={handleSave} disabled={!servingsInput || servingsInput === servings.toString()}>
            Save
          </Button>
        </S.InputAndButtonWrapper>
      </Common.PageWrapper>
    </Modal>
  )
}

const S = {
  InputWrapper: styled.View`
    display: flex;
  `,
  InputAndButtonWrapper: styled.View`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  `
}
