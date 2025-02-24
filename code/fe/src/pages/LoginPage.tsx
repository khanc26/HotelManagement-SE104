const LoginPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
