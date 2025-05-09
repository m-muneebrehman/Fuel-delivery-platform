// components/SidePanel.jsx
const SidePanel = () => {
  return (
    <div className="w-full sm:w-1/2 relative bg-gray-900 flex flex-col justify-between p-8 overflow-hidden">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/car1.jpg')",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center space-x-1 mb-24">
          <span className="text-red-200 text-3xl font-bold">P</span>
          <span className="bg-red-500 w-6 h-6"></span>
        </div>
      </div>

      <div className="relative z-10 pb-10">
        <h3 className="text-gray-400 text-xl mb-3">Welcome to</h3>
        <h1 className="text-white text-5xl font-bold mb-6">
          PetrolFinder Community
        </h1>
        <p className="text-gray-400">
          Join our network of fuel providers and grow your business
        </p>
        <a href="#" className="text-green-500 hover:text-green-400">
          Know more
        </a>
      </div>
    </div>
  );
};

export default SidePanel;