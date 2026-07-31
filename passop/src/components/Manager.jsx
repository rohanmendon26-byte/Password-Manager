// Manager.jsx (Updated with MongoDB Backend Integration)
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
    // =========================
    // API CONFIGURATION
    // =========================
   const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/passwords`;

    // References
    const ref = useRef();
    const passwordRef = useRef();

    // Form data
    const [form, setForm] = useState({
        site: "",
        username: "",
        password: ""
    });

    // All passwords
    const [passwordArray, setPasswordArray] = useState([]);

    // ID of password currently being edited
    const [editId, setEditId] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(false);

    // =========================
    // API FUNCTIONS
    // =========================

    // Fetch all passwords from backend
    const fetchPasswords = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const result = await response.json();

            if (result.success) {
                setPasswordArray(result.data);
            } else {
                toast.error('Failed to fetch passwords');
            }
        } catch (error) {
            console.error('Error fetching passwords:', error);
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    // Save password to backend
    const savePasswordToDB = async (password) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(password),
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error saving password:', error);
            toast.error('Failed to save password');
            return false;
        }
    };

    // Update password in backend
    const updatePasswordInDB = async (id, password) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(password),
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password');
            return false;
        }
    };

    // Delete password from backend
    const deletePasswordFromDB = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Error deleting password:', error);
            toast.error('Failed to delete password');
            return false;
        }
    };

    // =========================
    // LOAD PASSWORDS ON MOUNT
    // =========================

    useEffect(() => {
        fetchPasswords();
    }, []);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // SHOW / HIDE PASSWORD
    // =========================

    const showPassword = () => {
        if (ref.current.src.includes("eyecross.png")) {
            ref.current.src = "/icons/eye.png";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "/icons/eyecross.png";
            passwordRef.current.type = "text";
        }
    };

    // =========================
    // SAVE / UPDATE PASSWORD
    // =========================

    const savePassword = async () => {
        // Check empty fields
        if (
            form.site.trim() === "" ||
            form.username.trim() === "" ||
            form.password.trim() === ""
        ) {
            toast.error("Please fill all the fields!");
            return;
        }

        setLoading(true);
        let success;

        // EDIT EXISTING PASSWORD
        if (editId) {
            success = await updatePasswordInDB(editId, form);

            if (success) {
                const updatedPasswords = passwordArray.map((item) =>
                    item.id === editId
                        ? {
                            ...form,
                            id: editId
                        }
                        : item
                );
                setPasswordArray(updatedPasswords);
                toast.success("Password updated successfully!");
                setEditId(null);
            }
        }
        // ADD NEW PASSWORD
        else {
            const newPassword = {
                ...form,
                id: uuidv4()
            };

            success = await savePasswordToDB(newPassword);

            if (success) {
                setPasswordArray([...passwordArray, newPassword]);
                toast.success("Password saved successfully!");
            }
        }

        if (success) {
            // Clear form
            setForm({
                site: "",
                username: "",
                password: ""
            });

            // Hide password after saving
            passwordRef.current.type = "password";

            if (ref.current) {
                ref.current.src = "/icons/eye.png";
            }
        }

        setLoading(false);
    };

    // =========================
    // EDIT PASSWORD
    // =========================

    const editPassword = (id) => {
        const passwordToEdit = passwordArray.find(
            (item) => item.id === id
        );

        if (!passwordToEdit) return;

        setForm({
            site: passwordToEdit.site,
            username: passwordToEdit.username,
            password: passwordToEdit.password
        });

        setEditId(id);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        toast.info("Password loaded for editing!");
    };

    // =========================
    // DELETE PASSWORD
    // =========================

    const deletePassword = async (id) => {
        // Confirmation
        if (!window.confirm("Are you sure you want to delete this password?")) {
            return;
        }

        setLoading(true);
        const success = await deletePasswordFromDB(id);

        if (success) {
            const updatedPasswords = passwordArray.filter(
                (item) => item.id !== id
            );

            setPasswordArray(updatedPasswords);

            // If deleting the password currently being edited
            if (editId === id) {
                setEditId(null);

                setForm({
                    site: "",
                    username: "",
                    password: ""
                });
            }

            toast.success("Password deleted successfully!");
        }

        setLoading(false);
    };

    // =========================
    // COPY TO CLIPBOARD
    // =========================

    const copyText = (text, message) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    return (
        <>
            {/* =========================
                TOAST CONTAINER
            ========================= */}

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />

            {/* =========================
                BACKGROUND
            ========================= */}

            <div className="absolute top-0 -z-10 h-full w-full bg-green-50">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]">
                </div>
            </div>

            {/* =========================
                MAIN CONTAINER
            ========================= */}

            <div className="mycontainer px-4 sm:px-6 md:px-8">

                {/* =========================
                    LOGO
                ========================= */}

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center pt-6">
                    <span className="text-green-700">
                        &lt;
                    </span>

                    <span>
                        Pass
                    </span>

                    <span className="text-green-500">
                        OP/&gt;
                    </span>
                </h1>

                <p className="text-green-900 text-base sm:text-lg text-center">
                    Your own Password Manager
                </p>

                {/* =========================
                    FORM
                ========================= */}

                <div className="text-black flex flex-col p-4 gap-4 sm:gap-6 md:gap-8 items-center">

                    {/* WEBSITE */}
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-500 w-full p-3 sm:p-4 py-2 text-sm sm:text-base"
                        type="text"
                        name="site"
                        disabled={loading}
                    />

                    <div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-8">

                        {/* USERNAME */}
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="rounded-full border border-green-500 w-full p-3 sm:p-4 py-2 text-sm sm:text-base"
                            type="text"
                            name="username"
                            disabled={loading}
                        />

                        {/* PASSWORD */}
                        <div className="relative w-full">
                            <input
                                ref={passwordRef}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-500 w-full p-3 sm:p-4 py-2 pr-10 sm:pr-12 text-sm sm:text-base"
                                type="password"
                                name="password"
                                disabled={loading}
                            />

                            {/* EYE ICON */}
                            <span
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={showPassword}
                            >
                                <img
                                    ref={ref}
                                    className="p-1 w-6 sm:w-7"
                                    src="/icons/eye.png"
                                    alt="Show password"
                                />
                            </span>
                        </div>
                    </div>

                    {/* =========================
                        ADD / UPDATE BUTTON
                    ========================= */}

                    <button
                        onClick={savePassword}
                        disabled={loading}
                        className="flex justify-center items-center gap-2 sm:gap-4 bg-green-400 rounded-full hover:bg-green-300 px-6 sm:px-8 py-2 w-full sm:w-fit border border-green-900 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover"
                            style={{ width: "25px", height: "25px" }}
                        >
                        </lord-icon>
                        <span className="font-semibold">
                            {loading ? "Processing..." : (editId ? "Update Password" : "Save")}
                        </span>
                    </button>
                </div>

                {/* =========================
                    PASSWORDS SECTION
                ========================= */}

                <div className="passwords px-4 pb-8">

                    <h2 className="font-bold text-xl sm:text-2xl py-4">
                        Your Passwords
                    </h2>

                    {/* LOADING STATE */}
                    {loading && passwordArray.length === 0 && (
                        <div className="text-center py-8 text-gray-600">
                            Loading passwords...
                        </div>
                    )}

                    {/* NO PASSWORDS */}
                    {!loading && passwordArray.length === 0 && (
                        <div className="text-center py-8 text-gray-600">
                            No passwords to show
                        </div>
                    )}

                    {/* PASSWORD TABLE */}
                    {passwordArray.length !== 0 && (
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="table-auto w-full rounded-md overflow-hidden min-w-[600px]">

                                {/* TABLE HEADER */}
                                <thead className="bg-green-800 text-white">
                                    <tr>
                                        <th className="py-2 px-2 sm:px-4 text-sm sm:text-base">
                                            Site
                                        </th>

                                        <th className="py-2 px-2 sm:px-4 text-sm sm:text-base">
                                            Username
                                        </th>

                                        <th className="py-2 px-2 sm:px-4 text-sm sm:text-base">
                                            Password
                                        </th>

                                        <th className="py-2 px-2 sm:px-4 text-sm sm:text-base">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                {/* TABLE BODY */}
                                <tbody className="bg-green-100">
                                    {passwordArray.map((item) => (
                                        <tr key={item.id}>

                                            {/* =========================
                                                SITE
                                            ========================= */}

                                            <td className="py-2 px-2 sm:px-4 border border-white">
                                                <div className="flex justify-center items-center gap-2">
                                                    <a
                                                        href={
                                                            item.site.startsWith("http")
                                                                ? item.site
                                                                : `https://${item.site}`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-700 hover:underline text-sm sm:text-base truncate max-w-[100px] sm:max-w-none"
                                                    >
                                                        {item.site}
                                                    </a>

                                                    <div onClick={() => copyText(item.site, "Website copied!")} className="cursor-pointer">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* =========================
                                                USERNAME
                                            ========================= */}

                                            <td className="py-2 px-2 sm:px-4 border border-white">
                                                <div className="flex justify-center items-center gap-2">
                                                    <span className="text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                                                        {item.username}
                                                    </span>

                                                    <div onClick={() => copyText(item.username, "Username copied!")} className="cursor-pointer">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* =========================
                                                PASSWORD
                                            ========================= */}

                                            <td className="py-2 px-2 sm:px-4 border border-white">
                                                <div className="flex justify-center items-center gap-2">
                                                    <span className="text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                                                        {item.password}
                                                    </span>

                                                    <div onClick={() => copyText(item.password, "Password copied!")} className="cursor-pointer">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover"
                                                            style={{ width: "20px", height: "20px" }}
                                                        >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* =========================
                                                EDIT / DELETE
                                            ========================= */}

                                            <td className="py-2 px-2 sm:px-4 border border-white">
                                                <div className="flex justify-center items-center gap-2 sm:gap-3">

                                                    {/* EDIT */}
                                                    <Pencil
                                                        size={16}
                                                        className="cursor-pointer text-green-700 hover:text-green-500 sm:w-[18px] sm:h-[18px]"
                                                        onClick={() => editPassword(item.id)}
                                                        title="Edit password"
                                                    />

                                                    {/* DELETE */}
                                                    <Trash2
                                                        size={16}
                                                        className="cursor-pointer text-red-600 hover:text-red-400 sm:w-[18px] sm:h-[18px]"
                                                        onClick={() => deletePassword(item.id)}
                                                        title="Delete password"
                                                    />
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
};

export default Manager;