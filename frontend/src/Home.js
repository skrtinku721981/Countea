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
  const [purposeDropdownOpen, setPurposeDropdownOpen] = useState(false);
  const [note, setNote] = useState({
    Ename: "",
    Eid: "",
    Department: "",
    Snacks: {}, // { SnackName: quantity }
    Purpose: "",
    OtherSnack: ""
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Autofill name and department when Eid is entered and field loses focus
  const handleEidBlur = async (e) => {
    const Eid = e.target.value;
    if (Eid.length >= 3) {
      try {
        const res = await fetch(`https://countea-backend.onrender.com/api/auth/employee/${Eid}`);
        if (res.ok) {
          const data = await res.json();
          setNote((prev) => ({
            ...prev,
            Ename: data.Ename,
            Department: data.Department
          }));
        }
      } catch (err) {
        // Optionally handle error (e.g., show "not found" message)
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    // Prepare Snacks array for backend
    let SnacksArr = Object.entries(note.Snacks).map(([Snack, quantity]) => ({
      Snack,
      Quantity: quantity
    }));

    // If "others" is selected, replace it with the value from OtherSnack
    if (note.Snacks["others"] !== undefined && note.OtherSnack.trim() !== "") {
      SnacksArr = SnacksArr.map(item =>
        item.Snack === "others"
          ? { Snack: note.OtherSnack.trim(), Quantity: item.Quantity }
          : item
      );
    }

    // Prepare data to send (exclude OtherSnack)
    const { OtherSnack, ...rest } = note;
    const dataToSend = {
      ...rest,
      Snacks: SnacksArr,
      OtherSnack: note.OtherSnack
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

  // Handle checkbox changes for Snacks
  const handleSnackChange = (Snack) => (e) => {
    if (e.target.checked) {
      setNote((prev) => ({
        ...prev,
        Snacks: { ...prev.Snacks, [Snack]: 1 }
      }));
    } else {
      setNote((prev) => {
        const newSnacks = { ...prev.Snacks };
        delete newSnacks[Snack];
        return { ...prev, Snacks: newSnacks };
      });
    }
  };

  // Handle quantity change for each Snack
  const handleQuantityChange = (Snack) => (e) => {
    const value = Math.max(1, Number(e.target.value));
    setNote((prev) => ({
      ...prev,
      Snacks: { ...prev.Snacks, [Snack]: value }
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
    note.Ename.length < 3 ||
    note.Eid.length < 3 ||
    note.Department.length < 2 ||
    Object.keys(note.Snacks).length < 1 ||
    note.Purpose.length < 2 ||
    (note.Snacks["others"] !== undefined && note.OtherSnack.trim().length === 0);

  return (
    <div className='container'>
      <div className='center' style={{
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
      }} >
        {/* input field */}

        <div className="mb-3">
          <label htmlFor="Eid" className="form-label">Employee ID</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="Eid"
            id="Eid"
            placeholder="Please enter your id"
            value={note.Eid}
            onChange={onChange}
            onBlur={handleEidBlur}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Ename" className="form-label">Employee Name</label>
          <input type="text" className="form-control" name="Ename" id="Ename" placeholder="Please enter your name" value={note.Ename} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Department" className="form-label">Department</label>
          <input type="text" className="form-control" name="Department" id="Department" placeholder="Please enter your department" value={note.Department} onChange={onChange} />
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
                      checked={note.Snacks[snack] !== undefined}
                      onChange={handleSnackChange(snack)}
                    />
                    <label className="form-check-label me-2" htmlFor={snack}>
                      {snack.charAt(0).toUpperCase() + snack.slice(1)}
                    </label>
                  </div>
                  {note.Snacks[snack] !== undefined && (
                    <input
                      type="number"
                      min="1"
                      value={note.Snacks[snack]}
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
          {note.Snacks["others"] !== undefined && (
            <input
              type="text"
              className="form-control mt-2"
              name="OtherSnack"
              id="OtherSnack"
              placeholder="Please specify"
              value={note.OtherSnack}
              onChange={onChange}
              required
            />
          )}
        </div>

        {/* Purpose dropdown */}
        <div className="mb-3" style={{ textAlign: "center" }}>
          <label htmlFor="Purpose" className="form-label">Purpose</label>
          <div className="dropdown full-width-dropdown" style={{ margin: "0 auto", width: "100%" }}>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              style={{ width: "100%" }}
              onClick={() => setPurposeDropdownOpen((open) => !open)}
            >
              {note.Purpose
                ? (note.Purpose.charAt(0).toUpperCase() + note.Purpose.slice(1) + " Purpose")
                : "Select Purpose"}
            </button>
            <ul className={`dropdown-menu${purposeDropdownOpen ? " show" : ""}`} style={{ width: "100%" }}>
              <li>
                <button className="dropdown-item" type="button" onClick={() => {
                  setNote({ ...note, Purpose: "official" });
                  setPurposeDropdownOpen(false);
                }}>Official Purpose</button>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={() => {
                  setNote({ ...note, Purpose: "meeting" });
                  setPurposeDropdownOpen(false);
                }}>Meeting Purpose</button>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={() => {
                  setNote({ ...note, Purpose: "guest" });
                  setPurposeDropdownOpen(false);
                }}>Guest Purpose</button>
              </li>
            </ul>
          </div>
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