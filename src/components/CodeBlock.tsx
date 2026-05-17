import { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Play, Copy, Terminal } from 'lucide-react';

const CODE_CONTENT = `const profile = {
  aliases: ["DuyunDz", "DuyHayRaDe"],
  works: ["minecraft client", "scripts", "tools"],
  location: "Vietnam",
  interests: ["coding", "modding", "reverse engineering"],
  contacts: {
    discordID: "1101376716670259210",
    facebook: "fb.com/profile.php?id=61556575490667"
  }
}`;

export const CodeBlock = ({ onRun }: { onRun: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const isTyping = useRef(true);
  const [showToast, setShowToast] = useState(false);
  const typingSpeed = 30;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping.current) {
      if (displayText.length < CODE_CONTENT.length) {
        timeout = setTimeout(() => {
          setDisplayText(CODE_CONTENT.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          isTyping.current = false;
          setDisplayText(prev => prev.slice(0, -1));
        }, 3000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(CODE_CONTENT.slice(0, displayText.length - 1));
        }, typingSpeed / 2);
      } else {
        timeout = setTimeout(() => {
          isTyping.current = true;
          setDisplayText(CODE_CONTENT.slice(0, 1));
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CODE_CONTENT);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="mt-5 md:mt-6 relative group">
      <div className="glass-card bg-zinc-900/80 border-white/5 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-white/5 border-b border-white/5">
          <div className="flex gap-x-1.5 md:gap-x-2">
            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-rose-500/50" />
            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <div className="text-[9px] md:text-[11px] text-zinc-500 font-mono flex items-center gap-2">
            <Terminal size={10} />
            profile.js
          </div>
          <div className="flex items-center gap-x-1 md:gap-x-1.5">
            <button
              onClick={onRun}
              className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-500"
              title="Run Code"
            >
              <Play size={12} className="md:size-3.5" fill="currentColor" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400"
              title="Copy Code"
            >
              <Copy size={12} className="md:size-3.5" />
            </button>
          </div>
        </div>
        <div className="p-3 md:p-5 font-mono text-[10px] md:text-[13px] leading-relaxed overflow-x-auto min-h-[220px] md:min-h-[280px]">
          <pre className="whitespace-pre">
            {displayText.split('\n').map((line, i, arr) => (
              <div key={`line-${i}`} className="flex">
                <span className="text-zinc-600 w-5 md:w-7 inline-block select-none text-right mr-2 md:mr-3">{i + 1}</span>
                <span>
                  {renderHighlightedCode(line, i)}
                  {i === arr.length - 1 && (
                    <m.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 align-middle"
                    />
                  )}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm shadow-xl z-50"
          >
            Copied to clipboard! 📋
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Safe tokenizer that splits code into tokens and renders React elements
function renderHighlightedCode(line: string, lineIndex: number) {
  if (!line) return null;
  
  const tokens = line.split(/(".*?"|[\w]+|[^\s\w]|[\s]+)/g).filter(Boolean);

  return tokens.map((token, index) => {
    const key = `token-${lineIndex}-${index}`;
    // Strings
    if (token.startsWith('"')) {
      return <span key={key} className="code-token-string">{token}</span>;
    }
    
    // Keywords
    if (['const', 'let', 'var', 'function', 'return', 'if', 'else'].includes(token)) {
      return <span key={key} className="code-token-keyword">{token}</span>;
    }
    
    if (['aliases', 'works', 'location', 'interests', 'contacts', 'discordID', 'facebook'].includes(token)) {
      return <span key={key} className="code-token-property">{token}</span>;
    }

    // Punctuation
    if (/^[{}[\],:]$/.test(token)) {
      return <span key={key} className="code-token-punctuation">{token}</span>;
    }

    // Operators
    if (token === '=') {
      return <span key={key} className="code-token-operator">{token}</span>;
    }

    // Default (numbers, other identifiers, whitespace)
    return <span key={key}>{token}</span>;
  });
}

