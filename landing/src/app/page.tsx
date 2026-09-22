"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code2,
  Terminal,
  Cpu,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Share2,
  Layers,
  FileCode2,
} from 'lucide-react';

interface CodeSample {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  code: string;
  output: string;
}

const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'hello',
    title: 'Hello World',
    hindiTitle: 'नमस्ते दुनिया',
    description: 'A simple entry point and standard output in PahadiScript.',
    code: `shuru {
  bol("Namaste Himachal!");
  bol("Welcome to HimalayanCode — PahadiScript.");
}`,
    output: `Namaste Himachal!
Welcome to HimalayanCode — PahadiScript.`,
  },
  {
    id: 'conditions',
    title: 'Conditionals (agar / magar)',
    hindiTitle: 'शर्तें (अगर / मगर)',
    description: 'Decision making using intuitive Hindi conditional branches.',
    code: `shuru {
  ank umar = 19;

  agar (umar >= 18) {
    bol("Aap vote dene ke yogya hain (Eligible).");
  } magar {
    bol("Aap abhi vote nahi de sakte.");
  }
}`,
    output: `Aap vote dene ke yogya hain (Eligible).`,
  },
  {
    id: 'loops',
    title: 'Loops (jabtak)',
    hindiTitle: 'लूप (जबतक)',
    description: 'Iterative conditional counting from 1 to 5.',
    code: `shuru {
  ank ginti = 1;

  jabtak (ginti <= 5) {
    bol("Ginti sankhya: " + ginti);
    ginti = ginti + 1;
  }
  bol("PahadiScript Loop Sampanna!");
}`,
    output: `Ginti sankhya: 1
Ginti sankhya: 2
Ginti sankhya: 3
Ginti sankhya: 4
Ginti sankhya: 5
PahadiScript Loop Sampanna!`,
  },
  {
    id: 'function',
    title: 'Function (kaam / paucha)',
    hindiTitle: 'फंक्शन (काम / पहुँचा)',
    description: 'Modular function declaration and returning values.',
    code: `kaam jod(ank pehla, ank doosra) {
  ank yog = pehla + doosra;
  paucha yog;
}

shuru {
  ank nateeja = jod(45, 55);
  bol("Kul Yog (Sum) = " + nateeja);
}`,
    output: `Kul Yog (Sum) = 100`,
  },
];

const KEYWORDS_LIST = [
  { keyword: 'shuru', hindi: 'शुरू', cEquiv: 'main', category: 'Structure', desc: 'Entry point of the script' },
  { keyword: 'bol', hindi: 'बोल', cEquiv: 'printf / print', category: 'I/O', desc: 'Standard console output' },
  { keyword: 'sun', hindi: 'सुन', cEquiv: 'scanf / input', category: 'I/O', desc: 'Standard console input' },
  { keyword: 'agar', hindi: 'अगर', cEquiv: 'if', category: 'Condition', desc: 'Conditional execution block' },
  { keyword: 'magar', hindi: 'मगर', cEquiv: 'else', category: 'Condition', desc: 'Alternative conditional branch' },
  { keyword: 'jabtak', hindi: 'जबतक', cEquiv: 'while', category: 'Loop', desc: 'Conditional loop execution' },
  { keyword: 'phir', hindi: 'फिर', cEquiv: 'for', category: 'Loop', desc: 'Iterative counting loop' },
  { keyword: 'bas', hindi: 'बस', cEquiv: 'break', category: 'Loop Control', desc: 'Terminate loop immediately' },
  { keyword: 'chalo', hindi: 'चलो', cEquiv: 'continue', category: 'Loop Control', desc: 'Skip to next loop iteration' },
  { keyword: 'le', hindi: 'ले', cEquiv: 'var / auto', category: 'Variable', desc: 'General variable declaration' },
  { keyword: 'ank', hindi: 'अंक', cEquiv: 'int', category: 'Data Type', desc: 'Integer numeric data type' },
  { keyword: 'naap', hindi: 'नाप', cEquiv: 'float', category: 'Data Type', desc: 'Floating point decimal data type' },
  { keyword: 'akshar', hindi: 'अक्षर', cEquiv: 'char / string', category: 'Data Type', desc: 'Character / text data type' },
  { keyword: 'dhancha', hindi: 'ढांचा', cEquiv: 'struct', category: 'Data Type', desc: 'Custom structured data structure' },
  { keyword: 'kaam', hindi: 'काम', cEquiv: 'function / def', category: 'Function', desc: 'Function definition header' },
  { keyword: 'paucha', hindi: 'पहुँचा', cEquiv: 'return', category: 'Function', desc: 'Return value from function' },
  { keyword: 'sahi', hindi: 'सही', cEquiv: 'true', category: 'Boolean', desc: 'Boolean truth value' },
  { keyword: 'galat', hindi: 'गलत', cEquiv: 'false', category: 'Boolean', desc: 'Boolean false value' },
  { keyword: 'khali', hindi: 'खाली', cEquiv: 'void / None', category: 'Data Type', desc: 'Void or empty return type' },
  { keyword: 'roko', hindi: 'रोको', cEquiv: 'exit()', category: 'Control', desc: 'Halt program execution' },
];

const FAQS = [
  {
    q: 'What is HimalayanCode and PahadiScript?',
    a: 'HimalayanCode is an open-source educational programming ecosystem centered around PahadiScript — a programming language created with intuitive Hindi keywords. It eliminates the dual challenge of simultaneously learning foreign English keywords and complex computer science logic.',
  },
  {
    q: 'How does this help first-year engineering students?',
    a: 'Many students in India enter engineering without prior high school computer science background. When learning C or C++, English syntax creates friction. PahadiScript allows students to master variables, loops, conditionals, and functions in their familiar language, making the subsequent transition to industry languages effortless.',
  },
  {
    q: 'How does the online interpreter execute code?',
    a: 'Your code is securely processed by our compiler engine built on Python with PLY (Python Lex-Yacc). The lexer tokenizes your PahadiScript syntax, the parser constructs an Abstract Syntax Tree (AST), and the runtime interpreter executes the code, returning stdout or errors within milliseconds.',
  },
  {
    q: 'Can I save, share, and track my code?',
    a: 'Yes! HimalayanCode includes built-in execution history tracking, compilation speed metrics, cloud saving, and one-click code sharing with unique links for collaborative learning.',
  },
  {
    q: 'Is HimalayanCode completely free to use?',
    a: 'Yes, HimalayanCode is 100% free and open-source. Anyone can open the browser, write code, run programs, and explore language syntax with zero software installation or subscription required.',
  },
];

export default function Home() {
  const router = useRouter();
  const [selectedSample, setSelectedSample] = useState<CodeSample>(CODE_SAMPLES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [keywordSearch, setKeywordSearch] = useState('');

  const handleBeginJourney = () => {
    router.push('/editor');
  };

  const handleTryInEditor = (sampleCode: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pahadi_editor_prefill', sampleCode);
    }
    router.push('/editor');
  };

  const filteredKeywords = KEYWORDS_LIST.filter(
    (item) =>
      item.keyword.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      item.hindi.includes(keywordSearch) ||
      item.cEquiv.toLowerCase().includes(keywordSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* ===================== HERO SECTION ===================== */}
      <section
        className="pb-24 w-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto"
        style={{ paddingTop: 'calc(5rem - 40px)' }}
        aria-label="Hero Introduction"
      >
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-white/80 backdrop-blur-md text-xs sm:text-sm font-medium text-black shadow-xs mb-8 animate-fade-rise">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>🏔️ HimalayanCode • The Native Hindi Programming Language</span>
        </div>

        {/* Primary H1 */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-normal text-black leading-[1.02] tracking-[-2px] animate-fade-rise">
          Code in the language of the mountains.{' '}
          <span className="italic text-[#6F6F6F]">Think in Hindi,</span>{' '}
          <span className="italic text-[#6F6F6F]">Build in code.</span>
        </h1>

        {/* Descriptive Subtitle for SEO & Users */}
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mt-8 leading-relaxed text-[#555555] font-body animate-fade-rise-delay">
          A modern, web-based interpreter for <strong>HimalayanCode (PahadiScript)</strong>.
          Designed specifically to help engineering and school students master programming logic,
          conditions, and loops using intuitive Hindi keywords like{' '}
          <code className="px-2 py-0.5 rounded bg-black/5 font-mono text-sm">bol</code>,{' '}
          <code className="px-2 py-0.5 rounded bg-black/5 font-mono text-sm">agar</code>, and{' '}
          <code className="px-2 py-0.5 rounded bg-black/5 font-mono text-sm">jabtak</code> without
          English syntax barriers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-rise-delay-2">
          <button
            onClick={handleBeginJourney}
            className="w-full sm:w-auto rounded-full px-10 py-4 text-base bg-black text-white hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-md font-medium flex items-center justify-center gap-2"
          >
            <span>Begin Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#keywords-guide"
            className="w-full sm:w-auto rounded-full px-8 py-4 text-base bg-white/90 border border-black/15 text-black hover:bg-black/5 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-black/70" />
            <span>Explore Keywords Guide</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 w-full max-w-4xl text-left">
          <div className="p-4 rounded-xl border border-black/5 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-black font-semibold text-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Zero Install</span>
            </div>
            <p className="text-xs text-[#6F6F6F] mt-1">Run immediately in your web browser</p>
          </div>
          <div className="p-4 rounded-xl border border-black/5 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-black font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Native Hindi</span>
            </div>
            <p className="text-xs text-[#6F6F6F] mt-1">20 intuitive keywords for logic</p>
          </div>
          <div className="p-4 rounded-xl border border-black/5 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-black font-semibold text-sm">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>PLY Compiler</span>
            </div>
            <p className="text-xs text-[#6F6F6F] mt-1">Fast AST parser and execution VM</p>
          </div>
          <div className="p-4 rounded-xl border border-black/5 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-black font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>100% Free</span>
            </div>
            <p className="text-xs text-[#6F6F6F] mt-1">Open source community project</p>
          </div>
        </div>
      </section>

      {/* ===================== INTERACTIVE LIVE CODE SHOWCASE ===================== */}
      <section
        className="w-full max-w-6xl my-12 p-6 sm:p-8 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-xl"
        aria-label="Interactive Code Examples"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">
              <Code2 className="w-4 h-4" />
              <span>Interactive Syntax Preview</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display text-black">
              See PahadiScript in Action
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-1 max-w-xl">
              Select an example to see how natural programming in Hindi looks and executes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CODE_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => setSelectedSample(sample)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedSample.id === sample.id
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-black/5 text-[#555555] hover:bg-black/10'
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Code + Terminal Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Code Editor Preview */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0F141C] text-white p-5 font-mono text-sm border border-slate-800 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/50 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-white/70">{selectedSample.id}.pahadi</span>
                </div>
                <span className="text-emerald-400 font-sans text-xs font-medium">
                  {selectedSample.hindiTitle}
                </span>
              </div>
              <pre className="overflow-x-auto text-sm leading-relaxed text-slate-200 py-2">
                <code>{selectedSample.code}</code>
              </pre>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-sans">{selectedSample.description}</span>
              <button
                onClick={() => handleTryInEditor(selectedSample.code)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Run in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Output Preview */}
          <div className="lg:col-span-5 rounded-2xl bg-[#181E29] text-white p-5 font-mono text-sm border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/50 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-white/70">Terminal Output</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-[10px]">
                Exit 0 • ~1.2ms
              </span>
            </div>

            <div className="flex-1 bg-[#0b0e14] rounded-xl p-4 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto leading-relaxed border border-white/5">
              <pre>{selectedSample.output}</pre>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Python PLY interpreter execution output</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY HIMALAYANCODE (FEATURES) ===================== */}
      <section
        className="w-full max-w-6xl my-16 px-4"
        aria-label="Core Advantages of HimalayanCode"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-black/50 font-semibold">
            Architected for Learning
          </span>
          <h2 className="text-3xl sm:text-5xl font-display text-black mt-2">
            Why PahadiScript Bridges the Gap
          </h2>
          <p className="text-sm sm:text-base text-[#6F6F6F] mt-3">
            Designed specifically for engineering institutions, high schools, and first-time coders
            across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <FileCode2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">Intuitive Native Hindi Keywords</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                Students understand <span className="font-semibold text-black">agar</span> (if),{' '}
                <span className="font-semibold text-black">magar</span> (else), and{' '}
                <span className="font-semibold text-black">bol</span> (print) intuitively. This lets
                them focus on computational thinking and algorithm design rather than memorizing
                unfamiliar English terms.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              Eliminates language cognitive load
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">Sub-millisecond Web Execution</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                Built with a verified Python PLY (Lex & Yacc) engine that provides instant syntax
                parsing, symbol validation, and execution results right in the browser with full
                standard input/output capabilities.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              Direct AST parsing & VM evaluation
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">Compile Analytics & History</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                Track your coding progress with the visual compilation metrics dashboard. Monitor
                success rates, execution speeds, and review complete historical logs for all your
                PahadiScript programs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              Local browser execution timeline
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">Friendly Error Diagnostics</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                Cryptic compiler errors discourage beginners. HimalayanCode reports syntax mistakes
                with clear contextual line numbers and actionable guidance to help students debug
                with confidence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              Line-level error pinpointing
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">Instant Code Sharing</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                Collaborate with peers and instructors effortlessly. Generate instant, secure share
                links that allow anyone to run and inspect your PahadiScript scripts directly in
                their browser.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              One-click shareable snippets
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display text-black">A Stepping Stone to C & Python</h3>
              <p className="text-sm text-[#555555] leading-relaxed mt-3">
                PahadiScript syntax maps directly to standard C/Python programming constructs. Once
                students gain confidence in logic building, transferring their skills to C, C++,
                Java, or Python is seamless.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 text-xs text-[#6F6F6F]">
              Smooth transition to industry languages
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LANGUAGE SPECIFICATION / KEYWORDS TABLE (HIGH SEO VALUE) ===================== */}
      <section
        id="keywords-guide"
        className="w-full max-w-6xl my-16 p-6 sm:p-10 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-xl scroll-mt-20"
        aria-label="PahadiScript Keywords Specification"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Language Specification</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display text-black">
              PahadiScript Keywords Reference Guide
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-1 max-w-2xl">
              PahadiScript features 20 reserved Hindi keywords mapped to standard C and Python
              constructs. Search or explore below:
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search keyword (e.g. agar, bol, int)..."
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-black/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
        </div>

        {/* Semantic Keywords Table for Google indexing & user clarity */}
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-black/5 border-b border-black/10 text-xs font-semibold uppercase text-black/70">
                <th className="py-3.5 px-4">Pahadi Keyword</th>
                <th className="py-3.5 px-4">Hindi Script</th>
                <th className="py-3.5 px-4">C / Python Equivalent</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredKeywords.length > 0 ? (
                filteredKeywords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-black">
                      <code>{item.keyword}</code>
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">{item.hindi}</td>
                    <td className="py-3 px-4 font-mono text-xs text-[#555555]">
                      <span className="px-2 py-0.5 rounded bg-black/5">{item.cEquiv}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#555555]">{item.desc}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#6F6F6F]">
                    No keywords found matching &quot;{keywordSearch}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F6F6F]">
          <span>Tip: Click &quot;Begin Journey&quot; to test these keywords directly in our interactive IDE.</span>
          <button
            onClick={handleBeginJourney}
            className="text-black font-semibold hover:underline flex items-center gap-1"
          >
            <span>Open Code Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ===================== FAQ ACCORDION (MATCHES JSON-LD FAQPage) ===================== */}
      <section
        className="w-full max-w-4xl my-16 px-4"
        aria-label="Frequently Asked Questions"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#6F6F6F] mt-2">
            Everything you need to know about HimalayanCode and the PahadiScript language.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left font-medium text-base text-black flex items-center justify-between gap-4 hover:bg-black/[0.02] transition-colors"
                >
                  <span className="font-display text-lg text-black">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6F6F6F] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#555555] leading-relaxed border-t border-black/5 pt-4">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== CALL TO ACTION SECTION ===================== */}
      <section
        className="w-full max-w-5xl my-16 p-10 sm:p-14 rounded-3xl bg-black text-white text-center shadow-2xl relative overflow-hidden"
        aria-label="Call to Action"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-xs font-mono uppercase tracking-wider text-emerald-300 border border-white/10 mb-4">
            Free • Open Source • Online
          </span>
          <h2 className="text-3xl sm:text-5xl font-display leading-tight">
            Ready to code in your own native language?
          </h2>
          <p className="text-sm sm:text-base text-white/70 mt-4 leading-relaxed">
            Join students and beginners across the nation. Write your first PahadiScript program in
            seconds.
          </p>

          <button
            onClick={handleBeginJourney}
            className="mt-8 rounded-full px-12 py-4 text-base bg-white text-black hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 font-semibold shadow-lg"
          >
            Launch Web Editor
          </button>
        </div>
      </section>

      {/* ===================== SEMANTIC FOOTER (HIGH SEO AUTHORITY) ===================== */}
      <footer
        className="w-full border-t border-black/10 mt-16 pt-12 pb-16 text-left"
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="HimalayanCode Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-display font-normal text-black">HimalayanCode</span>
            </div>
            <p className="text-sm text-[#6F6F6F] mt-4 max-w-md leading-relaxed">
              An open-source, Himalayan-inspired programming language and web-based execution
              environment designed to break language barriers in engineering education through
              native Hindi keywords.
            </p>
            <div className="text-xs text-[#888888] mt-6">
              © {new Date().getFullYear()} HimalayanCode Project. Released under MIT License.
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[#6F6F6F]">
              <li>
                <Link href="/editor" className="hover:text-black transition-colors">
                  Online Code Editor
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-black transition-colors">
                  Compiler Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-black transition-colors">
                  Execution History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Resources & SEO
            </h3>
            <ul className="space-y-2 text-sm text-[#6F6F6F]">
              <li>
                <a
                  href="#keywords-guide"
                  className="hover:text-black transition-colors"
                >
                  PahadiScript Keywords
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  Robots.txt Directives
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ankush850/HimalayanCode-PahadiScript-Web-Interpreter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
