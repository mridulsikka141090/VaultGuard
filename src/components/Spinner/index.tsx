// components/Spinner.tsx
export default function Spinner() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="fixed inset-0 bg-gray-200 opacity-25 z-50 backdrop-blur-sm" />
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }