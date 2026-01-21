import { Typography } from 'antd';

import styled from 'styled-components';

export const AnswerResultModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
`;

export const RightAnswerLabel = styled(Typography.Text)`
  font-size: 14px;
  font-weight: 600;
  color: #01132a;
  margin: 8px 0;
`;

export const CorrectAnswerBox = styled.div`
  background: #f0f2f5;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #01132a;
  width: 70%;
  text-align: center;
`;
