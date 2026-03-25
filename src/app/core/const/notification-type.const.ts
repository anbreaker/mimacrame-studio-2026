export const NOTIFICATION_TYPE = {
  Error: 'error',
  Info: 'info',
  Success: 'success',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
