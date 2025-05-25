import { getConfiguration } from "@/api/configurations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

type ParamItem = {
  paramName: string;
  paramValue: number;
  description?: string;
};

export function ConfigurationParams() {

  const navigate = useNavigate();

  const form = useForm<Record<string, number>>({
    defaultValues: {},
  });

  const {
    data: params,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["params"],
    queryFn: getConfiguration,
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

  useEffect(() => {
    if (params) {
      params.forEach((param: ParamItem) => {
        form.setValue(param.paramName, param.paramValue); 
      });
    }
  }, [params, form]);
  
  return (
    <Card className="w-full h-full mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">System Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading configuration.</div>
        ) : (
          <div className="flex">
            <div className="w-1 flex-1">
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {params.map((param: ParamItem) => (
                      <FormField
                        key={param.paramName}
                        control={form.control}
                        name={param.paramName}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{param.paramName}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled
                                className="font-semibold"
                              />
                            </FormControl>
                            {param.description && (
                              <p className="text-sm text-muted-foreground">
                                {param.description}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}