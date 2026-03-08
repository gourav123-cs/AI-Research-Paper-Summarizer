interface ApiKeyWarningProps {
  onOpenSettings?: () => void;
}

const ApiKeyWarning = ({ onOpenSettings }: ApiKeyWarningProps) => (
  <div className="bg-emerald-500/10 border-b border-emerald-500/30 py-2.5">
    <div className="container text-center text-sm text-emerald-700 dark:text-emerald-400">
      ⚡ Demo mode · Powered by Groq ·{" "}
      <button
        onClick={onOpenSettings}
        className="underline font-semibold hover:opacity-80 cursor-pointer"
      >
        Add your own key for unlimited use →
      </button>
    </div>
  </div>
);

export default ApiKeyWarning;
