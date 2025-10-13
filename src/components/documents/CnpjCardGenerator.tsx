import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateCnpjCard } from "@/api/unicopag-api";
import { FileText, CheckCircle } from "lucide-react";

interface CnpjCardGeneratorProps {
  cnpj: string;
  onCnpjCardGenerated: () => void;
  disabled: boolean;
}

export const CnpjCardGenerator = ({ cnpj, onCnpjCardGenerated, disabled }: CnpjCardGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cnpjCardUrl, setCnpjCardUrl] = useState<string | null>(null);

  const handleGenerateCnpjCard = async () => {
    setIsGenerating(true);
    const url = await generateCnpjCard(cnpj);
    setIsGenerating(false);

    if (url) {
      setCnpjCardUrl(url);
      onCnpjCardGenerated();
    }
  };

  return (
    <div className={`space-y-4 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-md font-semibold text-unicopag-black">Cartão CNPJ</h3>
      {cnpjCardUrl ? (
        <div className="flex items-center justify-between p-3 border rounded-md bg-unicopag-light-gray">
          <span className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" /> Cartão CNPJ Gerado
          </span>
          <a href={cnpjCardUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
            Visualizar
          </a>
        </div>
      ) : (
        <Button
          onClick={handleGenerateCnpjCard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? "Gerando Cartão CNPJ..." : "Gerar Cartão CNPJ"}
          <FileText className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};