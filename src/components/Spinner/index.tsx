// components/Spinner.tsx
export default function Spinner() {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }