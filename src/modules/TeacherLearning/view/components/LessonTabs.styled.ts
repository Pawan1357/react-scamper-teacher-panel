import styled from 'styled-components';

export const LessonTabsWrapper = styled.div`
  .ant-tabs-nav {
    margin: 0;
  }

  .ant-tabs-nav-wrap {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(39, 152, 205, 0.3) transparent;
    padding-right: 20px;
    margin-right: -20px;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(39, 152, 205, 0.3);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(39, 152, 205, 0.5);
    }
  }

  .ant-tabs-nav-list {
    flex-wrap: nowrap;
    min-width: max-content;
    padding-right: 20px;
  }

  .ant-tabs-tab {
    font-weight: 600;
    font-size: 16px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #2798cd;
  }

  .ant-tabs-ink-bar {
    background: #2798cd;
  }

  @media (max-width: 768px) {
    .ant-tabs-nav-wrap {
      padding-bottom: 4px;
      padding-right: 16px;
      margin-right: -16px;
    }

    .ant-tabs-nav-list {
      padding-right: 16px;
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 8px 12px;
    }
  }

  @media (max-width: 480px) {
    .ant-tabs-nav-wrap {
      padding-right: 12px;
      margin-right: -12px;
    }

    .ant-tabs-nav-list {
      padding-right: 12px;
    }

    .ant-tabs-tab {
      font-size: 12px;
      padding: 6px 10px;
    }
  }
`;
