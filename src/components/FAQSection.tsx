"use client";
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData: FAQItem[] = [
    {
      question: "What is Dao Staking?",
      answer:
        "Dao Staking ) is a program that rewards participants with OCICAT tokens for actively staking and participating in the ecosystem. It also allows users to accrue more voting power for Dao voting.",
    },
    {
      question: " How do I claim my  rewards?",
      answer:
        "To claim your rewards, connect your wallet to the platform and navigate to the rewards section. Follow the prompt to claim your tokens or restake.",
    },
    {
      question: "What benefit is included in my stake?",
      answer:
        "You receive reward from daily emissions and reward for DAO participation. The more points the more advantage. Your points qualifies you for future airdrop from partner projects and the ecosystem",
    },
    {
      question: "Can I stake multiple tokens?",
      answer:
        "Yes, you can stake multiple tokens. However, the rewards are calculated based on the total amount of OCICAT staked and your voting power collected.",
    },
    {
      question: "What happens if I unstake my tokens?",
      answer:
        "If you unstake your tokens, you will stop earning rewards and loose your points collected. Your voting power will also decrease, and you may lose eligibility for future rewards.",
    },
    {
      question: "Is there penalty for unstaking?",
      answer:
        "No. Unstaking has cool-down period of 21 days. After the period you can now withdraw without penalty. Note that all your points are lost.",
    },
  ];

  return (
    <section className="py-16 bg-black px-4 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          FAQs
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-[#0c0c0c] border border-gray-800 rounded-lg hover:border-red-600 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <p className="text-lg font-semibold text-white">
                  {faq.question}
                </p>
                <span className="text-red-600">
                  {activeIndex === index ? (
                    <FaMinus className="w-6 h-6" />
                  ) : (
                    <FaPlus className="w-6 h-6" />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-white/70">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
