import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Image, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { VerificationRequest, User } from "@/entities/all";

export default function VerifyPage() {
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleVerify = async () => {
    if (!textInput && !uploadedFile) return;

    setIsVerifying(true);

    try {
      // Get current user
      const currentUser = await User.me();

      // Simulate verification process
      const isReliable = Math.random() > 0.5; // Random for demo
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      const sources = isReliable ? Math.floor(Math.random() * 3) + 2 : 1; // 2-4 sources if reliable, 1 if not

      const result = {
        isReliable,
        confidence,
        sources,
        analysis: isReliable
          ? "This information appears to be factual and is supported by multiple reliable sources."
          : "This information may be misleading or false. Please verify with additional sources."
      };

      // Save verification request to database
      await VerificationRequest.create({
        user_id: currentUser.id,
        content_text: textInput || null,
        file_name: uploadedFile?.name || null,
        verification_result: result
      });

      setVerificationResult(result);
    } catch (error) {
      console.error('Error during verification:', error);
      // Still show result even if saving fails
      const isReliable = Math.random() > 0.5;
      setVerificationResult({
        isReliable,
        confidence: Math.floor(Math.random() * 30) + 70,
        sources: isReliable ? 3 : 1,
        analysis: isReliable
          ? "This information appears to be factual and is supported by multiple reliable sources."
          : "This information may be misleading or false. Please verify with additional sources."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setTextInput("");
    setUploadedFile(null);
    setVerificationResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Truth Verification
        </h1>
        <p className="text-gray-600 text-lg">
          Upload content or paste text to verify its authenticity
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <Card className="shadow-xl border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Content to Verify
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Paste text content
              </label>
              <Textarea
                placeholder="Paste the news article, social media post, or any text content you want to verify..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px] border-gray-200 focus:border-purple-400"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Or upload an image/document
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    Images, PDFs, or text documents
                  </p>
                </label>
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Image className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-700">{uploadedFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleVerify}
                disabled={(!textInput && !uploadedFile) || isVerifying}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Truth
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-purple-200 hover:bg-purple-50"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`shadow-xl ${
              verificationResult.isReliable 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  verificationResult.isReliable ? 'text-green-700' : 'text-red-700'
                }`}>
                  {verificationResult.isReliable ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                  Verification Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-lg font-semibold ${
                  verificationResult.isReliable ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult.isReliable ? 'Likely Reliable' : 'Potentially Unreliable'}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Confidence Level</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {verificationResult.confidence}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Sources Found</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {verificationResult.sources}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Analysis</div>
                  <p className="text-gray-700">{verificationResult.analysis}</p>
                </div>

                <div className={`p-4 rounded-lg ${
                  verificationResult.isReliable ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className={`text-sm font-medium mb-2 ${
                    verificationResult.isReliable ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Recommendation
                  </div>
                  <p className={`text-sm ${
                    verificationResult.isReliable ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult.isReliable 
                      ? "This content appears to be factual, but always cross-reference with multiple sources for important decisions."
                      : "Exercise caution with this content. Verify with trusted news sources and fact-checking websites before sharing."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
