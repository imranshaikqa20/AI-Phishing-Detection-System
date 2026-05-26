"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import api, {

  isAuthenticated,

  isAdmin

} from "../../../services/api";

import AdminNavbar from "../../../components/AdminNavbar";

export default function AdminUsersPage() {

  const router = useRouter();

  // =========================
  // STATES
  // =========================

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // =========================
  // AUTH CHECK + LOAD USERS
  // =========================

  useEffect(() => {

    // =========================
    // CHECK LOGIN
    // =========================

    if (!isAuthenticated()) {

      router.push(
        "/auth/login"
      );

      return;
    }

    // =========================
    // CHECK ADMIN ROLE
    // =========================

    if (!isAdmin()) {

      router.push(
        "/dashboard"
      );

      return;
    }

    // =========================
    // LOAD USERS
    // =========================

    fetchUsers();

  }, [router]);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(
          "/admin/users"
        );

      console.log(response.data);

      setUsers(
        response.data.users || []
      );

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed To Load Users"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // DISABLE USER
  // =========================

  const disableUser = async (id) => {

    try {

      setActionLoading(true);

      const response =
        await api.put(
          `/admin/disable/${id}`
        );

      setMessage(
        response.data.message
      );

      fetchUsers();

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed To Disable User"
      );

    } finally {

      setActionLoading(false);
    }
  };

  // =========================
  // ENABLE USER
  // =========================

  const enableUser = async (id) => {

    try {

      setActionLoading(true);

      const response =
        await api.put(
          `/admin/enable/${id}`
        );

      setMessage(
        response.data.message
      );

      fetchUsers();

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed To Enable User"
      );

    } finally {

      setActionLoading(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (

    id,

    role

  ) => {

    // =========================
    // PREVENT ADMIN DELETE
    // =========================

    if (
      role ===
      "ROLE_ADMIN"
    ) {

      setMessage(
        "Admin Account Cannot Be Deleted"
      );

      return;
    }

    const confirmDelete =

      confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) {

      return;
    }

    try {

      setActionLoading(true);

      const response =
        await api.delete(
          `/admin/delete/${id}`
        );

      setMessage(
        response.data.message
      );

      fetchUsers();

    } catch (error) {

      console.log(error);

      setMessage(
        "Failed To Delete User"
      );

    } finally {

      setActionLoading(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
          text-3xl
          font-bold
        "
      >
        Loading Users...
      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-black
        via-slate-950
        to-gray-900
        text-white
        p-6
      "
    >

      {/* =========================
          ADMIN NAVBAR
      ========================= */}

      <AdminNavbar />

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-bold
            mb-3
          "
        >
          User Management
        </h1>

        <p
          className="
            text-gray-400
            text-lg
          "
        >
          Manage platform users,
          roles, permissions,
          and account activity.
        </p>

      </div>

      {/* =========================
          RESPONSE MESSAGE
      ========================= */}

      {
        message && (

          <div
            className="
              mb-6
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-300
              p-4
              rounded-2xl
              font-medium
            "
          >
            {message}
          </div>
        )
      }

      {/* =========================
          USERS TABLE
      ========================= */}

      <div
        className="
          overflow-x-auto
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          p-6
        "
      >

        <table
          className="
            w-full
            text-left
          "
        >

          {/* =========================
              TABLE HEADER
          ========================= */}

          <thead>

            <tr
              className="
                border-b
                border-white/20
              "
            >

              <th className="p-4">
                ID
              </th>

              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Role
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Login Count
              </th>

              <th className="p-4">
                Actions
              </th>

            </tr>

          </thead>

          {/* =========================
              TABLE BODY
          ========================= */}

          <tbody>

            {
              users.length > 0

                ?

                users.map((user) => (

                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-white/10
                      hover:bg-white/5
                      transition
                    "
                  >

                    {/* ID */}

                    <td className="p-4">
                      {user.id}
                    </td>

                    {/* NAME */}

                    <td className="p-4">
                      {user.name}
                    </td>

                    {/* EMAIL */}

                    <td className="p-4 break-all">
                      {user.email}
                    </td>

                    {/* ROLE */}

                    <td className="p-4">

                      <span
                        className={`
                          px-4
                          py-1
                          rounded-full
                          text-sm
                          font-semibold

                          ${
                            user.role ===
                            "ROLE_ADMIN"

                              ? "bg-yellow-500/20 text-yellow-300"

                              : "bg-cyan-500/20 text-cyan-300"
                          }
                        `}
                      >
                        {user.role}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      {
                        user.active

                          ? (

                            <span
                              className="
                                text-green-400
                                font-semibold
                              "
                            >
                              Active
                            </span>
                          )

                          : (

                            <span
                              className="
                                text-red-400
                                font-semibold
                              "
                            >
                              Disabled
                            </span>
                          )
                      }

                    </td>

                    {/* LOGIN COUNT */}

                    <td className="p-4">
                      {user.loginCount || 0}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-3
                        "
                      >

                        {
                          user.active

                            ? (

                              <button
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  disableUser(
                                    user.id
                                  )
                                }
                                className="
                                  bg-orange-500
                                  hover:bg-orange-600
                                  px-4
                                  py-2
                                  rounded-xl
                                  text-sm
                                  font-semibold
                                  transition
                                "
                              >
                                Disable
                              </button>
                            )

                            : (

                              <button
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  enableUser(
                                    user.id
                                  )
                                }
                                className="
                                  bg-green-500
                                  hover:bg-green-600
                                  px-4
                                  py-2
                                  rounded-xl
                                  text-sm
                                  font-semibold
                                  transition
                                "
                              >
                                Enable
                              </button>
                            )
                        }

                        <button
                          disabled={
                            actionLoading
                          }
                          onClick={() =>
                            deleteUser(
                              user.id,
                              user.role
                            )
                          }
                          className="
                            bg-red-500
                            hover:bg-red-600
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            font-semibold
                            transition
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))

                :

                <tr>

                  <td
                    colSpan="7"
                    className="
                      text-center
                      p-10
                      text-gray-400
                    "
                  >
                    No Users Found
                  </td>

                </tr>
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}