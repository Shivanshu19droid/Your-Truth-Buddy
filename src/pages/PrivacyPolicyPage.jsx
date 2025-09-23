import React from "react";

export default function PrivacyPolicyPage() {
  // Get today's date for the "Last Updated" field
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md font-sans leading-relaxed text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
          Privacy Policy for Truth Buddy
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Last Updated: {today}
        </p>

        <p className="mb-4">
          Welcome to Truth Buddy ("we," "us," or "our"). We are committed to
          protecting your privacy. This Privacy Policy explains what information
          our Chrome Extension (the "Extension") and its associated backend
          service (the "Service") handle and why.
        </p>
        <p className="mb-6">
          Our core principle is to provide a powerful fact-checking tool while
          minimizing data collection. We do not collect or store personally
          identifiable information on our servers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
          1. Information We Handle
        </h2>
        <p className="mb-4">
          The extension processes two main categories of data: data sent for
          analysis and data stored locally on your device.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          a. Data Sent to Our Backend Service
        </h3>
        <p className="mb-4">
          When you request a verification, the following non-personal data is
          sent securely to our backend Service:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>
            <strong>Content for Analysis:</strong> The text you select or the
            URL of the image you right-click is sent to our Service for
            processing. This content is then forwarded to the Google Gemini API
            for analysis and is not permanently stored on our servers.
          </li>
          <li>
            <strong>Content Type:</strong> We send an indicator specifying
            whether the content is{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded-sm text-sm">
              text
            </code>{" "}
            or an{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded-sm text-sm">
              image
            </code>{" "}
            to ensure it is processed correctly.
          </li>
        </ul>
        <p className="mb-6">
          This data is used exclusively to provide the verification result and
          is essential for the core functionality of the Extension. Our Service
          acts as a secure proxy to protect our API keys and manage requests to
the Google Gemini API.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          b. Data Stored Locally on Your Computer
        </h3>
        <p className="mb-4">
          To provide a personalized and feature-rich experience, the Extension
          stores some data directly on your computer using the browser's
          built-in storage. This data is <strong>never</strong> transmitted to
          our servers.
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            <strong>Verification History:</strong> A local log of your recent
            verifications is kept for your convenience. You can view and clear
            this history at any time from the extension's popup.
          </li>
          <li>
            <strong>Quiz & Profile Data:</strong> Your quiz scores, progress,
            leaderboard entries, and profile information (nickname, avatar) are
            all stored locally. You have full control to clear this data.
          </li>
          <li>
            <strong>User Preferences:</strong> Your choice for dark or light
            mode is saved locally to persist your theme preference.
          </li>
          <li>
            <strong>Last Checked Item:</strong> The extension temporarily stores
            the last item you selected for verification to display it when you
            open the popup.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          2. How We Use Information
        </h2>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            <strong>To Provide Core Functionality:</strong> We process the text
            and image URLs you provide to generate a fact-checking analysis from
            the Google Gemini API.
          </li>
          <li>
            <strong>To Enhance User Experience:</strong> We use locally stored
            data to remember your settings, display your verification history,
            and power the gamification features (quiz and leaderboard).
          </li>
          <li>
            <strong>To Provide Convenience:</strong> The{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded-sm text-sm">
              clipboardWrite
            </code>{" "}
            permission is used only for the "Copy text" button in the floating
            bubble, allowing you to copy selected text with a single click.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          3. Third-Party Services
        </h2>
        <p className="mb-4">
          We rely on one key third-party service to power our extension:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            <strong>Google Gemini API:</strong> Content you submit for
            verification is ultimately processed by Google's AI models. We
            recommend you review the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Privacy Policy
            </a>{" "}
            to understand how they handle data submitted to their services.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          4. Data Security
        </h2>
        <p className="mb-4">We take security seriously.</p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            <strong>API Key Protection:</strong> All API keys for third-party
            services are stored securely on our backend server and are never
            exposed in the browser extension's code.
          </li>
          <li>
            <strong>Secure Communication:</strong> Communication between the
            Extension and our backend Service is encrypted using HTTPS.
          </li>
          <li>
            <strong>Local Data Control:</strong> All personal preferences,
            history, and profile data are stored on your device, giving you
            full control.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          5. Your Choices and Control
        </h2>
        <p className="mb-4">
          You have complete control over the data associated with your use of the
          Extension:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>
            You can clear your verification history at any time via the "Clear
            History" button.
          </li>
          <li>
            You can clear all quiz data, profile stats, and the local
            leaderboard using the "Clear Quiz Data" button in the Profile tab.
          </li>
          <li>You can opt-out of participating in the local leaderboard.</li>
          <li>
            Uninstalling the extension will permanently remove all associated
            local data from your browser.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          6. Changes to This Privacy Policy
        </h2>
        <p className="mb-6">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last Updated" date at the top.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 my-4">
          7. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at: <strong>Ashutoshkumar63041@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}