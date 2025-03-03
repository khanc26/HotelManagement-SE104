import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/ui/data-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Room, roomColumns } from "@/features/room/components/room-columns";

const data: Room[] = [
  {
    id: "1",
    name: "Deluxe Suite",
    type: "Suite",
    price: 200,
    note: "Ocean view",
    status: "occupied",
  },
  {
    id: "2",
    name: "Standard Room",
    type: "Single",
    price: 100,
    note: undefined,
    status: "available",
  },
  {
    id: "3",
    name: "Family Room",
    type: "Double",
    price: 150,
    note: "Extra bed available",
    status: "available",
  },
  {
    id: "4",
    name: "Penthouse",
    type: "Suite",
    price: 500,
    note: "Private pool",
    status: "occupied",
  },
  {
    id: "5",
    name: "Budget Room",
    type: "Single",
    price: 50,
    note: "No air conditioning",
    status: "unknown",
  },
];

const RoomsPage = () => {
  return (
    <div className="p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <SidebarTrigger className="text-black bg-white" />
          <BreadcrumbSeparator>|</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rooms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Room #1</h2>
          <p>Available for booking</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Room #2</h2>
          <p>Currently occupied</p>
        </div>
      </div>

      <DataTable columns={roomColumns} data={data} />
    </div>
  );
};

export default RoomsPage;
