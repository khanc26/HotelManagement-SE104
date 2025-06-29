export const access_token_expired_time = 600000;

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

export const GuestTypeMap = {
  local: "Local",
  foreign: "Foreign",
};

export const RoleMap: Record<"user" | "admin", string> = {
  user: "User",
  admin: "Admin",
};

export const ParamMap = {
  max_guests_per_room: "Maximum Guests per Room",
  surcharge_rate: "Additional Fee",
  foreign_guest_factor: "Foreign Guest Surcharge",
};
