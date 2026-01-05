import { Table } from 'antd';
import { textEllipsis } from 'style/Common/Mixin';
import { theme } from 'style/Theme';

import { styled } from 'styled-components';

export const StyledTable = styled(Table)`
  &.ant-table-wrapper {
    .ant-spin-container {
      .ant-table {
        border: 0;
        &.ant-table-small {
          .ant-table-container {
            border: 0;
            th {
              &.ant-table-cell {
                &.cell-hidden {
                  display: none;
                }
              }
            }
            .ant-table-cell {
              border-right: 0;
              &.user-info-cell {
                .user-info-wrap {
                  display: flex;
                  align-items: center;

                  .profile-avatar {
                    min-height: 30px;
                    min-width: 30px;
                  }

                  .user-info {
                    flex: 1;
                    margin-left: 10px;
                    text-align: left;
                    max-width: calc(100% - 30px);
                    > * {
                      ${textEllipsis}
                    }
                    .title,
                    .desc {
                      margin: 0;
                      line-height: 18px;
                    }
                    .title {
                      font-weight: 600;
                    }
                    .desc {
                      font-size: 12px;
                      color: ${theme.color.primary};
                    }
                  }
                }
              }
            }
          }
        }
      }
      ul.ant-pagination {
        &.ant-table-pagination {
          margin: 20px 20px 0;

          .ant-pagination-total-text {
          }
          li {
            & + li {
              margin-inline-end: 6px;
            }
          }
        }
      }
    }
  }
`;
