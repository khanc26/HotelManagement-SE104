export const access_token_expired_time = 300000;

export const roles = [
  {
    key: "admin",
    label: "Admin",
  },
  { key: "user", label: "User" },
];

export const userTypes = [
  {
    key: "foreign",
    label: "Foregin",
  },
  {
    key: "local",
    label: "Local",
  },
];

export const userStatus = [
  {
    key: "active",
    label: "Active",
  },
  {
    key: "inactive",
    label: "Inactive",
  },
];

export const roomPricingRules = {
  FOREIGN_MULTIPLIER: 1.5,
  GROUP_SURCHARGE_THRESHOLD: 3,
  GROUP_SURCHARGE_PERCENTAGE: 25,
};