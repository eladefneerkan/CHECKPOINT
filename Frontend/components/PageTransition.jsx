export default function PageTransition({ children }) {
  return (
    <div className="fade-in">
      {children}
    </div>
  );
}