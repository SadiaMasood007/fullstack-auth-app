import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompleteProfile() {
  const nav = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again");
      return nav("/signup");
    }

    const formData = new FormData();
    formData.append("age", age);
    formData.append("gender", gender);
    if (image) formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile completed!");
      nav("/login");
    } else {
      alert(data.message || "Profile update failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg bg-white p-6 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Complete Your Profile
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Fill in the missing details to continue.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label>Age</Label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <div>
              <Label>Gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border rounded w-full p-2 text-gray-700 focus:ring focus:ring-blue-200"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label>Profile Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Save & Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
