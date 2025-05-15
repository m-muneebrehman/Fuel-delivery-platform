// components/Step1Form.jsx
import { Button } from "@/components/ui/button"

const Step1Form = ({ formData, handleChange, nextStep }) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-5">
        Create your account
      </h2>
      <p className="text-gray-600 mb-6">
        Join our network of fuel providers and help drivers find you easily.
      </p>
      
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Fuel Pump Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          required
          minLength={3}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          required
          minLength={8}
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
          required
        />
        
        <Button
          type="button"
          onClick={nextStep}
          className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-gray-100 font-medium rounded-md"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Step1Form;