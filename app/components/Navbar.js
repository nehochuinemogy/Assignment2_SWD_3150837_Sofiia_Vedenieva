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
}