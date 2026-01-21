import React from 'react';

import { Tooltip } from 'antd';

import { truncateText } from 'utils/functions';

interface TruncatedTextWithTooltipProps {
  text: string | null | undefined;
  maxLength?: number;
  emptyText?: string;
  component?: React.ElementType;
  [key: string]: any; // Allow any additional props to be passed to the component
}

export const TruncatedTextWithTooltip: React.FC<TruncatedTextWithTooltipProps> = ({
  text,
  maxLength = 200,
  emptyText = '-',
  component: Component = 'span',
  ...rest
}) => {
  const displayText = text || emptyText;
  const truncated = truncateText(displayText, maxLength);
  const shouldShowTooltip = displayText.length > maxLength;

  if (shouldShowTooltip) {
    return (
      <Tooltip
        title={
          <span
            style={{
              display: 'block',
              maxWidth: 'min(calc(100vw - 40px), 600px)',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflowWrap: 'break-word'
            }}
          >
            {displayText}
          </span>
        }
        overlayInnerStyle={{
          maxWidth: 'min(calc(100vw - 40px), 600px)',
          padding: '8px 12px'
        }}
        overlayStyle={{
          maxWidth: 'min(calc(100vw - 40px), 600px)'
        }}
      >
        <Component {...rest} style={{ cursor: 'pointer' }}>
          {truncated}
        </Component>
      </Tooltip>
    );
  }

  return <Component {...rest}>{displayText}</Component>;
};
