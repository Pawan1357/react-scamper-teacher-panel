import { useMemo } from 'react';

import { EyeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useChapterTable } from 'modules/ManageChapter/hooks/useChapterTable';
import { useNavigate } from 'react-router-dom';
import { IconWrapper } from 'style/Common/common';

import { IMAGE_URL, INPUTS } from 'utils/constants';
import { formatDate } from 'utils/constants/day';
import { ImageTypeEnum, PAGE_LIMIT } from 'utils/constants/enum';
import { ROUTES } from 'utils/constants/routes';
import { getAntDSortOrder } from 'utils/functions';

import { IChapterBase } from 'services/chapter/types';

import { RenderSearchInput } from 'components/common/FormField';
import RenderActionCell from 'components/common/RenderActionCell';
import { StatusTag } from 'components/common/StatusTag';
import { CHAPTER_TAG_COLOR } from 'components/common/StatusTag/types';
import { CommonTable } from 'components/common/Table';
import EmptyState from 'components/common/Table/EmptyState';
import { TruncatedTextWithTooltip } from 'components/common/TruncatedTextWithTooltip';

const ChapterTable = () => {
  const navigate = useNavigate();

  const {
    args,

    searchVal,
    data,
    isLoading,
    isEmpty,
    handleTableChange,
    handleSearchChange
  } = useChapterTable();

  const columns: ColumnsType<IChapterBase> = useMemo(
    () => [
      {
        title: <div style={{ textAlign: 'center' }}>Chapter</div>,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        sortOrder: getAntDSortOrder(args?.sort_by, args?.sort_order, 'name'),
        render: (name: string, record) => (
          <Space>
            <Avatar
              size={32}
              src={
                record?.thumbnail
                  ? `${IMAGE_URL}scamper/${ImageTypeEnum.CHAPTER}/${record.thumbnail}`
                  : undefined
              }
              icon={!record?.thumbnail && <UserOutlined />}
            />
            <TruncatedTextWithTooltip text={name || '-'} maxLength={40} />
          </Space>
        )
      },
      {
        title: 'Lessons',
        dataIndex: 'lesson_count',
        align: 'center',
        render: (val) => <StatusTag color={CHAPTER_TAG_COLOR.LESSON} status={val > 0 ? val : 0} />
      },
      {
        title: 'Skill Checks',
        dataIndex: 'activity_count',
        align: 'center',
        render: (val) => <StatusTag color={CHAPTER_TAG_COLOR.ACTIVITY} status={val > 0 ? val : 0} />
      },
      {
        title: 'Created by',
        dataIndex: 'created_user',
        align: 'center',
        render: (user) =>
          user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || '-' : '-'
      },
      {
        title: 'Created on',
        dataIndex: 'created_at',
        align: 'center',
        render: (date) => formatDate(date)
      },
      {
        title: 'Published on',
        dataIndex: 'publish_date',
        align: 'center',
        render: (date, record) => {
          if (record.is_published) {
            return formatDate(date);
          }
          return '-';
        }
      },
      {
        title: 'Action',
        key: 'actions',
        align: 'center',
        render: (_, record) => {
          return (
            <RenderActionCell>
              <Tooltip title="View Chapter">
                <Button
                  type="primary"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(ROUTES.chapter.viewChapter(String(record.id)))}
                />
              </Tooltip>
            </RenderActionCell>
          );
        }
      }
    ],
    [args?.sort_by, args?.sort_order, navigate]
  );

  return (
    <>
      <RenderSearchInput
        inputProps={{
          value: searchVal,
          size: 'large',
          onChange: handleSearchChange,
          placeholder: INPUTS.PLACEHOLDER.SEARCH,
          prefix: (
            <IconWrapper>
              <SearchOutlined />
            </IconWrapper>
          )
        }}
      />

      <div className="shadow-paper">
        <CommonTable
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={data?.chapters_list || []}
          pagination={{
            current: args.page ?? PAGE_LIMIT.PAGE,
            pageSize: args.limit ?? PAGE_LIMIT.LIMIT,
            total: data?.total_records ?? 0
          }}
          onChange={handleTableChange}
          loading={isLoading}
          emptyText={
            <EmptyState
              isEmpty={isEmpty}
              search={args.search}
              defaultDescription="No Chapter available"
              searchDescription="No Chapter Found"
            />
          }
        />
      </div>
    </>
  );
};

export default ChapterTable;
