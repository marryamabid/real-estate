import { useState } from "react";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Tailwind CSS is Working!
          </h1>
          <p className="text-gray-600">
            If you can see this styled box, Tailwind is successfully set up in
            your project.
          </p>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Click Me
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
