import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const Dashboard = () => {
  const [totalEssays, setTotalEssays] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [uniqueColleges, setUniqueColleges] = useState(0);
  const [essays, setEssays] = useState<any[]>([]);

  useEffect(() => {
    const fetchEssays = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("essays")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error) setEssays(data);
    };
    fetchEssays();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: essays, error } = await supabase
        .from("essays")
        .select("score, college_name")
        .eq("user_id", user.id);

      if (error || !essays) return;

      const scores = essays.map((e) => Number(e.score)).filter((s) => !isNaN(s));
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const unique = new Set(essays.map((e) => e.college_name)).size;

      setTotalEssays(essays.length);
      setAverageScore(Number(avg.toFixed(1)));
      setUniqueColleges(unique);
    };
    fetchStats();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-1">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your essay analyses and progress</p>
          </div>
          <Button asChild>
            <Link to="/upload">
              <Plus className="h-4 w-4" />
              New analysis
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-10">
          {[
            { label: "Essays analyzed", value: totalEssays },
            { label: "Average score", value: averageScore || "—" },
            { label: "Colleges targeted", value: uniqueColleges },
          ].map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-5">
              <p className="text-2xl font-semibold tabular-nums mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent essays */}
        <div>
          <h2 className="font-serif text-xl font-medium mb-4">Recent essays</h2>

          {essays.length > 0 ? (
            <div className="space-y-2">
              {essays.map((essay) => (
                <div
                  key={essay.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-sm truncate">{essay.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{essay.college}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {essay.score > 0 && (
                      <span className={`text-sm font-semibold tabular-nums ${getScoreColor(essay.score)}`}>
                        {essay.score}
                      </span>
                    )}
                    <Badge variant={essay.score > 0 ? "secondary" : "outline"} className="text-xs">
                      {essay.score > 0 ? "Analyzed" : "Processing"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">No essays yet</p>
              <p className="text-sm text-muted-foreground mb-5">
                Upload your first essay to get AI analysis
              </p>
              <Button asChild>
                <Link to="/upload">Upload essay</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
