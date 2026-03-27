"use client";

import { useState, useMemo } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import InputField from "@/components/calculators/InputField";
import { formatCurrency } from "@/lib/format";
import { IMAGES, BOOKING_URL } from "@/lib/constants";

function calcInsurance(
  annualIncome: number,
  yearsToReplace: number,
  mortgageBalance: number,
  otherDebts: number,
  childrenEducation: number,
  existingCoverage: number,
  savings: number
) {
  const incomeReplacement = annualIncome * yearsToReplace;
  const totalNeeds = incomeReplacement + mortgageBalance + otherDebts + childrenEducation;
  const totalResources = existingCoverage + savings;
  const gap = Math.max(0, totalNeeds - totalResources);

  return { incomeReplacement, totalNeeds, totalResources, gap };
}

function BreakdownBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex h-6 overflow-hidden mb-3">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${item.label}: ${formatCurrency(item.value)}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={`w-2.5 h-2.5 inline-block ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LifeInsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [yearsToReplace, setYearsToReplace] = useState(10);
  const [mortgageBalance, setMortgageBalance] = useState(250000);
  const [otherDebts, setOtherDebts] = useState(15000);
  const [childrenEducation, setChildrenEducation] = useState(100000);
  const [existingCoverage, setExistingCoverage] = useState(50000);
  const [savings, setSavings] = useState(30000);

  const result = useMemo(
    () => calcInsurance(annualIncome, yearsToReplace, mortgageBalance, otherDebts, childrenEducation, existingCoverage, savings),
    [annualIncome, yearsToReplace, mortgageBalance, otherDebts, childrenEducation, existingCoverage, savings]
  );

  const breakdownItems = [
    { label: "Income Replacement", value: result.incomeReplacement, color: "bg-accent" },
    { label: "Mortgage", value: mortgageBalance, color: "bg-accent/70" },
    { label: "Other Debts", value: otherDebts, color: "bg-accent/50" },
    { label: "Education Fund", value: childrenEducation, color: "bg-accent/30" },
  ];

  return (
    <>
      <PageHero
        title="Life Insurance Needs Calculator"
        tagline="Estimate how much coverage your family needs"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-20 px-6">
        <div className="container-site max-w-[1000px]">
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-2">What Your Family Needs</h2>
                <p className="text-xs text-text-muted mb-8">Financial obligations to cover if you were gone</p>
                <div className="space-y-5">
                  <InputField label="Annual Income" value={annualIncome} onChange={setAnnualIncome} prefix="$" min={0} step={5000} />
                  <InputField label="Years of Income to Replace" value={yearsToReplace} onChange={setYearsToReplace} suffix="years" min={1} max={30} hint="How many years should your family be supported?" />
                  <InputField label="Mortgage Balance" value={mortgageBalance} onChange={setMortgageBalance} prefix="$" min={0} step={10000} />
                  <InputField label="Other Debts" value={otherDebts} onChange={setOtherDebts} prefix="$" min={0} step={1000} hint="Car loans, student loans, credit cards" />
                  <InputField label="Children's Education Fund" value={childrenEducation} onChange={setChildrenEducation} prefix="$" min={0} step={10000} />
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-4">What You Already Have</h3>
                  <div className="space-y-5">
                    <InputField label="Existing Life Insurance" value={existingCoverage} onChange={setExistingCoverage} prefix="$" min={0} step={10000} />
                    <InputField label="Liquid Savings" value={savings} onChange={setSavings} prefix="$" min={0} step={5000} hint="Savings, investments, or other assets" />
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Coverage Recommendation</h2>

                <div className="text-center mb-8">
                  <p className="text-text-muted text-sm mb-2">Additional coverage needed</p>
                  <p className="text-4xl md:text-5xl font-extralight text-foreground">
                    {formatCurrency(result.gap)}
                  </p>
                </div>

                <div className="space-y-1 mb-6">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Income Replacement</span>
                    <span className="text-sm">{formatCurrency(result.incomeReplacement)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Mortgage</span>
                    <span className="text-sm">{formatCurrency(mortgageBalance)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Other Debts</span>
                    <span className="text-sm">{formatCurrency(otherDebts)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Education Fund</span>
                    <span className="text-sm">{formatCurrency(childrenEducation)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border font-medium">
                    <span className="text-sm">Total Needs</span>
                    <span className="text-sm">{formatCurrency(result.totalNeeds)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-success">
                    <span className="text-sm">Existing Resources</span>
                    <span className="text-sm">−{formatCurrency(result.totalResources)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-medium">
                    <span className="text-sm text-accent">Coverage Gap</span>
                    <span className="text-sm text-accent">{formatCurrency(result.gap)}</span>
                  </div>
                </div>

                <BreakdownBar items={breakdownItems} />

                <div className="mt-10 text-center">
                  <p className="text-sm text-text-secondary mb-4">
                    Let us help you find the right coverage
                  </p>
                  <Button href={BOOKING_URL} external>
                    Book a Free Consultation
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-12 bg-muted border border-border p-8 text-sm text-text-secondary leading-relaxed">
              <p className="font-medium text-foreground mb-2">Disclaimer</p>
              <p>
                This calculator provides a simplified estimate of life insurance needs. Actual
                coverage recommendations depend on your full financial situation, health history,
                and family circumstances. This tool does not account for Social Security survivor
                benefits, pension income, or future changes in expenses. For personalized guidance,
                please schedule a consultation.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner title="Ready to Take Control of Your Financial Future?" text="Schedule a consultation and let us help you build a personalized plan." buttonText="Book a Consultation" buttonHref={BOOKING_URL} buttonExternal />
    </>
  );
}
