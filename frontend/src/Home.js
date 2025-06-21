import React, { useState } from 'react'

const SNACK_OPTIONS = [
  "tea",
  "coffee",
  "lemon tea",
  "lemon water",
  "biscuit",
  "namkeen",
  "dry fruits",
  "others"
];

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [note, setNote] = useState({
    ename: "",
    eid: "",
    department: "",
    snacks: {}, // { snackName: quantity }
    remarks: "",
    otherSnack: ""
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Autofill name and department when eid is entered and field loses focus
  const handleEidBlur = async (e) => {
    const eid = e.target.value;
    if (eid.length >= 3) {
      try {
        const res = await fetch(`https://countea-backend.onrender.com/api/auth/employee/${eid}`);
        if (res.ok) {
          const data = await res.json();
          setNote((prev) => ({
            ...prev,
            ename: data.ename,
            department: data.department
          }));
        }
      } catch (err) {
        // Optionally handle error (e.g., show "not found" message)
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    // Prepare snacks array for backend
    let snacksArr = Object.entries(note.snacks).map(([snack, qty]) => ({
      snack,
      quantity: qty
    }));

    // If "others" is selected, replace it with the value from otherSnack
    if (note.snacks["others"] !== undefined && note.otherSnack.trim() !== "") {
      snacksArr = snacksArr.map(item =>
        item.snack === "others"
          ? { snack: note.otherSnack.trim(), quantity: item.quantity }
          : item
      );
    }

    // Prepare data to send (exclude otherSnack)
    const { otherSnack, ...rest } = note;
    const dataToSend = {
      ...rest,
      snacks: snacksArr
    };

    sendDataToBackend(dataToSend);

    setShowMessage(true); // Show the success message
    setTimeout(() => {
      setShowMessage(false); // Hide the message after 3 seconds
    }, 3000);
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle checkbox changes for snacks
  const handleSnackChange = (snack) => (e) => {
    if (e.target.checked) {
      setNote((prev) => ({
        ...prev,
        snacks: { ...prev.snacks, [snack]: 1 }
      }));
    } else {
      setNote((prev) => {
        const newSnacks = { ...prev.snacks };
        delete newSnacks[snack];
        return { ...prev, snacks: newSnacks };
      });
    }
  };

  // Handle quantity change for each snack
  const handleQuantityChange = (snack) => (e) => {
    const value = Math.max(1, Number(e.target.value));
    setNote((prev) => ({
      ...prev,
      snacks: { ...prev.snacks, [snack]: value }
    }));
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('https://countea-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data sent successfully:', result);
      } else {
        console.error('Failed to send data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Validation for submit button
  const isSubmitDisabled =
    note.ename.length < 3 ||
    note.eid.length < 3 ||
    note.department.length < 2 ||
    Object.keys(note.snacks).length < 1 ||
    note.remarks.length < 2 ||
    (note.snacks["others"] !== undefined && note.otherSnack.trim().length === 0);

  return (
    <div className='container'>
      <div className='center' style={{
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
      }} >
        {/* input field */}

        <div className="mb-3">
          <label htmlFor="eid" className="form-label">Employee ID</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="eid"
            id="eid"
            placeholder="Please enter your id"
            value={note.eid}
            onChange={onChange}
            onBlur={handleEidBlur}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ename" className="form-label">Employee Name</label>
          <input type="text" className="form-control" name="ename" id="ename" placeholder="Please enter your name" value={note.ename} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">Department</label>
          <input type="text" className="form-control" name="department" id="department" placeholder="Please enter your department" value={note.department} onChange={onChange} />
        </div>

        {/* snacks dropdown with checkboxes and quantity */}
        <div className="mb-3">
          <label className="form-label">Snacks</label>
          <div className="dropdown full-width-dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              style={{ width: "100%" }}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Select Snacks
            </button>
            <ul className={`dropdown-menu${dropdownOpen ? " show" : ""}`} style={{ maxHeight: 300, overflowY: "auto" }}>
              {SNACK_OPTIONS.map((snack) => (
                <li key={snack} className="snack-row px-3 py-1">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      id={snack}
                      checked={note.snacks[snack] !== undefined}
                      onChange={handleSnackChange(snack)}
                    />
                    <label className="form-check-label me-2" htmlFor={snack}>
                      {snack.charAt(0).toUpperCase() + snack.slice(1)}
                    </label>
                  </div>
                  {note.snacks[snack] !== undefined && (
                    <input
                      type="number"
                      min="1"
                      value={note.snacks[snack]}
                      onChange={handleQuantityChange(snack)}
                      className="form-control form-control-sm"
                      placeholder="Qty"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Show "others" input if selected */}
          {note.snacks["others"] !== undefined && (
            <input
              type="text"
              className="form-control mt-2"
              name="otherSnack"
              id="otherSnack"
              placeholder="Please specify"
              value={note.otherSnack}
              onChange={onChange}
              required
            />
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="remarks" className="form-label">Purpose</label>
          <select
            className="form-control"
            name="remarks"
            id="remarks"
            value={note.remarks}
            onChange={onChange}
            required
          >
            <option value="">Select purpose</option>
            <option value="official">Official</option>
            <option value="meeting">Meeting</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* button */}
        <div className="d-grid gap-2">
          <button
            disabled={isSubmitDisabled}
            className="btn btn-primary"
            type="submit"
            onClick={handleClick}
          >
            Submit
          </button>

          {showMessage && (
            <div style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
              Success!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home