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
    snacks: [],
    quantity: "",
    remarks: "",
    otherSnack: ""
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log(note);
    sendDataToBackend(note);

    setShowMessage(true); // Show the success message
    setTimeout(() => {
      setShowMessage(false); // Hide the message after 3 seconds
    }, 3000);
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle checkbox changes for snacks
  const handleSnackChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNote({ ...note, snacks: [...note.snacks, value] });
    } else {
      setNote({ ...note, snacks: note.snacks.filter(snack => snack !== value) });
    }
  };

  const sendDataToBackend = async (dataArray) => {
    try {
      const response = await fetch('https://countea-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArray)
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

  return (
    <div className='container'>
      <div className='center' style={{
        background: 'rgba(255, 255, 255, 0.7)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
      }} >
        {/* input field */}
        <div className="mb-3">
          <label htmlFor="ename" className="form-label">Employee Name</label>
          <input type="text" className="form-control" name="ename" id="ename" placeholder="Please enter your name" value={note.ename} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="eid" className="form-label">Employee ID</label>
          <input type="number" min="0" className="form-control" name="eid" id="eid" placeholder="Please enter your id" value={note.eid} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="department" className="form-label">Department</label>
          <input type="text" className="form-control" name="department" id="department" placeholder="Please enter your department" value={note.department} onChange={onChange} />
        </div>

        {/* snacks checkboxes */}
        <div className="mb-3">
          <label className="form-label">Snacks</label>
          <div className="d-flex flex-wrap gap-2">
            {SNACK_OPTIONS.map(snack => (
              <div key={snack} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={snack}
                  name="snacks"
                  value={snack}
                  checked={note.snacks.includes(snack)}
                  onChange={handleSnackChange}
                />
                <label className="form-check-label" htmlFor={snack}>
                  {snack.charAt(0).toUpperCase() + snack.slice(1)}
                </label>
              </div>
            ))}
          </div>
          {note.snacks.includes("others") && (
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
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="quantity"
            id="quantity"
            placeholder="Quantity"
            value={note.quantity}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="remarks" className="form-label">Remarks</label>
          <textarea className="form-control" name='remarks' id="remarks" rows="2" placeholder="Enter the remarks" value={note.remarks} onChange={onChange} required></textarea>
        </div>

        {/* button */}
        <div className="d-grid gap-2">
          <button
            disabled={
              note.ename.length < 3 ||
              note.eid.length < 5 ||
              note.department.length < 2 ||
              Number(note.quantity) < 1 ||
              note.remarks.length < 2 ||
              note.snacks.length < 1 ||
              (note.snacks.includes("others") && note.otherSnack.trim().length === 0)
            }
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