import { DataTable } from "@/components/ui/data-table";
import { roomColumns } from "./room-columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms } from "@/api/rooms";
import { createBooking } from "@/api/bookings";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { useState, useRef, useEffect } from "react";
import { Room } from "@/types/room.type";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { toast } from "react-toastify";
import { roomPricingRules } from "@/utils/constants";
import { InputDatePicker } from "@/components/ui/input-date-picker";

// Zod schema for a single booking
const bookingSchema = z
  .object({
    roomId: z.string().trim(),
    guestCount: z.number().min(1, "Guest count must be at least 1"),
    startDate: z
      .string()
      .trim()
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }, "Start date must be today or later"),
    endDate: z
      .string()
      .trim()
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      }, "End date must be after today"),
    hasForeigners: z.boolean(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingCardProps {
  room: Room;
  onRemove: () => void;
  registerForm: (
    roomId: string,
    form: UseFormReturn<BookingFormValues>
  ) => void;
  formRefs: React.MutableRefObject<
    Map<string, UseFormReturn<BookingFormValues>>
  >;
}

function BookingCard({
  room,
  onRemove,
  registerForm,
  formRefs,
}: BookingCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomId: room.id,
      guestCount: 1,
      startDate: today,
      endDate: tomorrowStr,
      hasForeigners: false,
    },
  });

  const { watch } = form;
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const calculateTotalNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let basePrice = nights * room.roomType.roomPrice;
    const { watch } = form;
    const guestCount = watch("guestCount");
    const hasForeigners = watch("hasForeigners");

    // Apply foreign multiplier if applicable
    if (hasForeigners) {
      basePrice *= roomPricingRules.FOREIGN_MULTIPLIER;
    }

    // Apply group surcharge if applicable
    if (guestCount >= roomPricingRules.GROUP_SURCHARGE_THRESHOLD) {
      const surchargePercentage = roomPricingRules.GROUP_SURCHARGE_PERCENTAGE;
      const surcharge = (basePrice * surchargePercentage) / 100;
      basePrice += surcharge;
    }

    return basePrice;
  };

  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    registerForm(room.id, form);
    return () => {
      formRefs.current.delete(room.id);
    };
  }, [room.id, form, registerForm, formRefs]);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Room {room.roomNumber}</CardTitle>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          Remove
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Room Details:</p>
          <p>Type: {room.roomType.name}</p>
          <p>Max Guests: {room.roomType.maxGuests}</p>
          <p>Price per night: {formatCurrency(room.roomType.roomPrice)}</p>
          <p className="mt-2 font-semibold">
            Total for {calculateTotalNights()} nights:{" "}
            {formatCurrency(totalPrice)}
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputDatePicker
                control={form.control}
                name="startDate"
                label="Check-in Date"
                minDate={new Date(today)}
              />

              <InputDatePicker
                control={form.control}
                name="endDate"
                label="Check-out Date"
                minDate={new Date(startDate)}
              />
            </div>

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      min={1}
                      max={room.roomType.maxGuests}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum {room.roomType.maxGuests} guests allowed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasForeigners"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-black bg-white checked:bg-black checked:border-black focus:ring-2 focus:ring-black focus:ring-offset-white"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Foreign Guests</FormLabel>
                    <FormDescription>
                      Check if any guests are foreigners
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function UserRoomList() {
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const formRefs = useRef<Map<string, UseFormReturn<BookingFormValues>>>(
    new Map()
  );
  const queryClient = useQueryClient();

  const registerForm = (
    roomId: string,
    form: UseFormReturn<BookingFormValues>
  ) => {
    formRefs.current.set(roomId, form);
    // Subscribe to form changes
    const subscription = form.watch(() => {
      updateTotalAmount();
    });
    return () => subscription.unsubscribe();
  };

  const updateTotalAmount = () => {
    let total = 0;
    selectedRooms.forEach((room) => {
      const form = formRefs.current.get(room.id);
      if (form) {
        const values = form.getValues();
        const { startDate, endDate, guestCount, hasForeigners } = values;

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let roomTotal = nights * room.roomType.roomPrice;

          // Apply foreign multiplier if applicable
          if (hasForeigners) {
            roomTotal *= roomPricingRules.FOREIGN_MULTIPLIER;
          }

          // Apply group surcharge if applicable
          if (guestCount >= roomPricingRules.GROUP_SURCHARGE_THRESHOLD) {
            const surchargePercentage =
              roomPricingRules.GROUP_SURCHARGE_PERCENTAGE;
            const surcharge = (roomTotal * surchargePercentage) / 100;
            roomTotal += surcharge;
          }

          total += roomTotal;
        }
      }
    });
    setTotalAmount(total);
  };

  // Update total when rooms are added or removed
  useEffect(() => {
    updateTotalAmount();
  }, [selectedRooms]);

  const {
    data: rooms = [],
    isLoading: isRoomsLoading,
    isError: isRoomsError,
  } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });

  const { mutate: bookRooms, isPending: isSubmitting } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Your rooms have been booked successfully!");
      setSelectedRooms([]);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selected = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => rooms[Number(key)])
      .filter((room): room is Room => room?.status === "available");
    setSelectedRooms(selected);
  };

  const handleRemoveRoom = (roomId: string) => {
    setSelectedRooms((prev) => prev.filter((room) => room.id !== roomId));
    formRefs.current.delete(roomId);
  };

  const onSubmit = async () => {
    const forms = Array.from(formRefs.current.values());
    const formPromises = forms.map((form) => form.trigger());
    const validationResults = await Promise.all(formPromises);

    if (!validationResults.every(Boolean)) {
      toast.error("Please check all fields and try again.");
      return;
    }

    const bookingData = forms.map((form) => {
      const values = form.getValues();
      return {
        roomId: values.roomId,
        guestCount: values.guestCount,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        hasForeigners: values.hasForeigners,
      };
    });

    bookRooms(bookingData);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Pick your favorite room
          </CardTitle>
          <CardDescription>
            We still have a few rooms available for today — grab yours now!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRoomsLoading ? (
            <TableSkeleton />
          ) : isRoomsError ? (
            <TableError />
          ) : (
            <DataTable
              columns={roomColumns}
              data={rooms}
              onRowSelectionChange={handleRowSelectionChange}
            />
          )}
        </CardContent>
      </Card>

      {selectedRooms.length > 0 && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {selectedRooms.map((room) => (
              <BookingCard
                key={room.id}
                room={room}
                onRemove={() => handleRemoveRoom(room.id)}
                registerForm={registerForm}
                formRefs={formRefs}
              />
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    Total Amount: {formatCurrency(totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    For {selectedRooms.length} room(s)
                  </p>
                </div>
                <Button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="w-[200px]"
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
