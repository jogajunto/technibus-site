"use client";

import { useState } from "react";

import { CheckCircle, Loader, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../Button";
import { Input } from "../ui/input";

type FormState = {
  email: string;
  honeypot: string;
};

const initialFormState: FormState = {
  email: "",
  honeypot: "",
};

export function NewsletterForm() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStartTime] = useState(() => Date.now());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const formDuration = Date.now() - formStartTime;

      const response = await fetch("/api/newsletter-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formDuration,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      resetForm();
      setSuccessMessage("Mensagem enviada com sucesso!");
    } catch {
      setErrorMessage("Erro ao enviar o formulário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Seu site</label>
        <Input id="website" name="honeypot" type="text" autoComplete="off" tabIndex={-1} value={formData.honeypot} onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email">E-mail</label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Digite o seu e-mail" required />
      </div>

      <footer className="mt-4 space-y-4">
        <p className="text-woodsmoke-lighter">
          Ao submeter os dados, você concorda com a nossa{" "}
          <Link className="link" href="https://otmeditora.com/politica-de-privacidade">
            Política de Privacidade
          </Link>
          .
        </p>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin" />
              Enviando
            </span>
          ) : (
            <span>Enviar</span>
          )}
        </Button>

        {successMessage && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2">
            <XCircle className="text-error-light h-6 w-6" />
            {errorMessage}
          </div>
        )}
      </footer>
    </form>
  );
}
