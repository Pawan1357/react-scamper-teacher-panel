import styled from 'styled-components';

export const StudentProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .lock-icon-medium {
    width: 24px;
    height: 24px;
  }

  .lock-icon-small {
    width: 14px;
    height: 14px;
  }
`;

export const ChapterSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  overflow-x: auto;

  .ant-tag {
    cursor: pointer;
  }
`;

export const InfoIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
`;
