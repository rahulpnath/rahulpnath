import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

console.log('Layout.tsx file is being loaded'); // Add this

 function Layout({ children }: LayoutProps) { // Remove 'export default' temporarily
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">My Blog</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white shadow mt-10">
        <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} My Blog
        </div>
      </footer>
    </div>
  );
}

export default Layout;