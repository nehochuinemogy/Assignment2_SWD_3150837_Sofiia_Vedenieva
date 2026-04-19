// app/page.js
// Home page - displays 4 option cards linking to each CRUD function

import Link from 'next/link';

export default function HomePage() {
  const options = [
    { href: '/add', title: 'Add Appliance'},
    { href: '/search', title: 'Search Appliance'},
    { href: '/update', title: 'Update Appliance'},
    { href: '/delete', title: 'Delete Appliance'},
  ];

  return (
    <>
      <div className="home-hero">
        <h1>Household Appliance Inventory</h1>
        <h3>Sofiia Vedenieva/3150837</h3>
      </div>

      <div className="options-grid">
        {options.map((opt) => (
          <Link key={opt.href} href={opt.href} className="option-card">
            <div className="option-icon">{opt.icon}</div>
            <h2>{opt.title}</h2>
            <p>{opt.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}