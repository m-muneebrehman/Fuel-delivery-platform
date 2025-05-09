// components/ProgressIndicator.jsx
const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-xs mt-1">Account</span>
        </div>
        <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-xs mt-1">Location & Fuel</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;