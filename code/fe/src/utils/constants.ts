export const access_token_expired_time = 60000;

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

export const GuestTypeMap = {
  local: "Local",
  foreign: "Foreign",
};

export const RoleMap: Record<"user" | "admin", string> = {
  user: "User",
  admin: "Admin",
};
