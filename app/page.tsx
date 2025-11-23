import Image from "next/image";
import TableCard from "@/components/table-component";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl p-10 max-w-md w-full text-center">
        
        <h1 className="text-3xl font-semibold mb-3">Welcome</h1>
        <p className="text-gray-400 mb-8">
          Access your analytics, reports, and system overview in the dashboard.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary hover:bg-accent hover:scale-150 hover:animate-spin font-medium transition-all duration-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}


