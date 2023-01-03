export enum UserRole {
  superAdmin,
  admin,
  agencyOwner,
  agencyManager,
  agencySupport,
}

export const AdminRoles = [
  {
    key: UserRole.admin,
    value: 'Admin',
  },
  {
    key: UserRole.agencyOwner,
    value: 'Agency owner',
  },
  {
    key: UserRole.agencyManager,
    value: 'Agency manager',
  },
  {
    key: UserRole.agencySupport,
    value: 'Agency support',
  },
];

export const AgencyRoles = [
  {
    key: UserRole.agencyOwner,
    value: 'Agency owner',
  },
  {
    key: UserRole.agencyManager,
    value: 'Agency manager',
  },
  {
    key: UserRole.agencySupport,
    value: 'Agency support',
  },
];
