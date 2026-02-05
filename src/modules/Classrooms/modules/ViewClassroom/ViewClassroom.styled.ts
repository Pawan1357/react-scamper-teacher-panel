import { Space } from 'antd';

import styled from 'styled-components';

export const ViewClassroomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .top-section-wrapper {
    display: flex;
    gap: 14px;

    h3 {
      font-size: 20px;
      font-weight: 600;
    }

    .left-section {
      flex: 1;
    }
    .right-section {
      flex: 2;
    }

    @media (max-width: 992px) {
      flex-direction: column;

      .left-section {
        flex: 1;
      }
      .right-section {
        flex: 1;
      }
    }
  }
`;

export const ChapterDetailsCard = styled.div`
  margin: 0 !important;
  width: 100%;

  display: flex;
  gap: 34px;
  padding: 20px;
  flex-direction: column;
`;

export const ChapterCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  .chapter-title-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .chapter-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 40px;
    margin: 0;
  }
`;

export const ChapterCardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  .action-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1d3c63;
    border: none;
    border-radius: 8px;
    color: #ffffff;

    .anticon {
      font-size: 16px;
    }
  }
`;

export const ChapterCardContent = styled.div<{ isEconomy: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 55px;
  row-gap: 34px;

  .status-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .classroom-economy-switch {
    width: fit-content;
    background-color: ${({ isEconomy }) => (isEconomy ? '#389e0d' : '')};
  }

  .ant-switch.ant-switch-loading,
  .ant-switch.ant-switch-disabled {
    opacity: 1;
  }
`;

export const ChaptersSectionCard = styled.div`
  width: 100%;
  flex: 1;

  .ant-table-wrapper {
    width: 100%;
    height: 100%;
  }

  .ant-table-body {
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const StudentsSectionCard = styled.div`
  width: 100%;
  flex: 1;

  .ant-table-wrapper {
    width: 100%;
    height: 100%;
  }

  .ant-table-body {
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const ActionButtonsWrapper = styled(Space)`
  .ant-btn {
    &.ant-btn-text {
      &.ant-btn-dangerous {
        color: #f5222d;
      }
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
