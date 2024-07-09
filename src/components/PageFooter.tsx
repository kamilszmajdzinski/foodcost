import styled from 'styled-components/native'
import { Typography } from './Typography'
import { appTheme } from 'src/config/theme'
import { formatPrice } from 'src/utils/formatPrice'

const S = {
  PageFooterTopRow: styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
  `,
  PageFooterRightColumn: styled.View`
    flex: 1;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
  `,
  PageFooterLeftColumn: styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `
}

export const PageFooter = ({ price, text, title, isCompact = false }: { price?: number; title: string; text?: string; isCompact?: boolean }) => (
  <S.PageFooterTopRow>
    <S.PageFooterLeftColumn>
      <Typography size={isCompact ? 22 : 26} color={appTheme.dimmed}>
        {title}:
      </Typography>
    </S.PageFooterLeftColumn>
    <S.PageFooterRightColumn>
      <Typography size={isCompact ? 26 : 30} color={appTheme.dimmed}>
        {price ? `${formatPrice(price)} zł` : text}
      </Typography>
    </S.PageFooterRightColumn>
  </S.PageFooterTopRow>
)
