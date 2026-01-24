"use client";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";

const SubscriptionConfigPage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [rows, setRows] = useState([]);

  // Fetch active providers with subscription=true
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/subscriptions/storageprovider");
        if (res.ok) {
          const data = await res.json();
          // Filter only providers with subscription active
          const activeProviders = (data.providers || []).filter(
            (p) => p.subscription === true
          );
          setProviders(activeProviders);
        } else {
          console.error("Failed to fetch providers");
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    };
    fetchProviders();
  }, []);

  // Fetch all configs on mount and whenever provider changes
  useEffect(() => {
    fetchConfigs();
  }, [selectedProvider]);

  const fetchConfigs = async () => {
    if (!selectedProvider) {
      setRows([
        {
          id: Date.now(),
          price: "",
          size: "",
          isActive: "Active",
          storageProviderId: selectedProvider || null,
          isNew: true,
        },
      ]);
    }
    try {
      // Fetch all configs
      const res = await fetch("/api/subscriptions/getallsubscriptionconfig");
      const data = await res.json();
      console.log("data : ", data.configs);
      if (res.ok) {
        let configs = data.configs || [];

        const providerConfig = configs.find(
          (c) => c.storageProviderId === selectedProvider
        );
        let mappedRows = [];

        if (providerConfig && providerConfig.config.length > 0) {
          mappedRows = providerConfig.config
            .map((item, j) => ({
              id: item._id || `${providerConfig._id}-${j}`,
              price: item.price,
              size: item.size,
              isActive: item.isActive ? "Active" : "Inactive",
              storageProviderId: providerConfig.storageProviderId,
              isNew: false,
            }))
            .reverse();
        } else {
          // No configs for this provider → show one empty row
          mappedRows.push({
            id: Date.now(),
            price: "",
            size: "",
            isActive: "Active",
            storageProviderId: selectedProvider,
            isNew: true,
          });
        }

        setRows(mappedRows);
      } else {
        setRows([
          {
            id: Date.now(),
            price: "",
            size: "",
            isActive: "Active",
            storageProviderId: selectedProvider || null,
            isNew: true,
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching configs:", err);
      setRows([
        {
          id: Date.now(),
          price: "",
          size: "",
          isActive: "Active",
          storageProviderId: selectedProvider || null,
          isNew: true,
        },
      ]);
    }
  };

  // Add new row
  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        price: "",
        size: "",
        isActive: "Active",
        storageProviderId: selectedProvider || null,
        isNew: true,
      },
    ]);
  };

  // Handle field change
  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
  // Delete row
  const handleDeleteRow = async (row) => {
    if (!row.storageProviderId || row.storageProviderId === "null") {
      // Just remove it locally; it’s not saved yet.
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    // Unsaved config with temp id
    if (!isValidObjectId(row.id)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This configuration will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return; // user cancelled
    try {
      const res = await fetch(
        `/api/subscriptions/deletesubscriptionconfig?storageProviderId=${row.storageProviderId}&configId=${row.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        Swal.fire("Error", data.error || "Failed to delete", "error");
        return;
      }

      // setProviders((prev) => prev.filter((p) => p._id !== id));
      fetchConfigs();
      Swal.fire("Deleted!", "Provider has been removed.", "success");
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!selectedProvider) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please choose a service provider first!",
      });
      return;
    }
    const newRows = rows.filter((r) => r.isNew); // only new rows
    if (newRows.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Nothing to Save",
        text: "No new configurations to save.",
      });
      return;
    }

    const payload = {
      storageProviderId: selectedProvider,
      config: rows
        .filter((r) => r.isNew)
        .map((r) => ({
          price: Number(r.price),
          size: Number(r.size),
          isActive: r.isActive === "Active",
        })),
    };

    try {
      const res = await fetch("/api/subscriptions/savesubscriptionconfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Configuration saved successfully!",
        });
        fetchConfigs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Failed to save configuration",
        });
      }
    } catch (err) {
      console.error("Error saving config:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="col-sm-3">
          <Form.Group>
            <Form.Label className=" mt-3">
              <strong className="">Choose Service Provider</strong>
            </Form.Label>
            <Form.Select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <option value="" className="text-center">
                --- Select Provider ---
              </option>
              {providers.map((p) => (
                <option key={p._id} value={p._id} >
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th className="text-center">Price (USD)</th>
                <th className="text-center">Size (MB)</th>
                <th className="text-center">Subscription Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <>
                  {showToast("info", "No configurations added yet.")}
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No configurations added yet.
                    </td>
                  </tr>
                </>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="text-center">
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={row.price}
                        onChange={(e) =>
                          handleRowChange(row.id, "price", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Form.Control
                        type="number"
                        placeholder="Enter size (MB)"
                        value={row.size}
                        onChange={(e) =>
                          handleRowChange(row.id, "size", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Form.Select
                        value={row.isActive}
                        onChange={(e) =>
                          handleRowChange(row.id, "isActive", e.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Select>
                    </td>
                    <td className="d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        onClick={() => handleDeleteRow(row)}
                      >
                        <Icon
                          icon="fluent:delete-24-regular"
                          className="menu-icon"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <Button size="sm" variant="success" onClick={handleAddRow}>
              Add More +
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              disabled={rows.length === 0}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfigPage;
