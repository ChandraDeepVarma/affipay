"use client";
import { useState } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const CreditDebitAmount = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSearchuser = async (e) => {
    e.preventDefault();
    const trimmedSearchQuery = searchQuery.trim();
    setSearchQuery(trimmedSearchQuery);

    if (!trimmedSearchQuery) return;
    try {
      const res = await fetch(
        `/api/users/creditdebitamount?search=${encodeURIComponent(
          trimmedSearchQuery
        )}`
      );
      console.log("Users Data", res);
      if (res.ok) {
        const data = await res.json();
        console.log("Users Response Data", data);
        setUsers(Array.isArray(data) ? data : []);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User Not Found.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const openModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setAmount("");
    setRemarks("");
    setModalShow(true);
  };
  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    if (!amount) return;

    try {
      const res = await fetch(`/api/users/updatewallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          type: actionType,
          walletAmount: Number(amount),
          remarks,
        }),
      });
      const data = await res.json();
      console.log("Update Wallet Data", data);
      if (res.ok) {
        setUsers(
          users.map((u) =>
            u._id === selectedUser._id
              ? { ...u, walletAmount: data.walletAmount }
              : u
          )
        );
        setModalShow(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update wallet. Debit is More than your credit", // data.message ||
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  return (
    <>
      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-30">
          <Form onSubmit={handleSearchuser} className="mb-3 gap-2">
            <div className="d-flex gap-3 mt-5" style={{ maxWidth: "750px" }}>
              <Form.Control
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Username or Mobilenumber"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
            <p className="mb-3 mt-3 alert alert-danger p-3 text-dark text-center">
              <strong className="text-danger">Note:</strong> Here you credit /
              debit credits from the User for the winning and deposit wallets
            </p>
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Userame</th>
                  <th className="text-center">Mobile Number</th>
                  <th className="text-center">Credit Wallet (₹)</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={item._id} className="text-center">
                      <td>{index + 1}</td>
                      <td>{item.fullName}</td>
                      <td>{item.phone}</td>
                      <td>{item.walletAmount}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-3">
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => openModal(item, "credit")}
                          >
                            Credit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openModal(item, "debit")}
                          >
                            Debit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No Data found. Please search above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Form>
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "credit"
              ? "Add Wallet Credits"
              : "Remove Wallet Credits"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                {actionType === "credit"
                  ? "Add Credit Amount (₹)"
                  : "Debit Amount (₹)"}
              </Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "credit" ? "success" : "danger"}
            onClick={handleUpdateWallet}
            disabled={!amount || Number(amount) <= 0 || !remarks.trim()}
          >
            {actionType === "credit" ? " Add " : "Debit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreditDebitAmount;
