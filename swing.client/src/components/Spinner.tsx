const Spinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="spinner-overlay">
    <div className="spinner" aria-label="Loading" role="status" />
    <p className="spinner-text">{text}</p>
  </div>
);

export default Spinner;
