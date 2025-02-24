const RoomsPage = () => {
  return (
    <div className="p-8">
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
    </div>
  );
};

export default RoomsPage; 