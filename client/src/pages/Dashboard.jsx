import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaUsers, FaRegEdit, FaClock, FaLightbulb } from "react-icons/fa";

export default function Dashboard() {
  const [myProfile, setMyProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", age: "", gender: "", image: null });

  useEffect(() => {
    fetchMyProfile();
    fetchUsers();
  }, []);

  const fetchMyProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyProfile(data);
    setEditData({ name: data.name, age: data.age, gender: data.gender, image: null });
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("age", editData.age);
    formData.append("gender", editData.gender);
    if (editData.image) formData.append("image", editData.image);

    const res = await fetch("http://localhost:5000/api/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const json = await res.json();
    if (res.ok) {
      setMyProfile(json.user || json);
      fetchUsers();
      setIsModalOpen(false);
    } else {
      alert(json.message || "Failed to update profile");
    }
  };

  const filteredUsers = myProfile ? users.filter((user) => user.id !== myProfile.id) : users;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
      
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, {myProfile?.name || "User"}!
          </h1>
          <p className="text-gray-600 mt-2">
            This is your personalized dashboard where you can manage your profile and explore other users.
          </p>
        </div>

     
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-white shadow-md text-center">
            <CardTitle className="text-lg font-semibold text-gray-800">Total Users</CardTitle>
            <CardContent className="text-2xl font-bold text-blue-600">{users.length}</CardContent>
          </Card>
          <Card className="p-4 bg-white shadow-md text-center">
            <CardTitle className="text-lg font-semibold text-gray-800">Your Age</CardTitle>
            <CardContent className="text-2xl font-bold text-green-600">
              {myProfile?.age || "--"}
            </CardContent>
          </Card>
          <Card className="p-4 bg-white shadow-md text-center">
            <CardTitle className="text-lg font-semibold text-gray-800">Your Gender</CardTitle>
            <CardContent className="text-2xl font-bold text-purple-600">
              {myProfile?.gender || "--"}
            </CardContent>
          </Card>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
          <div className="lg:col-span-1">
            {myProfile && (
              <Card className="p-6 shadow-lg rounded-lg bg-white flex flex-col items-center">
                <img
                  src={myProfile.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                />
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900">{myProfile.name}</h2>
                  <p className="text-gray-600">{myProfile.email}</p>
                  <p className="text-sm text-gray-500">Age: {myProfile.age}</p>
                  <p className="text-sm text-gray-500">Gender: {myProfile.gender}</p>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 "
                >
                   <FaRegEdit />Edit Profile
                </Button>
               
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="w-full mt-2 bg-red-500 hover:bg-red-600 "
      >
        Logout
      </Button>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="p-4 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-gray-800 text-lg">Explore Users</CardTitle>
                <p className="text-sm text-gray-500">Here’s a list of other registered users.</p>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 text-center bg-gray-50 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={user.image || "/default-avatar.png"}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover border"
                    />
                    <h3 className="mt-2 font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

     
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Edit Profile</h3>
            <div className="space-y-3">
              <Label>Name</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />

              <Label>Age</Label>
              <Input
                type="number"
                value={editData.age}
                onChange={(e) => setEditData({ ...editData, age: e.target.value })}
              />

              <Label>Gender</Label>
              <select
                className="border rounded w-full p-2 text-gray-700"
                value={editData.gender}
                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveProfile} className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
