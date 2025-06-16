import React, { useState } from 'react'

const Home = () => {

  const [showMessage, setShowMessage] = useState(false);
  const [note, setNote] = useState({ ename: "", eid: "", department: "", snacks: "", quantity: "", remarks: "", otherSnack: "" });

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
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const sendDataToBackend = async (dataArray) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
    <div className='center' style={{ backgroundColor: 'rgba(188, 183, 230, 0.99)', padding: '20px', borderRadius: '5px' }}>
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

      {/* dropdown */}
      <div className="mb-3">
        <label htmlFor="snacks" className="form-label">Snacks</label>
<div className={`input-group mb-3${note.snacks === "others" ? " with-others" : ""}`} style={{ position: "relative" }}>
          <select
            style={{ outline: 'none', border: '1px solid #ccc', padding: '5px', borderRadius: '5px', overflow: 'hidden' }}
            className="form-control"
            name="snacks"
            id="snacks"
            value={note.snacks}
            onChange={onChange}
            required
          >
            <option value="">Select your meal</option>
            <option value="tea">Tea</option>
            <option value="coffee">Coffee</option>
            <option value="lemon tea">Lemon Tea</option>
            <option value="lemon water">Lemon Water</option>
            <option value="biscuit">Biscuits</option>
            <option value="namkeen">Namkeen</option>
            <option value="dry fruits">Dry Fruits</option>
            <option value="others">Others</option>
          </select>
          {note.snacks === "others" && ( 
            <input
              type="text"
              className="form-control  floating-others-input" 
              name="otherSnack"
              id="otherSnack"
              placeholder="Please specify"
              value={note.otherSnack}
              onChange={onChange}
              style={{
               position: "absolute",
                borderRadius: '5px',
                top: "100%",
                left: 0,
                width: "100%",
                zIndex: 2,
                background: "#fff"
              }}
              required
            />
          )}
          <input
            type="number"
            min="0"
            className="form-control"
            name="quantity"
            id="quantity"
            aria-label="Text input with dropdown button"
            placeholder="Quantity"
            value={note.quantity}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">Remarks</label>
          <textarea className="form-control" name='remarks' id="remarks" rows="2" placeholder="Enter the remarks" value={note.remarks} onChange={onChange} required></textarea>
        </div>
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
            !["tea", "coffee", "lemon tea", "lemon juice", "biscuit", "namkeen", "dry fruits", "others"].includes(note.snacks) ||
            (note.snacks === "others" && note.otherSnack.trim().length === 0)
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
  )
}

export default Home