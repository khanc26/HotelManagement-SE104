import { getConfiguration, updateConfiguration } from "@/api/configurations";
import { Button } from "@/components/ui/button";
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
import { ConfigurationParam } from "@/types/configuration.";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";



export function ConfigurationEdit() {
  const queryClient = useQueryClient();
  const form = useForm<Record<string, number>>();

  const {
    data: params,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["configuration"],
    queryFn: getConfiguration,
  });

  const updateMutation = useMutation({
    mutationFn: ({ paramName, value }: { paramName: string; value: number }) =>
      updateConfiguration(paramName, { paramValue: value }),
    onSuccess: () => {
      toast.success("Configuration updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    },
  });

  useEffect(() => {
    if (params) {
      const defaultValues: Record<string, number> = {};
      params.forEach((param: ConfigurationParam) => {
        defaultValues[param.paramName] = param.paramValue;
      });
      form.reset(defaultValues);
    }
  }, [params, form]);

  const onSubmit = form.handleSubmit((data) => {
    for (const [paramName, value] of Object.entries(data)) {
      if (paramName === "max_guests_per_room" && !Number.isInteger(value)) {
        toast.error("max_guests_per_room must be an integer", {
          position: "top-right",
        });
        return; 
      }
    }
  
    Object.entries(data).forEach(([paramName, value]) => {
      updateMutation.mutate({ paramName, value });
    });
  });
  

  return (
    <Card className="w-full h-full mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Edit System Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading configuration</div>
        ) : (
          <div className="flex">
            <div className="w-1 flex-1">
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {params?.map((param: ConfigurationParam) => (
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
                                disabled={updateMutation.isPending}
                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}