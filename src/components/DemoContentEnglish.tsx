import { useState } from 'react';
import { ArrowRight, Shield, Zap, Users, FileText, Check, Github, Circle, Info, Target, Gift, Crown, Download, Linkedin } from 'lucide-react';
import { OllamaIcon, OpenAIIcon, ClaudeIcon, GrokIcon, QwenIcon } from './AIModelIcons';
import { AnimatedButton } from './AnimatedButton';

export function DemoContentEnglish() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div id="translatable-content" className="min-h-screen bg-[#F9F9F9] text-gray-900 antialiased overflow-x-hidden flex flex-col scroll-smooth">
      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 animate-fade-up">
        <nav className="glass-nav border border-gray-200 rounded-full pl-6 pr-2 py-2 flex items-center gap-8 shadow-sm hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300">
          <a href="#" className="group flex items-center gap-2 text-sm text-gray-900 hover:text-rose-600 transition-colors">
            <span className="text-2xl tracking-tight font-serif italic font-medium">OpenTranslateAI.com</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-montserrat font-medium text-gray-500">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#pro" className="hover:text-rose-600 transition-colors">Go Pro</a>
            <a href="#pricing" className="hover:text-rose-600 transition-colors">Pricing</a>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden md:block"></div>

          <div className="hidden md:flex items-center gap-3">
            <a href="https://x.com/OpenTranslateAI" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-rose-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/opentranslateai" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-rose-600 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <a href="#demo" className="group bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-600/30 transition-all duration-300 hidden md:flex items-center gap-2 font-montserrat font-medium">
            Click Demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </nav>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20 flex-grow w-full">
        {/* Hero Section */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 lg:p-16 shadow-sm border border-gray-100 relative overflow-hidden group transition-shadow duration-700">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="animate-fade-up delay-100 w-fit inline-flex items-center gap-2.5 bg-white/80 backdrop-blur border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-montserrat font-semibold mb-8 shadow-sm hover:border-rose-200 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                OPEN SOURCE V1.0
              </div>

              <h1 className="animate-fade-up delay-200 text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-8 text-gray-900 font-medium">
                Website <span className="italic text-gray-400">Translation</span><br />
                made <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Instant</span> &<br />
                Private.
              </h1>

              <p className="animate-fade-up delay-300 text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg mb-10 font-montserrat font-medium">
                Translate your website instantly from Mandarin to English and more. Powered by open-source tools like LibreTranslate. No server required.
              </p>

              <div className="animate-fade-up delay-500 flex flex-wrap gap-4 items-center">
                <AnimatedButton text="View on GitHub" href="https://github.com/aceman23/OpenTranslateAI_OpenSourceWebsiteTranslator_US" />
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[500px] lg:h-[600px] w-full animate-slide-in delay-300 flex items-center justify-center">
              <div className="absolute top-10 right-10 w-full h-full bg-orange-100/50 rounded-[2rem] -rotate-3 z-0"></div>
              <div className="relative h-full w-full bg-gradient-to-br from-orange-50/80 via-white to-rose-50/80 rounded-[2rem] overflow-visible shadow-2xl border border-orange-100/50 z-10 group/image flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] rounded-[2rem]"></div>

                <div className="absolute top-12 right-8 lg:right-12 z-30 animate-fade-up delay-500">
                  <div className="bg-orange-100/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl shadow-xl border border-orange-200/50 rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
                  </div>
                </div>

                <div className="absolute bottom-12 left-8 lg:left-12 z-30 animate-fade-up delay-700">
                  <div className="bg-orange-100/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl shadow-xl border border-orange-200/50 -rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                </div>

                <div className="relative z-20 w-[80%] max-w-[320px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-6 lg:p-8 transition-transform duration-500 hover:scale-[1.02] my-auto">
                  <div className="flex gap-2 mb-8">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#FFF0E6] p-3.5 rounded-xl flex items-center justify-between group cursor-default hover:bg-[#ffe4d1] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <span className="text-gray-900 font-montserrat font-medium text-base truncate">Hello World</span>
                      </div>
                      <span className="text-gray-500 text-xs font-bold tracking-wider opacity-60 flex-shrink-0 ml-2">EN</span>
                    </div>

                    <div className="bg-[#E6E8FF] p-3.5 rounded-xl flex items-center justify-between group cursor-default hover:bg-[#dce0ff] transition-colors shadow-sm ring-1 ring-indigo-100/50">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-indigo-500 shadow-sm flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
                        </div>
                        <span className="text-gray-900 font-montserrat font-medium text-base truncate">你好世界</span>
                      </div>
                      <span className="text-gray-500 text-xs font-bold tracking-wider opacity-60 flex-shrink-0 ml-2">中文</span>
                    </div>

                    <div className="bg-[#FFF0E6] p-3.5 rounded-xl flex items-center justify-between group cursor-default hover:bg-[#ffe4d1] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-orange-500 shadow-sm flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <span className="text-gray-900 font-montserrat font-medium text-base truncate">Hola Mundo</span>
                      </div>
                      <span className="text-gray-500 text-xs font-bold tracking-wider opacity-60 flex-shrink-0 ml-2">ES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Open-Source Version: Pros & Cons */}
        <div className="py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-montserrat font-bold text-green-600">
              <Github className="w-3.5 h-3.5" />
              OPEN SOURCE VERSION
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl text-center mb-6 tracking-tight text-gray-900 font-montserrat font-semibold">
            Free Open-Source Version: Pros & Cons
          </h2>
          <p className="text-gray-600 text-center text-base md:text-lg mb-8 leading-relaxed font-montserrat max-w-3xl mx-auto">
            Our free version uses open-source tools like LibreTranslate for client-side or self-hosted translation, keeping everything private and customizable.
          </p>
          <div className="flex justify-center mb-16">
            <a href="https://github.com/aceman23/OpenTranslateAI_OpenSourceWebsiteTranslator_US" target="_blank" rel="noopener noreferrer" className="text-gray-600 px-6 py-4 rounded-full text-base hover:text-gray-900 transition-all duration-300 font-montserrat font-medium flex items-center gap-2 group/link">
              <Github className="w-4 h-4 text-gray-400 group-hover/link:text-gray-900 transition-colors" />
              Contribute on GitHub
            </a>
          </div>
          <div className="bg-white rounded-[2rem] p-12 md:p-16 shadow-lg border border-gray-200">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-3 font-montserrat">
                  <Check className="w-5 h-5 text-green-600" />
                  Pros
                </h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Completely Free</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      No subscription or hidden fees.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Maximum Privacy</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Runs client-side or on your own server; no data sent to third-party providers.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Full Customization</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Open-source code lets you fork, modify, and integrate as needed.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Community-Driven</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Benefit from GitHub contributions and ongoing improvements.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-10 flex items-center gap-3 font-montserrat">
                  <Info className="w-5 h-5 text-gray-600" />
                  Cons
                </h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Translation Quality</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Good for general use (80-90% accuracy in many languages), but may struggle with nuances, idioms, or specialized terms.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Setup Required</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Needs basic configuration (e.g., self-hosting LibreTranslate instance for best performance).
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Performance Limits</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      Can be slower on low-resource setups; public instances may have rate limits.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-2 font-montserrat text-base">Fewer Advanced Features</p>
                    <p className="text-gray-600 text-sm leading-relaxed font-montserrat">
                      No built-in model switching or premium AI enhancements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A2626] rounded-2xl p-8 md:p-10 mt-6">
              <p className="text-white text-center text-base md:text-lg leading-relaxed font-montserrat">
                Ideal for privacy-focused users, developers, or small projects testing website translation. For higher accuracy, seamless multi-model AI (e.g., DeepSeek, Qwen, Grok), and zero-setup convenience, <a href="#pro" className="underline font-semibold hover:text-orange-400 transition-colors">upgrade to our Pro version (coming soon)!</a>
              </p>
            </div>
          </div>
        </div>

        {/* Features (Free Version) */}
        <div id="features" className="py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-montserrat font-bold text-green-600 mb-6">
              <Github className="w-3.5 h-3.5" />
              OPEN SOURCE VERSION
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 tracking-tight text-gray-900 font-montserrat font-semibold">
              Open Source Features
            </h2>
            <p className="text-gray-600 text-lg font-montserrat font-medium">
              Powerful translation capabilities, completely free and open source
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group flex flex-col h-full">
              <div className="h-36 w-full bg-[#FFE4D6] rounded-2xl flex items-center justify-center mb-6 text-orange-500 transition-transform group-hover:scale-[1.02] duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 tracking-tight">Multilingual support</h3>
              <p className="text-sm text-gray-500 font-montserrat font-medium leading-relaxed">
                Supports translation between dozens of major world languages. Seamlessly integrates with your existing content structure.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group flex flex-col h-full">
              <div className="h-36 w-full bg-[#E0E7FF] rounded-2xl flex items-center justify-center mb-6 text-indigo-500 transition-transform group-hover:scale-[1.02] duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 tracking-tight">Privacy protection</h3>
              <p className="text-sm text-gray-500 font-montserrat font-medium leading-relaxed">
                We do not collect data and fully respect user privacy. All translations happen locally or via your own private instance.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group flex flex-col h-full">
              <div className="h-36 w-full bg-[#FFE4D6] rounded-2xl flex items-center justify-center mb-6 text-orange-500 transition-transform group-hover:scale-[1.02] duration-500">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 tracking-tight">Real-time translation</h3>
              <p className="text-sm text-gray-500 font-montserrat font-medium leading-relaxed">
                Instant translation, seamless user experience. Optimized for minimal layout shift and maximum speed.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group flex flex-col h-full">
              <div className="h-36 w-full bg-[#E0E7FF] rounded-2xl flex items-center justify-center mb-6 text-indigo-500 transition-transform group-hover:scale-[1.02] duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>
              </div>
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 tracking-tight">Smart caching</h3>
              <p className="text-sm text-gray-500 font-montserrat font-medium leading-relaxed">
                After caching, you can switch between languages instantly without additional API calls.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <AnimatedButton text="View on GitHub" href="https://github.com/aceman23/OpenTranslateAI_OpenSourceWebsiteTranslator_US" />
          </div>
        </div>

        {/* Pro Section */}
        <div id="pro" className="py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-montserrat font-bold text-rose-600">
              <Crown className="w-3.5 h-3.5" />
              PRO VERSION (COMING SOON)
            </div>
          </div>
          <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl text-white mb-6 tracking-tight font-medium">
                  Multi-AI Model<br /><span className="text-gray-300 italic">Powered Translation.</span>
                </h2>
                <p className="text-lg text-gray-300 mb-10 leading-relaxed font-montserrat">
                  Unlock advanced translation with <span className="text-white font-semibold">multi-model AI switching</span> for superior accuracy. Ideal for complex languages like Chinese-to-English in EdTech.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-gray-800 p-3 rounded-xl h-fit">
                      <Circle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-lg font-semibold font-montserrat">Model Switching</h4>
                      <p className="text-gray-400 text-sm mt-1 font-montserrat">
                        Choose top engines on-the-fly: Grok, Gemini, GPT-4o, Claude, or Chinese-optimized models like DeepSeek & Qwen.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gray-800 p-3 rounded-xl h-fit">
                      <Circle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-lg font-semibold font-montserrat">Hosted Proxy (No Setup)</h4>
                      <p className="text-gray-400 text-sm mt-1 font-montserrat">
                        Add your site once. We handle the API keys securely. No exposure on the client-side.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gray-800 p-3 rounded-xl h-fit">
                      <Zap className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-lg font-semibold font-montserrat">Unlimited Usage</h4>
                      <p className="text-gray-400 text-sm mt-1 font-montserrat">
                        No rate limits. Blazing fast inference via Groq infrastructure.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-3xl p-8 font-mono text-sm text-gray-300">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-gray-400 mb-2">// config.js</p>
                <p><span className="text-purple-400">const</span> translator = <span className="text-blue-400">new</span> OpenTranslate({'{'}</p>
                <p className="pl-4">apiKey: <span className="text-green-400">"hidden_proxy_token"</span>,</p>
                <p className="pl-4">models: [</p>
                <p className="pl-8 text-orange-300">"deepseek-r1",</p>
                <p className="pl-8 text-orange-300">"gpt-4o",</p>
                <p className="pl-8 text-orange-300">"claude-3.5-sonnet"</p>
                <p className="pl-4">],</p>
                <p className="pl-4">glossary: {'{'}</p>
                <p className="pl-8"><span className="text-orange-300">"EdTech"</span>: <span className="text-green-400">"教育科技"</span></p>
                <p className="pl-4">{'}'}</p>
                <p>{'});'}</p>

                <div className="mt-8 pt-8 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span>Translation Accuracy</span>
                    <span className="text-green-400">98%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div className="bg-green-500 h-2 rounded-full w-[98%]"></div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Pro Version: Pros & Cons Section */}
        <div className="py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-montserrat font-bold text-rose-600">
              <Crown className="w-3.5 h-3.5" />
              PRO VERSION (COMING SOON)
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-10 md:p-14 shadow-xl border border-gray-700">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl mb-6 tracking-tight text-white font-montserrat font-semibold">
                Pro Version: Pros & Cons
              </h2>
              <p className="text-gray-300 text-center text-base md:text-lg leading-relaxed font-montserrat max-w-3xl mx-auto">
                Our Pro version upgrades your translation experience with cutting-edge multi-AI model support (Grok, Gemini, GPT-4o, Claude, DeepSeek, Qwen, Kimi, MiniMax, and more) via a secure hosted backend—no API keys or self-hosting required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-10">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3 font-montserrat">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  Pros
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Superior Translation Quality</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      90–98% accuracy with context-aware AI models that excel at nuances, idioms, and specialized terms (perfect for edtech, legal, or technical content).
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Seamless Model Switching</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Choose the best AI engine for each task (e.g., DeepSeek/Qwen for Chinese ⇄ English excellence).
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Zero Setup & Unlimited Usage</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Hosted proxy handles everything: no rate limits or instance management.
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Extra Features</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Real-time full-page translation, custom glossaries, analytics, and priority support.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3 font-montserrat">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Circle className="w-5 h-5 text-red-400" />
                  </div>
                  Cons
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Subscription Cost</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Paid plans start at $9/month (with annual discounts).
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Internet Required</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Relies on cloud APIs for advanced models (unlike fully offline free version).
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-2 font-montserrat text-base">Less Customization of Core Code</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-montserrat">
                      Advanced features are managed server-side for security and reliability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed font-montserrat">
              Perfect for businesses, edtech platforms, and anyone needing professional-grade, hassle-free multilingual websites. Ready to go global effortlessly? Upgrade to Pro (coming soon)! 🚀
            </p>
          </div>
        </div>

        {/* Models Marquee */}
        <div className="w-full py-12 mt-8 overflow-hidden marquee-mask relative group bg-transparent z-10">
          <div className="flex w-[200%] animate-infinite-scroll hover:[animation-play-state:paused]">
            <div className="flex items-center justify-between w-1/2 gap-8 md:gap-16 px-8 md:px-12">
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <OllamaIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Ollama</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <OpenAIIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">GPT-4o</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <ClaudeIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Claude 3.5</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <GrokIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Grok</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <QwenIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Qwen</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-1/2 gap-8 md:gap-16 px-8 md:px-12">
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <OllamaIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Ollama</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <OpenAIIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">GPT-4o</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <ClaudeIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Claude 3.5</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <GrokIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Grok</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-3 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <QwenIcon size={20} className="md:w-8 md:h-8" />
                <span className="text-xs md:text-lg font-montserrat font-semibold text-gray-700 whitespace-nowrap">Qwen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-AI Model Powered Features */}
        <div className="py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-montserrat font-bold text-rose-600 mb-6">
              <Crown className="w-3.5 h-3.5" />
              PRO VERSION (COMING SOON)
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 tracking-tight text-gray-900 font-montserrat font-semibold">
              Multi-AI Model Powered Features
            </h2>
            <p className="text-gray-600 text-lg font-montserrat max-w-3xl mx-auto">
              Unlock professional-grade translation with access to 100+ AI models through OpenRouter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Model Switching Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="text-xl mb-4 text-white font-montserrat font-semibold">Model Switching</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-montserrat mb-6">
                Choose from top AI engines on-the-fly
              </p>

              <div className="space-y-3 mb-4">
                <div className="text-xs font-montserrat font-bold text-gray-500 uppercase tracking-wider">CLOUD MODELS</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Grok</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Gemini</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">GPT-4o</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Claude</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-montserrat font-bold text-gray-500 uppercase tracking-wider">OPEN SOURCE</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">DeepSeek</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Qwen</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Kimi</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-montserrat">Llama</span>
                </div>
              </div>
            </div>

            {/* Higher Quality Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-8 border border-green-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-lg">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl mb-4 text-white font-montserrat font-semibold">Higher Quality</h3>
              <p className="text-white/90 text-sm leading-relaxed font-montserrat mb-6">
                90-98% accuracy with context-aware translation
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Context-aware translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Neural network powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Beats basic LibreTranslate</span>
                </div>
              </div>

              <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-xs font-montserrat font-semibold">Accuracy</span>
                  <span className="text-white text-lg font-montserrat font-bold">90-98%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>

            {/* No Setup Hassle Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-[2rem] p-8 border border-blue-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-lg">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl mb-4 text-white font-montserrat font-semibold">No Setup Hassle</h3>
              <p className="text-white/90 text-sm leading-relaxed font-montserrat mb-6">
                Hosted backend proxy - add your site once
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-montserrat">No API keys exposed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-montserrat">Secure backend proxy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-montserrat">One-time setup</span>
                </div>
              </div>

              <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-white text-2xl font-montserrat font-bold mb-1">Plug & Play</div>
                <div className="text-white/80 text-xs font-montserrat">Just add one line of code</div>
              </div>
            </div>

            {/* Extra Features Card */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-[2rem] p-8 border border-purple-400/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-lg">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-xl mb-4 text-white font-montserrat font-semibold">Extra Features</h3>
              <p className="text-white/90 text-sm leading-relaxed font-montserrat mb-6">
                Unlimited usage with premium capabilities
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-white text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Real-time translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-white text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Custom glossaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-white text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Analytics & SEO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-white text-white" />
                  <span className="text-white/90 text-sm font-montserrat">Priority support</span>
                </div>
              </div>

              <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="text-white text-sm font-montserrat font-semibold mb-1">No Limits</div>
                <div className="text-white/80 text-xs font-montserrat">Zero rate limiting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Perfect for Every Industry */}
        <div className="py-24">
          <h2 className="text-4xl md:text-5xl text-center mb-6 tracking-tight text-gray-900 font-montserrat font-semibold">
            Perfect for Every Industry
          </h2>
          <p className="text-center text-gray-500 text-lg mb-16 max-w-3xl mx-auto font-montserrat">
            From e-commerce to education, healthcare to hospitality—our translation solution adapts to your unique needs
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">E-commerce</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Sell globally with localized product pages and checkout experiences
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Education</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Make learning accessible to students in any language, anywhere
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path><path d="m18 15-2-2"></path><path d="m15 18-2-2"></path></svg>
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Healthcare</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Deliver critical health information in patients' native languages
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Finance</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Provide secure, multilingual banking and investment platforms
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Real Estate</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Showcase properties to international buyers effortlessly
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect width="10" height="8" x="7" y="8" rx="1"></rect></svg>
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Tech & SaaS</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Scale your software globally with localized interfaces
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Travel</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Welcome travelers with booking sites in their language
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group">
              <div className="mb-6 w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900 font-montserrat font-semibold">Legal</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-montserrat">
                Translate legal documents and client portals accurately
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="py-24">
          <h2 className="text-4xl md:text-5xl text-center mb-16 tracking-tight text-gray-900 font-montserrat font-semibold">
            Transparent Pricing
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-gray-500 text-sm font-montserrat">
                  <th className="py-2 px-6 font-medium">Feature</th>
                  <th className="py-2 px-6 font-medium">Free (Open-Source)</th>
                  <th className="py-2 px-6 font-medium text-rose-600">Pro ($9/mo)</th>
                  <th className="py-2 px-6 font-medium">Enterprise ($49+)</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base font-montserrat font-medium">
                <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <td className="py-6 px-6 rounded-l-2xl text-gray-900">Basic Translation</td>
                  <td className="py-6 px-6 text-gray-600">✓ (LibreTranslate)</td>
                  <td className="py-6 px-6 text-gray-900 bg-rose-50/30 group-hover:bg-rose-50 transition-colors">✓</td>
                  <td className="py-6 px-6 rounded-r-2xl text-gray-900">✓</td>
                </tr>
                <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <td className="py-6 px-6 rounded-l-2xl text-gray-900">Multi-Model Switching</td>
                  <td className="py-6 px-6 text-gray-400">✗</td>
                  <td className="py-6 px-6 text-rose-600 font-semibold bg-rose-50/30 group-hover:bg-rose-50 transition-colors">✓ (DeepSeek, Grok...)</td>
                  <td className="py-6 px-6 rounded-r-2xl text-gray-900">✓</td>
                </tr>
                <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <td className="py-6 px-6 rounded-l-2xl text-gray-900">Hosted Proxy</td>
                  <td className="py-6 px-6 text-gray-400">✗</td>
                  <td className="py-6 px-6 text-gray-900 bg-rose-50/30 group-hover:bg-rose-50 transition-colors">✓</td>
                  <td className="py-6 px-6 rounded-r-2xl text-gray-900">✓</td>
                </tr>
                <tr className="bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <td className="py-6 px-6 rounded-l-2xl text-gray-900">Custom Glossaries</td>
                  <td className="py-6 px-6 text-gray-400">✗</td>
                  <td className="py-6 px-6 text-gray-400 bg-rose-50/30 group-hover:bg-rose-50 transition-colors">✗</td>
                  <td className="py-6 px-6 rounded-r-2xl text-gray-900">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center mt-6 text-gray-400 text-sm font-montserrat">Annual plans include a 20% discount. Free trial available.</p>
        </div>

        {/* FAQ */}
        <div className="py-24">
          <h2 className="text-4xl md:text-5xl text-center mb-16 tracking-tight text-gray-900 font-montserrat font-semibold">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm max-w-4xl mx-auto">
            <div className="border-b border-gray-100 pb-8 mb-8">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full flex justify-between items-start gap-4 text-left cursor-pointer group"
              >
                <h3 className="text-lg font-montserrat font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                  How does open-source translation protect my privacy?
                </h3>
                <div className={`mt-1 text-gray-400 transition-transform duration-300 ${openFaqIndex === 0 ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3 20h18L12 4z"></path>
                  </svg>
                </div>
              </button>
              {openFaqIndex === 0 && (
                <p className="mt-3 text-gray-500 text-sm leading-relaxed font-montserrat font-medium animate-fade-up">
                  Unlike commercial APIs, our open-source solution runs entirely on your infrastructure. No data is sent to third parties, giving you complete control over sensitive information.
                </p>
              )}
            </div>

            <div className="border-b border-gray-100 pb-8 mb-8">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full flex justify-between items-start gap-4 text-left cursor-pointer group"
              >
                <h3 className="text-lg font-montserrat font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                  What languages are supported?
                </h3>
                <div className={`mt-1 text-gray-400 transition-transform duration-300 ${openFaqIndex === 1 ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3 20h18L12 4z"></path>
                  </svg>
                </div>
              </button>
              {openFaqIndex === 1 && (
                <p className="mt-3 text-gray-500 text-sm leading-relaxed font-montserrat font-medium animate-fade-up">
                  LibreTranslate supports over 30 languages including English, Spanish, French, German, Chinese, Japanese, and many more. The list is continuously expanding with community contributions.
                </p>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleFaq(2)}
                className="w-full flex justify-between items-start gap-4 text-left cursor-pointer group"
              >
                <h3 className="text-lg font-montserrat font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                  How do I integrate this into my website?
                </h3>
                <div className={`mt-1 text-gray-400 transition-transform duration-300 ${openFaqIndex === 2 ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3 20h18L12 4z"></path>
                  </svg>
                </div>
              </button>
              {openFaqIndex === 2 && (
                <p className="mt-3 text-gray-500 text-sm leading-relaxed font-montserrat font-medium animate-fade-up">
                  Integration is simple with our JavaScript widget. Just include our script and add a few lines of code. Detailed documentation and examples are provided to get you started quickly.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Roadmap & Technical */}
        <div className="grid md:grid-cols-2 gap-12 border-t border-gray-200 pt-20">
          <div>
            <h3 className="text-3xl mb-8 tracking-tight text-gray-900 font-montserrat font-semibold">
              Roadmap
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center"></div>
                <div>
                  <p className="text-gray-900 font-medium font-montserrat">Pro Beta Launch</p>
                  <p className="text-gray-500 text-sm">Q1 2026</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center"></div>
                <div>
                  <p className="text-gray-900 font-medium font-montserrat">Integrations</p>
                  <p className="text-gray-500 text-sm">WordPress Plugin, Webflow App</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center"></div>
                <div>
                  <p className="text-gray-900 font-medium font-montserrat">Community Models</p>
                  <p className="text-gray-500 text-sm">Support for local LLMs via Ollama</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-2xl mb-6 tracking-tight text-gray-900 font-montserrat font-semibold">
              How Pro Works
            </h3>
            <p className="text-gray-600 leading-relaxed font-montserrat font-medium mb-6">
              The Pro version uses a lightweight backend (Node.js on Serverless) that routes translation requests to OpenRouter and Groq APIs.
            </p>
            <p className="text-gray-600 leading-relaxed font-montserrat font-medium">
              You receive a customized widget script with a securely embedded API token, so your keys are never exposed in the browser.
            </p>
          </div>
        </div>

        {/* CTA Callout Card */}
        <div className="py-24">
          <div className="bg-[#121D1D] rounded-[2rem] p-12 md:p-20 text-center shadow-2xl mx-auto relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl text-white mb-6 font-montserrat font-semibold tracking-tight">
              Translate Websites. Build Your Future
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-2xl mx-auto font-montserrat font-medium">
              Join hundreds of developers already using this solution to reach global audiences
            </p>
            <AnimatedButton text="Start For Free" href="#" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#121D1D] w-full py-16 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="mb-10 space-y-3">
            <p className="text-white text-sm md:text-base font-montserrat font-medium">
              Built with <span className="text-orange-500">LibreTranslate</span> | <span className="text-orange-500">Fully Open Source</span> | <span className="text-orange-500">MIT License</span>
            </p>
            <p className="text-gray-400 text-sm font-montserrat font-medium">
              Supports self-hosting or public instances | Protects your data privacy
            </p>
          </div>
          <div className="h-px w-full bg-white/10 mb-10 max-w-4xl"></div>
          <p className="text-gray-400 text-sm mb-4 font-montserrat text-center">Follow us for latest updates & support on:</p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <a href="https://x.com/OpenTranslateAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/opentranslateai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="/privacy-policy" className="text-gray-400 hover:text-orange-500 text-sm font-montserrat font-medium transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-orange-500 text-sm font-montserrat font-medium transition-colors">
              Terms of Service
            </a>
            <a href="/cookie-policy" className="text-gray-400 hover:text-orange-500 text-sm font-montserrat font-medium transition-colors">
              Cookie Policy
            </a>
            <a href="/translation-widget-logo.svg" download="translation-widget-logo.svg" className="text-gray-400 hover:text-orange-500 text-sm font-montserrat font-medium transition-colors flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Download Logo
            </a>
          </div>
          <p className="text-gray-500 text-sm font-montserrat font-medium">
            Created and Developed by <span className="text-orange-500 font-semibold">Hybrid Ads.ai</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
