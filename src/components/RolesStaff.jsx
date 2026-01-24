"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const RolesStaff = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: "", roleName: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.roleName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const method = editingRole ? 'PUT' : 'POST';
      const url = editingRole ? `/api/roles?id=${editingRole._id}` : '/api/roles';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(editingRole ? 'Role updated successfully' : 'Role added successfully');
        fetchRoles();
        resetForm();
      } else {
        toast.error(data.error || 'Failed to save role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('An error occurred while saving the role');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      const response = await fetch(`/api/roles?id=${roleToDelete._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Role deleted successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        });
        fetchRoles();
        setShowDeleteModal(false);
        setRoleToDelete(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('An error occurred while deleting the role');
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  // Handle edit
  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({ name: role.name, roleName: role.roleName });
    setShowAddModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", roleName: "" });
    setEditingRole(null);
    setShowAddModal(false);
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Toaster position="top-right" />
      <div className='card h-100 p-0 radius-12'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
          <div className='d-flex align-items-center flex-wrap gap-3'>
            <form className='navbar-search'>
              <input
                type='text'
                className='bg-base h-40-px w-auto'
                name='search'
                placeholder='Search'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon icon='ion:search-outline' className='icon' />
            </form>
          </div>
          <button
            type="button"
            className="btn btn-primary-600 text-md px-24 py-12 d-flex align-items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Icon icon="ic:baseline-plus" />
            Add Role
          </button>
        </div>
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table sm-table mb-0'>
              <thead>
                <tr>
                  <th scope='col'>Name</th>
                  <th scope='col'>Role Name</th>
                  <th scope='col' className='text-center'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No roles found
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role._id}>
                      <td>
                        <span className="px-10 py-2 radius-4 fw-medium text-xs">
                          {role.name}
                        </span>
                      </td>
                      <td>{role.roleName}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center gap-10 justify-content-center">
                          <button
                            type="button"
                            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => handleEdit(role)}
                          >
                            <Icon icon="lucide:edit" className="menu-icon" />
                          </button>
                          <button
                            type="button"
                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => showDeleteConfirmation(role)}
                          >
                            <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24'>
            <span>Showing {filteredRoles.length} entries</span>
            <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
              <li className='page-item'>
                <Link
                  className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md'
                  href='#'
                >
                  <Icon icon='ep:d-arrow-left' className='' />
                </Link>
              </li>
              {[1,2,3,4,5].map((num) => (
                <li className='page-item' key={num}>
                  <Link
                    className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${num === 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-secondary-light'}`}
                    href='#'
                  >
                    {num}
                  </Link>
                </li>
              ))}
              <li className='page-item'>
                <Link
                  className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md'
                  href='#'
                >
                  {" "}
                  <Icon icon='ep:d-arrow-right' className='' />{" "}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRole ? 'Edit Role' : 'Add New Role'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Kathryn Murphy"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Manager"
                      value={formData.roleName}
                      onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingRole ? 'Update Role' : 'Add Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-body text-center p-5">
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      backgroundColor: '#FEF3C7',
                      border: '3px solid #F59E0B'
                    }}
                  >
                    <Icon 
                      icon="material-symbols:warning-outline" 
                      style={{ 
                        fontSize: '40px', 
                        color: '#F59E0B' 
                      }} 
                    />
                  </div>
                </div>
                <h4 className="fw-bold text-dark mb-3" style={{ fontSize: '24px' }}>
                  Are you sure you want to Delete it?
                </h4>
                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button
                    type="button"
                    className="btn fw-medium px-4 py-2"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#6B7280',
                      fontSize: '16px'
                    }}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn fw-medium px-4 py-2"
                    style={{
                      backgroundColor: '#DC2626',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minWidth: '80px'
                    }}
                    onClick={handleDelete}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default RolesStaff;
