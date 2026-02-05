import styled from 'styled-components';

export const ImportPageWrapper = styled.div`
  padding: 24px;
  min-height: calc(100vh - 64px);
`;

export const TableWrapper = styled.div`
  margin-top: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  min-height: 400px;
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
  min-height: 400px;
  gap: 24px;
`;

export const ErrorIcon = styled.div`
  font-size: 64px;
  color: #ff4d4f;
  margin-bottom: 8px;

  .anticon {
    font-size: 64px;
  }
`;

export const ErrorMessage = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  text-align: center;
`;

export const ErrorDescription = styled.p`
  font-size: 14px;
  color: #8c8c8c;
  text-align: center;
  margin: 0;
  max-width: 500px;
`;
