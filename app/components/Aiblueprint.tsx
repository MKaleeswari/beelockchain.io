// src/App.tsx
'use client'
import React, { useState, useRef } from 'react';
// import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import BlueprintDiagram from "./BlueprintDiagram";
import jsPDF from "jspdf";
import { ChevronDown, Download, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { MacBookFrame } from "./MacBookFrame";
import { Answer, Blueprint, QuizQuestion, ServiceQuestions, Step, BlueprintInput } from './types';


async function fetchBlueprint(service: string, answers: Answer): Promise<Blueprint> {
  const res = await fetch("/api/blueprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service, answers }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to generate blueprint");
  }

  return res.json();
} 

const BlueprintGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedService, setSelectedService] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [generatingProgress, setGeneratingProgress] = useState<number>(0);
  
  const diagramRef = useRef<HTMLDivElement>(null);

  const services: string[] = [
    'Blockchain App',
    'Crypto Token',
    'Smart Contract',
    'AI Integrated 2d/3d Game development',
    'Crypto Exchange',
    'NFT Marketplace',
    'Custom AI system',
    'Or a Hybrid solution'
  ];
  
  const serviceQuestions: ServiceQuestions = {
    'Blockchain App': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'Crypto Token': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'Smart Contract': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'AI Integrated 2d/3d Game development': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'Crypto Exchange': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'NFT Marketplace': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'Custom AI system': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ],
    'Or a Hybrid solution': [
      {
        id: 'blockchain_type',
        question: 'What type of Blockchain Solution do you want to build?',
        type: 'single',
        options: ['Crypto Exchange (CEX)', 'Decentralized Exchange (DEX)', 'NFT Marketplace', 'Crypto Wallet (Hot / Cold)', 'Token / Coin Creation', 'Prediction Market Solution', 'Gaming Development', 'DeFi Platform (Staking, Lending, Farming)','Web3 Solution','Enterprise Blockchain Solution','Not sure']
      },
      {
        id: 'use_case',
        question: 'What stage is your blockchain idea in?',
        type: 'single',
        options: ['Just an idea', 'Concept / Wireframe ready', 'MVP already built', 'Live product needing upgrades', 'Enterprise requirement analysis']
      },
      {
        id: 'network',
        question: 'Which blockchain network do you prefer?',
        type: 'single',
        options: ['Ethereum', 'BNB Chain', 'Polygon', 'Solana', 'Avalanche', 'Multi-chain', 'Not sure']
      },
      {
        id: 'features',
        question: 'What core features do you need?',
        type: 'multiple',
        options: ['Smart Contracts', 'Token Standards (ERC-20 / ERC-721 / ERC-1155)', 'Wallet Integration', 'On-chain Transactions', 'Admin Dashboard', 'KYC / AML', 'Liquidity & Swaps', 'Staking / Rewards', 'API Integrations']
      },
      {
        id: 'Ai',
        question: 'Do you want AI integrated into the blockchain solution?',
        type: 'single',
        options: ['No AI required', 'AI Chat / Support Assistant', 'AI Fraud Detection', 'AI Trading / Recommendation Engine', 'AI Analytics & Insights', 'AI Automation (Smart workflows)']
      },
      {
        id: 'timeline',
        question: 'Desired launch timeline?',
        type: 'single',
        options: ['2–4 weeks (Rapid MVP)', '1–3 months', '3–6 months', '6+ months', 'Planning phase only']
      }
    ]
  };

  const QUIZ_IDS: string[] = ["blockchain_type", "use_case", "network", "features", "Ai", "timeline"];

  function answersToInputs(answers: Answer): BlueprintInput[] {
    return QUIZ_IDS.map((id) => {
      const v = answers?.[id];

      if (v == null) return { id, value: "-" };

      const value = Array.isArray(v) ? v.join(", ") : String(v);

      return { id, value };
    });
  }

  const currentQuestions = serviceQuestions[selectedService] || [];
  const currentQuestionData = currentQuestions[currentQuestion];

  const handleServiceSelect = (service: string): void => {
    setSelectedService(service);
    setShowDropdown(false);
    setCurrentStep('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: string, isMultiple: boolean = false): void => {
    if (isMultiple) {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(answer)
        ? current.filter(a => a !== answer)
        : [...current, answer];
      setAnswers({ ...answers, [questionId]: updated });
    } else {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };

  const handleNext = (): void => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateBlueprint();
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generateBlueprint = async (): Promise<void> => {
    setCurrentStep("generating");
    setGeneratingProgress(10);
  
    try {
      const interval = setInterval(() => {
        setGeneratingProgress((p) => (p < 90 ? p + 2 : p));
      }, 120);
  
      const generated = await fetchBlueprint(selectedService, answers);
      clearInterval(interval);
      setGeneratingProgress(100);
  
      setBlueprint(generated);
      setTimeout(() => setCurrentStep("complete"), 300);
    } catch (e) {
      console.error(e);
      alert("Blueprint generation failed. Check server logs.");
      setCurrentStep("quiz");
      setGeneratingProgress(0);
    }
  };
  
  // const downloadPDF = async (): Promise<void> => {
  //   if (!diagramRef.current) return;
    
  //   try {
  //     const downloadBtn = document.querySelector('[data-download-btn]') as HTMLButtonElement | null;
  //     if (downloadBtn) {
  //       downloadBtn.disabled = true;
  //       downloadBtn.innerHTML = 'Generating PDF...';
  //     }
      
  //     const canvas = await html2canvas(diagramRef.current, {
  //       scale: 2,
  //       backgroundColor: "#ffffff",
  //       useCORS: true,
  //       logging: false,
  //       width: diagramRef.current.scrollWidth,
  //       height: diagramRef.current.scrollHeight
  //     });
      
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'mm',
  //       format: 'a4'
  //     });
      
  //     const imgWidth = 210;
  //     const pageHeight = 297;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;
  //     let position = 0;
      
  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
      
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }
      
  //     pdf.save(`${(selectedService || "Blueprint").replace(/\s+/g, "_")}_Blueprint.pdf`);
      
  //     if (downloadBtn) {
  //       downloadBtn.disabled = false;
  //       downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Download Blueprint';
  //     }
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     alert('Failed to generate PDF. Please try again.');
      
  //     const downloadBtn = document.querySelector('[data-download-btn]') as HTMLButtonElement | null;
  //     if (downloadBtn) {
  //       downloadBtn.disabled = false;
  //       downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> Download Blueprint';
  //     }
  //   }
  // };
const downloadPDF = async (): Promise<void> => {
  if (!diagramRef.current) return;

  const downloadBtn = document.querySelector(
    "[data-download-btn]"
  ) as HTMLButtonElement | null;

  try {
    if (downloadBtn) {
      downloadBtn.disabled = true;
      downloadBtn.innerText = "Generating PDF...";
    }

    const node = diagramRef.current;

    // 🔒 wait for images inside the diagram
    const images = node.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            img.onload = img.onerror = () => resolve(true);
          })
      )
    );

    // 🎯 generate image
    const dataUrl = await toPng(node, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      cacheBust: true,
    });

    // 📄 create PDF
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const img = new Image();
    img.src = dataUrl;

    await new Promise((res) => (img.onload = res));

    const imgHeight = (img.height * pageWidth) / img.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(
      `${(selectedService || "Blueprint").replace(/\s+/g, "_")}_Blueprint.pdf`
    );
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download Blueprint
      `;
    }
  }
};

  const resetGenerator = (): void => {
    setCurrentStep('select');
    setSelectedService('');
    setCurrentQuestion(0);
    setAnswers({});
    setGeneratingProgress(0);
    setBlueprint(null);
  };

  return (
    <div className='mt-5'> 
    <h2 className="
          text-center text-transparent bg-clip-text
          bg-[linear-gradient(90deg,#00A993_0%,#57ADCD_54%,#FFFFFF_60%)]
          text-3xl sm:text-4xl lg:text-5xl md:text-6xl
          font-semibold mb-5 sm:mb-14 md:mb-14 lg:mb-16
        ">
          EVO AI Blueprint Generator
        </h2>
    <MacBookFrame>
      <div className="relative z-10 mx-auto flex h-[450px] sm:h-[550px] md:h-[700px] lg:h-[700px] w-full flex-col items-center justify-start px-3 sm:px-4 py-6 sm:py-8 lg:py-10 overflow-hidden">
        {/* Content */}

        <div className="w-full max-w-7xl h-full flex flex-col">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-[24px] border border-white/12 bg-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl overflow-hidden h-full flex flex-col">
            {/* Inner top bar - Responsive */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#1d222e] px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 flex-shrink-0">
              <div className="text-xs sm:text-sm text-white/35"> </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                {currentStep === "generating" ? (
                  <span className="text-white/50 truncate max-w-[120px] sm:max-w-none">
                    Generating...
                  </span>
                ) : currentStep === "quiz" ? (
                  <span className="text-white/50 truncate max-w-[120px] sm:max-w-none">
                    Q {currentQuestion + 1}/{currentQuestions.length}
                  </span>
                ) : (
                  <div className="relative bg-[#1d222e]">
                  <img
                    src="/assets/images/image-blue.gif"
                    alt="Ready"
                    className="mix-blend-screen object-contain h-12 w-12 md:h-20 md:w-20"
                  />
                </div>


                )}
                <span className="text-white/25 hidden sm:inline">•</span>
                <span className="text-white/80 truncate max-w-[100px] sm:max-w-[200px] lg:max-w-none">
                  {selectedService || "Blockchain App"}
                </span>
              </div>
            </div>
  
            {/* Inner content - Responsive padding with SCROLL */}
            <div className="px-3 sm:px-6 md:px-10 lg:px-10 xl:px-20 py-6 sm:py-8 lg:py-1 flex-1 overflow-y-auto overflow-x-hidden">
              {/* SERVICE SELECTION */}
              {currentStep === "select" && (
                <div className="flex flex-col justify-start min-h-full mt-10 space-y-10">
                  <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white mb-4 sm:mb-6 lg:mb-8 px-2">
                    Select with <span className="text-cyan-300">Seamless</span>{" "}
                    Power <span className="inline-block ml-0">
                      <img src='/assets/images/sparkle.svg' alt="sparkle"
                       className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 inline" />
                    </span>
                  </h2>
  
                  {/* Dropdown pill - Responsive - REDUCED SIZE */}
                  <div className="mt-2 sm:mt-3 lg:mt-4 flex justify-center">
                    <div className="relative w-full max-w-xl">
                      <button
                        onClick={() => setShowDropdown((s) => !s)}
                        className="group w-full rounded-full border border-white/15 bg-gradient-to-r from-white/10 to-white/5 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 shadow-[0_12px_40px_-18px_rgba(0,255,255,0.35)] backdrop-blur-md transition hover:border-white/25"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-xs sm:text-sm lg:text-base truncate" style={{ color: '#1BFFE1' }}>
                            {selectedService || "Blockchain App"}
                          </span>
                          <span className="flex items-center justify-center rounded-full bg-[#0b1222]/80 px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] flex-shrink-0">
                            <ChevronDown
                              className={`h-3 w-3 sm:h-4 sm:w-4 text-white/80 transition ${
                                showDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </div>
                      </button>
  
                      {showDropdown && (
                        <div className=" absolute left-0 right-0 mt-2 overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-[#0b1222]/90 shadow-2xl backdrop-blur-xl z-10 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                          {services.map((item: string) => (
                            <button
                              key={item}
                              onClick={() => handleServiceSelect(item)}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-white/85 hover:bg-white/10 border-b border-white/5 last:border-b-0 text-xs sm:text-sm"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
  
                  <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center">
                    <img 
                      src='/assets/images/generate.gif'
                      alt="Animation" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              )}
  
              {/* QUIZ SCREEN - Responsive - REDUCED SIZES */}
              {currentStep === "quiz" && currentQuestionData && (
                <div className="flex flex-col">
                  <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                    <div className="inline-block px-3 sm:px-4 lg:px-5 py-1 sm:py-1.5 lg:py-2 bg-cyan-400/10 text-cyan-300 rounded-full text-xs mb-3 sm:mb-4 lg:mb-6 border border-cyan-400/20 font-medium">
                      Question {currentQuestion + 1} of {currentQuestions.length}
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-4">
                      {currentQuestionData.question}
                    </h2>
                    <div className="w-full max-w-2xl mx-auto bg-white/10 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-teal-300 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* GRID LAYOUT - 2 columns on mobile, 3 on larger screens */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-4xl mx-auto mt-4 sm:mt-6 lg:mt-8">
                    {currentQuestionData.options.map((option: string) => {
                      const isSelected =
                        currentQuestionData.type === "multiple"
                          ? ((answers[currentQuestionData.id] as string[]) || []).includes(option)
                          : answers[currentQuestionData.id] === option;

                      return (
                        <button
                          key={option}
                          onClick={() =>
                            handleAnswer(
                              currentQuestionData.id,
                              option,
                              currentQuestionData.type === "multiple"
                            )
                          }
                          className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-3.5 rounded-lg sm:rounded-xl text-left transition-all border backdrop-blur-md text-xs sm:text-sm ${
                            isSelected
                              ? "bg-cyan-400/20 border-cyan-400/50 text-white shadow-[0_0_30px_-10px_rgba(34,211,238,0.5)]"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium leading-tight">{option}</span>
                            {isSelected && (
                              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-400 flex-shrink-0">
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-black" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-6 sm:pt-8 lg:pt-10 pb-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center gap-2 transition-all border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        !answers[currentQuestionData.id] ||
                        (currentQuestionData.type === "multiple" &&
                          (answers[currentQuestionData.id] as string[])?.length === 0)
                      }
                      className="px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-500 hover:to-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-full flex items-center justify-center gap-2 transition-all font-semibold shadow-[0_0_30px_-10px_rgba(34,211,238,0.6)] text-xs sm:text-sm"
                    >
                      {currentQuestion === currentQuestions.length - 1 ? "Generate Blueprint" : "Next"}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              )}
  
              {/* GENERATING SCREEN - Responsive */}
              {currentStep === "generating" && (
  <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10 flex flex-col justify-center min-h-full">
    <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 items-center justify-center">
      <img 
        src='/assets/images/generate.gif'
        alt="Generating" 
        className="w-full h-full object-contain"
      />
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white px-4">
      Generating magic...
    </h2>
    <div className="max-w-xl mx-auto space-y-3 sm:space-y-4 px-4">
      <div className="w-full bg-white/10 rounded-full h-2.5 sm:h-3 lg:h-3.5">
        <div
          className="bg-gradient-to-r from-cyan-400 to-teal-300 h-2.5 sm:h-3 lg:h-3.5 rounded-full transition-all duration-300"
          style={{ width: `${generatingProgress}%` }}
        />
      </div>
      <p className="text-white/40 text-sm sm:text-base italic">
        Screen {Math.floor(generatingProgress / 17)}/6
      </p>
    </div>
  </div>
)}
  
              {/* COMPLETE SCREEN - Responsive */}
              {currentStep === "complete" && blueprint && (
                <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10 py-8 sm:py-12 lg:py-16">
                  {/* Blueprint Diagram */}
                  <div ref={diagramRef} className="w-full max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                    <BlueprintDiagram
                      title={`${selectedService} Blueprint`}
                      blueprint={{
                        ...blueprint,
                        inputs: answersToInputs(answers),
                      }}
                    />
                  </div>
                  
                  <div className="mx-auto flex h-20 w-20 sm:h-20 sm:w-20 lg:h-20 lg:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-400 to-emerald-300 shadow-lg">
                    <Check className="w-12 h-12 sm:w-12 sm:h-12 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <div className="px-4">
                    <h2 className="text-[20px]  md:text-[28px] lg:text-[30px] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
                      Blueprint Generated!
                    </h2>
                    <p className="text-white/50 text-base sm:text-lg">
                      Your comprehensive blueprint is ready for download
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center pt-4 sm:pt-6 lg:pt-8 px-4">
                    <button
                      onClick={resetGenerator}
                      className="px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 backdrop-blur-md font-medium text-sm sm:text-base"
                    >
                      Create Another
                    </button>
                    <button
                      onClick={downloadPDF}
                      data-download-btn
                      className="px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-500 hover:to-teal-400 text-black rounded-full flex items-center justify-center gap-2 transition-all font-semibold shadow-[0_0_30px_-10px_rgba(34,211,238,0.6)] text-sm sm:text-base"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download Blueprint
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MacBookFrame>
    </div>
  );
};

export default BlueprintGenerator;