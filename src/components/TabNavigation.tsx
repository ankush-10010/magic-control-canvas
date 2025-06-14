
import { useState } from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  activeTab: string;
}

const TabNavigation = ({ activeTab }: TabNavigationProps) => {
  // Tab button mouse positions
  const [playgroundMousePos, setPlaygroundMousePos] = useState({ x: 0, y: 0 });
  const [apiMousePos, setApiMousePos] = useState({ x: 0, y: 0 });
  const [examplesMousePos, setExamplesMousePos] = useState({ x: 0, y: 0 });
  const [docsMousePos, setDocsMousePos] = useState({ x: 0, y: 0 });

  const handleTabMouseMove = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    switch(tabName) {
      case 'playground':
        setPlaygroundMousePos(pos);
        break;
      case 'api':
        setApiMousePos(pos);
        break;
      case 'examples':
        setExamplesMousePos(pos);
        break;
      case 'docs':
        setDocsMousePos(pos);
        break;
    }
  };

  return (
    <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
      <TabsTrigger 
        value="playground" 
        onMouseMove={(e) => handleTabMouseMove(e, 'playground')}
        className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${playgroundMousePos.x}px ${playgroundMousePos.y}px, rgba(255, 255, 0, 0.3), transparent 70%)`
          }}
        />
        <span className="relative z-10">Playground</span>
      </TabsTrigger>
      <TabsTrigger 
        value="api" 
        onMouseMove={(e) => handleTabMouseMove(e, 'api')}
        className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${apiMousePos.x}px ${apiMousePos.y}px, rgba(255, 255, 0, 0.3), transparent 70%)`
          }}
        />
        <span className="relative z-10">API</span>
      </TabsTrigger>
      <TabsTrigger 
        value="examples" 
        onMouseMove={(e) => handleTabMouseMove(e, 'examples')}
        className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${examplesMousePos.x}px ${examplesMousePos.y}px, rgba(255, 255, 0, 0.3), transparent 70%)`
          }}
        />
        <span className="relative z-10">Examples</span>
      </TabsTrigger>
      <TabsTrigger 
        value="docs" 
        onMouseMove={(e) => handleTabMouseMove(e, 'docs')}
        className="data-[state=active]:bg-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 80px at ${docsMousePos.x}px ${docsMousePos.y}px, rgba(255, 255, 0, 0.3), transparent 70%)`
          }}
        />
        <span className="relative z-10">Documentation</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabNavigation;
