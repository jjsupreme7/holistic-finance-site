"use client";

import { useState, useMemo } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import InputField from "@/components/calculators/InputField";
import { formatCurrency } from "@/lib/format";
import { IMAGES, BOOKING_URL } from "@/lib/constants";

function calcMortgage(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: number,
  propertyTaxRate: number,
  insuranceAnnual: number
) {
  // Max monthly housing payment (28% front-end DTI)
  const maxHousing = (annualIncome / 12) * 0.28;
  // Max total debt (36% back-end DTI)
  const maxTotalDebt = (annualIncome / 12) * 0.36;
  const maxFromDebt = maxTotalDebt - monthlyDebts;
  const maxMonthly = Math.min(maxHousing, maxFromDebt);

  if (maxMonthly <= 0) return { maxHome: 0, monthlyPayment: 0, piPayment: 0, taxInsurance: 0, loanAmount: 0 };

  // Iteratively solve: P&I + property tax + insurance must fit within maxMonthly
  // Start by estimating home price without property tax, then refine
  const r = interestRate / 100 / 12;
  const n = loanTermYears * 12;
  const monthlyInsurance = insuranceAnnual / 12;

  // Payment factor: monthly P&I per dollar of loan
  const paymentFactor = r > 0 ? r / (1 - Math.pow(1 + r, -n)) : 1 / n;

  // Monthly property tax per dollar of home value = (propertyTaxRate / 100) / 12
  // Home = loan + downPayment, so loan = home - downPayment
  // maxMonthly = paymentFactor * loan + (home * propertyTaxRate/100/12) + monthlyInsurance
  // maxMonthly - monthlyInsurance = paymentFactor * (home - downPayment) + home * propTaxMonthly
  // budget = paymentFactor * home - paymentFactor * downPayment + propTaxMonthly * home
  // budget + paymentFactor * downPayment = home * (paymentFactor + propTaxMonthly)
  const propTaxMonthly = propertyTaxRate / 100 / 12;
  const budget = maxMonthly - monthlyInsurance;

  if (budget <= 0) return { maxHome: 0, monthlyPayment: 0, piPayment: 0, taxInsurance: monthlyInsurance, loanAmount: 0 };

  const maxHome = (budget + paymentFactor * downPayment) / (paymentFactor + propTaxMonthly);
  const loanAmount = Math.max(0, maxHome - downPayment);
  const piPayment = paymentFactor * loanAmount;
  const monthlyPropTax = (maxHome * propTaxMonthly);
  const totalMonthly = piPayment + monthlyPropTax + monthlyInsurance;

  return {
    maxHome,
    monthlyPayment: totalMonthly,
    piPayment,
    taxInsurance: monthlyPropTax + monthlyInsurance,
    loanAmount,
  };
}

function ResultRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className={`text-sm font-medium ${accent ? "text-accent" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default function MortgageCalculator() {
  const [annualIncome, setAnnualIncome] = useState(75000);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [downPayment, setDownPayment] = useState(40000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.0);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1500);

  const result = useMemo(
    () => calcMortgage(annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insuranceAnnual),
    [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insuranceAnnual]
  );

  return (
    <>
      <PageHero
        title="Mortgage Affordability Calculator"
        tagline="Find out how much home you can afford"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-20 px-6">
        <div className="container-site max-w-[1000px]">
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Your Finances</h2>
                <div className="space-y-6">
                  <InputField label="Annual Household Income" value={annualIncome} onChange={setAnnualIncome} prefix="$" min={0} step={5000} />
                  <InputField label="Monthly Debt Payments" value={monthlyDebts} onChange={setMonthlyDebts} prefix="$" min={0} step={50} />
                  <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} prefix="$" min={0} step={5000} />
                  <InputField label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" min={0} max={15} step={0.25} />
                  <InputField label="Loan Term" value={loanTerm} onChange={setLoanTerm} suffix="years" min={10} max={30} step={5} />
                  <InputField label="Property Tax Rate" value={propertyTaxRate} onChange={setPropertyTaxRate} suffix="%" min={0} max={5} step={0.1} />
                  <InputField label="Annual Home Insurance" value={insuranceAnnual} onChange={setInsuranceAnnual} prefix="$" min={0} step={100} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">What You Can Afford</h2>

                <div className="text-center mb-8">
                  <p className="text-text-muted text-sm mb-2">Maximum Home Price</p>
                  <p className="text-4xl md:text-5xl font-extralight text-foreground">
                    {result.maxHome > 0 ? formatCurrency(result.maxHome) : "—"}
                  </p>
                </div>

                <div className="mb-8">
                  <ResultRow label="Loan Amount" value={formatCurrency(result.loanAmount)} />
                  <ResultRow label="Down Payment" value={formatCurrency(downPayment)} />
                  <ResultRow label="Monthly P&I" value={formatCurrency(result.piPayment)} />
                  <ResultRow label="Tax & Insurance" value={formatCurrency(result.taxInsurance)} />
                  <ResultRow label="Est. Total Monthly" value={formatCurrency(result.monthlyPayment)} accent />
                </div>

                <div className="bg-muted p-4 mb-8">
                  <p className="text-xs text-text-muted mb-1">Based on</p>
                  <p className="text-sm text-text-secondary">
                    28% front-end DTI and 36% back-end DTI — standard qualifying ratios used by most lenders.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-text-secondary mb-4">
                    Ready to explore mortgage options?
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
                This calculator provides estimates based on standard lending guidelines. Actual
                mortgage approval depends on credit score, employment history, and other factors.
                Property tax rates and insurance costs vary by location and provider. This tool is
                for educational purposes only and should not be considered financial advice.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner title="Ready to Take Control of Your Financial Future?" text="Schedule a consultation and let us help you build a personalized plan." buttonText="Book a Consultation" buttonHref="https://calendly.com/holistic-health-finance/consultation" buttonExternal />
    </>
  );
}
