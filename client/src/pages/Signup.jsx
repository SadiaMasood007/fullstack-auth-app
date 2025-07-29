import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Select gender" }),
  age: z.number().min(13, "Must be 13 or older"),
  image: z.any().optional(),
});

export default function Signup() {
  const nav = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await fetch(`${import.meta.env.VITE_URL_vercel}/api/oauth/google-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        if (!data.user.age || !data.user.gender) {
          nav("/complete-profile");
        } else {
          nav("/dashboard");
        }
      } else {
        alert(data.message || "Google signup failed");
      }
    } catch (err) {
      alert("Google OAuth error");
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) formData.append(key, data[key]);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("${import.meta.env.VITE_URL_vercel}/api/signup", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        alert("Signup successful! Please log in.");
        nav("/login");
      } else {
        alert(json.message || "Signup failed");
      }
    } catch (err) {
      alert("Network or server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200 bg-white p-6 rounded-xl">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create Your Account
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Sign up with Google or Email
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-6">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => alert("Google OAuth failed")}
              />
              <p className="mt-2 text-sm text-gray-500">Quick signup with Google</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3"
              encType="multipart/form-data"
            >
              <div>
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Label>Password</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Name</Label>
                  <Input {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <Label>Gender</Label>
                  <select
                    {...register("gender")}
                    className="border rounded w-full p-2 text-gray-700 focus:ring focus:ring-blue-200"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                </div>

                <div>
                  <Label>Age</Label>
                  <Input type="number" {...register("age", { valueAsNumber: true })} />
                  {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
                </div>
              </div>

              <div>
                <Label>Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Sign Up
              </Button>
            </form>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
