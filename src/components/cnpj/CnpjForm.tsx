import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchCnpjData, CnpjData } from "@/api/unicopag-api";
import { toast } from "sonner";

interface CnpjFormProps {
  onCnpjDataFetched: (data: CnpjData) => void;
}

export const CnpjForm = ({ onCnpjDataFetched }: CnpjFormProps) => {
  const [cnpj, setCnpj] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    // Format CNPJ: XX.XXX.XXX/XXXX-XX
    let formattedCnpj = value;
    if (value.length > 2) formattedCnpj = `${value.substring(0, 2)}.${value.substring(2)}`;
    if (value.length > 5) formattedCnpj = `${formattedCnpj.substring(0, 6)}.${formattedCnpj.substring(6)}`;
    if (value.length > 8) formattedCnpj = `${formattedCnpj.substring(0, 10)}/${formattedCnpj.substring(10)}`;
    if (value.length > 12) formattedCnpj = `${formattedCnpj.substring(0, 15)}-${formattedCnpj.substring(15)}`;
    setCnpj(formattedCnpj.substring(0, 18)); // Max length for formatted CNPJ
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      toast.error("Por favor, insira um CNPJ válido com 14 dígitos.");
      return;
    }

    setIsLoading(true);
    const data = await fetchCnpjData(cleanCnpj);
    setIsLoading(false);

    if (data) {
      onCnpjDataFetched(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cnpj">CNPJ do Cliente</Label>
        <Input
          id="cnpj"
          type="text"
          placeholder="XX.XXX.XXX/XXXX-XX"
          value={cnpj}
          onChange={handleCnpjChange}
          maxLength={18}
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full bg-unicopag-red hover:bg-unicopag-red/90 text-white" disabled={isLoading}>
        {isLoading ? "Buscando..." : "Buscar Dados do CNPJ"}
      </Button>
    </form>
  );
};