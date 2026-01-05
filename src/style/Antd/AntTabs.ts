import { createGlobalStyle } from 'styled-components';

export const AntTabs = createGlobalStyle`
  .ant-tabs-top >.ant-tabs-nav::before, .ant-tabs-top >div>.ant-tabs-nav::before {
        border-bottom: none;
    }
`;
