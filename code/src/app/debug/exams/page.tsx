import { loadExams } from '@/lib/loadExams';

export default function DebugExamsPage() {
  const exams = loadExams();

  if (exams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            No Exams Found
          </h1>
          <p className="text-red-700">
            No exam data could be loaded. Please check that exam JSON files
            exist in the <code className="bg-red-100 px-1 py-0.5 rounded">src/data/exams/</code> directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Debug: Exam Data Loader
          </h1>
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{exams.length}</span> exam
            {exams.length !== 1 ? 's' : ''} • Sorted by year (newest first), then by subject
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Subject Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {exam.subject}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {exam.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {exam.description}
              </p>

              {/* Metadata Grid */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Year:</span>
                  <span className="font-semibold text-gray-900">{exam.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-semibold text-gray-900">
                    {exam.questions.length} / {exam.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold text-gray-900">
                    {exam.durationMinutes} min
                  </span>
                </div>
              </div>

              {/* Exam ID (for debugging) */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <code className="text-xs text-gray-400 break-all">
                  ID: {exam.id}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

