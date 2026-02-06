import { Space } from 'antd';

import styled from 'styled-components';

export const ViewStudentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .ant-tabs {
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #2798cd;
    }

    .ant-tabs-ink-bar {
      background: #2798cd;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding: 15px 0;
  }

  @media (max-width: 480px) {
    gap: 12px;
    padding: 12px 0;
  }
`;

export const TopSectionWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;

  > .profile-info-container {
    width: fit-content;
  }

  /* Profile info card styling */
  > .profile-info-container > .profile-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25px 30px;
    min-width: 310px;
    min-height: 185px;
    max-height: 185px;
  }

  @media (max-width: 1200px) {
    flex-direction: column;

    > .profile-info-container {
      width: 100%;
    }

    > .profile-info-container > .profile-info {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 12px;
  }
`;

export const ProfileWrapper = styled.div`
  flex-shrink: 0;

  .image-container {
    border-radius: 50%;
    width: 185px;
    height: 185px;
    img {
      object-fit: cover;
      /* border-radius: 50%; */
    }
  }

  @media (max-width: 768px) {
    .image-container {
      width: 150px;
      height: 150px;
    }
  }

  @media (max-width: 480px) {
    .image-container {
      width: 120px;
      height: 120px;
    }
  }
`;

export const ProfileName = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 20px;
  font-weight: 600;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 18px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ClassroomSectionCard = styled.div`
  width: 100%;
`;

export const ChapterProgressCard = styled.div`
  margin: 0 !important;
  width: 100%;
  min-height: 185px;
  max-height: 185px;
  height: 185px;
  overflow: hidden;
  box-sizing: border-box;
  /* Override shadow-paper padding to maximize table space */
  padding: 0 !important;

  .ant-table-wrapper {
    height: 100%;
    box-sizing: border-box;
  }

  .ant-table {
    box-sizing: border-box;
  }

  .ant-table-container {
    box-sizing: border-box;
  }

  .ant-table-body {
    box-sizing: border-box;
  }

  /* Ensure empty state displays properly */
  .ant-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    height: 100%;
  }

  @media (max-width: 1200px) {
    width: 100%;
    min-width: 100%;
  }

  @media (max-width: 768px) {
    min-height: auto;
    max-height: none;
    height: auto;
    padding: 20px !important;
  }
`;

export const ChapterDetailsCard = styled.div`
  margin: 0 !important;
  flex: 1;
  min-width: 0;
  min-height: 185px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media (max-width: 1200px) {
    width: 100%;
    min-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
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

export const TableCellText = styled.span`
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  .ant-avatar {
    flex-shrink: 0;
  }
`;

export const UserInfoContent = styled.div`
  text-align: left;
  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

export const UserName = styled.div`
  font-weight: 500;
  color: #0f1b53;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserEmail = styled.div`
  font-size: 12px;
  color: #6d7bad;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProfileInfoText = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 20px;

  &:first-of-type {
    margin-top: 12px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
