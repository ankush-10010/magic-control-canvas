
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, RefreshCw, Zap, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface PipelineState {
  pipeline_type: string;
  active_controlnet: boolean;
  active_adapters: string[];
}

const PipelineStatusPanel = () => {
  const [pipelineState, setPipelineState] = useState<PipelineState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const backendUrl = "http://localhost:8000";

  const fetchPipelineState = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/pipeline-state/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      if (response.ok) {
        const data = await response.json();
        setPipelineState(data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        throw new Error('Failed to fetch pipeline state');
      }
    } catch (err) {
      const errorMessage = 'Failed to connect to pipeline';
      setError(errorMessage);
      if (showLoadingIndicator) {
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchPipelineState();
    const interval = setInterval(() => {
      fetchPipelineState(false); // Silent refresh
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPipelineIcon = (pipelineType: string) => {
    if (pipelineType.includes('Stable')) return <Zap className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (error) return "destructive";
    if (pipelineState?.active_controlnet) return "default";
    return "secondary";
  };

  const getStatusText = () => {
    if (error) return "Connection Failed";
    if (pipelineState?.active_controlnet) return "ControlNet Active";
    return "No ControlNet";
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-3 h-3" />;
    if (pipelineState?.active_controlnet) return <CheckCircle className="w-3 h-3" />;
    return <Circle className="w-3 h-3" />;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Pipeline Status
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchPipelineState(true)}
                    disabled={isLoading}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 h-8 w-8 p-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh pipeline status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {lastUpdate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                      Auto-refresh
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipeline Type */}
        {pipelineState && (
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-600">
            <div className="flex items-center gap-3">
              {getPipelineIcon(pipelineState.pipeline_type)}
              <div>
                <p className="text-white font-medium">Pipeline Type</p>
                <p className="text-slate-300 text-sm">{pipelineState.pipeline_type}</p>
              </div>
            </div>
          </div>
        )}

        {/* ControlNet Status */}
        <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-600">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-white font-medium">ControlNet Status</p>
              <Badge variant={getStatusColor()} className="mt-1">
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Active Adapters */}
        {pipelineState && pipelineState.active_adapters.length > 0 && (
          <>
            <Separator className="bg-slate-600" />
            <div className="space-y-3">
              <p className="text-white font-medium flex items-center gap-2">
                Active Adapters
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  {pipelineState.active_adapters.length}
                </Badge>
              </p>
              <div className="flex flex-wrap gap-2">
                {pipelineState.active_adapters.map((adapter, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          variant="outline" 
                          className="bg-purple-500/20 text-purple-300 border-purple-500/50 hover:bg-purple-500/30 cursor-default transition-colors duration-200"
                        >
                          {adapter}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Active adapter: {adapter}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <>
            <Separator className="bg-slate-600" />
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && !pipelineState && (
          <div className="text-center py-6 text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400 mx-auto mb-2"></div>
            <p>Loading pipeline status...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PipelineStatusPanel;
