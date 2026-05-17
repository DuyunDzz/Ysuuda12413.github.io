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

const ALL_LINES = CODE_CONTENT.split('\n');

export const CodeBlock = ({ onRun }: { onRun: () => void }) => {
  const [iteration, setIteration] = useState(0);
  const isTyping = useRef(true);
  const [showToast, setShowToast] = useState(false);
  const typingSpeed = 25;
  const scrambleChars = "!@#$%^&*()_+{}:<>?/[];,./";

  useEffect(() => {
    let currentIteration = 0;
    let timeout: NodeJS.Timeout;

    const tick = () => {
      if (isTyping.current) {
        if (currentIteration <= CODE_CONTENT.length) {
          setIteration(currentIteration);
          currentIteration++;
          timeout = setTimeout(tick, currentIteration > CODE_CONTENT.length ? 4000 : typingSpeed);
          if (currentIteration > CODE_CONTENT.length) isTyping.current = false;
        }
      } else {
        if (currentIteration > 0) {
          currentIteration--;
          setIteration(currentIteration);
          timeout = setTimeout(tick, typingSpeed / 2);
        } else {
          isTyping.current = true;
          timeout = setTimeout(tick, 1000);
        }
      }
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CODE_CONTENT);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Helper to get text for each line based on global iteration
  const getLineText = (lineIndex: number) => {
    let charCount = 0;
    for (let i = 0; i < lineIndex; i++) {
      charCount += ALL_LINES[i].length + 1; // +1 for \n
    }
    
    const lineContent = ALL_LINES[lineIndex];
    const relativeIteration = iteration - charCount;
    
    if (relativeIteration <= 0) return "";
    if (relativeIteration >= lineContent.length) return lineContent;
    
    return lineContent.split("").map((char, index) => {
      if (index < relativeIteration) return char;
      if (index === relativeIteration) return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      return "";
    }).join("");
  };

  // Helper to get scrambled line number
  const getScrambledLineNumber = (lineIndex: number) => {
    let charCountBefore = 0;
    for (let i = 0; i < lineIndex; i++) {
      charCountBefore += ALL_LINES[i].length + 1;
    }
    
    const lineNumStr = (lineIndex + 1).toString();
    const lineLength = ALL_LINES[lineIndex].length;
    const relativeIteration = iteration - charCountBefore;
    
    if (relativeIteration <= 0) return "";
    
    // While the line is being typed/scrambled, scramble the number too
    if (relativeIteration < lineLength) {
      // Pick random chars based on the length of the line number string
      return Array(lineNumStr.length)
        .fill(0)
        .map(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)])
        .join("");
    }
    
    return lineNumStr;
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
            {ALL_LINES.map((_, i) => {
              const lineText = getLineText(i);
              const scrambledLineNum = getScrambledLineNumber(i);
              return (
                <div key={`line-${i}`} className="flex">
                  <span className="text-zinc-600 w-5 md:w-7 inline-block select-none text-right mr-2 md:mr-3">
                    {scrambledLineNum}
                  </span>
                  <span>
                    {renderHighlightedCode(lineText, i)}
                    {iteration >= CODE_CONTENT.length ? (
                      i === ALL_LINES.length - 1 && (
                        <m.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 align-middle"
                        />
                      )
                    ) : (
                      // Find which line the cursor is currently on
                      iteration >= ALL_LINES.slice(0, i).reduce((acc, l) => acc + l.length + 1, 0) &&
                      iteration < ALL_LINES.slice(0, i + 1).reduce((acc, l) => acc + l.length + 1, 0) && (
                        <m.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-1.5 h-3.5 bg-emerald-500 ml-0.5 align-middle"
                        />
                      )
                    )}
                  </span>
                </div>
              );
            })}
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

