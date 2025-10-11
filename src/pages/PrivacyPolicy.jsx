import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Privacy Policy</h1>
      <p className="text-gray-700 leading-relaxed mb-3">
        At Eduprayas, we value your privacy. We collect only essential information 
        required to provide you with a personalized and secure learning experience.
      </p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-4">
        <li>We never sell or share your personal data with third parties.</li>
        <li>Your information is encrypted and stored securely.</li>
        <li>Cookies are used only to enhance your site experience.</li>
      </ul>
      <p className="text-gray-700">
        By using Eduprayas, you agree to our terms and this privacy policy. 
        For any privacy-related queries, please contact us at 
        <span className="text-blue-600 font-semibold"> eduprayashub@gmail.com</span>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
