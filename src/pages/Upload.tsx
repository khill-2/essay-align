import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Zap } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const barColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  const textColor = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{label}</p>
        <span className={`text-sm font-semibold tabular-nums ${textColor}`}>
          {score}<span className="text-muted-foreground font-normal">/100</span>
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export const Upload = () => {
  const [essay, setEssay] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const [scores, setScores] = useState<{
    alignment: number;
    values: number;
    tone: number;
    improvement: number;
  } | null>(null);

  const popularColleges = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Pennsylvania",
    "Duke University",
    "Northwestern University",
    "University of Chicago",
    "California Institute of Technology",
    "University of California, Berkeley",
    "University of Michigan",
    "University of California, Los Angeles",
    "Johns Hopkins University",
    "University of California, San Diego",
    "University of Southern California",
    "University of Virginia",
    "University of North Carolina at Chapel Hill",
    "University of Texas at Austin",
    "University of Washington",
    "University of Wisconsin-Madison",
    "University of Florida",
    "University of Illinois at Urbana-Champaign",
    "University of California, Santa Barbara",
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setEssay(content);
        if (!title) setTitle(file.name.replace(".txt", ""));
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!essay.trim() || !selectedCollege || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before analyzing",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Please log in first",
        description: "You must be authenticated to submit essays.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await fetch("https://essay-align.onrender.com/analyze-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay,
          title,
          email: user.email,
          user_id: user.id,
          college: {
            name: selectedCollege,
            mission: `Mission of ${selectedCollege}`,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");

      setFeedback(json.feedback);
      setScores(json.scores);

      toast({
        title: "Analysis complete",
        description: "Your essay has been analyzed.",
      });
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message || "Unexpected error.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = essay.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-3">Analyze your essay</h1>
          <p className="text-muted-foreground">
            Select a college, paste your essay, and get targeted feedback in seconds.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Essay title</Label>
              <Input
                id="title"
                placeholder="e.g. Why Stanford, Personal Statement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">Target college</Label>
              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {popularColleges.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">
                Upload file{" "}
                <span className="text-muted-foreground font-normal">(optional — .txt only)</span>
              </Label>
              <Input
                id="file"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-foreground hover:file:bg-secondary/80 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="essay">Essay text</Label>
                <Badge variant="outline" className="font-normal">{wordCount} words</Badge>
              </div>
              <Textarea
                id="essay"
                placeholder="Paste your essay here..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="min-h-[280px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Most college essays are 250–650 words. Include specific examples and personal stories for the best analysis.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Analyze essay
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {feedback && scores && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-serif font-medium text-xl">Analysis results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <ScoreBar label="Mission alignment" score={scores.alignment} />
                <ScoreBar label="Values match" score={scores.values} />
                <ScoreBar label="Tone & voice" score={scores.tone} />
                <ScoreBar label="Improvement potential" score={scores.improvement} />
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium mb-3">Feedback</p>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
