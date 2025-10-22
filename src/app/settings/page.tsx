import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ApiKeysList } from "@/components/settings/ApiKeysList";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Chaves de API</CardTitle>
          <CardDescription>
            Configure as chaves usadas para geração de usuários e integrações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysList />
        </CardContent>
      </Card>
    </div>
  );
}
