
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const AppHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">LoRA Integration</h1>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
          Inference
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
          Commercial use
        </Badge>
      </div>
    </div>
  );
};

export default AppHeader;
