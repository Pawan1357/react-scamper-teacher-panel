import { message } from 'antd';
import { NoticeType } from 'antd/es/message/interface';

import { setAxiosInterceptor } from 'services/interceptor';
import { authStore } from 'services/store/auth';

import { ICommonPagination } from './Types';
import { LocalStorageKeys } from './constants';

//To concate the path for the public folder
export const toAbsoluteUrl = (pathname: string) => window.location.origin + pathname;

// Rehydrate store and set axios default headers
export const setupAxios = () => {
  const { actions } = authStore.getState();

  const userStorage = localStorage.getItem(LocalStorageKeys.user);
  const tokenStorage = localStorage.getItem(LocalStorageKeys.authToken);

  if (userStorage && tokenStorage) {
    const token = JSON.parse(tokenStorage);
    const userData = JSON.parse(userStorage);

    if (token) {
      const USER_DATA = { ...userData, authToken: token };
      actions.authSuccess({ data: USER_DATA });
    } else {
      actions.authFail();
    }
  }

  // Set Axios Interceptor
  setAxiosInterceptor();
};

export const appLoader = (status: boolean) => {
  const { actions } = authStore.getState();
  actions.loaderChange(status);
};

/**
 * Convert a hex color to an rgba string with specified opacity
 *
 * @param hex - The hex color string, e.g. "#4B88FF" or "#4B8"
 * @param opacity - The opacity as a number between 0 (transparent) and 1 (fully opaque)
 * @returns A string in rgba format, e.g. "rgba(75, 136, 255, 0.5)"
 */
export function hexToRGBA(hex: string, opacity: number): string {
  let cleanedHex = hex.replace('#', '');

  if (cleanedHex.length === 3) {
    cleanedHex = cleanedHex
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (cleanedHex.length !== 6) {
    throw new Error('Invalid hex color format');
  }

  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const showToaster = (type: NoticeType, content: React.ReactNode): void => {
  const fallback = 'An unexpected error occurred';

  if (Array.isArray(content)) {
    content.forEach((msg) => {
      message[type](msg);
    });
  } else {
    message[type](content || fallback);
  }
};

export const getInitials = (first_name: string, last_name: string, full_name?: string) => {
  const initial = full_name
    ? full_name
        .split(' ')
        .map((name) => name[0])
        .join('')
    : '';
  return first_name && last_name ? `${first_name?.[0] || ''}${last_name?.[0] || ''}` : initial;
};

export const capitalizeFirstLetterWhileTyping = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const buildSearchParams = (options: ICommonPagination): URLSearchParams => {
  const params = new URLSearchParams();

  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  if (options.search?.trim()) params.set('search', options.search.trim());
  if (options.sort_by) params.set('sort_by', options.sort_by);
  if (options.sort_order) params.set('sort_order', options.sort_order);

  return params;
};

export function debounce<T>(this: T, func: (...args: any[]) => void): (...args: any[]) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: T, ...args: any[]): void {
    clearTimeout(timer as NodeJS.Timeout);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 700);
  };
}

export const getSortOrder = (order: string | null | undefined): string | null => {
  switch (order) {
    case 'descend':
      return 'DESC';
    case 'ascend':
      return 'ASC';
    default:
      return '';
  }
};

export const getAntDSortOrder = (
  currentSortBy: string | undefined,
  currentSortOrder: string | undefined,
  columnKey: string
): 'ascend' | 'descend' | undefined => {
  if (currentSortBy !== columnKey) return undefined;
  const order = currentSortOrder?.toLowerCase();
  if (order === 'asc') return 'ascend';
  if (order === 'desc') return 'descend';
  return undefined;
};
