"use client";

import { useState, useMemo } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import InputField from "@/components/calculators/InputField";
import { formatCurrency } from "@/lib/format";
import { IMAGES, BOOKING_URL } from "@/lib/constants";

function calcRetirement(
  currentAge: number,
  retireAge: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number
) {
  const years = retireAge - currentAge;
  if (years <= 0) return { total: currentSavings, growth: 0, contributions: 0, milestones: [] };

  const r = annualReturn / 100 / 12;
  const n = years * 12;

  // Future value of lump sum + future value of annuity
  const fvLump = currentSavings * Math.pow(1 + r, n);
  const fvAnnuity = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
  const total = fvLump + fvAnnuity;
  const totalContributions = currentSavings + monthlyContribution * n;

  // Build milestones for chart
  const milestones: { age: number; balance: number; contributed: number }[] = [];
  let balance = currentSavings;
  let contributed = currentSavings;
  for (let y = 0; y <= years; y++) {
    if (y % Math.max(1, Math.round(years / 10)) === 0 || y === years) {
      milestones.push({ age: currentAge + y, balance: Math.round(balance), contributed: Math.round(contributed) });
    }
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthlyContribution;
      contributed += monthlyContribution;
    }
  }

  return { total, growth: total - totalContributions, contributions: totalContributions, milestones };
}

function BarChart({ milestones }: { milestones: { age: number; balance: number; contributed: number }[] }) {
  if (milestones.length === 0) return null;
  const max = Math.max(...milestones.map((m) => m.balance));

  return (
    <div className="mt-8">
      <div className="space-y-2">
        {milestones.map((m) => {
          const widthPct = max > 0 ? Math.max(2, (m.balance / max) * 100) : 0;
          const contribPct = m.balance > 0 ? (m.contributed / m.balance) * 100 : 0;
          return (
            <div key={m.age} className="flex items-center gap-3">
              <span className="text-[11px] text-text-muted w-7 text-right shrink-0">{m.age}</span>
              <div className="flex-1 relative h-5" title={formatCurrency(m.balance)}>
                <div
                  className="absolute inset-y-0 left-0 bg-accent/30"
                  style={{ width: `${widthPct}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: `${widthPct * (contribPct / 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-text-muted w-20 text-right shrink-0">
                {formatCurrency(m.balance)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-6 justify-center mt-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-accent inline-block" /> Contributions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-accent/30 inline-block" /> Growth
        </span>
      </div>
    </div>
  );
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);

  const result = useMemo(
    () => calcRetirement(currentAge, retireAge, currentSavings, monthlyContribution, annualReturn),
    [currentAge, retireAge, currentSavings, monthlyContribution, annualReturn]
  );

  return (
    <>
      <PageHero
        title="Retirement Savings Calculator"
        tagline="See how your savings could grow over time"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-20 px-6">
        <div className="container-site max-w-[1000px]">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Inputs */}
            <FadeIn>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Your Details</h2>
                <div className="space-y-6">
                  <InputField
                    label="Current Age"
                    value={currentAge}
                    onChange={setCurrentAge}
                    suffix="years"
                    min={18}
                    max={80}
                  />
                  <InputField
                    label="Retirement Age"
                    value={retireAge}
                    onChange={setRetireAge}
                    suffix="years"
                    min={currentAge + 1}
                    max={90}
                  />
                  <InputField
                    label="Current Savings"
                    value={currentSavings}
                    onChange={setCurrentSavings}
                    prefix="$"
                    min={0}
                    step={1000}
                  />
                  <InputField
                    label="Monthly Contribution"
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    prefix="$"
                    min={0}
                    step={50}
                  />
                  <InputField
                    label="Expected Annual Return"
                    value={annualReturn}
                    onChange={setAnnualReturn}
                    suffix="%"
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
              </div>
            </FadeIn>

            {/* Results */}
            <FadeIn delay={0.15}>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Your Projection</h2>

                <div className="text-center mb-8">
                  <p className="text-text-muted text-sm mb-2">Estimated savings at age {retireAge}</p>
                  <p className="text-4xl md:text-5xl font-extralight text-foreground">
                    {formatCurrency(result.total)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-muted p-4 text-center">
                    <p className="text-xs text-text-muted mb-1">Total Contributed</p>
                    <p className="text-lg font-light">{formatCurrency(result.contributions)}</p>
                  </div>
                  <div className="bg-muted p-4 text-center">
                    <p className="text-xs text-text-muted mb-1">Investment Growth</p>
                    <p className="text-lg font-light text-success">{formatCurrency(result.growth)}</p>
                  </div>
                </div>

                <BarChart milestones={result.milestones} />

                <div className="mt-10 text-center">
                  <p className="text-sm text-text-secondary mb-4">
                    Want a personalized retirement plan?
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
                This calculator provides estimates based on the inputs you provide and a fixed annual
                rate of return. Actual investment returns vary year to year and are not guaranteed.
                This tool does not account for taxes, inflation, fees, or changes in contribution
                levels. It is for educational purposes only and should not be considered financial
                advice. For a personalized retirement plan, please schedule a consultation.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner title="Ready to Take Control of Your Financial Future?" text="Schedule a consultation and let us help you build a personalized plan." buttonText="Book a Consultation" buttonHref={BOOKING_URL} buttonExternal />
    </>
  );
}
