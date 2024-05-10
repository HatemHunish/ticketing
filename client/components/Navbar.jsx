import React from "react";
import Link from "next/link";
function Navbar({ currentUser }) {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link className="nav-link" href={href}>
          {label}
        </Link>
      </li>
    ));
  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link className="navbar-brand" href={"/"}>
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-felx align-items-center">{links}</ul>
      </div>
    </nav>
  );
}

export default Navbar;
