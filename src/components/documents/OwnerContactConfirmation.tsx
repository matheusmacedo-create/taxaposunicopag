import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CnpjData } from "@/api/unicopag-api";
import { toast } from "sonner";
import { CheckCircle, MapPin } from "lucide-react";

interface OwnerContactConfirmationProps {
  cnpjData: CnpjData;
  onConfirmationComplete: (locationShared: boolean) => void;
  disabled: boolean;
}

export const OwnerContactConfirmation = ({ cnpjData, onConfirmationComplete, disabled }: OwnerContactConfirmationProps) => {
  const [ownerEmail, setOwnerEmail] = useState(cnpjData.email_proprietario || "");
  const [ownerPhone, setOwnerPhone] = useState(cnpjData.telefone_proprietario || "");
  const [isResponsible, setIsResponsible] = useState(false);
  const [shareLocation, setShareLocation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    // Basic validation: check if email/phone match mock data (in a real app, this would be API validated)
    const emailMatches = ownerEmail.toLowerCase() === cnpjData.email_proprietario.toLowerCase();
    const phoneMatches = ownerPhone.replace(/\D/g, '') === cnpjData.telefone_proprietario.replace(/\D/g, '');

    if (!emailMatches) {
      toast.error("O e-mail inserido não corresponde ao e-mail do proprietário no CNPJ.");
      return;
    }
    if (!phoneMatches) {
      toast.error("O telefone inserido não corresponde ao telefone do proprietário no CNPJ.");
      return;
    }
    if (!isResponsible) {
      toast.error("Por favor, confirme que você é o responsável/proprietário.");
      return;
    }

    setIsConfirmed(true);
    onConfirmationComplete(shareLocation);
    toast.success("Dados do proprietário confirmados!");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    // Format phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    let formattedPhone = value;
    if (value.length > 2) formattedPhone = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    if (value.length > 7) formattedPhone = `${formattedPhone.substring(0, 10)}-${formattedPhone.substring(10)}`;
    setOwnerPhone(formattedPhone.substring(0, 15)); // Max length for formatted phone
  };

  return (
    <div className={`space-y-4 ${disabled || isConfirmed ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-md font-semibold text-unicopag-black">Confirmação de Dados do Proprietário</h3>

      <div>
        <Label htmlFor="owner-email">E-mail do Proprietário</Label>
        <Input
          id="owner-email"
          type="email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          required
          className="mt-1"
          disabled={isConfirmed}
        />
      </div>

      <div>
        <Label htmlFor="owner-phone">Telefone do Proprietário</Label>
        <Input
          id="owner-phone"
          type="tel"
          value={ownerPhone}
          onChange={handlePhoneChange}
          maxLength={15}
          required
          className="mt-1"
          disabled={isConfirmed}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is-responsible"
          checked={isResponsible}
          onCheckedChange={(checked) => setIsResponsible(!!checked)}
          disabled={isConfirmed}
        />
        <Label htmlFor="is-responsible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Confirmo que sou o responsável/proprietário
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="share-location"
          checked={shareLocation}
          onCheckedChange={(checked) => setShareLocation(!!checked)}
          disabled={isConfirmed}
        />
        <Label htmlFor="share-location" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
          Permitir o envio da minha localização (opcional) <MapPin className="h-4 w-4 text-muted-foreground" />
        </Label>
      </div>

      {!isConfirmed ? (
        <Button
          onClick={handleConfirm}
          className="w-full bg-unicopag-red hover:bg-unicopag-red/90 text-white"
          disabled={disabled || !ownerEmail || !ownerPhone || !isResponsible}
        >
          Confirmar Dados
        </Button>
      ) : (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" /> Dados do proprietário confirmados.
        </p>
      )}
    </div>
  );
};