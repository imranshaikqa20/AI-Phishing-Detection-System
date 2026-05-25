import Link from "next/link";

export default function Navbar() {

  return (
    <nav className="flex justify-between p-4 bg-black text-white">

      <h1 className="text-xl font-bold">
        AI Phishing Detection
      </h1>

      <div className="flex gap-4">

        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/scan/url">URL Scan</Link>

      </div>

    </nav>
  );
}
