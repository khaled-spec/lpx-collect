"use client";

import { useState } from "react";
import Link from "next/link";
// TODO: Replace with actual data from API or database
const vendorPricingPlans: any[] = [];
const vendorSuccessStories: any[] = [];
const vendorFAQ: any[] = [];
import { Container } from "@/components/layout/Container";
import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
} from "@/components/custom/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeatureCard } from "@/components/custom/card-variants";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { designTokens } from "@/lib/design-tokens";
import { tokens } from "@/lib/design-system";
import {
  Store,
  TrendingUp,
  Shield,
  Clock,
  Award,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Globe,
  Zap,
  HeadphonesIcon,
  Check,
  ChevronRight,
  Star,
  Quote,
  ArrowRight,
  BadgeCheck,
  Rocket,
  Target,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

export default function BecomeVendorPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Access thousands of collectors worldwide and expand your market beyond local boundaries.",
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description:
        "Built-in payment processing and buyer protection ensures safe transactions for everyone.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track your performance with detailed analytics and optimize your sales strategy.",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description:
        "24/7 customer support team to help you succeed and resolve any issues quickly.",
    },
    {
      icon: BadgeCheck,
      title: "Verification Badge",
      description:
        "Get verified to build trust with buyers and stand out from the competition.",
    },
    {
      icon: Zap,
      title: "Fast Payouts",
      description:
        "Receive your earnings quickly with multiple payout options available.",
    },
  ];

  const processSteps = [
    { title: "Sign Up", description: "Create your vendor account in minutes" },
    {
      title: "Get Verified",
      description: "Submit documents for quick verification",
    },
    {
      title: "List Products",
      description: "Add your inventory with our easy tools",
    },
    {
      title: "Start Selling",
      description: "Reach thousands of eager collectors",
    },
  ];

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Application submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <Container className={`${designTokens.spacing.section.xl} relative`}>
          <div className="text-center max-w-4xl mx-auto text-white">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/20 text-white border-white/30"
            >
              <Rocket className="h-3 w-3 mr-1" />
              Join 500+ Successful Vendors
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Turn Your Collection Into a Business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Start selling authentic collectibles to thousands of passionate
              collectors. No upfront costs, powerful tools, and expert support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton
                size="lg"
                onClick={() => setShowApplicationForm(true)}
                className="bg-white text-primary hover:bg-white/90"
              >
                Start Selling Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </PrimaryButton>
              <OutlineButton
                size="lg"
                className="text-white border-white/50 hover:bg-white/10"
              >
                Watch Demo
              </OutlineButton>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">$2.5M+</div>
                <div className="text-sm text-white/80">Monthly GMV</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/80">Active Buyers</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/80">Satisfaction Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold">24hr</div>
                <div className="text-sm text-white/80">Avg Payout Time</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className={designTokens.spacing.section.lg}>
        <Container>
          <div className="text-center mb-12">
            <h2 className={`${designTokens.heading.h2} mb-4`}>
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools and features designed to help you grow your
              business
            </p>
          </div>

          <div
            className={`grid ${designTokens.grid.cols[3]} ${designTokens.spacing.gap.lg}`}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                className={`${tokens.animation.transition.all}`}
              >
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </FeatureCard>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className={`${designTokens.spacing.section.lg} bg-muted/30`}>
        <Container>
          <div className="text-center mb-12">
            <h2 className={`${designTokens.heading.h2} mb-4`}>
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free and upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 ${designTokens.spacing.gap.lg} max-w-6xl mx-auto`}
          >
            {vendorPricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.highlighted ? "border-primary shadow-xl scale-105" : ""
                } ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl">$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">
                          /{plan.interval}
                        </span>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PrimaryButton
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setShowApplicationForm(true);
                    }}
                  >
                    {plan.cta}
                  </PrimaryButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Success Stories */}
      <section className={designTokens.spacing.section.lg}>
        <Container>
          <div className="text-center mb-12">
            <h2 className={`${designTokens.heading.h2} mb-4`}>
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of vendors who have transformed their passion into
              profit
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 ${designTokens.spacing.gap.lg}`}
          >
            {vendorSuccessStories.map((story) => (
              <Card key={story.id} className="relative">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{story.quote}"
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full" />
                    <div>
                      <div className="font-semibold">{story.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {story.role} at {story.vendor}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-green-600 font-semibold">
                      {story.revenue}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{story.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Timeline */}
      <section className={`${designTokens.spacing.section.lg} bg-muted/30`}>
        <Container>
          <div className="text-center mb-12">
            <h2 className={`${designTokens.heading.h2} mb-4`}>
              Start Selling in 4 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined onboarding process gets you selling quickly
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              {/* Steps */}
              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative flex gap-6 items-center">
                    <div
                      className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold
                      ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}
                      z-10 flex-shrink-0
                    `}
                    >
                      {index + 1}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className={designTokens.spacing.section.lg}>
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`${designTokens.heading.h2} mb-4`}>
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about selling on LPX Collect
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {vendorFAQ.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className={`${designTokens.spacing.section.xl} bg-gradient-to-br from-primary to-primary/80 text-white`}
      >
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join our community of successful vendors and turn your passion
              into profit. Start selling today with zero upfront costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton
                size="lg"
                onClick={() => setShowApplicationForm(true)}
                className="bg-white text-primary hover:bg-white/90"
              >
                Apply Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </PrimaryButton>
              <OutlineButton
                size="lg"
                className="text-white border-white/50 hover:bg-white/10"
                asChild
              >
                <Link href="/vendors">Browse Success Stories</Link>
              </OutlineButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Application Modal/Form (simplified for now) */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Vendor Application</CardTitle>
              <CardDescription>
                Fill out the form below to start your vendor journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    placeholder="Your store name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" />
                </div>

                <div>
                  <Label htmlFor="category">Primary Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading-cards">
                        Trading Cards
                      </SelectItem>
                      <SelectItem value="comics">Comics</SelectItem>
                      <SelectItem value="coins">Coins</SelectItem>
                      <SelectItem value="stamps">Stamps</SelectItem>
                      <SelectItem value="toys">Vintage Toys</SelectItem>
                      <SelectItem value="sports">Sports Memorabilia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">
                    Tell us about your collection
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="What types of items do you plan to sell?"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Selected Plan</Label>
                  <div className="flex gap-2 mt-2">
                    {vendorPricingPlans.map((plan) => (
                      <Badge
                        key={plan.id}
                        variant={
                          selectedPlan === plan.id ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <OutlineButton
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </OutlineButton>
                  <PrimaryButton type="submit">
                    Submit Application
                  </PrimaryButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
