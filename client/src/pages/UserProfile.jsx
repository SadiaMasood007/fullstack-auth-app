// src/pages/UserProfile.jsx
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

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10 text-center">
      <img
        src={user.image || "/default-avatar.png"}
        alt="Profile"
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-bold mt-4">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <p>Age: {user.age}</p>
      <p>Gender: {user.gender}</p>
    </div>
  );
}
