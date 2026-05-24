import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosinstance';
import { useContext } from 'react';
import { UserContext } from '../../context/useContext';
import uploadImage from '../../utils/uploadImage';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);

    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    //Handle Signup form

    const handleSignUp = async (e) => {
        e.preventDefault();

        let profileImageUrl = "";

        if (!fullName) {
            setError("Please enter your name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError(null);

        // SignUp API call
        try {
            //upload Image if present

            if(profilePic){
                const imgUploadRes = await uploadImage(profilePic);

                profileImageUrl = imgUploadRes.imageUrl || "";
            }


            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER , {
                fullName ,
                email ,
                password,
                profileImageUrl
            });

            const { token , user} = response.data;

            if(token) {
                localStorage.setItem("token" , token);
                updateUser(user);
                navigate("/dashboard");
            }


        } catch (error) {
            if(error.response && error.response.data.message){
                setError(error.response.data.message);
            }
            else{
                setError("Something went wrong. Please try again")
            }
        }


    }
    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className='text-xs text-slate-700 mt-[5px] mb-6'>
                    Join us today by entering your details below.
                </p>

                <form onSubmit={handleSignUp}>

                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="FullName"
                            placeholder="Jhon"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email Address"
                            placeholder='jhon@example.com'
                            type="text"
                        />
                        <div className="col-span-2">
                            <Input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                label="Password"
                                placeholder="Min 8 Characters"
                                type="password"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                    <button type="submit" className='btn-primary cursor-pointer '>SIGN UP</button>
                    <p className='text-[13px] text-slate-800 mt-3'>
                        Already have an account?{" "}
                        <Link className="text-cyan-900" to="/login">Login here</Link>
                    </p>
                </form>
            </div>

        </AuthLayout>
    )
}

export default SignUp