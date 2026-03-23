"use client"

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper"

type Step = { title: string; content: React.ReactNode }

interface PatternProps {
  steps: Step[]
  value?: number
  defaultValue?: number
  onValueChange?: (step: number) => void
}

export function Pattern({ steps, value, defaultValue = 1, onValueChange }: PatternProps) {
  return (
    <Stepper
      value={value}
      defaultValue={value ? undefined : defaultValue}
      onValueChange={onValueChange}
      className="w-full space-y-8"
    >
      <StepperNav className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StepperItem key={step.title} step={index + 1}>
            <StepperTrigger className="flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left">
              <StepperIndicator>{index + 1}</StepperIndicator>
              <div className="flex flex-col">
                <StepperTitle className="text-sm font-semibold">
                  {step.title}
                </StepperTitle>
                <span className="text-xs text-muted-foreground">Step {index + 1} of {steps.length}</span>
              </div>
            </StepperTrigger>
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="space-y-6">
        {steps.map((step, index) => (
          <StepperContent key={step.title} value={index + 1}>
            {step.content}
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  )
}
