// src/components/UsersDelLayer.jsx
"use client";
import { useUserStatus } from "@/context/UserStatusContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbRestore, TbTrash } from "react-icons/tb";
import Swal from "sweetalert2";

const UsersDelLayer = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { triggerRefresh } = useUserStatus();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    try {
      const res = await fetch(`/api/customers/deleteduserslist`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDeletedUsers(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch deleted users", err);
    }
  };

  const handleRestore = async (id) => {
    try {
      const res = await fetch("/api/customers/restoreuser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Restore failed");
      }
      setDeletedUsers((prev) => prev.filter((user) => user._id !== id));
      triggerRefresh(); // notify counts component
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/customers/deleteduserslist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User deleted permanently!",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setDeletedUsers((prev) => prev.filter((user) => user._id !== id));
      triggerRefresh(); // notify counts component
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  //Filtered users based on search term
  const filteredUsers = deletedUsers.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Dynamic page range sliding window
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (loading) {
    return <div>Loading Deleted Users...</div>;
  }
  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <form className="navbar-search">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
        </div>
      </div>
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Deleted Date & Time</th>
                <th scope="col">Name</th>
                <th scope="col">Email ID</th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No deleted users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <tr key={user._id || idx}>
                    <td>{indexOfFirstUser + idx + 1}</td>
                    <td>
                      <span className={`px-10 py-2 radius-4 fw-medium text-xs`}>
                        {/* {user.date}*/}
                        {user.deletedAt
                          ? new Date(user.deletedAt).toLocaleString()
                          : "—"}
                      </span>
                    </td>
                    <td>{user.fullName}</td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light">
                        {user.email}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <button
                          type="button"
                          onClick={() => handleRestore(user._id)} //Restore user logic
                          className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-90-px h-40-px d-flex justify-content-center align-items-center radius-8"
                        >
                          <TbRestore /> Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user._id)} //Delete permanent user logic
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        >
                          <Icon
                            icon="fluent:delete-24-regular"
                            className="menu-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
          {/* <span>Showing 1 to 10 of 12 entries</span> */}
          <span>
            Showing {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </span>
          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li className="page-item">
              <Link
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <Icon icon="ep:d-arrow-left" className="" />
              </Link>
            </li>
            {/* {[1,2,3,4,5].map((num) => (
                <li className='page-item' key={num}>
                  <Link
                    className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${num === 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light'}`}
                    href='#'
                  >
                    {num}
                  </Link>
                </li>
              ))} */}
            {pageNumbers.map((num) => (
              <li className="page-item" key={num}>
                <Link
                  href="#"
                  onClick={() => handlePageChange(num)}
                  className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                    num === currentPage
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-200 text-secondary-light"
                  }`}
                >
                  {num}
                </Link>
              </li>
            ))}
            <li className="page-item">
              <Link
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {" "}
                <Icon icon="ep:d-arrow-right" className="" />{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default UsersDelLayer;
