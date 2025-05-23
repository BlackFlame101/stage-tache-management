export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    
    <div className="app-main-container">
      {children}
    </div>
  );
}