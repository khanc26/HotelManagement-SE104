const SettingsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Application Settings</h2>
          <p>Theme: Light</p>
          <p>Language: English</p>
          <p>Notifications: Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 