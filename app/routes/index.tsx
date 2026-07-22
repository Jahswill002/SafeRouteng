import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: MarketingSite,
})

function MarketingSite() {
  return (
    <div className="min-h-screen bg-surface font-inter text-gray-800">
      {/* Header */}
      <header className="bg-primary text-white p-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-accent text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
            S
          </div>
          <h1 className="font-sora text-2xl font-bold tracking-tight">SafeRoute NG</h1>
        </div>
        <nav>
          <Link to="/auth" className="bg-success hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg">
            Sign In / Demo
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative overflow-hidden bg-primary text-white py-24 px-6 md:px-12 lg:px-24">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-sora text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Real-time peace of mind for <span className="text-accent">Nigerian Schools</span>.
            </h2>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Track school buses, manage daily rosters, and respond to emergencies instantly. The all-in-one safety platform for parents, matrons, and school admins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/auth" className="bg-success text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                Try the Pilot Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features / How it works */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h3 className="font-sora text-4xl font-bold text-center mb-16 text-primary">How SafeRoute Works</h3>
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">👩🏽‍🍼</div>
              <h4 className="font-sora text-2xl font-bold mb-4 text-primary">For Parents</h4>
              <p className="text-gray-600 leading-relaxed">
                No more guessing. Get real-time alerts when your child boards, track the bus live on a map, and know exactly when they arrive.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🧑🏾‍⚕️</div>
              <h4 className="font-sora text-2xl font-bold mb-4 text-primary">For Matrons</h4>
              <p className="text-gray-600 leading-relaxed">
                Replace paper rosters with a mobile tap. Log attendance instantly, manage stops, and hit the SOS button if emergencies arise.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6">👨🏾‍💻</div>
              <h4 className="font-sora text-2xl font-bold mb-4 text-primary">For Admins</h4>
              <p className="text-gray-600 leading-relaxed">
                Full fleet visibility. Monitor all buses on a single dashboard, audit incident logs, and ensure every student is accounted for.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p className="font-inter">© 2026 SafeRoute NG. Building safer school commutes in Nigeria.</p>
      </footer>
    </div>
  )
}
