import { Button } from "@/components/ui/button";
import { CnpjData, Proposal, sendProposalByEmail, sendProposalByWhatsapp } from "@/api/unicopag-api";
import { Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ProposalSenderProps {
  cnpjData: CnpjData;
  currentRates: { debito: number; creditoVista: number; creditoParcelado: number };
  selectedProposal: Proposal;
  disabled: boolean;
}

export const ProposalSender = ({ cnpjData, currentRates, selectedProposal, disabled }: ProposalSenderProps) => {

  const handleSendEmail = async () => {
    if (!cnpjData.email_proprietario) {
      toast.error("E-mail do proprietário não disponível para envio.");
      return;
    }
    await sendProposalByEmail(cnpjData.email_proprietario, cnpjData, currentRates, selectedProposal);
  };

  const handleSendWhatsapp = async () => {
    if (!cnpjData.telefone_proprietario) {
      toast.error("Telefone do proprietário não disponível para envio.");
      return;
    }
    await sendProposalByWhatsapp(cnpjData.telefone_proprietario, cnpjData, currentRates, selectedProposal);
  };

  return (
    <div className={`space-y-4 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <h3 className="text-md font-semibold text-unicopag-black">Enviar Proposta Comercial</h3>
      <div className="flex gap-2">
        <Button
          onClick={handleSendEmail}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={disabled}
        >
          <Mail className="mr-2 h-4 w-4" /> Enviar por E-mail
        </Button>
        <Button
          onClick={handleSendWhatsapp}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          disabled={disabled}
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Enviar por WhatsApp
        </Button>
      </div>
    </div>
  );
};