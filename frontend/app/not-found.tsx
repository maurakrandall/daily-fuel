import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FDFBF7] to-[#F5E6C8] text-[#0A192F]">
      <h2 className="text-4xl font-serif mb-4">Not Found</h2>
      <p className="mb-8">Could not find requested resource</p>
      <Link href="/" className="px-6 py-3 bg-[#0A192F] text-white rounded-full hover:bg-[#0A192F]/90 transition-colors">
        Return Home
      </Link>
    </div>
  )
}
