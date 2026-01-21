import { Carousel, Collapse, Empty } from 'antd';

import { formatDate } from 'utils/constants/day';
import { ImageTypeEnum } from 'utils/constants/enum';

import CommonMedia from 'components/common/Media/CommonMedia';
import { defaultCarouselSettings } from 'components/common/Media/carouselSettings';

import { ActivityDetailsBody, ActivityDetailsCard, ActivityInfoRow } from '../ActivityView.styled';

export const ActivityDetails = ({ activityDetails }: any) => {
  const {
    created_at = '',
    description = '',
    questions = [],
    chapter_name = '',
    lesson_name = '',
    name = '',
    media = []
  } = activityDetails || {};

  return (
    <ActivityDetailsCard>
      <Collapse
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: (
              <h3 style={{ margin: 0, color: '#0f1b53', fontSize: '20px', fontWeight: 700 }}>
                Skill Check Details
              </h3>
            ),
            children: (
              <ActivityDetailsBody>
                <ActivityInfoRow>
                  <div className="info-item-wrapper">
                    <div className="info-item">
                      <span className="info-label">Chapter</span>
                      <span className="info-value">{chapter_name || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Lesson Name</span>
                      <span className="info-value">{lesson_name || '-'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Questions</span>
                      <span className="info-value">{questions?.length || 0}</span>
                    </div>
                  </div>
                  <div className="info-item-wrapper">
                    <div className="info-item">
                      <span className="info-label">Skill Check Name</span>
                      <span className="info-value">{name || '-'}</span>
                    </div>
                    {/* <div className="info-item">
                      <span className="info-label">Activity Type</span>
                      <Tag color="blue" className="type-tag border-md">
                        {questionType(type) || '-'}
                      </Tag>
                    </div> */}
                    <div className="info-item">
                      <span className="info-label">Created At</span>
                      <span className="info-value">
                        {created_at ? formatDate(created_at, 'MM/DD/YY, HH:mm') : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="align-self-start">
                    <div className="info-item">
                      <span className="info-label">Skill Check Description</span>
                      <p
                        className="tiptap-content-view"
                        dangerouslySetInnerHTML={{ __html: description || '-' }}
                      />
                    </div>
                  </div>
                </ActivityInfoRow>

                {media?.length > 0 ? (
                  <CommonMedia
                    mode="gallery"
                    Carousel={Carousel}
                    data={media}
                    urlName={ImageTypeEnum.TL_ACTIVITY}
                    itemsPerSlide={4}
                    carouselSettings={defaultCarouselSettings}
                  />
                ) : (
                  <Empty description="No media available" />
                )}
              </ActivityDetailsBody>
            )
          }
        ]}
      />
    </ActivityDetailsCard>
  );
};
