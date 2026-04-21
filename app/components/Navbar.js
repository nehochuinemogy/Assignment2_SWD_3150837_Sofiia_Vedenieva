import Link from 'next/link'

//creating links for each option in this assignment

export default function Navbar() {
    const links = [
        { label: 'Home', href: '/'},
        { label: 'Add', href: '/add'},
        { label: 'Search', href: '/search'},
        { label: 'Update', href: '/update'},
        { label: 'Delete', href: '/delete'},
    ];

    return (
    <nav className="navbar">
      <h1 className ="navbar-brand">
        Appliance Inventory
      </h1>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}