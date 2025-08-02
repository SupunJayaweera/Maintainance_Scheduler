import { fetchData, updateData } from "@/lib/fetch-utils";
import type {
  ChangePasswordFormData,
  ProfileFormData,
} from "@/routes/user/profile";
import { useMutation, useQuery, type QueryKey } from "@tanstack/react-query";

const queryKey: QueryKey = ["user"];

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey,
    queryFn: () => fetchData("/user/profile"),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      updateData("/user/change-password", data),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileFormData) => updateData("/user/profile", data),
  });
};
