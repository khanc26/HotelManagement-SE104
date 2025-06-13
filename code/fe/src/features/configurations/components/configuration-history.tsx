import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getConfigurationHistory } from "@/api/configurations";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { configurationColumns } from "./configuration-columns";

export function ConfigurationHistory() {
  const navigate = useNavigate();
  const [searchParams] = useState({});

  const {
    data: configurations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["configurations", searchParams],
    queryFn: () => getConfigurationHistory(),
  });

  if (isError) {
    const errorData = GetAPIErrorResponseData(error);
    if (errorData.statusCode === 401) {
      toast.error("Unauthorized. Navigating to sign-in page in 3 seconds");
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 3000);
    } else
      toast.error(
        "Error while getting configurations " +
          errorData.statusCode +
          " " +
          errorData.message
      );
  }

  return (
    <Card className="w-full h-full mb-4 border-black/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Configuration History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View a log of recent changes made to the system configuration,
          including updates to guest limits, fees, and more.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>An error has occurred!</div>
        ) : (
          <div className="flex">
            <div className="w-1 flex-1">
              <DataTable
                columns={configurationColumns}
                data={configurations || []}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
