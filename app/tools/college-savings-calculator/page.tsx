"use client";

import { useState, useMemo } from "react";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import InputField from "@/components/calculators/InputField";
import { formatCurrency } from "@/lib/format";
import { IMAGES, BOOKING_URL } from "@/lib/constants";

const SCHOOL_COSTS: Record<string, { label: string; annual: number }> = {
  "in-state-public": { label: "In-State Public", annual: 23000 },
  "out-of-state-public": { label: "Out-of-State Public", annual: 41000 },
  "private": { label: "Private University", annual: 56000 },
  "community": { label: "Community College (2yr)", annual: 12000 },
};

function calcCollegeSavings(
  childAge: number,
  collegeStartAge: number,
  schoolType: string,
  yearsOfCollege: number,
  currentSavings: number,
  annualReturn: number,
  inflationRate: number
) {
  const yearsUntil = collegeStartAge - childAge;
  if (yearsUntil <= 0) return { totalCost: 0, futureValue: 0, monthlyNeeded: 0, gap: 0, yearsUntil: 0 };

  const annualCost = SCHOOL_COSTS[schoolType]?.annual ?? 23000;

  // Inflate college costs to future value
  let totalCost = 0;
  for (let y = 0; y < yearsOfCollege; y++) {
    totalCost += annualCost * Math.pow(1 + inflationRate / 100, yearsUntil + y);
  }

  // Future value of current savings
  const r = annualReturn / 100 / 12;
  const n = yearsUntil * 12;
  const fvSavings = currentSavings * Math.pow(1 + r, n);

  const gap = Math.max(0, totalCost - fvSavings);

  // Monthly payment needed to fill the gap
  const monthlyNeeded = r > 0 && n > 0
    ? gap / ((Math.pow(1 + r, n) - 1) / r)
    : n > 0 ? gap / n : 0;

  return { totalCost, futureValue: fvSavings, monthlyNeeded, gap, yearsUntil };
}

export default function CollegeSavingsCalculator() {
  const [childAge, setChildAge] = useState(5);
  const [collegeStartAge, setCollegeStartAge] = useState(18);
  const [schoolType, setSchoolType] = useState("in-state-public");
  const [yearsOfCollege, setYearsOfCollege] = useState(4);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(5);

  const result = useMemo(
    () => calcCollegeSavings(childAge, collegeStartAge, schoolType, yearsOfCollege, currentSavings, annualReturn, inflationRate),
    [childAge, collegeStartAge, schoolType, yearsOfCollege, currentSavings, annualReturn, inflationRate]
  );

  return (
    <>
      <PageHero
        title="College Savings Calculator"
        tagline="Plan ahead so education is funded when it matters"
        backgroundImage={IMAGES.heroServices}
      />

      <section className="py-20 px-6">
        <div className="container-site max-w-[1000px]">
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Your Plan</h2>
                <div className="space-y-6">
                  <InputField label="Child's Current Age" value={childAge} onChange={setChildAge} suffix="years" min={0} max={17} />
                  <InputField label="College Start Age" value={collegeStartAge} onChange={setCollegeStartAge} suffix="years" min={childAge + 1} max={25} />

                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Type of School</label>
                    <div className="border border-border focus-within:border-accent transition-colors">
                      <select
                        value={schoolType}
                        onChange={(e) => setSchoolType(e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-foreground outline-none text-sm appearance-none cursor-pointer"
                      >
                        {Object.entries(SCHOOL_COSTS).map(([key, { label, annual }]) => (
                          <option key={key} value={key}>
                            {label} (~{formatCurrency(annual)}/yr today)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <InputField label="Years of College" value={yearsOfCollege} onChange={setYearsOfCollege} suffix="years" min={1} max={6} />
                  <InputField label="Current College Savings" value={currentSavings} onChange={setCurrentSavings} prefix="$" min={0} step={1000} />
                  <InputField label="Expected Annual Return" value={annualReturn} onChange={setAnnualReturn} suffix="%" min={0} max={12} step={0.5} hint="529 plans typically earn 5-8% annually" />
                  <InputField label="College Cost Inflation" value={inflationRate} onChange={setInflationRate} suffix="%" min={0} max={10} step={0.5} hint="College costs have risen ~5% per year historically" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="border border-border p-8">
                <h2 className="heading-sm font-light mb-8">Your Savings Goal</h2>

                <div className="text-center mb-8">
                  <p className="text-text-muted text-sm mb-2">Save this much per month</p>
                  <p className="text-4xl md:text-5xl font-extralight text-foreground">
                    {result.yearsUntil > 0 ? formatCurrency(result.monthlyNeeded) : "—"}
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    for the next {result.yearsUntil} years
                  </p>
                </div>

                <div className="space-y-1 mb-8">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Projected Total Cost</span>
                    <span className="text-sm">{formatCurrency(result.totalCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Current Savings (future value)</span>
                    <span className="text-sm text-success">{formatCurrency(result.futureValue)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-medium">
                    <span className="text-sm text-accent">Remaining Gap</span>
                    <span className="text-sm text-accent">{formatCurrency(result.gap)}</span>
                  </div>
                </div>

                <div className="bg-muted p-5 mb-8">
                  <p className="text-xs text-text-muted mb-1">Did you know?</p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    529 college savings plans offer tax-free growth and tax-free withdrawals for
                    qualified education expenses. Washington State offers the GET (Guaranteed
                    Education Tuition) program as an additional option.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-text-secondary mb-4">
                    Want help choosing the right savings plan?
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
                This calculator provides estimates based on current average college costs and assumed
                growth rates. Actual costs vary significantly by school, program, and location.
                Financial aid, scholarships, and grants are not factored in. College cost inflation
                may differ from historical averages. This tool is for educational purposes only and
                should not be considered financial advice.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner title="Ready to Take Control of Your Financial Future?" text="Schedule a consultation and let us help you build a personalized plan." buttonText="Book a Consultation" buttonHref="https://calendly.com/holistic-health-finance/consultation" buttonExternal />
    </>
  );
}
