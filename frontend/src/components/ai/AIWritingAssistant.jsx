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
    setSuggestions(null);

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
    if (suggestion.original && suggestion.improved) {
      // Replace specific text
      const updatedContent = content.replace(
        suggestion.original,
        suggestion.improved
      );
      onContentUpdate(updatedContent);
    } else if (suggestion.improved && !suggestion.original) {
      // General improvement - append or use as reference
      const improvedContent = `${content}\n\n${suggestion.improved}`;
      onContentUpdate(improvedContent);
    }
  };

  const applyAllSuggestions = () => {
    if (!suggestions?.suggestions) return;

    let updatedContent = content;
    suggestions.suggestions.forEach((suggestion) => {
      if (suggestion.original && suggestion.improved) {
        updatedContent = updatedContent.replace(
          suggestion.original,
          suggestion.improved
        );
      }
    });
    onContentUpdate(updatedContent);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
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
              📝 Grammar Check
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
          {/* Action Button */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => analyzeContent(activeTab)}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <span>
                  {activeTab === "grammar" && "📝"}
                  {activeTab === "enhance" && "🚀"}
                  {activeTab === "tone" && "🎯"}
                </span>
              )}
              <span>
                {loading
                  ? "Analyzing..."
                  : `Analyze ${
                      activeTab === "grammar"
                        ? "Grammar"
                        : activeTab === "enhance"
                        ? "Content"
                        : "Tone"
                    }`}
              </span>
            </button>

            {suggestions?.suggestions?.length > 0 && (
              <button
                onClick={applyAllSuggestions}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <span>✨</span>
                <span>Apply All</span>
              </button>
            )}
          </div>

          {/* Results */}
          {suggestions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {activeTab === "grammar" && "Grammar & Style Suggestions"}
                  {activeTab === "enhance" && "Content Enhancement Suggestions"}
                  {activeTab === "tone" && "Tone Adjustment Suggestions"}
                </h4>
                <span className="text-sm text-gray-500">
                  {suggestions.suggestions?.length || 0} suggestions found
                </span>
              </div>

              {suggestions.suggestions?.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2 flex items-center">
                        {suggestion.type === "grammar" && "📝 Grammar Fix"}
                        {suggestion.type === "enhancement" && "🚀 Enhancement"}
                        {suggestion.type === "tone" && "🎯 Tone Adjustment"}
                        {suggestion.confidence && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {Math.round(suggestion.confidence * 100)}%
                            confidence
                          </span>
                        )}
                      </div>

                      {suggestion.original && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-red-600">
                            Original:
                          </span>
                          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded mt-1 text-sm">
                            {suggestion.original}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <span className="text-sm font-medium text-green-600">
                          {suggestion.original ? "Improved:" : "Suggestion:"}
                        </span>
                        <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded mt-1 text-sm">
                          {suggestion.improved}
                        </div>
                      </div>

                      {suggestion.reason && (
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                          <strong>Why:</strong> {suggestion.reason}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="ml-4 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <span>✓</span>
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
              ))}

              {suggestions.suggestions?.length === 0 && (
                <div className="text-center text-gray-500 py-8 bg-green-50 rounded-lg">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="font-medium">Great job!</div>
                  <div>
                    No improvements needed. Your content looks excellent!
                  </div>
                </div>
              )}
            </div>
          )}

          {!suggestions && !loading && (
            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">
                {activeTab === "grammar" && "📝"}
                {activeTab === "enhance" && "🚀"}
                {activeTab === "tone" && "🎯"}
              </div>
              <div className="font-medium mb-2">
                Ready to improve your content?
              </div>
              <div>
                Click the analyze button to get AI-powered suggestions for your{" "}
                {activeTab === "grammar"
                  ? "grammar and style"
                  : activeTab === "enhance"
                  ? "content quality"
                  : "tone and voice"}
                .
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistant;
