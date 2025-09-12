export const Messages = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    PENDING_APPROVAL: 'Your account is pending approval or disabled',
    EMAIL_CONFLICT: 'Email already registered',
    TOKEN_REQUIRED: 'Invite token is required',
    TOKEN_INVALID: 'Invalid invite token',
    TOKEN_EXPIRED: 'Invite token has expired',
    TOKEN_USED: 'Invite token already used',
  },
  ADMIN: {
    TOKEN: {
      NOT_FOUND: 'Token not found',
      AMOUNT_LESS_ERROR: (n: number) => `Amount cannot be less than ${n}`,
      AMOUNT_MORE_ERROR: (n: number) => `Amount cannot be more than ${n}`,
    },
    USER: {
      NOT_FOUND: 'User not found',
      SELF_DELETION: 'You cannot delete yourself',
    },
  },
  LANGUAGE: {
    NOT_FOUND: 'Language not found',
    FORBIDDEN: 'You can only access your own languages',
    NAME_CONFLICT: 'Language with this name already exists',
    NAME_TOO_LONG: 'Language name is too long',
  },
  USER: {
    NAME_TOO_SHORT: 'Name is too short',
    NAME_TOO_LONG: 'Name is too long',
    PASSWORD_TOO_SHORT: 'Password is too short',
    PASSWORD_TOO_LONG: 'Password is too long',
    NOT_FOUND: 'User not found',
    FORBIDDEN: 'You can only access your own profile',
  },
  PAGINATION: {
    PAGE_LESS_ERROR: (n: number) => `Page cannot be less than ${n}`,
    LIMIT_LESS_ERROR: (n: number) => `Limit cannot be less than ${n}`,
  },
}
