import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../utils/axios.instance";
import { login as authLogin } from "../../store/authSlice";
import { Input, Button, Logo, Loader } from "../index";

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const createUser = async (data) => {
        setError("");
        setLoading(true);
        
        try {
            // Because we pass files (avatar/coverImage), we MUST use FormData
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username.toLowerCase());
            formData.append("email", data.email);
            formData.append("password", data.password);
            
            // `data.avatar` is a FileList array injected by react-hook-form, so grab the first item [0]
            if (data.avatar[0]) {
                formData.append("avatar", data.avatar[0]);
            }
            if (data.coverImage && data.coverImage[0]) {
                formData.append("coverImage", data.coverImage[0]);
            }

            // Let Axios handle the Content-Type header boundary automatically for FormData
            const response = await axiosInstance.post("/users/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // The user was created, auto login them or wait for them to manually login
            const userData = response.data.message;
            if (userData) {
               // You can redirect to login page here, or log them in immediately!
               navigate("/login"); 
            }
        } catch (err) {
             // First, see if the backend expressly sent a message we can read
            const backendMessage = err.response?.data?.message;

            // If the status is 409, we know exactly what conflict occurred
            if (err.response?.status === 409) {
                setError(backendMessage || "A user with this email or username already exists. Please try another one.");
            } else {
                // Generic fallback for other errors (like 500 server error or validation fail)
                setError(backendMessage || "Registration failed. Please make sure all your information is correct.");
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex items-center justify-center w-full mb-10 mt-5">
            <div className="mx-auto w-full max-w-lg bg-gray-900 rounded-xl p-10 border border-gray-700 shadow-xl">
                <div className="flex justify-center mb-4"><Logo /></div>
                <h2 className="text-2xl font-bold leading-tight text-center text-white">Sign up for an account</h2>
                
                {error && <p className="mt-8 text-center text-red-500">{error}</p>}
                
                <form onSubmit={handleSubmit(createUser)} className="mt-8">
                    <div className="space-y-4">
                        <Input
                            label="Full Name: *"
                            placeholder="Enter your full name"
                            {...register("fullName", { required: true })}
                        />
                        <Input
                            label="Username: *"
                            placeholder="Enter a unique username"
                            {...register("username", { required: true })}
                        />
                        <Input
                            label="Email: *"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", { required: true })}
                        />
                        <Input
                            label="Password: *"
                            type="password"
                            placeholder="Create a strong password"
                            {...register("password", { required: true })}
                        />
                        
                        {/* File Uploads handling */}
                        <Input
                            label="Avatar Image: *"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            {...register("avatar", { required: true })}
                        />
                        <Input
                            label="Cover Image: (Optional)"
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            {...register("coverImage")}
                        />
                        
                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? <Loader /> : "Create Account"}
                        </Button>
                    </div>
                </form>
                <p className="mt-4 text-base text-center text-gray-400">
                    Already have an account?&nbsp;
                    <Link to="/login" className="text-amber-500 transition-all duration-200 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}