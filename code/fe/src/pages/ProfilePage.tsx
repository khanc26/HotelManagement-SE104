const ProfilePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
          <p>Role: Administrator</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 