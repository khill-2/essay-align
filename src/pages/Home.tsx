import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Home = () => {
  const steps = [
    {
      title: "Paste your essay",
      desc: "Drop in your essay and select the college you're applying to. That's it.",
    },
    {
      title: "AI reads both",
      desc: "We pull each college's mission, values, and what they look for — then see how your essay holds up against them.",
    },
    {
      title: "Get honest feedback",
      desc: "Not generic tips. Specific analysis of where your essay connects and where it falls short.",
    },
  ];

  const features = [
    {
      title: "Mission alignment score",
      desc: "How well your essay reflects what the school actually values.",
    },
    {
      title: "Values assessment",
      desc: "Whether your personal story demonstrates the qualities they're looking for.",
    },
    {
      title: "Tone & voice check",
      desc: "Does your writing style feel right for the school's culture?",
    },
    {
      title: "Improvement suggestions",
      desc: "Specific angles to strengthen your essay before you submit.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 lg:py-36">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-8">
              College Essay Analysis
            </p>
            <h1 className="font-serif text-5xl lg:text-6xl font-medium leading-tight mb-6 text-foreground">
              Essays that speak to<br />
              <em>each school's values</em>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Find out how well your essay resonates with what each college is really looking for — before you hit submit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/upload">
                  Analyze your essay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/signup">Create free account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-16 text-center">
              How it works
            </h2>
            <div className="space-y-12">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <span className="font-serif text-4xl text-muted-foreground/25 leading-none font-bold tabular-nums flex-shrink-0 w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-serif text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 border-t border-border bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-6">
                Feedback that's actually useful
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Not generic advice you've already seen. Targeted analysis of how your essay connects with each school's specific mission and culture.
              </p>
              <Button asChild>
                <Link to="/signup">Get started free</Link>
              </Button>
            </div>
            <div>
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 items-start py-5 border-b border-border last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">{f.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
