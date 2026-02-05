import { StatusTagStyles } from './styles';
import { IStatusTagProps } from './types';

export const StatusTag = ({ status, color, onClick }: IStatusTagProps) => {
  return (
    <StatusTagStyles color={color} onClick={onClick}>
      {status}
    </StatusTagStyles>
  );
};
