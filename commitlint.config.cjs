module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['auth', 'rooms', 'bookings', 'payments', 'staff', 'reports', 'frontend', 'infra', 'repo'],
    ],
  },
};
