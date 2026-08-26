import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
const [reportType, setReportType] = useState(null);
const [formError, setFormError] = useState("");
const [reportSuccess, setReportSuccess] = useState(false);
const [formData, setFormData] = useState({
  item_name: "",
  description: "",
  category: "",
  location: "",
  date: "",
  posted_by: "",
  contact: ""
});

 useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/items`)
    .then((response) => response.json())
    .then((data) => {
      setItems(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      setLoading(false);
    });
}, []);

  const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
};

const handleSearch = () => {
  if (!search.trim()) {
    fetch(`${import.meta.env.VITE_API_URL}/items`)
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));

    return;
  }

  fetch(`${import.meta.env.VITE_API_URL}/items/search?keyword=${encodeURIComponent(search)}`)
    .then((response) => response.json())
    .then((data) => setItems(data))
    .catch((error) => console.error("Error searching items:", error));
};
const handleResetSearch = () => {
  setSearch("");
  setFilter("All");

  fetch(`${import.meta.env.VITE_API_URL}/items`)
    .then((response) => response.json())
    .then((data) => setItems(data))
    .catch((error) => console.error("Error fetching items:", error));
};
const handleFormChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
const handleSubmit = (e) => {
  e.preventDefault();
  setFormError("");

  const newItem = {
    type: reportType,
    ...formData
  };

  fetch(`${import.meta.env.VITE_API_URL}/items`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
    body: JSON.stringify(newItem)
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to post item");
      }

      return data;
    })
    .then((data) => {
      console.log("Item posted:", data);
      setReportSuccess(true);
    })
    .catch((error) => {
      console.error("Error posting item:", error);
      setFormError("Something went wrong while posting your item. Please try again.");
    });
};

const filteredItems =
  filter === "All"
    ? items
    : items.filter(
        (item) => item.type.toLowerCase() === filter.toLowerCase()
      );

return (
    <div className="app">

      <header className="navbar">
        <button className="brand" onClick={() => {
  handleResetSearch();
  setShowAbout(false);
  setShowReport(false);
  setReportType(null);
  setSelectedItem(null);
}}>
  <span className="brand-mark">R</span>
  <span>Retrace</span>
</button>

        <nav>
          <button
  className="nav-link"
  onClick={() => {
    handleResetSearch();
    setShowAbout(false);
    setShowReport(false);
    setReportType(null);
    setSelectedItem(null);

    setTimeout(() => {
      document.querySelector(".browse-section")?.scrollIntoView({
        behavior: "smooth"
      });
    }, 100);
  }}
>
  Browse
</button>
          <button
  className="nav-link"
  onClick={() => {
    setShowAbout(true);
    setShowReport(false);
    setReportType(null);
    setSelectedItem(null);
  }}
>
  About
</button>
          <button
  className="report-button"
  onClick={() => {
    setShowReport(true);
    setReportType(null);
  }}
>
  Report an item
</button>
        </nav>
      </header>

      <main>
        {showAbout ? (
  <section className="about-page">
    <button
      className="back-button"
      onClick={() => setShowAbout(false)}
    >
      ← Back to board
    </button>

    <div className="about-hero">
      <p className="eyebrow">ABOUT RETRACE</p>

      <h1>
        Lost things deserve
        <br />
        a way <em>back.</em>
      </h1>

      <p>
        Retrace is a campus lost & found board designed
        to make reporting, searching, and returning
        misplaced items a little easier.
      </p>
    </div>

    <div className="about-grid">
      <div>
        <p className="eyebrow">THE IDEA</p>
        <h2>One place to look.</h2>
      </div>

      <p>
        Instead of relying on scattered messages and
        word of mouth, Retrace brings lost and found
        reports together in one searchable place.
      </p>

      <div>
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>Report. Search. Retrace.</h2>
      </div>

      <p>
        Lost something? Post the details. Found something?
        Put it on the board. Search by item, location,
        category, or keyword and get in touch with the
        person who posted it.
      </p>
    </div>
  </section>
) : showReport ? (
  <section className="report-choice">
 <div className="report-navigation">
  {reportType && (
    <button
      className="back-button"
      onClick={() => setReportType(null)}
    >
      ← Back to choices
    </button>
  )}

  <button
    className="back-button"
    onClick={() => {
      setShowReport(false);
      setReportType(null);
    }}
  >
    ← Back to board
  </button>
</div>
{reportSuccess ? (
  <div className="report-success">
    <div className="success-mark">✓</div>

    <p className="eyebrow">REPORT POSTED</p>

    <h1>
      It's on the
      <br />
      <em>board.</em>
    </h1>

    <p>
      Your {reportType.toLowerCase()} item has been added to
      Retrace and is now visible to the campus.
    </p>

    <button
      className="submit-report"
      onClick={() => {
        setShowReport(false);
        setReportType(null);
        setReportSuccess(false);
        setFormData({
          item_name: "",
          description: "",
          category: "",
          location: "",
          date: "",
          posted_by: "",
          contact: ""
        });
fetch(`${import.meta.env.VITE_API_URL}/items`)
          .then((response) => response.json())
          .then((data) => setItems(data));
      }}
    >
      Back to the board <span>→</span>
    </button>
  </div>
) : !reportType ? (
    <>
      <div className="report-intro">
        <p className="eyebrow">REPORT AN ITEM</p>

        <h1>
          What happened to
          <br />
          <em>your item?</em>
        </h1>

        <p>
          Tell the campus what happened and help get
          things back where they belong.
        </p>
      </div>

      <div className="report-options">
        <button
          className="report-option lost-option"
          onClick={() => setReportType("Lost")}
        >
          <span className="option-dot"></span>

          <div>
            <h2>I lost it</h2>
            <p>
              Report something you've misplaced
              around campus.
            </p>
          </div>

          <span className="option-arrow">→</span>
        </button>

        <button
          className="report-option found-option"
          onClick={() => setReportType("Found")}
        >
          <span className="option-dot"></span>

          <div>
            <h2>I found it</h2>
            <p>
              Help someone get back something
              they've lost.
            </p>
          </div>

          <span className="option-arrow">→</span>
        </button>
      </div>
    </>
  ) : (
<div className="report-form">
  <div className="form-heading">
    <p className="eyebrow">
      REPORTING {reportType.toUpperCase()}
    </p>

    <h1>
      {reportType === "Lost"
        ? "What did you lose?"
        : "What did you find?"}
    </h1>

    <p>
      {reportType === "Lost"
        ? "Let's get the details down so someone can help retrace it."
        : "Let's get the details down so we can help return it."}
    </p>
  </div>
{formError && (
  <p className="form-error">
    {formError}
  </p>
)}
  <form onSubmit={handleSubmit}>
    <div className="form-field">
      <label>Item name</label>
      <input
        type="text"
        name="item_name"
        placeholder={
          reportType === "Lost"
            ? "e.g. Black Casio calculator"
            : "e.g. Blue water bottle"
        }
        value={formData.item_name}
        onChange={handleFormChange}
        required
      />
    </div>

    <div className="form-field">
      <label>Description</label>
      <textarea
        name="description"
        placeholder="Describe the item and any details that might help identify it..."
        value={formData.description}
        onChange={handleFormChange}
        rows="3"
        required
      />
    </div>

    <div className="form-row">
      <div className="form-field">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleFormChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Books">Books</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="form-field">
        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="e.g. Library"
          value={formData.location}
          onChange={handleFormChange}
          required
        />
      </div>
    </div>

    <div className="form-field">
      <label>
        {reportType === "Lost"
          ? "When did you lose it?"
          : "When did you find it?"}
      </label>

      <input
  type="date"
  name="date"
  value={formData.date}
  onChange={handleFormChange}
  max={new Date().toISOString().split("T")[0]}
  required
/>
    </div>

    <div className="form-row">
      <div className="form-field">
        <label>Your name</label>
        <input
          type="text"
          name="posted_by"
          placeholder="e.g. Rahul"
          value={formData.posted_by}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="form-field">
        <label>Contact</label>
        <input
          type="text"
          name="contact"
          placeholder="Email or phone number"
          value={formData.contact}
          onChange={handleFormChange}
          required
        />
      </div>
    </div>

    <button className="submit-report" type="submit">
      {reportType === "Lost"
        ? "Post lost item"
        : "Post found item"}
      <span>→</span>
    </button>
  </form>
</div>
  )}
</section>
) : (
  <>

        <section className="hero">
          <p className="eyebrow">CAMPUS LOST & FOUND</p>

          <h1>
            Lost something?
            <br />
            <em>Let's retrace it.</em>
          </h1>

          <p className="hero-text">
            Search items reported lost or found around campus.
          </p>

          <form className="search-box" onSubmit={(e) => {
  e.preventDefault();
  handleSearch();
}}>
  <span className="search-icon">⌕</span>

  <input
    type="text"
    placeholder="Search for an item, place or keyword..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button type="submit">Search</button>
  
</form>
{search && (
  <button className="clear-search" onClick={handleResetSearch}>
    ← Back to all items
  </button>
)}
        </section>
        
{selectedItem && (
  <section className="item-details">
    <button
  className="back-button"
  onClick={() => {
    setSelectedItem(null);
    setShowContact(false);
  }}
>
  ← Back to board
</button>

    <div className="details-content">

      <span className={`status ${selectedItem.type.toLowerCase()}`}>
        <span className="status-dot"></span>
        {selectedItem.type}
      </span>

      <h2>{selectedItem.item_name}</h2>

      <p className="details-description">
        {selectedItem.description}
      </p>

      <div className="details-meta">
        <div>
          <span>Location</span>
          <strong>{selectedItem.location}</strong>
        </div>

        <div>
          <span>Date reported</span>
          <strong>{formatDate(selectedItem.date)}</strong>
        </div>

        <div>
          <span>Category</span>
          <strong>{selectedItem.category}</strong>
        </div>
      </div>

      <div className="contact-section">
        <p>Know something about this item?</p>
        <button
  className="report-button"
  onClick={() => setShowContact(true)}
>
  Contact poster
</button>
{showContact && (
  <div className="contact-info">
    <p className="eyebrow">CONTACT POSTER</p>

    <h3>{selectedItem.posted_by}</h3>

    <p>
      You can reach them at:
    </p>

    <a href={`mailto:${selectedItem.contact}`}>
      {selectedItem.contact}
    </a>

    <button
      className="close-contact"
      onClick={() => setShowContact(false)}
    >
      Close
    </button>
  </div>
)}
      </div>

    </div>
  </section>
)}
        {!selectedItem && (
  <section className="browse-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">THE BOARD</p>
              <h2>Recently reported</h2>
            </div>

            <div className="filters">
              <button
  className={`filter ${filter === "All" ? "active" : ""}`}
  onClick={() => setFilter("All")}
>
  All
</button>

<button
  className={`filter ${filter === "Lost" ? "active" : ""}`}
  onClick={() => setFilter("Lost")}
>
  Lost
</button>

<button
  className={`filter ${filter === "Found" ? "active" : ""}`}
  onClick={() => setFilter("Found")}
>
  Found
</button>
            </div>
          </div>

          <div className="item-grid">
  {loading ? (
    <div className="loading-state">
      <div className="loading-dot"></div>
      <p>Looking through the board...</p>
    </div>
  ) : filteredItems.length > 0 ? (
    filteredItems.map((item) => (
      <article className="item-card" key={item.id}>

        <span className={`status ${item.type.toLowerCase()}`}>
          <span className="status-dot"></span>
          {item.type}
        </span>

        <h3>{item.item_name}</h3>

        <p>{item.description}</p>

        <div className="item-meta">
          <span>{item.location}</span>
          <span>{formatDate(item.date)}</span>
        </div>

        <button
          className="view-item"
          onClick={() => {
  setSelectedItem(item);
  setShowContact(false);
}}
        >
          View item <span>→</span>
        </button>

      </article>
    ))
  ) : (
<div className="empty-state">
  <div className="empty-illustration">
    <span>⌕</span>
  </div>

  <p className="eyebrow">NOT ON THE BOARD</p>

  <h3>Nothing turned up.</h3>

  <p>
    We couldn't find an item matching that search.
    Try another word, place, or category.
  </p>

  <button onClick={handleResetSearch}>
    Back to the board →
  </button>
</div>
  )}
</div>

        </section>)}
  </>
)}
      </main>

    </div>
  );
}

export default App;