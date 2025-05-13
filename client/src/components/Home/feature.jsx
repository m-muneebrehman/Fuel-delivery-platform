import { Truck, Zap, Shield, Clock, ArrowRight } from "lucide-react"

export const Feature = () => (
  <div className="w-full py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    
    <div className="container mx-auto px-4 relative">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          Why Choose Our Service?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We provide comprehensive solutions for all your fuel and parts needs, ensuring your business runs smoothly and efficiently.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: Truck,
            title: "Fast Delivery",
            description: "Quick and reliable delivery of fuel and parts to your location, saving you time and hassle.",
            color: "blue"
          },
          {
            icon: Zap,
            title: "Quality Fuel",
            description: "Premium quality fuel that ensures optimal performance for your vehicles.",
            color: "green"
          },
          {
            icon: Shield,
            title: "Secure Service",
            description: "Safe and secure transactions with reliable tracking and monitoring systems.",
            color: "purple"
          },
          {
            icon: Clock,
            title: "24/7 Support",
            description: "Round-the-clock customer support to assist you with any queries or issues.",
            color: "orange"
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Decorative corner */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-50 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Bottom decorative line */}
      <div className="w-24 h-1 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20 rounded-full mx-auto mt-20"></div>
    </div>
  </div>
);