export function Breadcrumb({ children }: { children: React.ReactNode }) {
    return <nav className="flex items-center space-x-2">{children}</nav>;
  }
  
  export function BreadcrumbList({ children }: { children: React.ReactNode }) {
    return <ol className="flex items-center space-x-2">{children}</ol>;
  }
  
  export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
    return <li>{children}</li>;
  }
  
  export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
      <a href={href} className="text-sm text-pink-500 hover:underline">
        {children}
      </a>
    );
  }
  
  export function BreadcrumbSeparator({ className }: { className?: string }) {
    return <span className={`text-sm text-gray-500 ${className}`}>/</span>;
  }
  
  export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
    return <span className="text-sm text-gray-500">{children}</span>;
  }