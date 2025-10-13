import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle } from "lucide-react";
import { IdentifiedRates, uploadRateSheetForAIProcessing } from "@/api/unicopag-api";
import { toast } from "sonner";

interface RateSheetUploaderProps {
  onRatesIdentified: (rates: IdentifiedRates) => void;
  disabled: boolean;
}

export const RateSheetUploader = ({ onRatesIdentified, disabled }: RateSheetUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    const rates = await uploadRateSheetForAIProcessing(file);
    setIsUploading(false);

    if (rates) {
      onRatesIdentified(rates);
      toast.success("Taxas do cliente preenchidas automaticamente!");
    } else {
      setFileName(null); // Clear file name if processing failed
    }
  };

  return (
    <div className={`space-y-2 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-md font-semibold text-unicopag-black">Analisar Planilha de Taxas</h3>
      <Label htmlFor="rate-sheet-upload" className="flex-grow cursor-pointer flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
        <span>{fileName || "Fazer upload da planilha de taxas"}</span>
        {fileName ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <UploadCloud className="h-5 w-5 text-gray-400" />
        )}
      </Label>
      <Input
        id="rate-sheet-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        accept=".csv, .xlsx, .pdf" // Common file types for rate sheets
      />
      {isUploading && <p className="text-sm text-muted-foreground">Processando arquivo...</p>}
    </div>
  );
};