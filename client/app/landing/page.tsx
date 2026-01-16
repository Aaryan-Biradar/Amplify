import { Button } from "@/components/ui/button"

export default function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full h-[40vh] md:h-[45vh] relative overflow-hidden">
        <img src="/landing.webp" alt="E-commerce ecosystem illustration" className="w-full h-full object-cover" />
        {/* Gradient fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="flex-1 bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a2e] tracking-tight text-balance">
          Amplify your store. Maximize your sales.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-[#5c5c7a] max-w-xl">
          The self-optimizing AI that tracks analytics and evolves your UI to convert more customers
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            className="px-10 py-6 text-lg font-semibold bg-[#95bf47] hover:bg-[#7aa63a] text-white rounded-full"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
