import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldValues, Path } from "react-hook-form";

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  minDate?: Date;
  className?: string;
}

export function InputDatePicker<T extends FieldValues>({
  control,
  name,
  label = "Date",
  description = "Please select a date.",
  minDate,
  className,
}: DatePickerProps<T>) {
  const normalizedMinDate = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(selectedDate) => {
                  const dateString = selectedDate
                    ? format(selectedDate, "yyyy-MM-dd")
                    : undefined;
                  field.onChange(dateString);
                }}
                disabled={
                  normalizedMinDate
                    ? (date) =>
                        date <
                        new Date(
                          normalizedMinDate.getFullYear(),
                          normalizedMinDate.getMonth(),
                          normalizedMinDate.getDate()
                        )
                    : undefined
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
