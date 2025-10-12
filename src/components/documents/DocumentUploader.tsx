import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadDocument } from "@/api/unicopag-api";
import { toast } from "sonner";
import { CheckCircle, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  cnpj: string;
  isPJ: boolean; // Personalidade Jurídica (CNPJ) vs. Pessoa Física (CPF)
  onUploadComplete: () => void;
  disabled: boolean;
}

export const DocumentUploader = ({ cnpj, isPJ, onUploadComplete, disabled }: DocumentUploaderProps) => {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);

  const requiredDocs = isPJ
    ? ["Contrato Social", "Documento do Sócio (RG/CNH)", "Selfie do Sócio"]
    : ["Documento (RG/CNH)", "Selfie"];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileUrl = await uploadDocument(cnpj, file, docType);
    setIsUploading(false);

    if (fileUrl) {
      setUploadedDocs((prev) => ({ ...prev, [docType]: true }));
      const allDocsUploaded = requiredDocs.every((doc) => uploadedDocs[doc] || doc === docType);
      if (allDocsUploaded) {
        onUploadComplete();
      }
    }
  };

  const allRequiredDocsUploaded = requiredDocs.every((doc) => uploadedDocs[doc]);

  return (
    <div className={`space-y-4 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-md font-semibold text-unicopag-black">Upload de Documentos</h3>
      {requiredDocs.map((docType) => (
        <div key={docType} className="flex items-center space-x-2">
          <Label htmlFor={`upload-${docType}`} className="flex-grow cursor-pointer flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
            <span>{docType}</span>
            {uploadedDocs[docType] ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <UploadCloud className="h-5 w-5 text-gray-400" />
            )}
          </Label>
          <Input
            id={`upload-${docType}`}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, docType)}
            disabled={isUploading}
            accept="image/*,.pdf"
          />
        </div>
      ))}
      {allRequiredDocsUploaded && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" /> Todos os documentos obrigatórios enviados.
        </p>
      )}
    </div>
  );
};