import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role, User, UserType } from "@/types/user.type";
import { useState } from "react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

export const UserEdit = () => {
  // const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  // const [user, setUser] = useState<User | null>(null);

  // useEffect(() => {
  //   // Fetch user data by ID
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch(`/api/users/${id}`);
  //       if (!response.ok) {
  //         throw new Error("User not found");
  //       }
  //       const data = await response.json();
  //       setUser(data);
  //     } catch (error) {
  //       console.error("Failed to fetch user:", error);
  //       navigate("/users");
  //     }
  //   };

  //   fetchUser();
  // }, [id, navigate]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!user) return;

  //   try {
  //     const response = await fetch(`/api/users/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(user),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update user");
  //     }

  //     navigate("/users");
  //   } catch (error) {
  //     console.error("Failed to update user:", error);
  //   }
  // };

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  const [user, setUser] = useState<User>({
    id: "1",
    fullname: "Minh Nguyen",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Vietnam",
    user_type: UserType.LOCAL,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated User:", user);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-2" htmlFor="fullname">Fullname</Label>
          <Input
            id="fullname"
            value={user.fullname}
            onChange={(e) => setUser({ ...user, fullname: e.target.value })}
          />
        </div>
        <div>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={user.role}
          onChange={(e) => {
            const selectedRole = e.target.value as Role;
            setUser({ ...user, role: selectedRole });
          }}
        >
          {Object.values(Role).map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>
        <div>
          <Label className="mb-2" htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="address">Address</Label>
          <Input
            id="address"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={user.nationality}
            onChange={(e) => setUser({ ...user, nationality: e.target.value })}
          />
        </div>
        <div>
        <label className="mb-2" htmlFor="user_type">User Type:</label>
        <select
          id="user_type"
          value={user.user_type}
          onChange={(e) => {
            const selectedUserType = e.target.value as UserType;
            setUser({ ...user, user_type: selectedUserType });
          }}
        >
          {Object.values(UserType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
        <div>
          <Label className="mb-2" htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={user.dob}
            onChange={(e) => setUser({ ...user, dob: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            value={user.phone_number}
            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="identity_number">Identity Number</Label>
          <Input
            id="identity_number"
            value={user.identity_number}
            onChange={(e) =>
              setUser({ ...user, identity_number: e.target.value })
            }
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};