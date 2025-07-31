import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/api/user/${id}`)
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => console.error(err));
  }, [id]);

  if (!user) return <div className="w-screen text-center mt-20 text-lg text-gray-500">Loading profile...</div>;

  return (
    <div className="flex justify-center items-center w-screen min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div className="mt-6 space-y-2 text-left">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Age:</span>
            <span className="text-gray-900">{user.age}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="text-gray-900">{user.gender}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
