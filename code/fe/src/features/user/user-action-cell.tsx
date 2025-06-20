
import { demoteToUser, lockAccount, promoteToAdmin } from "@/api/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Create a separate component for the actions cell
export function UserActionsCell({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lockAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log(`User ${user.id} locked successfully`);
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error("Error deleting user: " + errorMessage);
    },
  });
  

  const promoteMutation = useMutation({
    mutationFn: (userId: string) => promoteToAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User promoted to admin successfully");
    }
  });

  const demoteMutation = useMutation({
    mutationFn: (userId: string) => demoteToUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User demoted to regular user successfully");
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate(user.id);
  };

  const handlePromote = () => {
    promoteMutation.mutate(user.id);
  };

  const handleDemote = () => {
    demoteMutation.mutate(user.id);
  };

  const isAdmin = user.role.roleName === "admin";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              to={`/users/edit?id=${user.id}`}
              onClick={() =>
                queryClient.setQueryData<User>(["edit-user"], user)
              }
            >
              <p className="text-sm font-normal">Edit</p>
            </Link>
          </DropdownMenuItem>

          {!isAdmin ? (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Promote to Admin
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Promote to Admin</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to promote {user.profile.fullName} to admin?
                    This will give them administrative privileges.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={handlePromote}
                    disabled={promoteMutation.isPending}
                  >
                    {promoteMutation.isPending ? "Promoting..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Demote to User
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Demote to User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to demote {user.profile.fullName} to a regular user?
                    This will remove their administrative privileges.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDemote}
                    disabled={demoteMutation.isPending}
                  >
                    {demoteMutation.isPending ? "Demoting..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to permanently
                  delete user{" "}
                  <span className="font-semibold inline text-black underline">
                    {user.profile.fullName}
                  </span>
                  ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
