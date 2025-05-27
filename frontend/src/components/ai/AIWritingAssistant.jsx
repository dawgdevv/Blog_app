import { useState } from "react";
import axios from "axios";

const AIWritingAssistant = ({
  content,
  onContentUpdate,
  isVisible,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("grammar");

  const analyzeContent = async (type) => {
    if (!content.trim()) {
      alert("Please write some content first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/ai/analyze`,
        {
          content,
          analysisType: type,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error analyzing content:", error);
      alert("Failed to analyze content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    onContentUpdate(suggestion.improvedText);
    setSuggestions(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              ✨ AI Writing Assistant
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("grammar")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "grammar"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📝 Grammar & Style
            </button>
            <button
              onClick={() => setActiveTab("enhance")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "enhance"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🚀 Content Enhancement
            </button>
            <button
              onClick={() => setActiveTab("tone")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "tone"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🎯 Tone Adjustment
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <button
              onClick={() => analyzeContent(activeTab)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <span>✨</span>
              )}
              <span>
                {loading
                  ? "Analyzing..."
                  : activeTab === "grammar"
                  ? "Check Grammar"
                  : activeTab === "enhance"
                  ? "Enhance Content"
                  : "Adjust Tone"}
              </span>
            </button>
          </div>

          {/* Results */}
          {suggestions && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">
                {activeTab === "grammar" && "Grammar & Style Suggestions"}
                {activeTab === "enhance" && "Content Enhancement"}
                {activeTab === "tone" && "Tone Adjustments"}
              </h4>

              {suggestions.suggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">
                        {suggestion.type === "grammar" && "📝 Grammar Issue"}
                        {suggestion.type === "style" && "✨ Style Improvement"}
                        {suggestion.type === "enhancement" && "🚀 Enhancement"}
                        {suggestion.type === "tone" && "🎯 Tone Adjustment"}
                      </div>

                      {suggestion.original && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-red-600">
                            Original:
                          </span>
                          <div className="bg-red-50 p-2 rounded mt-1 text-sm">
                            {suggestion.original}
                          </div>
                        </div>
                      )}

                      <div className="mb-2">
                        <span className="text-sm font-medium text-green-600">
                          Suggestion:
                        </span>
                        <div className="bg-green-50 p-2 rounded mt-1 text-sm">
                          {suggestion.improved}
                        </div>
                      </div>

                      {suggestion.reason && (
                        <div className="text-xs text-gray-500">
                          <strong>Why:</strong> {suggestion.reason}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="ml-4 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}

              {suggestions.overallScore && (
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h5 className="font-semibold text-blue-900 mb-2">
                    Content Analysis
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Readability:</span>
                      <div className="font-semibold">
                        {suggestions.overallScore.readability}/10
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600">Grammar:</span>
                      <div className="font-semibold">
                        {suggestions.overallScore.grammar}/10
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600">Engagement:</span>
                      <div className="font-semibold">
                        {suggestions.overallScore.engagement}/10
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600">Clarity:</span>
                      <div className="font-semibold">
                        {suggestions.overallScore.clarity}/10
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Word count and reading time */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Word count: {content.split(" ").length}</span>
              <span>
                Reading time: ~{Math.ceil(content.split(" ").length / 200)} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistant;
