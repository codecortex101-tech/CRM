import { getUserRole, getUserName } from "../utils/auth";

export default function TopBar() {
  const role = getUserRole();
  const name = getUserName();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">CRM Dashboard</h1>
        <p className="text-gray-400">
          Welcome back, <span className="font-semibold">{name}</span>
          <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
            {role}
          </span>
        </p>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="border px-4 py-2 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
}
