"use client"
import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className="w-full bg-[#002B5B] py-10 md:py-16 lg:py-24 bg-cover bg-center z-0" >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Content Container */}
        <div className="text-center">
          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Mantente al día con Oportunidades Educativas
          </h2>

          {/* Subtitle */}
          <p className="text-[#BFDBFE] text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro boletín y recibe las últimas noticias sobre universidades, becas y
            eventos exclusivos directamente en tu bandeja de entrada.
          </p>

          {/* Email Input and Subscribe Button */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0047E9] hover:shadow-lg hover:scale-105 transition-transform text-white font-semibold rounded-lg duration-200"
            >
              Suscribirse
            </button>
          </form>

          {/* Success Message */}
          {subscribed && <p className="text-green-300 text-sm mb-4">¡Gracias por suscribirte!</p>}

          {/* Privacy Notice */}
          <p className="text-[#BFDBFE] text-sm">
            Respetamos tu privacidad y nunca compartiremos tu información. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}
